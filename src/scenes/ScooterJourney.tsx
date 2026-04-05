import { useState } from 'react';
import { motion } from 'framer-motion';

const stages = [
  { id: 0, label: '🔒 Insurance', desc: 'The paperwork era', unlocked: false },
  { id: 1, label: '🛵 First Ride', desc: 'Slightly terrifying', unlocked: false },
  { id: 2, label: '🏍️ Solo Ride', desc: 'Smooth operator', unlocked: false },
];

const ScooterJourney = () => {
  const [currentStage, setCurrentStage] = useState(-1);

  const unlockNext = () => {
    if (currentStage < 2) setCurrentStage(s => s + 1);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="scene-text text-3xl md:text-4xl mb-8"
      >
        🛵 The Scooter Saga
      </motion.h2>

      {/* Scooter */}
      <motion.div
        className="text-7xl md:text-8xl mb-8"
        animate={
          currentStage === 1
            ? { x: [0, 5, -3, 4, -2, 0], rotate: [0, 2, -2, 1, -1, 0] }
            : currentStage === 2
            ? { x: [0, 0, 0] }
            : {}
        }
        transition={
          currentStage === 1
            ? { repeat: Infinity, duration: 0.8 }
            : {}
        }
      >
        {currentStage >= 2 ? (
          <motion.span
            animate={{ x: [0, 200] }}
            transition={{ duration: 3, ease: 'easeInOut' }}
          >
            🛵💨
          </motion.span>
        ) : currentStage >= 0 ? '🛵' : '🔒'}
      </motion.div>

      {/* Stages */}
      <div className="flex gap-4 mb-8">
        {stages.map((stage, i) => (
          <motion.div
            key={stage.id}
            className={`glass-panel px-4 py-3 rounded-xl text-center ${
              i <= currentStage ? 'glow-soft' : 'opacity-40'
            }`}
            animate={i === currentStage ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <p className="text-lg">{stage.label}</p>
            <p className="scene-text text-xs text-primary/60">{stage.desc}</p>
          </motion.div>
        ))}
      </div>

      {currentStage < 2 ? (
        <motion.button
          onClick={unlockNext}
          className="nav-button px-8 py-3 glow-soft"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Unlock Next Stage 🔓
        </motion.button>
      ) : (
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="scene-text text-xl italic text-center"
        >
          "That day… I was stupidly proud"
        </motion.p>
      )}
    </div>
  );
};

export default ScooterJourney;
