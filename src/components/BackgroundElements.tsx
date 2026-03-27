import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const BackgroundElements = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <div
        className="absolute w-64 h-64 rounded-full opacity-[0.04] transition-all duration-700 ease-out"
        style={{
          left: mousePos.x - 128,
          top: mousePos.y - 128,
          background: "radial-gradient(circle, hsl(var(--amber)) 0%, transparent 70%)",
        }}
      />

      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute rounded-full bg-primary/20"
          style={{
            width: 2 + (i % 3),
            height: 2 + (i % 3),
            left: `${5 + i * 8}%`,
            top: `${6 + ((i * 7) % 80)}%`,
          }}
          animate={{
            y: [0, -30 - i * 3, 0],
            x: [0, (i % 2 === 0 ? 10 : -10), 0],
            opacity: [0.1, 0.5, 0.1],
          }}
          transition={{ duration: 4 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
        />
      ))}

      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`dot-${i}`}
          className="absolute rounded-full bg-amber/10"
          style={{
            width: 3 + i * 2,
            height: 3 + i * 2,
            right: `${3 + i * 12}%`,
            bottom: `${10 + i * 9}%`,
          }}
          animate={{
            x: [0, 20, -15, 0],
            y: [0, -15, 8, 0],
            opacity: [0.08, 0.3, 0.12, 0.08],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 8 + i * 1.5, repeat: Infinity, ease: "easeInOut", delay: i * 1 }}
        />
      ))}

      {[...Array(5)].map((_, i) => (
        <motion.div
          key={`line-${i}`}
          className="absolute h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent"
          style={{ top: `${15 + i * 18}%`, left: "3%", right: "3%" }}
          animate={{ opacity: [0, 0.2, 0], scaleX: [0.3, 1, 0.3] }}
          transition={{ duration: 8 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 1.5 }}
        />
      ))}

      <svg className="absolute top-[5%] right-[5%] w-48 h-48" viewBox="0 0 200 200" fill="none">
        {[
          { cx: 30, cy: 40 },
          { cx: 80, cy: 20 },
          { cx: 120, cy: 60 },
          { cx: 70, cy: 100 },
          { cx: 150, cy: 90 },
          { cx: 160, cy: 140 },
        ].map((dot, i, arr) => (
          <g key={`constellation-${i}`}>
            <motion.circle
              cx={dot.cx}
              cy={dot.cy}
              r="2"
              fill="hsl(var(--amber))"
              animate={{ opacity: [0.1, 0.4, 0.1], r: [1.5, 2.5, 1.5] }}
              transition={{ duration: 3 + i * 0.5, repeat: Infinity, delay: i * 0.3 }}
            />
            {i < arr.length - 1 && (
              <motion.line
                x1={dot.cx}
                y1={dot.cy}
                x2={arr[i + 1].cx}
                y2={arr[i + 1].cy}
                stroke="hsl(var(--amber))"
                strokeWidth="0.5"
                animate={{ opacity: [0.03, 0.12, 0.03] }}
                transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
              />
            )}
          </g>
        ))}
      </svg>

      <motion.svg
        className="absolute top-[10%] left-[8%] w-36 h-36 text-amber/5"
        viewBox="0 0 100 100"
        fill="none"
        animate={{ opacity: [0.03, 0.1, 0.03], rotate: [0, 8, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        <path d="M10 80 Q 50 10, 90 50" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M20 90 Q 40 40, 80 30" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" />
      </motion.svg>

      <motion.svg
        className="absolute bottom-[12%] right-[8%] w-28 h-28 text-sage/5"
        viewBox="0 0 100 100"
        fill="none"
        animate={{ opacity: [0.02, 0.08, 0.02], rotate: [0, -5, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 4 }}
      >
        <path d="M20 70 Q 60 20, 80 60" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </motion.svg>

      <motion.svg
        className="absolute top-[40%] left-[2%] w-16 h-16"
        viewBox="0 0 50 50"
        animate={{ y: [0, -8, 0], opacity: [0.03, 0.08, 0.03], rotate: [0, 10, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <ellipse cx="25" cy="25" rx="18" ry="12" fill="hsl(var(--primary))" opacity="0.15" />
        <ellipse cx="22" cy="28" rx="10" ry="8" fill="hsl(var(--amber))" opacity="0.1" />
      </motion.svg>

      <motion.div
        className="absolute top-[55%] right-[3%] w-24 h-24 rounded-full border border-primary/5"
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.12, 0.05], rotate: [0, 90, 180] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute top-[20%] left-[3%] w-14 h-14 rounded-full border border-amber/5"
        animate={{ scale: [1, 1.3, 1], opacity: [0.03, 0.1, 0.03] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      <motion.div
        className="absolute bottom-[30%] left-[15%] w-10 h-10 rounded-full border-2 border-dashed border-sage/5"
        animate={{ rotate: [0, 360], opacity: [0.05, 0.1, 0.05] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`drip-${i}`}
          className="absolute w-px bg-gradient-to-b from-primary/15 via-primary/5 to-transparent"
          style={{
            left: `${20 + i * 30}%`,
            top: 0,
            height: `${15 + i * 5}%`,
          }}
          animate={{ opacity: [0, 0.3, 0], scaleY: [0.5, 1, 0.5] }}
          transition={{ duration: 6 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 3 }}
        />
      ))}

      <motion.div
        className="absolute top-[70%] right-[20%] w-6 h-6 border border-amber/10 rotate-45"
        animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.05, 0.15, 0.05] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <motion.div
        className="absolute top-[15%] right-[35%] w-4 h-4 border border-primary/10 rotate-45"
        animate={{ scale: [1, 1.3, 1], opacity: [0.03, 0.1, 0.03], rotate: [45, 90, 45] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />
    </div>
  );
};

export default BackgroundElements;
