import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const EightMinuteHug = () => {
  const [seconds, setSeconds] = useState(0);
  const totalSeconds = 8 * 60;

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(s => {
        if (s >= totalSeconds) { clearInterval(interval); return totalSeconds; }
        return s + 1;
      });
    }, 62.5); // Faster for demo: ~8 real seconds = 8 virtual minutes
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const progress = seconds / totalSeconds;

  return (
    <div className="h-full flex flex-col items-center justify-center">
      {/* Minimal scene - just the hug */}
      <motion.div
        className="relative mb-12"
        animate={{ scale: [1, 1.01, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="text-8xl md:text-9xl">🫂</div>
        {/* Soft glow behind */}
        <div
          className="absolute inset-0 -z-10 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle, hsl(300, 25%, 73%, ${0.1 + progress * 0.2}) 0%, transparent 70%)`,
            transform: 'scale(2)',
          }}
        />
      </motion.div>

      {/* Timer */}
      <motion.div
        className="glass-panel px-8 py-4 rounded-2xl mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <p className="scene-text text-4xl md:text-5xl font-display tracking-wider text-center">
          {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
        </p>
      </motion.div>

      {/* Text appears gradually */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: progress > 0.3 ? 1 : 0 }}
        className="scene-text text-xl italic mb-2"
      >
        "I wasn't in a hurry"
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: progress > 0.6 ? 1 : 0 }}
        className="scene-text text-xl italic text-primary/70"
      >
        "I just wanted to stay"
      </motion.p>
    </div>
  );
};

export default EightMinuteHug;
