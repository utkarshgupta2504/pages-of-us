import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TerraceScene = () => {
  const [timeOfDay, setTimeOfDay] = useState(0);
  const [showText, setShowText] = useState(false);
  const [playingMusic, setPlayingMusic] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay(t => {
        if (t >= 1) { clearInterval(interval); return 1; }
        return t + 0.004;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Warm orange → purple gradient
  const skyTop = `hsl(${30 - timeOfDay * 230}, ${80 - timeOfDay * 20}%, ${65 - timeOfDay * 50}%)`;
  const skyBottom = `hsl(${280 - timeOfDay * 60}, ${50 + timeOfDay * 20}%, ${30 - timeOfDay * 18}%)`;
  const sunY = 55 + timeOfDay * 60;

  // Stable star positions
  const stars = useMemo(() =>
    Array.from({ length: 40 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 45}%`,
      delay: Math.random() * 3,
    })), []
  );

  // Stable smoke particles
  const smokeParticles = useMemo(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      startX: 48 + Math.random() * 8,
      startY: 62 + Math.random() * 5,
      driftX: (Math.random() - 0.5) * 40,
      duration: 6 + Math.random() * 4,
      delay: i * 1.2,
      isButterfly: i === 2 || i === 5,
    })), []
  );

  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Sky gradient */}
      <div
        className="absolute inset-0"
        style={{ background: `linear-gradient(to bottom, ${skyTop}, ${skyBottom})` }}
      />

      {/* Sun/Moon */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 50, height: 50,
          top: `${sunY}%`, left: '50%',
          transform: 'translateX(-50%)',
          background: timeOfDay < 0.5
            ? 'radial-gradient(circle, #FFD700 20%, #FF6B35 60%, transparent 100%)'
            : timeOfDay < 0.7
              ? 'radial-gradient(circle, #FF8C42 20%, #C44536 60%, transparent 100%)'
              : 'radial-gradient(circle, #E8E8F0 25%, #B8B8D0 60%, transparent 100%)',
          boxShadow: timeOfDay < 0.5
            ? '0 0 80px #FFD70066, 0 0 120px #FF6B3533'
            : timeOfDay < 0.7
              ? '0 0 60px #FF8C4244'
              : '0 0 40px #E8E8F033',
        }}
      />

      {/* Stars */}
      {timeOfDay > 0.65 && stars.map((star, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-foreground"
          style={{ left: star.left, top: star.top }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.7, 0.3, 0.8] }}
          transition={{ delay: star.delay, duration: 2.5, repeat: Infinity }}
        />
      ))}

      {/* City skyline */}
      <div className="absolute bottom-0 w-full h-36 flex items-end justify-center">
        {[
          { w: 5, h: 45 }, { w: 3, h: 60 }, { w: 7, h: 35 }, { w: 4, h: 80 },
          { w: 6, h: 50 }, { w: 3, h: 70 }, { w: 5, h: 40 }, { w: 4, h: 65 },
          { w: 6, h: 55 }, { w: 3, h: 75 }, { w: 5, h: 45 }, { w: 4, h: 60 },
          { w: 7, h: 30 }, { w: 3, h: 50 },
        ].map((b, i) => (
          <div
            key={i}
            className="bg-background/90 rounded-t-sm mx-0.5 relative"
            style={{ width: `${b.w}%`, height: `${b.h}%` }}
          >
            {/* Building windows */}
            {timeOfDay > 0.5 && Array.from({ length: Math.floor(b.h / 20) }).map((_, j) => (
              <motion.div
                key={j}
                className="absolute w-1 h-1 rounded-sm"
                style={{
                  left: `${30 + Math.random() * 40}%`,
                  top: `${15 + j * 25}%`,
                  background: 'hsl(45, 90%, 70%)',
                }}
                animate={{ opacity: [0.3, 0.8, 0.3] }}
                transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 2 }}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Terrace railing */}
      <div className="absolute bottom-28 w-full flex justify-center">
        <div className="w-[70%] h-px bg-foreground/10" />
      </div>

      {/* Cigarette hand silhouette */}
      <div className="absolute bottom-32 right-[22%]">
        <motion.div className="relative">
          {/* Hand silhouette */}
          <div className="text-2xl opacity-60">🤚</div>
          {/* Cigarette */}
          <div
            className="absolute -top-1 left-1 w-6 h-0.5 rounded-full"
            style={{ background: 'linear-gradient(to right, #fff 70%, #FF6B35 100%)' }}
          />
          {/* Ember glow */}
          <motion.div
            className="absolute -top-1 left-7 w-1.5 h-1.5 rounded-full"
            style={{ background: '#FF4500' }}
            animate={{ opacity: [0.5, 1, 0.5], scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      </div>

      {/* Smoke particles - some drift into butterfly shapes */}
      <div className="absolute inset-0 pointer-events-none">
        {smokeParticles.map((sp) => (
          <motion.div
            key={sp.id}
            className="absolute cursor-pointer pointer-events-auto"
            style={{ left: `${sp.startX}%`, top: `${sp.startY}%` }}
            animate={{
              x: [0, sp.driftX * 0.5, sp.driftX],
              y: [0, -80, -180],
              opacity: [0, 0.5, 0],
              rotate: sp.isButterfly ? [0, 10, -10, 0] : [0, 5, -5, 0],
            }}
            transition={{ duration: sp.duration, repeat: Infinity, delay: sp.delay }}
            onClick={() => setShowText(true)}
          >
            <span className="text-2xl">
              {sp.isButterfly ? '🦋' : (
                <span className="block w-4 h-4 rounded-full bg-foreground/15 blur-sm" />
              )}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="scene-text text-3xl md:text-4xl mb-4"
        >
          🌇 The Terrace (Sutta breaks)
        </motion.h2>

        <AnimatePresence>
          {showText && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="scene-text text-xl italic"
            >
              "This is where silence started saying everything"
            </motion.p>
          )}
        </AnimatePresence>

        {/* Sky click area for music */}
        <motion.div
          className="absolute -top-48 left-1/2 -translate-x-1/2 w-40 h-32 cursor-pointer rounded-full"
          onClick={() => setPlayingMusic(!playingMusic)}
          whileHover={{ scale: 1.05 }}
        />
        <AnimatePresence>
          {playingMusic && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: [0.4, 0.8, 0.4], y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity }}
              className="scene-text text-sm text-primary/50 mt-4"
            >
              ♪ Ye Vaada Raha... ♪
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TerraceScene;
