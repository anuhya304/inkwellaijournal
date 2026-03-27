import { cn } from "@/lib/utils";

interface InkSplatterProps {
  className?: string;
}

const InkSplatter = ({ className }: InkSplatterProps) => {
  return (
    <div className={cn("absolute opacity-[0.06] animate-ink-spread", className)}>
      <svg viewBox="0 0 200 200" fill="currentColor">
        <path d="M100 20 C130 30, 170 50, 180 100 C190 150, 150 180, 100 180 C50 180, 10 150, 20 100 C30 50, 70 30, 100 20 Z" />
        <circle cx="60" cy="60" r="15" />
        <circle cx="140" cy="140" r="10" />
        <circle cx="150" cy="50" r="8" />
      </svg>
    </div>
  );
};

export default InkSplatter;
