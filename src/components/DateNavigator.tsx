import { format, isToday } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DateNavigatorProps {
  currentDate: Date;
  onPrevious: () => void;
  onNext: () => void;
}

const DateNavigator = ({ currentDate, onPrevious, onNext }: DateNavigatorProps) => {
  const dateLabel = isToday(currentDate) ? "Today" : format(currentDate, "EEEE");
  const dateFormatted = format(currentDate, "MMMM d, yyyy");

  return (
    <div className="flex items-center justify-center gap-6">
      <button
        onClick={onPrevious}
        className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 group"
      >
        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
      </button>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentDate.toISOString()}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.25 }}
          className="text-center min-w-[200px]"
        >
          <p className="font-display text-2xl font-semibold text-foreground tracking-wide">
            {dateLabel}
          </p>
          <p className="font-mono text-xs text-muted-foreground tracking-widest uppercase mt-1">
            {dateFormatted}
          </p>
        </motion.div>
      </AnimatePresence>

      <button
        onClick={onNext}
        disabled={isToday(currentDate)}
        className="p-2 rounded-full bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-300 group disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
      </button>
    </div>
  );
};

export default DateNavigator;
