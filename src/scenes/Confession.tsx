import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const messages = [
  { from: 'her', text: 'I need to tell you something...', delay: 1 },
  { from: 'her', text: 'I think about you way more than I should', delay: 3 },
  { from: 'her', text: 'Like... all the time', delay: 5 },
  { from: 'pause', text: '', delay: 7 },
  { from: 'him', text: 'You know what...', delay: 8 },
  { from: 'him', text: 'I was trying to figure out how to say the same thing', delay: 10 },
  { from: 'him', text: 'Every time I see you, I forget every word I practiced', delay: 12.5 },
  { from: 'final', text: 'Omphoooo.', delay: 15 },
];

const Confession = () => {
  const [visibleMessages, setVisibleMessages] = useState<number[]>([]);
  const [heartbeat, setHeartbeat] = useState(false);

  useEffect(() => {
    const timers = messages.map((msg, i) =>
      setTimeout(() => {
        setVisibleMessages(prev => [...prev, i]);
        if (msg.from === 'pause') setHeartbeat(true);
      }, msg.delay * 1000)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="h-full flex flex-col items-center justify-center relative">
      {/* Heartbeat background */}
      {heartbeat && (
        <motion.div
          className="absolute inset-0 rounded-full"
          animate={{ scale: [1, 1.02, 1], opacity: [0, 0.05, 0] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          style={{ background: 'radial-gradient(circle, hsl(330, 60%, 75%) 0%, transparent 70%)' }}
        />
      )}

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="scene-text text-3xl md:text-4xl mb-8"
      >
        💬 December 9
      </motion.h2>

      <div className="w-full max-w-md space-y-3 px-4">
        <AnimatePresence>
          {visibleMessages.map(idx => {
            const msg = messages[idx];
            if (msg.from === 'pause') return null;
            if (msg.from === 'final') {
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center mt-8"
                >
                  <p className="scene-text text-3xl text-glow">{msg.text}</p>
                </motion.div>
              );
            }
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: msg.from === 'her' ? -30 : 30, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ type: 'spring', damping: 20 }}
                className={`flex ${msg.from === 'him' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`glass-panel px-4 py-2.5 max-w-[80%] ${
                  msg.from === 'her' ? 'rounded-br-2xl rounded-tr-2xl rounded-tl-2xl'
                    : 'rounded-bl-2xl rounded-tl-2xl rounded-tr-2xl bg-primary/10'
                }`}>
                  <p className="scene-text text-sm md:text-base">{msg.text}</p>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Confession;
