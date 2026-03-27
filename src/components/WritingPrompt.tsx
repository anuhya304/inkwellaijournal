import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shuffle, Lightbulb } from "lucide-react";

const PROMPTS = [
  "What made you smile today?",
  "Describe a challenge you overcame recently.",
  "Write about someone who inspires you.",
  "What are you most grateful for right now?",
  "If you could relive one day, which would it be?",
  "What does your ideal morning look like?",
  "Write a letter to your future self.",
  "What's a fear you'd like to conquer?",
  "Describe a place where you feel completely at peace.",
  "What lesson did this week teach you?",
  "What would you do if failure wasn't possible?",
  "Write about a sound that brings you comfort.",
  "What's something you've been putting off? Why?",
  "Describe your happiest memory in detail.",
  "What does courage mean to you today?",
];

const WritingPrompt = () => {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * PROMPTS.length));
  const [direction, setDirection] = useState(1);

  const shuffle = useCallback(() => {
    setDirection(1);
    setIndex((prev) => {
      let next: number;
      do { next = Math.floor(Math.random() * PROMPTS.length); } while (next === prev && PROMPTS.length > 1);
      return next;
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
      className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-4 shadow-ink"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-primary" />
          <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.15em]">
            Writing Prompt
          </span>
        </div>
        <button
          onClick={shuffle}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all active:scale-90"
          title="New prompt"
        >
          <Shuffle className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="min-h-[3rem] flex items-center">
        <AnimatePresence mode="wait" initial={false}>
          <motion.p
            key={index}
            initial={{ opacity: 0, y: direction * 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: direction * -10 }}
            transition={{ duration: 0.25 }}
            className="font-display text-sm text-foreground/90 italic leading-relaxed"
          >
            "{PROMPTS[index]}"
          </motion.p>
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default WritingPrompt;
