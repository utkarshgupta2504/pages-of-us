import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TerraceScene = () => {
  const [timeOfDay, setTimeOfDay] = useState(0); // 0-1 sunset to night
  const [showText, setShowText] = useState(false);
  const [playingMusic, setPlayingMusic] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay(t => {
        if (t >= 1) { clearInterval(interval); return 1; }
        return t + 0.005;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const skyColor = `hsl(${30 - timeOfDay * 200}, ${70 - timeOfDay * 30}%, ${60 - timeOfDay * 45}%)`;
  const sunY = 60 + timeOfDay * 80;

  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Sky */}
      <div
        className="absolute inset-0 transition-colors duration-1000"
        style={{ background: `linear-gradient(to bottom, ${skyColor}, hsl(224, 70%, ${15 + (1 - timeOfDay) * 20}%))` }}
      />

      {/* Sun/Moon */}
      <motion.div
        className="absolute rounded-full"
        style={{
          width: 60,
          height: 60,
          top: `${sunY}%`,
          left: '50%',
          transform: 'translateX(-50%)',
          background: timeOfDay < 0.6
            ? 'radial-gradient(circle, #FFD700 30%, #FF8C00 70%, transparent 100%)'
            : 'radial-gradient(circle, #E8E8F0 30%, #C8C8D8 70%, transparent 100%)',
          boxShadow: timeOfDay < 0.6
            ? '0 0 60px #FFD70088'
            : '0 0 40px #E8E8F044',
        }}
      />

      {/* Stars */}
      {timeOfDay > 0.6 && Array.from({ length: 30 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-foreground"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 50}%`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0.3, 0.8] }}
          transition={{ delay: i * 0.1, duration: 2, repeat: Infinity }}
        />
      ))}

      {/* Cityscape silhouette */}
      <div className="absolute bottom-0 w-full h-32 flex items-end justify-center gap-1">
        {[40, 60, 35, 80, 55, 45, 70, 50, 65, 30, 75, 40].map((h, i) => (
          <div
            key={i}
            className="bg-background/80 rounded-t-sm"
            style={{ width: `${6 + Math.random() * 4}%`, height: `${h}%` }}
          />
        ))}
      </div>

      {/* Smoke/Butterflies */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-2xl cursor-pointer pointer-events-auto"
            style={{ left: `${20 + Math.random() * 60}%`, top: `${30 + Math.random() * 30}%` }}
            animate={{
              x: [0, 20, -10, 15, 0],
              y: [0, -15, -5, -20, 0],
              opacity: [0.3, 0.7, 0.5, 0.8, 0.3],
            }}
            transition={{ duration: 5 + Math.random() * 3, repeat: Infinity, delay: i * 0.7 }}
            onClick={() => setShowText(true)}
          >
            🦋
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
          🌇 The Terrace
        </motion.h2>

        {showText && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="scene-text text-xl italic"
          >
            "This is where silence started saying everything"
          </motion.p>
        )}

        {/* Hidden sky interaction */}
        <motion.div
          className="absolute -top-40 left-1/2 -translate-x-1/2 cursor-pointer"
          onClick={() => setPlayingMusic(!playingMusic)}
          whileHover={{ scale: 1.1 }}
        >
          {playingMusic && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="scene-text text-sm text-primary/60"
            >
              ♪ Ye Vaada Raha... ♪
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default TerraceScene;
