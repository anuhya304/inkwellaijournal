import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Heart, ListChecks, ChevronDown, Lightbulb, RotateCcw, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface InsightsDashboardProps {
  mood: string | null;
  moodScore: number;
  moodLabel: string;
  insights: string | null;
  tasks: string[];
}

const AnimatedScore = ({ target }: { target: number }) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 1200;
    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [target]);
  return <span>{value}</span>;
};

const MoodMeter = ({ score, label }: { score: number; label: string }) => {
  const [hovered, setHovered] = useState(false);

  const getEmoji = (s: number) => {
    if (s >= 80) return "✨";
    if (s >= 60) return "🌤";
    if (s >= 40) return "🌥";
    if (s >= 25) return "🌧";
    return "⛈";
  };

  const getMoodColor = (s: number) => {
    if (s >= 75) return "from-amber to-amber-glow";
    if (s >= 50) return "from-sage to-sage-soft";
    if (s >= 35) return "from-amber-glow to-amber";
    return "from-destructive to-destructive/70";
  };

  return (
    <div
      className="space-y-3"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center justify-between">
        <motion.span
          className="font-display text-xl text-amber font-semibold"
          animate={{ scale: hovered ? 1.05 : 1 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {label}
        </motion.span>
        <motion.span
          className="text-3xl"
          animate={{ scale: hovered ? 1.3 : 1, rotate: hovered ? 15 : 0 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {getEmoji(score)}
        </motion.span>
      </div>

      {/* Custom animated bar */}
      <div className="relative h-4 bg-secondary rounded-full overflow-hidden">
        <motion.div
          className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${getMoodColor(score)}`}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        {/* Shimmer */}
        <motion.div
          className="absolute inset-y-0 w-16 bg-gradient-to-r from-transparent via-foreground/10 to-transparent"
          animate={{ left: ["-10%", "110%"] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
        />
      </div>

      <div className="flex justify-between font-mono text-sm text-muted-foreground">
        <span>Low</span>
        <motion.span
          className="text-foreground font-bold text-base"
          animate={{ scale: hovered ? 1.15 : 1 }}
        >
          <AnimatedScore target={score} />/100
        </motion.span>
        <span>High</span>
      </div>
    </div>
  );
};

const InsightsDashboard = ({ mood, moodScore, moodLabel, insights, tasks }: InsightsDashboardProps) => {
  const [expandedInsight, setExpandedInsight] = useState(false);
  const [checkedTasks, setCheckedTasks] = useState<Set<number>>(new Set());
  const [celebrateAll, setCelebrateAll] = useState(false);

  if (!mood && !insights && tasks.length === 0) return null;

  const toggleTask = (index: number) => {
    setCheckedTasks((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      if (next.size === tasks.length) setCelebrateAll(true);
      return next;
    });
  };

  const resetTasks = () => {
    setCheckedTasks(new Set());
    setCelebrateAll(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
        <motion.h2
          className="font-display text-2xl text-primary tracking-wide"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Reflection
        </motion.h2>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
      </div>

      {/* Mood Card */}
      {mood && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          whileHover={{ scale: 1.01, transition: { duration: 0.2 } }}
          className="bg-amber/5 border border-amber/20 rounded-lg p-6 md:p-8"
        >
          <div className="flex items-center gap-2 mb-5">
            <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 4, repeat: Infinity }}>
              <Heart className="w-6 h-6 text-amber" />
            </motion.div>
            <h3 className="font-display text-lg font-semibold text-amber uppercase tracking-wider">
              Mood
            </h3>
          </div>
          <MoodMeter score={moodScore} label={moodLabel} />
          <p className="text-foreground/80 text-lg leading-relaxed font-body mt-5">
            {mood}
          </p>
        </motion.div>
      )}

      {/* Insights Card — expandable with hover glow */}
      {insights && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          whileHover={{ scale: 1.01, boxShadow: "0 0 30px hsl(var(--amber) / 0.08)" }}
          className="bg-parchment/5 border border-parchment/10 rounded-lg p-6 md:p-8 cursor-pointer group relative overflow-hidden"
          onClick={() => setExpandedInsight(!expandedInsight)}
        >
          {/* Hover shimmer overlay */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent"
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.8 }}
          />

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Brain className="w-6 h-6 text-parchment-dim" />
                </motion.div>
                <h3 className="font-display text-lg font-semibold text-parchment-dim uppercase tracking-wider">
                  Insights
                </h3>
              </div>
              <motion.div
                animate={{ rotate: expandedInsight ? 180 : 0 }}
                className="text-muted-foreground"
              >
                <ChevronDown className="w-5 h-5" />
              </motion.div>
            </div>

            <p className={`text-foreground/80 text-lg leading-relaxed font-body ${!expandedInsight ? "line-clamp-2" : ""}`}>
              {insights}
            </p>

            <AnimatePresence>
              {expandedInsight && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-5 pt-5 border-t border-parchment/10"
                >
                  <div className="flex items-center gap-2 text-amber/80">
                    <motion.div animate={{ rotate: [0, 20, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                      <Lightbulb className="w-5 h-5" />
                    </motion.div>
                    <span className="font-mono text-sm tracking-wide">
                      Tap to reflect on these patterns in your next entry
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Tasks — interactive checkable with celebration */}
      {tasks.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="bg-sage-soft/20 border border-sage/20 rounded-lg p-6 md:p-8 relative overflow-hidden"
        >
          {/* All-done celebration overlay */}
          <AnimatePresence>
            {celebrateAll && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center z-20 bg-background/60 backdrop-blur-sm rounded-lg"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="text-center"
                >
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: 2 }}
                    className="text-5xl mb-3"
                  >
                    🎉
                  </motion.div>
                  <p className="font-display text-xl text-sage font-semibold">All tasks complete!</p>
                  <button
                    onClick={(e) => { e.stopPropagation(); resetTasks(); }}
                    className="mt-3 flex items-center gap-2 mx-auto px-4 py-2 rounded-lg bg-secondary text-secondary-foreground font-mono text-sm hover:bg-secondary/80 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <motion.div animate={{ y: [0, -2, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ListChecks className="w-6 h-6 text-sage" />
              </motion.div>
              <h3 className="font-display text-lg font-semibold text-sage uppercase tracking-wider">
                Suggested Focus
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <motion.span
                className="font-mono text-sm text-muted-foreground"
                key={checkedTasks.size}
                initial={{ scale: 1.3 }}
                animate={{ scale: 1 }}
              >
                {checkedTasks.size}/{tasks.length}
              </motion.span>
              {checkedTasks.size > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <Sparkles className="w-4 h-4 text-amber" />
                </motion.div>
              )}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-5">
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-sage to-sage-soft rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(checkedTasks.size / tasks.length) * 100}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
          </div>

          <ul className="space-y-3">
            {tasks.map((task, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                onClick={() => toggleTask(i)}
                whileHover={{ x: 4, transition: { duration: 0.15 } }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-start gap-3 text-lg font-body cursor-pointer select-none transition-colors duration-300 p-2 rounded-md hover:bg-sage/5 ${
                  checkedTasks.has(i) ? "text-muted-foreground line-through opacity-50" : "text-foreground/80"
                }`}
              >
                <motion.span
                  className={`mt-1 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all duration-200 ${
                    checkedTasks.has(i)
                      ? "bg-sage border-sage text-background"
                      : "border-sage/40 hover:border-sage"
                  }`}
                  whileTap={{ scale: 0.8 }}
                >
                  {checkedTasks.has(i) && (
                    <motion.span
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="text-xs font-bold"
                    >
                      ✓
                    </motion.span>
                  )}
                </motion.span>
                {task}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
    </motion.div>
  );
};

export default InsightsDashboard;
