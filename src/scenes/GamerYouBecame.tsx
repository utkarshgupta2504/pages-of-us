import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const storyLines = [
  { text: "They said you wouldn’t play…", delay: 1.5 },
  { text: "But then…", delay: 3.5 },
  { text: "You started learning", delay: 5.2 },
  { text: "One finger at a time…", delay: 7.5 },
  { text: "one movement at a time", delay: 9.5 },
  { text: "And suddenly…", delay: 12 },
  { text: "You weren’t trying anymore…", delay: 14 },
  { text: "you were just playing", delay: 16 },
];

const keyFlow = ['A', 'W', 'D', 'SHIFT', 'SPACE'];

const games = ['Fireboy & Watergirl', 'It Takes Two (Steam gift)'];

const GamerYouBecame = () => {
  const [visibleLines, setVisibleLines] = useState<number[]>([]);
  const [showFinal, setShowFinal] = useState(false);
  const [trainingIndex, setTrainingIndex] = useState(0);
  const [controlLevel, setControlLevel] = useState(0);
  const [syncBursts, setSyncBursts] = useState(0);

  useEffect(() => {
    const lineTimers = storyLines.map((line, i) =>
      setTimeout(() => setVisibleLines(prev => [...prev, i]), line.delay * 1000)
    );

    const finalTimer = setTimeout(() => setShowFinal(true), 19000);

    const keyTimer = setInterval(() => {
      setTrainingIndex(i => (i + 1) % keyFlow.length);
    }, 950);

    const levelTimer = setInterval(() => {
      setControlLevel(level => {
        if (level >= 100) return 100;
        return level + 1;
      });
    }, 150);

    return () => {
      lineTimers.forEach(clearTimeout);
      clearTimeout(finalTimer);
      clearInterval(keyTimer);
      clearInterval(levelTimer);
    };
  }, []);

  const awkwardControl = controlLevel < 45;
  const smoothControl = controlLevel >= 45;
  const inSync = controlLevel >= 72 || syncBursts > 0;

  const keyStyle = (keyName: string) => {
    const active = keyFlow[trainingIndex] === keyName;
    return active
      ? 'bg-primary/40 border-primary text-white shadow-[0_0_18px_hsl(var(--primary)/0.5)]'
      : 'bg-black/25 border-white/20 text-white/75';
  };

  const floatingTips = useMemo(
    () => [
      'Index → D',
      'Middle → W',
      'Ring → A',
      'Pinky → Shift/Ctrl',
      'Thumb → Space',
    ],
    []
  );

  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Cozy dark gaming ambience */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 20%, hsl(230, 55%, 20%) 0%, hsl(245, 45%, 10%) 50%, hsl(255, 40%, 7%) 100%)',
        }}
      />

      {/* Screen glow */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 360,
          height: 220,
          top: '18%',
          left: '50%',
          transform: 'translateX(-50%)',
          background:
            'radial-gradient(ellipse, hsl(220, 95%, 65%, 0.16) 0%, hsl(280, 90%, 65%, 0.12) 45%, transparent 75%)',
          filter: 'blur(35px)',
        }}
        animate={{ opacity: [0.45, 0.75, 0.45] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.4 }}
        className="scene-text text-3xl md:text-4xl mb-5 relative z-10 text-white [text-shadow:0_2px_14px_rgba(0,0,0,0.7)]"
      >
        🎮 The Gamer You Became
      </motion.h2>

      {/* Co-op game strip */}
      <div className="relative z-10 flex flex-wrap items-center justify-center gap-2 mb-4">
        {games.map((game) => (
          <motion.span
            key={game}
            className="glass-panel px-3 py-1.5 rounded-full scene-text text-xs md:text-sm text-white/90"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            {game}
          </motion.span>
        ))}
      </div>

      <div className="relative z-10 w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* WASD learning */}
        <div className="glass-panel rounded-2xl p-4 md:p-5">
          <p className="scene-text text-sm text-white/85 mb-3">WASD discipline</p>

          <div className="grid grid-cols-3 gap-2 max-w-[220px] mx-auto mb-3">
            <div />
            <div className={`h-12 rounded-lg border flex items-center justify-center font-semibold ${keyStyle('W')}`}>W</div>
            <div />
            <div className={`h-12 rounded-lg border flex items-center justify-center font-semibold ${keyStyle('A')}`}>A</div>
            <div className={`h-12 rounded-lg border flex items-center justify-center font-semibold ${keyStyle('SHIFT')}`}>Shift</div>
            <div className={`h-12 rounded-lg border flex items-center justify-center font-semibold ${keyStyle('D')}`}>D</div>
            <div className={`col-span-3 h-11 rounded-lg border flex items-center justify-center font-semibold ${keyStyle('SPACE')}`}>Space</div>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={trainingIndex}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="scene-text text-xs md:text-sm text-white/80 text-center"
            >
              {floatingTips[trainingIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Mouse + co-op simulation */}
        <div className="glass-panel rounded-2xl p-4 md:p-5 relative overflow-hidden">
          <p className="scene-text text-sm text-white/85 mb-3">Mouse camera control</p>

          <div className="relative h-20 rounded-lg bg-black/25 border border-white/10 mb-3 overflow-hidden">
            <motion.div
              className="absolute w-3 h-3 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(56,189,248,0.8)]"
              animate={
                awkwardControl
                  ? { x: [10, 80, 40, 120, 55], y: [45, 20, 52, 18, 40] }
                  : { x: [12, 40, 80, 120, 160], y: [40, 28, 25, 30, 36] }
              }
              transition={{ duration: awkwardControl ? 1.3 : 2.4, repeat: Infinity, ease: smoothControl ? 'easeInOut' : 'linear' }}
            />
          </div>

          <p className="scene-text text-xs text-white/75 mb-4">
            Control: {controlLevel}% {awkwardControl ? '• awkward but trying' : '• smooth and confident'}
          </p>

          <div className="relative h-20 rounded-lg bg-black/20 border border-white/10 overflow-hidden">
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 text-xl"
              animate={{ x: inSync ? [16, 135, 16] : [16, 80, 16], y: [0, -4, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
            >
              🔥
            </motion.div>
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 text-xl"
              animate={{ x: inSync ? [24, 142, 24] : [24, 95, 24], y: [0, 4, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }}
            >
              💧
            </motion.div>

            {inSync && (
              <motion.div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at center, hsl(185, 90%, 65%, 0.2) 0%, hsl(280, 90%, 65%, 0.18) 35%, transparent 70%)',
                }}
                animate={{ opacity: [0.2, 0.75, 0.2] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              />
            )}
          </div>

          <button
            onClick={() => setSyncBursts((v) => v + 1)}
            className="nav-button mt-3 px-4 py-1.5 text-xs"
          >
            Sync jump ✨
          </button>
        </div>
      </div>

      <div className="relative z-10 text-center mt-5 space-y-1 max-w-xl">
        {visibleLines.map((idx) => (
          <motion.p
            key={idx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="scene-text text-base md:text-lg italic text-white/95 [text-shadow:0_2px_10px_rgba(0,0,0,0.65)]"
          >
            "{storyLines[idx].text}"
          </motion.p>
        ))}

        {showFinal && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2 }}
            className="scene-text text-lg md:text-xl text-white font-medium mt-4"
          >
            "I didn’t just see you learn… I saw you become someone new"
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default GamerYouBecame;
