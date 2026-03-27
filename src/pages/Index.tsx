import { useState, useEffect, useCallback } from "react";
import { addDays, subDays, isToday } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Save, Loader2, PenLine, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import DateNavigator from "@/components/DateNavigator";
import JournalEditor from "@/components/JournalEditor";
import InsightsDashboard from "@/components/InsightsDashboard";
import MoodCalendar from "@/components/MoodCalendar";
import InkSplatter from "@/components/InkSplatter";
import BackgroundElements from "@/components/BackgroundElements";
import { getEntry, saveEntry } from "@/lib/journal-store";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [text, setText] = useState("");
  const [mood, setMood] = useState<string | null>(null);
  const [moodScore, setMoodScore] = useState(50);
  const [moodLabel, setMoodLabel] = useState("Neutral");
  const [insights, setInsights] = useState<string | null>(null);
  const [tasks, setTasks] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const entry = getEntry(currentDate);
    setText(entry.text);
    setMood(entry.mood);
    setInsights(entry.insights);
    setTasks(entry.tasks);
  }, [currentDate]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const entry = getEntry(currentDate);
      saveEntry(currentDate, { ...entry, text });
    }, 500);
    return () => clearTimeout(timeout);
  }, [text, currentDate]);

  const handlePrevious = () => setCurrentDate((d) => subDays(d, 1));
  const handleNext = () => {
    if (!isToday(currentDate)) setCurrentDate((d) => addDays(d, 1));
  };

  const handleClear = () => {
    setText("");
    toast("Entry cleared", { description: "Your slate is clean." });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAskQuestion = useCallback(async () => {
    if (!text.trim()) {
      toast.error("Write something first", { description: "The AI needs some ink to read." });
      return;
    }
    setIsAsking(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-journal", {
        body: { text, action: "question" },
      });
      if (error) throw error;
      const question = data?.result || "What is your mind circling back to?";
      setText((prev) => prev + `\n\n💭 ${question}`);
      toast("A question to ponder", { description: question });
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate question", { description: "Please try again." });
    } finally {
      setIsAsking(false);
    }
  }, [text]);

  const handleAnalyze = useCallback(async () => {
    if (!text.trim()) {
      toast.error("Nothing to analyze", { description: "Pour some thoughts onto the page first." });
      return;
    }
    setIsAnalyzing(true);
    try {
      const { data, error } = await supabase.functions.invoke("analyze-journal", {
        body: { text, action: "analyze" },
      });
      if (error) throw error;

      const resultText = data?.result || "";
      // Parse JSON from AI response (may be wrapped in markdown code block)
      const jsonMatch = resultText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid AI response");
      
      const result = JSON.parse(jsonMatch[0]);
      setMood(result.moodText);
      setMoodScore(result.moodScore);
      setMoodLabel(result.moodLabel);
      setInsights(result.insights);
      setTasks(result.tasks || []);
      saveEntry(currentDate, {
        text,
        mood: result.moodText,
        insights: result.insights,
        tasks: result.tasks || [],
      });
      toast.success("Analysis complete", { description: "Your reflection is ready below." });
    } catch (e) {
      console.error(e);
      toast.error("Analysis failed", { description: "Please try again." });
    } finally {
      setIsAnalyzing(false);
    }
  }, [text, currentDate]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <InkSplatter className="-top-20 -right-20 text-primary w-[300px] h-[300px]" />
      <InkSplatter className="-bottom-32 -left-16 text-ink-blue w-[250px] h-[250px]" />
      <InkSplatter className="top-1/3 -left-24 text-sage w-[200px] h-[200px]" />
      <InkSplatter className="bottom-1/4 -right-12 text-amber w-[180px] h-[180px]" />

      <BackgroundElements />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 md:py-16">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 relative"
        >
          <button
            onClick={handleLogout}
            className="absolute right-0 top-0 p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <div className="flex items-center justify-center gap-3 mb-2">
            <PenLine className="w-6 h-6 text-primary" />
            <h1 className="font-display text-3xl md:text-4xl font-bold text-gradient-amber tracking-tight">
              Inkwell
            </h1>
          </div>
          <p className="font-mono text-xs text-muted-foreground tracking-[0.2em] uppercase">
            AI-Guided Journal
          </p>
        </motion.header>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
          <DateNavigator currentDate={currentDate} onPrevious={handlePrevious} onNext={handleNext} />
        </motion.div>

        <div className="mb-6">
          <JournalEditor value={text} onChange={setText} onClear={handleClear} />
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-10"
        >
          <button
            onClick={handleAskQuestion}
            disabled={isAsking || !text.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-secondary text-secondary-foreground font-mono text-sm tracking-wide hover:bg-secondary/80 transition-all disabled:opacity-40 disabled:cursor-not-allowed border border-border"
          >
            {isAsking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber" />}
            Ask a Question
          </button>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !text.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary text-primary-foreground font-mono text-sm tracking-wide hover:bg-amber-glow transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-amber"
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save & Analyze
          </button>
        </motion.div>

        <AnimatePresence>
          {(mood || insights || tasks.length > 0) && (
            <InsightsDashboard mood={mood} moodScore={moodScore} moodLabel={moodLabel} insights={insights} tasks={tasks} />
          )}
        </AnimatePresence>

        <motion.footer initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="mt-16 text-center">
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-4" />
          <p className="font-mono text-xs text-muted-foreground/50 tracking-wider">
            Every word matters · Inkwell Journal
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default Index;
