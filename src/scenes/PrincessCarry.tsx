import { useState } from 'react';
import { motion } from 'framer-motion';

const PrincessCarry = () => {
  const [clicked, setClicked] = useState(false);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="scene-text text-3xl md:text-4xl mb-12"
      >
        👑 Princess Carry
      </motion.h2>

      <motion.div
        className="relative cursor-pointer mb-12"
        onClick={() => setClicked(!clicked)}
        whileHover={{ scale: 1.05 }}
      >
        <motion.div
          className="text-8xl md:text-9xl"
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        >
          <motion.span
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block"
          >
            🏋️‍♂️👸
          </motion.span>
        </motion.div>

        {/* Slow motion effect lines */}
        {Array.from({ length: 5 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-0.5 bg-primary/20 rounded-full"
            style={{
              width: 40 + Math.random() * 60,
              left: -40 + Math.random() * 20,
              top: `${20 + i * 15}%`,
            }}
            animate={{ opacity: [0, 0.4, 0], x: [-20, 20] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          />
        ))}
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5 }}
        className="scene-text text-xl italic mb-4"
      >
        "First time… but definitely not last"
      </motion.p>

      {clicked && (
        <motion.p
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="scene-text text-lg text-accent"
        >
          dumbum… again 😄
        </motion.p>
      )}
    </div>
  );
};

export default PrincessCarry;
