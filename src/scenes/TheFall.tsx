import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const lines = [
  { text: "I had a small accident one day…", delay: 2 },
  { text: "nothing too dramatic…", delay: 4.5 },
  { text: "but enough to slow me down", delay: 7 },
  { text: "I thought I'd just deal with it myself", delay: 10 },
];

const TheFall = () => {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);

  useEffect(() => {
    const timers = lines.map((line, i) =>
      setTimeout(() => setVisibleLines(prev => [...prev, i]), line.delay * 1000)
    );
    return () => { timers.forEach(clearTimeout); };
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Slightly dimmed warm glow - neutral environment */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 40%, hsl(30, 25%, 12%) 0%, hsl(224, 50%, 8%) 85%)',
        }}
      />

      {/* Subtle light source - minimal animation */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 250, height: 250,
          top: '15%', left: '50%', transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, hsl(35, 50%, 45%, 0.04) 0%, transparent 70%)',
          filter: 'blur(50px)',
        }}
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="scene-text text-3xl md:text-4xl mb-12 relative z-10"
      >
        🚴 The Fall
      </motion.h2>

      <div className="relative z-10 text-center space-y-4 max-w-md">
        {visibleLines.map(idx => (
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="scene-text text-lg md:text-xl italic"
          >
            "{lines[idx].text}"
          </motion.p>
        ))}
      </div>
    </div>
  );
};

export default TheFall;
