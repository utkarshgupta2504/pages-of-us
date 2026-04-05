import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const nodes = [
  { id: 'ironhill', label: 'Ironhill', emoji: '🍺', x: 15, y: 25, memory: 'That first cider… we were already too comfortable', anim: 'cider' },
  { id: 'travellers', label: "Traveller's Bungalow", emoji: '🍫', x: 55, y: 15, memory: 'Chocolate dessert and conversations that went nowhere… and everywhere', anim: 'dessert' },
  { id: 'social', label: 'Social', emoji: '🍹', x: 80, y: 40, memory: 'Banarasi Patiala — a name we'll never forget', anim: 'drink' },
  { id: 'candlelight', label: 'Candlelight Concert', emoji: '🕯️', x: 30, y: 60, memory: 'The music was good… but I was watching you', anim: 'candle' },
  { id: 'souljam', label: 'Souljam', emoji: '🎵', x: 65, y: 70, memory: 'When the bass dropped, something shifted', anim: 'music' },
];

const MemoryMap = () => {
  const [activeNode, setActiveNode] = useState<string | null>(null);

  return (
    <div className="h-full flex flex-col items-center justify-center relative">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="scene-text text-3xl md:text-4xl mb-4"
      >
        🛣️ Memory Map
      </motion.h2>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="scene-text text-sm text-primary/50 mb-8"
      >
        Tap on a place to unlock a memory
      </motion.p>

      <div className="relative w-full max-w-lg h-80 md:h-96">
        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
          {nodes.map((node, i) => {
            const next = nodes[(i + 1) % nodes.length];
            return (
              <motion.line
                key={`line-${i}`}
                x1={node.x} y1={node.y}
                x2={next.x} y2={next.y}
                stroke="hsl(300, 25%, 73%)"
                strokeWidth="0.3"
                strokeDasharray="2 2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: i * 0.3, duration: 1 }}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.div
            key={node.id}
            className="absolute cursor-pointer"
            style={{ left: `${node.x}%`, top: `${node.y}%`, transform: 'translate(-50%, -50%)' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.2, type: 'spring' }}
          >
            <motion.div
              className="glass-panel w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl glow-soft"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setActiveNode(activeNode === node.id ? null : node.id)}
              animate={activeNode === node.id ? { boxShadow: '0 0 30px hsl(300, 25%, 73%, 0.5)' } : {}}
            >
              {node.emoji}
            </motion.div>
            <p className="scene-text text-xs text-center mt-1 whitespace-nowrap">{node.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Memory text */}
      <AnimatePresence mode="wait">
        {activeNode && (
          <motion.div
            key={activeNode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-panel px-6 py-4 mt-4 max-w-md text-center"
          >
            <p className="scene-text text-base italic">
              "{nodes.find(n => n.id === activeNode)?.memory}"
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="scene-text text-sm italic text-primary/50 mt-6"
      >
        "Every place… just became a reason to stay longer with you"
      </motion.p>
    </div>
  );
};

export default MemoryMap;
