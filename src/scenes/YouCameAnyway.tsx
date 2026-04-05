import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const lines = [
  { text: "You didn't have to come…", delay: 2 },
  { text: "but you did", delay: 4.5 },
  { text: "again…", delay: 7 },
  { text: "and again…", delay: 9 },
  { text: "and again", delay: 11 },
];

const YouCameAnyway = () => {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [showFinal, setShowFinal] = useState(false);

  useEffect(() => {
    const timers = lines.map((line, i) =>
      setTimeout(() => setVisibleLines(prev => [...prev, i]), line.delay * 1000)
    );
    const finalTimer = setTimeout(() => setShowFinal(true), 14000);
    return () => { timers.forEach(clearTimeout); clearTimeout(finalTimer); };
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Soft warm indoor glow */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, hsl(30, 30%, 15%) 0%, hsl(224, 50%, 8%) 80%)',
        }}
      />

      {/* Subtle warm light source */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 200, height: 200,
          top: '20%', left: '50%', transform: 'translateX(-50%)',
          background: 'radial-gradient(circle, hsl(35, 60%, 50%, 0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        animate={{ opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="scene-text text-3xl md:text-4xl mb-12 relative z-10"
      >
        🩹 You Came Anyway
      </motion.h2>

      <div className="relative z-10 text-center space-y-4 max-w-md">
        {visibleLines.map(idx => (
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="scene-text text-xl italic"
          >
            "{lines[idx].text}"
          </motion.p>
        ))}

        {showFinal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 3 }}
            className="mt-12 pt-8"
          >
            <motion.p
              className="scene-text text-2xl md:text-3xl text-glow"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              "I absolutely love you"
            </motion.p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default YouCameAnyway;
