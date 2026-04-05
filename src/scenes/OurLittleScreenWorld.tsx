import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const narrative = [
  { text: 'Not every moment needed a place…', delay: 1.7 },
  { text: 'Some just needed a screen… and you', delay: 4.5 },
  { text: 'We watched everything…', delay: 7.4 },
  { text: 'But it was never about what we watched', delay: 11 },
];

const titles = [
  { id: 'zootopia', name: 'Zootopia', emoji: '🦊' },
  { id: 'zootopia2', name: 'Zootopia 2', emoji: '🌆' },
  { id: 'mardaani3', name: 'Mardaani 3', emoji: '🎬' },
  { id: '2brokegirls', name: '2 Broke Girls', emoji: '☕' },
  { id: 'bbt', name: 'The Big Bang Theory', emoji: '🧠' },
];

const chatSnippets = ['Are you watching or sleeping?', 'Wait wait pause', 'This is so good'];

const OurLittleScreenWorld = () => {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [showFinal, setShowFinal] = useState(false);
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [chatIndex, setChatIndex] = useState(0);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const lineTimers = narrative.map((line, i) =>
      setTimeout(() => setVisibleLines(prev => [...prev, i]), line.delay * 1000)
    );

    const finalTimer = setTimeout(() => setShowFinal(true), 15000);

    const chatTimer = setInterval(() => {
      setChatIndex(i => (i + 1) % chatSnippets.length);
      setShowChat(true);
      setTimeout(() => setShowChat(false), 1500);
    }, 3000);

    return () => {
      lineTimers.forEach(clearTimeout);
      clearTimeout(finalTimer);
      clearInterval(chatTimer);
    };
  }, []);

  const cardPositions = useMemo(
    () => [
      { x: '-34%', y: '-16%' },
      { x: '33%', y: '-14%' },
      { x: '-38%', y: '26%' },
      { x: '0%', y: '30%' },
      { x: '36%', y: '23%' },
    ],
    []
  );

  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Warm, dark screen-share ambience */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 30%, hsl(220, 45%, 18%) 0%, hsl(235, 40%, 10%) 50%, hsl(255, 34%, 8%) 100%)',
        }}
      />

      {/* TV glow */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 430,
          height: 260,
          top: '24%',
          left: '50%',
          transform: 'translateX(-50%)',
          background:
            'radial-gradient(ellipse, hsl(210, 90%, 65%, 0.16) 0%, hsl(280, 90%, 70%, 0.12) 48%, transparent 74%)',
          filter: 'blur(40px)',
        }}
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="scene-text text-3xl md:text-4xl mb-4 relative z-10 text-white"
      >
        📺 Our Little Screen World
      </motion.h2>

      {/* Main shared screen */}
      <motion.div
        className="relative z-10 glass-panel w-[320px] md:w-[420px] h-[160px] md:h-[210px] rounded-2xl overflow-hidden mb-4"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(135deg, hsl(220, 70%, 20%, 0.65) 0%, hsl(265, 70%, 22%, 0.65) 100%)',
          }}
        />

        <div className="absolute inset-0 flex items-center justify-center gap-4">
          <motion.span className="text-3xl" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2.2, repeat: Infinity }}>🖥️</motion.span>
          <motion.span className="text-sm scene-text text-white/90">Discord (VC + Screen Share)</motion.span>
        </div>

        {/* Watching together indicators */}
        <motion.div className="absolute bottom-3 left-4 text-lg" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1.8, repeat: Infinity }}>👩</motion.div>
        <motion.div className="absolute bottom-3 right-4 text-lg" animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1.8, repeat: Infinity, delay: 0.2 }}>🧑</motion.div>
        <motion.div
          className="absolute bottom-5 left-1/2 -translate-x-1/2 h-[2px] bg-white/40 rounded-full"
          style={{ width: 80 }}
          animate={{ opacity: [0.35, 0.9, 0.35] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        />
      </motion.div>

      {/* Floating titles */}
      <div className="relative z-10 w-full max-w-[560px] h-44 mb-2">
        {titles.map((item, idx) => {
          const isActive = activeCard === item.id;
          return (
            <motion.button
              key={item.id}
              onClick={() => setActiveCard(isActive ? null : item.id)}
              className="absolute glass-panel rounded-xl px-3 py-2 text-left"
              style={{
                left: `calc(50% + ${cardPositions[idx].x})`,
                top: `calc(50% + ${cardPositions[idx].y})`,
                transform: 'translate(-50%, -50%)',
              }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              animate={{
                y: isActive ? -6 : [0, -2, 0],
                opacity: isActive ? 1 : 0.92,
              }}
              transition={{ duration: isActive ? 0.2 : 3, repeat: isActive ? 0 : Infinity, ease: 'easeInOut' }}
            >
              <p className="scene-text text-xs text-white/80">{item.emoji}</p>
              <p className="scene-text text-xs md:text-sm text-white">{item.name}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Ambient chat bubble */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            key={chatIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="relative z-10 glass-panel px-4 py-2 rounded-full mb-3"
          >
            <p className="scene-text text-xs md:text-sm text-white/90">{chatSnippets[chatIndex]}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Narrative */}
      <div className="relative z-10 text-center space-y-1 max-w-xl">
        {visibleLines.map((idx) => (
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="scene-text text-base md:text-lg italic text-white/95"
          >
            "{narrative[idx].text}"
          </motion.p>
        ))}

        {showFinal && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="scene-text text-lg md:text-xl text-white mt-3"
          >
            "You were just waiting for someone to watch it with… and somehow… that became me"
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default OurLittleScreenWorld;
