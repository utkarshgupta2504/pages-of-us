import { useState } from 'react';
import { motion } from 'framer-motion';

const ShyComfort = () => {
  const [helped, setHelped] = useState(false);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="scene-text text-3xl md:text-4xl mb-12"
      >
        🌱 Shy → Comfort
      </motion.h2>

      <div className="flex items-end gap-12 md:gap-20 mb-12">
        {/* Playful character */}
        <motion.div
          className="flex flex-col items-center"
          animate={{ y: [0, -8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary flex items-center justify-center text-3xl">
            😊
          </div>
          <p className="scene-text text-sm mt-2 text-primary/60">playful</p>
        </motion.div>

        {/* Shy character */}
        <motion.div className="flex flex-col items-center">
          <motion.div
            className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-accent/30 flex items-center justify-center text-3xl"
            animate={helped
              ? { scale: [1, 1.1, 1], rotate: [0, -5, 5, 0] }
              : { scale: 1 }
            }
            transition={helped ? { repeat: Infinity, duration: 2 } : {}}
          >
            {helped ? '😄' : '😶'}
          </motion.div>
          <p className="scene-text text-sm mt-2 text-primary/60">
            {helped ? 'not shy anymore!' : 'shy...'}
          </p>
        </motion.div>
      </div>

      {!helped && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          onClick={() => setHelped(true)}
          className="nav-button px-8 py-3 text-lg glow-soft"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Help? 🤝
        </motion.button>
      )}

      {helped && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-4 space-y-2"
        >
          <p className="scene-text text-xl italic">"You is shy… but not for long"</p>
          <p className="scene-text text-lg text-primary/70">"I is problem… and also solution"</p>
        </motion.div>
      )}
    </div>
  );
};

export default ShyComfort;
