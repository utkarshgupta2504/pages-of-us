import { useState } from 'react';
import { motion } from 'framer-motion';

const sweets = [
  { id: 1, color: '#E8B4D8', label: '🍬', x: -80, y: -20 },
  { id: 2, color: '#C8A2C8', label: '🍫', x: 0, y: -40 },
  { id: 3, color: '#F0C8E0', label: '🍭', x: 80, y: -20 },
  { id: 4, color: '#D8B4E8', label: '🧁', x: -40, y: 30 },
  { id: 5, color: '#C8D8A2', label: '🍩', x: 40, y: 30, easter: true },
];

const SweetBeginning = () => {
  const [opened, setOpened] = useState(false);
  const [clickedSweet, setClickedSweet] = useState<number | null>(null);

  return (
    <div className="h-full flex flex-col items-center justify-center relative">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="scene-text text-3xl md:text-4xl mb-12"
      >
        🍬 Sweet Beginning
      </motion.h2>

      {/* Sweet box */}
      <motion.div
        className="relative cursor-pointer"
        onClick={() => setOpened(true)}
        whileHover={{ scale: 1.02 }}
      >
        <motion.div
          className="glass-panel p-8 md:p-12 rounded-2xl glow-soft"
          animate={opened ? { height: 'auto' } : {}}
        >
          {!opened ? (
            <motion.p className="scene-text text-xl text-center">
              Tap to open the box ✨
            </motion.p>
          ) : (
            <div className="relative w-64 h-48 md:w-80 md:h-56">
              {sweets.map((sweet) => (
                <motion.div
                  key={sweet.id}
                  className="absolute cursor-pointer text-4xl md:text-5xl"
                  style={{ left: `calc(50% + ${sweet.x}px)`, top: `calc(50% + ${sweet.y}px)` }}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: sweet.id * 0.15, type: 'spring' }}
                  whileHover={{ scale: 1.3, rotate: [0, -10, 10, 0], transition: { duration: 0.4 } }}
                  onClick={(e) => { e.stopPropagation(); setClickedSweet(sweet.id); }}
                >
                  {sweet.label}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Messages */}
      {clickedSweet && (
        <motion.div
          key={clickedSweet}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center"
        >
          {sweets.find(s => s.id === clickedSweet)?.easter ? (
            <p className="scene-text text-xl text-accent">dumbum detected 😄</p>
          ) : (
            <p className="scene-text text-lg italic">
              Before anything else… I just wanted you to feel at home
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SweetBeginning;
