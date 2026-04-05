import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const FiftyKmRide = () => {
  const [distance, setDistance] = useState(0);
  const [nearLake, setNearLake] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDistance(d => {
        if (d >= 50) { clearInterval(interval); return 50; }
        const increment = nearLake ? 0.1 : 0.3;
        const next = d + increment;
        if (next >= 25 && next <= 30 && !nearLake) setNearLake(true);
        if (next > 30) setNearLake(false);
        return next;
      });
    }, 80);
    return () => clearInterval(interval);
  }, [nearLake]);

  const progress = distance / 50;

  return (
    <div className="h-full flex flex-col items-center justify-center relative overflow-hidden">
      {/* Sky */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, hsl(200, 50%, ${55 + progress * 10}%) 0%, hsl(35, 60%, ${70 - progress * 15}%) 100%)`,
        }}
      />

      {/* Contrast veil for legible foreground text */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, hsl(224, 40%, 6%, 0.28) 0%, hsl(224, 40%, 6%, 0.52) 100%)',
        }}
      />

      {/* Passing trees */}
      <div className="absolute bottom-16 w-full overflow-hidden h-40">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl"
            style={{ bottom: '0', left: `${(i * 10) % 100}%` }}
            animate={{ x: [0, -200] }}
            transition={{ duration: 3 + Math.random(), repeat: Infinity, ease: 'linear', delay: i * 0.3 }}
          >
            🌳
          </motion.div>
        ))}
      </div>

      {/* Lake reflection - appears when near lake */}
      {nearLake && (
        <motion.div
          className="absolute bottom-20 w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex justify-center">
            <motion.div
              className="w-80 h-16 rounded-full"
              style={{
                background: 'linear-gradient(to bottom, hsl(200, 60%, 50%, 0.3), hsl(200, 60%, 40%, 0.1))',
                filter: 'blur(2px)',
              }}
              animate={{ scaleX: [1, 1.02, 1], opacity: [0.4, 0.6, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </div>
          <p className="scene-text text-xs text-center text-white/85 mt-2 [text-shadow:0_2px_8px_rgba(0,0,0,0.7)]">~ the lake ~</p>
        </motion.div>
      )}

      {/* Road */}
      <div className="absolute bottom-0 w-full h-16 bg-muted/60">
        <motion.div
          className="absolute top-1/2 left-0 w-full h-0.5 bg-foreground/20"
          style={{ transform: 'translateY(-50%)' }}
        />
        {/* Road dashes */}
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-1/2 h-0.5 w-8 bg-foreground/30 rounded"
            style={{ transform: 'translateY(-50%)', left: `${i * 12}%` }}
            animate={{ x: [0, -100] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear', delay: i * 0.12 }}
          />
        ))}
      </div>

      {/* Bike */}
      <motion.div
        className="absolute bottom-12 text-4xl"
        style={{ left: '45%' }}
        animate={nearLake ? {} : { y: [0, -2, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
      >
        🏍️
      </motion.div>

      {/* Content */}
      <div className="relative z-10 text-center">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="scene-text text-3xl md:text-4xl mb-4 text-white font-semibold [text-shadow:0_2px_14px_rgba(0,0,0,0.75)]"
        >
          🛣️ The 50km Ride
        </motion.h2>

        {/* Distance counter */}
        <motion.div className="glass-panel px-6 py-3 rounded-xl mb-6 inline-block">
          <p className="scene-text text-2xl text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.6)]">{distance.toFixed(1)} km</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: distance >= 45 ? 1 : 0 }}
          className="mt-4 glass-panel px-5 py-4 rounded-xl"
        >
          <p className="scene-text text-xl italic text-white [text-shadow:0_2px_10px_rgba(0,0,0,0.65)]">"50 kilometers…"</p>
          <p className="scene-text text-lg italic text-white/90 mt-1 [text-shadow:0_2px_10px_rgba(0,0,0,0.65)]">
            "and I still didn't want the road to end"
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default FiftyKmRide;
