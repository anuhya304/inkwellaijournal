import { useState } from "react";
import { format, isSameDay, isToday, isFuture, startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getEntry } from "@/lib/journal-store";

interface MoodCalendarProps {
  currentDate: Date;
  onDateSelect: (date: Date) => void;
}

const MOOD_COLORS: Record<string, string> = {
  // Map mood labels to dot colors
  "Very Negative": "bg-destructive",
  "Negative": "bg-destructive/60",
  "Slightly Negative": "hsl(var(--amber)) opacity-40",
  "Neutral": "bg-muted-foreground/50",
  "Slightly Positive": "bg-sage-soft",
  "Positive": "bg-sage",
  "Very Positive": "bg-amber-glow",
};

function getMoodDotClass(moodScore: number | null): string {
  if (moodScore === null) return "";
  if (moodScore <= 15) return "bg-destructive";
  if (moodScore <= 30) return "bg-destructive/70";
  if (moodScore <= 45) return "bg-amber/50";
  if (moodScore <= 55) return "bg-muted-foreground/60";
  if (moodScore <= 70) return "bg-sage-soft";
  if (moodScore <= 85) return "bg-sage";
  return "bg-amber-glow";
}

function getMoodEmoji(mood: string | null): string {
  if (!mood) return "";
  const lower = mood.toLowerCase();
  if (lower.includes("happy") || lower.includes("joy") || lower.includes("excited")) return "✨";
  if (lower.includes("calm") || lower.includes("peace") || lower.includes("serene")) return "🍃";
  if (lower.includes("sad") || lower.includes("down") || lower.includes("low")) return "🌧";
  if (lower.includes("anxious") || lower.includes("stress") || lower.includes("worried")) return "💭";
  if (lower.includes("angry") || lower.includes("frustrat")) return "🔥";
  if (lower.includes("grateful") || lower.includes("thankful")) return "🙏";
  if (lower.includes("creative") || lower.includes("inspired")) return "🎨";
  if (lower.includes("love") || lower.includes("warm")) return "💛";
  return "📝";
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const MoodCalendar = ({ currentDate, onDateSelect }: MoodCalendarProps) => {
  const [viewMonth, setViewMonth] = useState(startOfMonth(currentDate));

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Gather mood data for visible days
  const dayData = days.map((day) => {
    const entry = getEntry(day);
    const hasMood = !!entry.mood;
    const hasText = !!entry.text.trim();
    return { day, entry, hasMood, hasText };
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-card/80 backdrop-blur-sm border border-border rounded-xl p-4 shadow-ink"
    >
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setViewMonth((m) => subMonths(m, 1))}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <AnimatePresence mode="wait">
          <motion.h3
            key={format(viewMonth, "yyyy-MM")}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="font-display text-sm font-semibold text-foreground tracking-wide"
          >
            {format(viewMonth, "MMMM yyyy")}
          </motion.h3>
        </AnimatePresence>
        <button
          onClick={() => setViewMonth((m) => addMonths(m, 1))}
          disabled={isSameDay(monthStart, startOfMonth(new Date())) || isFuture(addMonths(monthStart, 1))}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {WEEKDAYS.map((wd) => (
          <div key={wd} className="text-center font-mono text-[10px] text-muted-foreground/70 uppercase tracking-widest py-1">
            {wd}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 gap-0.5">
        {dayData.map(({ day, entry, hasMood, hasText }) => {
          const isCurrentMonth = day.getMonth() === viewMonth.getMonth();
          const isSelected = isSameDay(day, currentDate);
          const isTodayDate = isToday(day);
          const isFutureDate = isFuture(day) && !isTodayDate;
          const moodEmoji = getMoodEmoji(entry.mood);

          return (
            <button
              key={day.toISOString()}
              onClick={() => {
                if (!isFutureDate) {
                  onDateSelect(day);
                }
              }}
              disabled={isFutureDate}
              className={`
                relative flex flex-col items-center justify-center
                w-full aspect-square rounded-lg text-xs
                transition-all duration-200 group
                ${!isCurrentMonth ? "opacity-30" : ""}
                ${isFutureDate ? "opacity-20 cursor-not-allowed" : "cursor-pointer"}
                ${isSelected 
                  ? "bg-primary/20 ring-1 ring-primary text-primary font-semibold" 
                  : isTodayDate 
                    ? "bg-secondary text-foreground font-medium" 
                    : "hover:bg-secondary/60 text-foreground/80"
                }
              `}
            >
              <span className="font-mono text-[11px] leading-none">
                {format(day, "d")}
              </span>
              
              {/* Mood indicator */}
              {hasMood && isCurrentMonth && (
                <span className="text-[8px] leading-none mt-0.5 opacity-80 group-hover:opacity-100 transition-opacity">
                  {moodEmoji}
                </span>
              )}
              
              {/* Has entry dot (no mood yet) */}
              {!hasMood && hasText && isCurrentMonth && (
                <div className="w-1 h-1 rounded-full bg-muted-foreground/40 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-border/50">
        <p className="font-mono text-[9px] text-muted-foreground/60 uppercase tracking-[0.15em] mb-2">
          Mood Legend
        </p>
        <div className="grid grid-cols-2 gap-1">
          {[
            { emoji: "✨", label: "Happy" },
            { emoji: "🍃", label: "Calm" },
            { emoji: "🌧", label: "Sad" },
            { emoji: "💭", label: "Anxious" },
            { emoji: "🔥", label: "Angry" },
            { emoji: "📝", label: "Entry" },
          ].map(({ emoji, label }) => (
            <div key={label} className="flex items-center gap-1.5">
              <span className="text-[10px]">{emoji}</span>
              <span className="font-mono text-[9px] text-muted-foreground/70">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default MoodCalendar;
