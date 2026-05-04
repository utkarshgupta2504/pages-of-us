import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ItTakesTwo = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [keysPressed, setKeysPressed] = useState<{ [key: string]: boolean }>({});
  const [vacuumCollected, setVacuumCollected] = useState(0);
  const [toolsFixed, setToolsFixed] = useState<boolean[]>([]);
  const [clocksMatched, setClocksMatched] = useState<boolean[]>([]);
  const [attractedPairs, setAttractedPairs] = useState(0);
  const [gardenGrowth, setGardenGrowth] = useState(0);
  const [notesSung, setNotesSung] = useState<number[]>([]);

  const containerRef = useRef<HTMLDivElement>(null);

  // WASD key detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (['W', 'A', 'S', 'D'].includes(key)) {
        setKeysPressed(prev => ({ ...prev, [key]: true }));
        e.preventDefault();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      if (['W', 'A', 'S', 'D'].includes(key)) {
        setKeysPressed(prev => ({ ...prev, [key]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const handleVacuumCollect = () => {
    setVacuumCollected(prev => prev + 1);
  };

  const handleToolFix = (idx: number) => {
    const newTools = [...toolsFixed];
    newTools[idx] = true;
    setToolsFixed(newTools);
  };

  const handleClockMatch = (idx: number) => {
    const newClocks = [...clocksMatched];
    newClocks[idx] = !newClocks[idx];
    setClocksMatched(newClocks);
  };

  const handleAttract = () => {
    setAttractedPairs(prev => (prev < 3 ? prev + 1 : 3));
  };

  const handleGardenGrow = () => {
    setGardenGrowth(prev => (prev < 4 ? prev + 1 : 4));
  };

  const handleSing = (noteIdx: number) => {
    setNotesSung(prev => [...prev, noteIdx]);
  };

  return (
    <div
      ref={containerRef}
      className="h-full flex flex-col items-center justify-center relative overflow-hidden px-4"
    >
      {/* Dynamic background based on level */}
      <div
        className="absolute inset-0 transition-all duration-1000"
        style={{
          background:
            currentLevel === 0
              ? 'linear-gradient(135deg, hsl(250, 60%, 10%) 0%, hsl(260, 50%, 12%) 100%)'
              : currentLevel === 1
                ? 'linear-gradient(135deg, hsl(40, 70%, 15%) 0%, hsl(30, 60%, 12%) 100%)'
                : currentLevel === 2
                  ? 'linear-gradient(135deg, hsl(320, 70%, 12%) 0%, hsl(280, 60%, 10%) 100%)'
                  : currentLevel === 3
                    ? 'linear-gradient(135deg, hsl(200, 80%, 15%) 0%, hsl(210, 70%, 12%) 100%)'
                    : currentLevel === 4
                      ? 'linear-gradient(135deg, hsl(140, 70%, 12%) 0%, hsl(160, 60%, 10%) 100%)'
                      : 'linear-gradient(135deg, hsl(300, 75%, 14%) 0%, hsl(280, 60%, 10%) 100%)',
        }}
      />

      {/* Ambient glow */}
      <motion.div
        className="absolute pointer-events-none"
        style={{
          width: 500,
          height: 300,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'blur(60px)',
          background:
            currentLevel === 0
              ? 'radial-gradient(ellipse, hsl(280, 90%, 50%, 0.1) 0%, transparent 75%)'
              : currentLevel === 1
                ? 'radial-gradient(ellipse, hsl(40, 85%, 55%, 0.1) 0%, transparent 75%)'
                : currentLevel === 2
                  ? 'radial-gradient(ellipse, hsl(320, 80%, 55%, 0.1) 0%, transparent 75%)'
                  : currentLevel === 3
                    ? 'radial-gradient(ellipse, hsl(200, 85%, 50%, 0.1) 0%, transparent 75%)'
                    : currentLevel === 4
                      ? 'radial-gradient(ellipse, hsl(140, 80%, 50%, 0.1) 0%, transparent 75%)'
                      : 'radial-gradient(ellipse, hsl(300, 80%, 55%, 0.1) 0%, transparent 75%)',
        }}
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      {/* Title */}
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="scene-text text-2xl md:text-3xl mb-6 relative z-10 text-white text-center"
      >
        🎮 The Levels We Conquered
      </motion.h2>

      <AnimatePresence mode="wait">
        {/* LEVEL 0: VACUUM CLEANER */}
        {currentLevel === 0 && (
          <motion.div
            key="level-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center space-y-8 max-w-lg"
          >
            <div className="space-y-3">
              <p className="scene-text text-lg text-white/90">
                The Vacuum Cleaner
              </p>
              <p className="scene-text text-sm text-white/60">
                "Sucking things up together… literally"
              </p>
            </div>

            {/* WASD Display */}
            <div className="space-y-3">
              <p className="scene-text text-xs text-white/50">Use WASD to move</p>
              <div className="grid grid-cols-3 gap-2 w-24 mx-auto">
                <div className="col-start-2">
                  <motion.div
                    animate={
                      keysPressed['W']
                        ? { scale: 1.15, boxShadow: '0 0 20px hsl(220, 100%, 60%)' }
                        : { scale: 1 }
                    }
                    className={`w-full h-10 flex items-center justify-center rounded border font-bold transition-all ${
                      keysPressed['W']
                        ? 'bg-blue-500/50 border-blue-300'
                        : 'glass-panel border-white/20'
                    }`}
                  >
                    W
                  </motion.div>
                </div>
                <motion.div
                  animate={
                    keysPressed['A']
                      ? { scale: 1.15, boxShadow: '0 0 20px hsl(220, 100%, 60%)' }
                      : { scale: 1 }
                  }
                  className={`h-10 flex items-center justify-center rounded border font-bold transition-all ${
                    keysPressed['A']
                      ? 'bg-blue-500/50 border-blue-300'
                      : 'glass-panel border-white/20'
                  }`}
                >
                  A
                </motion.div>
                <motion.div
                  animate={
                    keysPressed['S']
                      ? { scale: 1.15, boxShadow: '0 0 20px hsl(220, 100%, 60%)' }
                      : { scale: 1 }
                  }
                  className={`h-10 flex items-center justify-center rounded border font-bold transition-all ${
                    keysPressed['S']
                      ? 'bg-blue-500/50 border-blue-300'
                      : 'glass-panel border-white/20'
                  }`}
                >
                  S
                </motion.div>
                <div className="col-start-3">
                  <motion.div
                    animate={
                      keysPressed['D']
                        ? { scale: 1.15, boxShadow: '0 0 20px hsl(220, 100%, 60%)' }
                        : { scale: 1 }
                    }
                    className={`h-10 flex items-center justify-center rounded border font-bold transition-all ${
                      keysPressed['D']
                        ? 'bg-blue-500/50 border-blue-300'
                        : 'glass-panel border-white/20'
                    }`}
                  >
                    D
                  </motion.div>
                </div>
              </div>
            </div>

            {/* Vacuum interaction */}
            <div className="relative h-40 flex items-center justify-center">
              <motion.div
                animate={{
                  x: keysPressed['A'] ? -20 : keysPressed['D'] ? 20 : 0,
                  y: keysPressed['W'] ? -20 : keysPressed['S'] ? 20 : 0,
                }}
                transition={{ type: 'spring', damping: 10 }}
                className="text-7xl"
              >
                🌀
              </motion.div>
            </div>

            {/* Debris to collect */}
            <div className="flex gap-3 justify-center flex-wrap">
              {Array(4).fill(0).map((_, idx) => (
                <motion.button
                  key={idx}
                  onClick={handleVacuumCollect}
                  animate={{
                    y: [0, -5, 0],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: idx * 0.2 }}
                  className="text-3xl hover:scale-110 transition-transform"
                >
                  ✨
                </motion.button>
              ))}
            </div>

            <p className="scene-text text-xs text-white/60">
              Collected: {vacuumCollected} ✨
            </p>

            <motion.button
              onClick={() => {
                setCurrentLevel(1);
                setToolsFixed([]);
              }}
              className="px-4 py-2 glass-panel border border-white/20 rounded-lg text-white scene-text text-sm hover:border-white/40 transition-all"
              whileHover={{ scale: 1.05 }}
            >
              Next Level →
            </motion.button>
          </motion.div>
        )}

        {/* LEVEL 1: TOOLBOX */}
        {currentLevel === 1 && (
          <motion.div
            key="level-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center space-y-8 max-w-lg"
          >
            <div className="space-y-3">
              <p className="scene-text text-lg text-white/90">
                The Toolbox
              </p>
              <p className="scene-text text-sm text-white/60">
                "Building things together… fixing things together"
              </p>
            </div>

            {/* Tools to fix */}
            <div className="space-y-3">
              {['🔧', '🪛', '⚒️', '🪚'].map((tool, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleToolFix(idx)}
                  disabled={toolsFixed[idx]}
                  className={`w-full px-4 py-3 rounded-lg transition-all ${
                    toolsFixed[idx]
                      ? 'glass-panel border border-emerald-300/50 bg-emerald-500/10'
                      : 'glass-panel border border-white/20 hover:border-white/40'
                  }`}
                  whileHover={!toolsFixed[idx] ? { scale: 1.02 } : {}}
                >
                  <motion.span
                    animate={toolsFixed[idx] ? { rotate: 360 } : {}}
                    transition={toolsFixed[idx] ? { duration: 0.5 } : {}}
                    className="text-2xl"
                  >
                    {tool}
                  </motion.span>
                  <p className="scene-text text-xs text-white/60 mt-1">
                    {toolsFixed[idx] ? '✓ Fixed' : 'Click to fix'}
                  </p>
                </motion.button>
              ))}
            </div>

            <p className="scene-text text-xs text-white/60">
              {toolsFixed.filter(Boolean).length} / 4 fixed
            </p>

            <motion.button
              onClick={() => {
                setCurrentLevel(2);
                setClocksMatched([]);
              }}
              disabled={toolsFixed.filter(Boolean).length < 4}
              className={`px-4 py-2 border rounded-lg text-white scene-text text-sm transition-all ${
                toolsFixed.filter(Boolean).length >= 4
                  ? 'glass-panel border-white/20 hover:border-white/40'
                  : 'border-white/10 opacity-50 cursor-default'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              Next Level →
            </motion.button>
          </motion.div>
        )}

        {/* LEVEL 2: CUCKOO CLOCK (TIME + CLONING) */}
        {currentLevel === 2 && (
          <motion.div
            key="level-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center space-y-8 max-w-lg"
          >
            <div className="space-y-3">
              <p className="scene-text text-lg text-white/90">
                The Cuckoo Clock
              </p>
              <p className="scene-text text-sm text-white/60">
                "Timing… cloning… moving through time together"
              </p>
            </div>

            {/* Clock times to match */}
            <div className="grid grid-cols-2 gap-3">
              {['🕐', '🕑', '🕒', '🕓'].map((clock, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleClockMatch(idx)}
                  className={`px-4 py-4 rounded-lg transition-all ${
                    clocksMatched[idx]
                      ? 'glass-panel border border-purple-300/50 bg-purple-500/10'
                      : 'glass-panel border border-white/20 hover:border-white/40'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  animate={
                    clocksMatched[idx]
                      ? { scale: [1, 1.1, 1] }
                      : {}
                  }
                  transition={clocksMatched[idx] ? { duration: 0.6 } : {}}
                >
                  <span className="text-4xl">{clock}</span>
                </motion.button>
              ))}
            </div>

            <p className="scene-text text-xs text-white/60">
              Matched: {clocksMatched.filter(Boolean).length} / 4
            </p>

            <motion.button
              onClick={() => {
                setCurrentLevel(3);
                setAttractedPairs(0);
              }}
              disabled={clocksMatched.filter(Boolean).length < 4}
              className={`px-4 py-2 border rounded-lg text-white scene-text text-sm transition-all ${
                clocksMatched.filter(Boolean).length >= 4
                  ? 'glass-panel border-white/20 hover:border-white/40'
                  : 'border-white/10 opacity-50 cursor-default'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              Next Level →
            </motion.button>
          </motion.div>
        )}

        {/* LEVEL 3: SNOW GLOBE (MAGNETS + ATTRACTION) */}
        {currentLevel === 3 && (
          <motion.div
            key="level-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center space-y-8 max-w-lg"
          >
            <div className="space-y-3">
              <p className="scene-text text-lg text-white/90">
                The Snow Globe
              </p>
              <p className="scene-text text-sm text-white/60">
                "Magnets attract… we attract… pulled together"
              </p>
            </div>

            {/* Magnetic attraction visualization */}
            <div className="relative h-48 flex items-center justify-center">
              <div className="flex gap-12 items-center">
                {/* Left magnet */}
                <motion.div
                  animate={{
                    x: attractedPairs > 0 ? 15 : 0,
                  }}
                  transition={{ type: 'spring', damping: 8 }}
                  className="text-5xl"
                >
                  🧲
                </motion.div>

                {/* Attracted particles */}
                {attractedPairs > 0 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-3xl"
                  >
                    ✨
                  </motion.div>
                )}

                {/* Right magnet */}
                <motion.div
                  animate={{
                    x: attractedPairs > 0 ? -15 : 0,
                  }}
                  transition={{ type: 'spring', damping: 8 }}
                  className="text-5xl"
                >
                  🧲
                </motion.div>
              </div>
            </div>

            <motion.button
              onClick={handleAttract}
              disabled={attractedPairs >= 3}
              className={`px-6 py-3 rounded-lg text-white scene-text font-semibold transition-all ${
                attractedPairs < 3
                  ? 'glass-panel border border-blue-300/50 hover:border-blue-300'
                  : 'glass-panel border border-emerald-300/50 bg-emerald-500/10'
              }`}
              whileHover={attractedPairs < 3 ? { scale: 1.05 } : {}}
            >
              {attractedPairs < 3 ? 'Attract' : '✓ Attracted'}
            </motion.button>

            <p className="scene-text text-xs text-white/60">
              Attraction level: {attractedPairs} / 3
            </p>

            <motion.button
              onClick={() => {
                setCurrentLevel(4);
                setGardenGrowth(0);
              }}
              disabled={attractedPairs < 3}
              className={`px-4 py-2 border rounded-lg text-white scene-text text-sm transition-all ${
                attractedPairs >= 3
                  ? 'glass-panel border-white/20 hover:border-white/40'
                  : 'border-white/10 opacity-50 cursor-default'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              Next Level →
            </motion.button>
          </motion.div>
        )}

        {/* LEVEL 4: GARDEN (HER FAVORITE) */}
        {currentLevel === 4 && (
          <motion.div
            key="level-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center space-y-8 max-w-lg"
          >
            <div className="space-y-3">
              <p className="scene-text text-lg text-emerald-300 font-semibold">
                The Garden
              </p>
              <p className="scene-text text-sm text-emerald-200">
                "This is where you stopped trying… and just started enjoying"
              </p>
            </div>

            {/* Growing garden */}
            <div className="relative h-40 flex items-center justify-center gap-4">
              {[0, 1, 2, 3].map((idx) => (
                <motion.button
                  key={idx}
                  onClick={handleGardenGrow}
                  animate={{
                    scale: gardenGrowth > idx ? 1.2 : 1,
                    y: gardenGrowth > idx ? -5 : 0,
                  }}
                  className="text-4xl hover:scale-110 transition-transform"
                >
                  {gardenGrowth > idx ? '🌻' : '🌱'}
                </motion.button>
              ))}
            </div>

            {/* Blooming indicator */}
            {gardenGrowth >= 4 && (
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                transition={{ duration: 0.6 }}
                className="text-6xl"
              >
                🌸
              </motion.div>
            )}

            <p className="scene-text text-xs text-emerald-200">
              {gardenGrowth >= 4 ? '✓ Garden bloomed' : `Growing: ${gardenGrowth} / 4`}
            </p>

            <motion.button
              onClick={() => {
                setCurrentLevel(5);
                setNotesSung([]);
              }}
              disabled={gardenGrowth < 4}
              className={`px-4 py-2 border rounded-lg text-white scene-text text-sm transition-all ${
                gardenGrowth >= 4
                  ? 'glass-panel border-white/20 hover:border-white/40'
                  : 'border-white/10 opacity-50 cursor-default'
              }`}
              whileHover={{ scale: 1.05 }}
            >
              Next Level →
            </motion.button>
          </motion.div>
        )}

        {/* LEVEL 5: SINGING (HER PASSION - MAY'S) */}
        {currentLevel === 5 && (
          <motion.div
            key="level-5"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center space-y-8 max-w-lg"
          >
            <div className="space-y-3">
              <p className="scene-text text-lg text-pink-300 font-semibold">
                The Singing
              </p>
              <p className="scene-text text-sm text-pink-200">
                "Where you found your voice… where you shined"
              </p>
            </div>

            {/* Musical notes to sing */}
            <div className="relative h-40 flex items-center justify-center">
              {[0, 1, 2].map((idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleSing(idx)}
                  animate={{
                    y: notesSung.includes(idx) ? [-20, 0, -20] : [0, -10, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: notesSung.includes(idx) ? 0 : Infinity,
                    delay: idx * 0.2,
                  }}
                  className={`text-4xl transition-all ${
                    notesSung.includes(idx) ? 'text-pink-300' : 'text-white/70 hover:text-white'
                  }`}
                >
                  🎵
                </motion.button>
              ))}
            </div>

            {/* Sound waves when singing */}
            <div className="relative h-16 flex items-center justify-center">
              {notesSung.length > 0 && (
                <motion.div className="flex gap-1">
                  {[0, 1, 2].map((idx) => (
                    <motion.div
                      key={idx}
                      animate={{ height: [10, 30, 10] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: idx * 0.1,
                      }}
                      className="w-1 bg-gradient-to-t from-pink-500 to-pink-300 rounded"
                    />
                  ))}
                </motion.div>
              )}
            </div>

            <p className="scene-text text-xs text-pink-200">
              Notes sung: {notesSung.length} / 3
            </p>

            {notesSung.length >= 3 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <motion.p
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="scene-text text-lg text-pink-300 font-semibold"
                >
                  ✓ You found your voice
                </motion.p>

                <motion.button
                  onClick={() => setCurrentLevel(6)}
                  className="px-4 py-2 glass-panel border border-pink-300/50 rounded-lg text-pink-300 scene-text text-sm hover:border-pink-300 transition-all"
                  whileHover={{ scale: 1.05 }}
                >
                  The End →
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* FINAL: COMPLETION & PAYOFF */}
        {currentLevel === 6 && (
          <motion.div
            key="level-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="relative z-10 text-center space-y-8 max-w-2xl"
          >
            {/* Two entities converging */}
            <div className="relative h-48 flex items-center justify-center">
              {/* Left entity */}
              <motion.div
                animate={{ x: [-80, 0], opacity: [0.4, 1] }}
                transition={{ duration: 2.5, ease: 'easeOut' }}
                className="text-7xl absolute left-0"
              >
                💙
              </motion.div>

              {/* Right entity */}
              <motion.div
                animate={{ x: [80, 0], opacity: [0.4, 1] }}
                transition={{ duration: 2.5, ease: 'easeOut' }}
                className="text-7xl absolute right-0"
              >
                ✨
              </motion.div>

              {/* Heart merge */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 2, duration: 0.8 }}
                className="text-8xl relative z-10"
              >
                💕
              </motion.div>
            </div>

            {/* Narrative payoff */}
            <div className="space-y-6 pt-4">
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 1 }}
                className="scene-text text-lg text-white/80 italic"
              >
                "Not because the levels were easy…"
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="scene-text text-lg text-white/80 italic"
              >
                "But because we did it together"
              </motion.p>

              <motion.div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-4" />

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 3.2, duration: 1 }}
                className="scene-text text-xl text-white font-semibold"
              >
                "I didn't just see you play a game…"
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 4.2, duration: 1 }}
                className="scene-text text-xl text-white font-semibold"
              >
                "I saw you become something new"
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 5.2, duration: 1 }}
                className="scene-text text-lg text-emerald-300 mt-6"
              >
                "Every level…"
              </motion.p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 6.2, duration: 1 }}
                className="scene-text text-2xl text-emerald-300 font-bold"
              >
                "It really did take two"
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ItTakesTwo;
