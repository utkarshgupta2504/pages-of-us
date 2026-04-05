import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const cakes = [
  { id: 1, label: '🎂', x: -80, y: -25 },
  { id: 2, label: '🧁', x: -30, y: -45 },
  { id: 3, label: '🍰', x: 30, y: -45 },
  { id: 4, label: '🎂', x: 80, y: -25 },
  { id: 5, label: '🧁', x: -50, y: 15 },
  { id: 6, label: '🍰', x: 0, y: 25 },
  { id: 7, label: '🎂', x: 50, y: 15 },
];

const SweetBeginning = () => {
  const [opened, setOpened] = useState(false);
  const [clickedCake, setClickedCake] = useState<number | null>(null);
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  const spawnParticles = (cakeId: number) => {
    const cake = cakes.find(c => c.id === cakeId);
    if (!cake) return;
    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      id: Date.now() + i,
      x: cake.x,
      y: cake.y,
    }));
    setParticles(prev => [...prev, ...newParticles]);
    setTimeout(() => {
      setParticles(prev => prev.filter(p => !newParticles.find(np => np.id === p.id)));
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center relative">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="scene-text text-3xl md:text-4xl mb-12"
      >
        🍰 Sweet Beginning
      </motion.h2>

      {/* Cake box */}
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
              {cakes.map((cake) => (
                <motion.div
                  key={cake.id}
                  className="absolute cursor-pointer text-4xl md:text-5xl"
                  style={{ left: `calc(50% + ${cake.x}px)`, top: `calc(50% + ${cake.y}px)` }}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: cake.id * 0.12, type: 'spring', stiffness: 200 }}
                  whileHover={{
                    y: [0, -12, 0],
                    transition: { duration: 0.4, repeat: Infinity },
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setClickedCake(cake.id);
                    spawnParticles(cake.id);
                  }}
                >
                  {cake.label}
                </motion.div>
              ))}

              {/* Particle bursts */}
              <AnimatePresence>
                {particles.map((p) => (
                  <motion.div
                    key={p.id}
                    className="absolute pointer-events-none"
                    style={{ left: `calc(50% + ${p.x}px)`, top: `calc(50% + ${p.y}px)` }}
                    initial={{ opacity: 1, scale: 0 }}
                    animate={{
                      opacity: 0,
                      scale: 1.5,
                      x: (Math.random() - 0.5) * 60,
                      y: (Math.random() - 0.5) * 60,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <span className="text-lg">✨</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Message */}
      <AnimatePresence>
        {clickedCake && (
          <motion.div
            key={clickedCake}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <p className="scene-text text-xl italic">
              "Lo ji, aap bhi khao"
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SweetBeginning;
