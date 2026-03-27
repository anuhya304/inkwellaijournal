import { motion } from "framer-motion";
import { Eraser } from "lucide-react";

interface JournalEditorProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

const JournalEditor = ({ value, onChange, onClear }: JournalEditorProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
      className="relative"
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Let the ink flow... What's on your mind today?"
        className="w-full min-h-[280px] p-6 rounded-xl bg-card text-card-foreground border border-border shadow-ink font-body text-base leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-ring/30 focus:border-primary/40 transition-all placeholder:text-muted-foreground/40 placeholder:italic"
      />
      {value && (
        <button
          onClick={onClear}
          className="absolute top-3 right-3 p-2 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
          title="Clear entry"
        >
          <Eraser className="w-4 h-4" />
        </button>
      )}
      <div className="absolute bottom-3 right-3 font-mono text-xs text-muted-foreground/40">
        {value.length} chars
      </div>
    </motion.div>
  );
};

export default JournalEditor;
