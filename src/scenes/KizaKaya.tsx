import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KizaKaya = () => {
  const [attacked, setAttacked] = useState(false);
  const [hitCount, setHitCount] = useState(0);

  const handleAttack = () => {
    setAttacked(true);
    setHitCount(c => c + 1);
    setTimeout(() => setAttacked(false), 600);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Ambient restaurant glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 60%, hsl(20, 60%, 15%) 0%, hsl(224, 60%, 8%) 70%)',
        }}
      />

      {/* Screen glow effect */}
      <motion.div
        className="absolute w-64 h-40 rounded-xl pointer-events-none"
        style={{
          top: '25%', left: '50%', transform: 'translateX(-50%)',
          background: 'radial-gradient(ellipse, hsl(210, 80%, 40%, 0.15) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="scene-text text-3xl md:text-4xl mb-8 relative z-10"
      >
        🎮 Kiza Kaya
      </motion.h2>

      {/* Gaming setup */}
      <div className="relative z-10 flex flex-col items-center">
        {/* TV Screen */}
        <motion.div
          className="glass-panel w-56 h-36 md:w-72 md:h-44 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden"
          style={{ border: '2px solid hsl(var(--glass-border))' }}
        >
          {/* Game screen content */}
          <AnimatePresence>
            {attacked ? (
              <motion.div
                key="attack"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="text-5xl md:text-6xl"
              >
                ⚔️
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-4xl md:text-5xl"
              >
                🪓
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hit flash */}
          {attacked && (
            <motion.div
              className="absolute inset-0 bg-accent/20"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}

          {/* Hit counter */}
          {hitCount > 0 && (
            <div className="absolute top-2 right-3">
              <p className="scene-text text-xs text-accent">COMBO x{hitCount}</p>
            </div>
          )}
        </motion.div>

        {/* Controller */}
        <motion.div
          className="cursor-pointer text-5xl md:text-6xl mb-2"
          onClick={handleAttack}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.85, rotate: -5 }}
        >
          🎮
        </motion.div>
        <p className="scene-text text-xs text-primary/40 mb-6">tap to attack</p>
      </div>

      {/* Text */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: hitCount >= 3 ? 1 : 0, y: hitCount >= 3 ? 0 : 20 }}
        className="text-center relative z-10"
      >
        <p className="scene-text text-lg italic">
          "For someone who wasn't supposed to play…"
        </p>
        <p className="scene-text text-lg italic text-primary/70 mt-1">
          "you absolutely destroyed God of War"
        </p>
      </motion.div>
    </div>
  );
};

export default KizaKaya;
