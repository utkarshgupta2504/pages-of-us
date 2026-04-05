import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const teasingTexts = [
  "Are you even driving properly?",
  "Focus na!",
  "Slow down!!",
  "You call this riding? 😂",
];

const SunsetPoint = () => {
  const [arrived, setArrived] = useState(false);
  const [floatingTextIdx, setFloatingTextIdx] = useState(0);

  useEffect(() => {
    if (arrived) return;
    const timer = setTimeout(() => setArrived(true), 8000);
    const textTimer = setInterval(() => {
      setFloatingTextIdx(i => (i + 1) % teasingTexts.length);
    }, 2200);
    return () => { clearTimeout(timer); clearInterval(textTimer); };
  }, [arrived]);

  const stablePositions = useMemo(() =>
    teasingTexts.map(() => ({
      x: 15 + Math.random() * 70,
      y: 20 + Math.random() * 30,
    })), []
  );

  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Sunset sky */}
      <div
        className="absolute inset-0"
        style={{
          background: arrived
            ? 'linear-gradient(to bottom, hsl(25, 80%, 55%) 0%, hsl(340, 60%, 40%) 40%, hsl(260, 40%, 20%) 100%)'
            : 'linear-gradient(to bottom, hsl(200, 50%, 60%) 0%, hsl(35, 60%, 65%) 100%)',
          transition: 'background 2s ease',
        }}
      />

      {/* Sun at destination */}
      {arrived && (
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 80, height: 80,
            top: '30%', left: '50%', transform: 'translateX(-50%)',
            background: 'radial-gradient(circle, #FFD700 20%, #FF6B35 50%, transparent 100%)',
            boxShadow: '0 0 100px #FFD70044',
          }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2 }}
        />
      )}

      {/* Floating teasing texts while riding */}
      {!arrived && (
        <div className="absolute inset-0 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.p
              key={floatingTextIdx}
              className="absolute scene-text text-lg text-accent/80 italic"
              style={{
                left: `${stablePositions[floatingTextIdx].x}%`,
                top: `${stablePositions[floatingTextIdx].y}%`,
              }}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.6 }}
            >
              "{teasingTexts[floatingTextIdx]}"
            </motion.p>
          </AnimatePresence>
        </div>
      )}

      {/* Riding animation */}
      {!arrived && (
        <motion.div
          className="absolute bottom-20 text-4xl"
          animate={{ x: [-100, 100, -100] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          🏍️💨
        </motion.div>
      )}

      {/* Arrived - silhouette scene */}
      {arrived && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
          className="relative z-10 text-center"
        >
          {/* Sitting silhouettes */}
          <motion.div
            className="text-6xl md:text-7xl mb-8"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            👫
          </motion.div>
        </motion.div>
      )}

      {/* Title */}
      <div className="relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="scene-text text-3xl md:text-4xl mb-4"
        >
          🌄 The Sunset Point
        </motion.h2>

        {arrived && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
          >
            <p className="scene-text text-xl italic">
              "Somewhere between teasing and silence…"
            </p>
            <p className="scene-text text-lg italic text-primary/70 mt-1">
              "we found peace"
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SunsetPoint;
