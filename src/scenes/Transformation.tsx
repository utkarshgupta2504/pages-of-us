import { useState } from 'react';
import { motion } from 'framer-motion';

const Transformation = () => {
  const [sliderValue, setSliderValue] = useState(0);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      <motion.h2
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="scene-text text-3xl md:text-4xl mb-12"
      >
        🚀 Transformation
      </motion.h2>

      {/* Split view */}
      <div className="flex gap-8 md:gap-16 items-center mb-12">
        <motion.div
          className="flex flex-col items-center"
          style={{ opacity: 1 - sliderValue / 100 }}
        >
          <div className="w-24 h-24 md:w-32 md:h-32 rounded-full glass-panel flex items-center justify-center text-5xl md:text-6xl">
            😶
          </div>
          <p className="scene-text text-sm mt-3 text-primary/60">before</p>
        </motion.div>

        <motion.div className="scene-text text-3xl">→</motion.div>

        <motion.div
          className="flex flex-col items-center"
          style={{ opacity: 0.3 + (sliderValue / 100) * 0.7 }}
        >
          <motion.div
            className="w-24 h-24 md:w-32 md:h-32 rounded-full glass-panel flex items-center justify-center text-5xl md:text-6xl glow-soft"
            animate={sliderValue > 80 ? { scale: [1, 1.05, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            😎✨
          </motion.div>
          <p className="scene-text text-sm mt-3 text-primary/60">after</p>
        </motion.div>
      </div>

      {/* Slider */}
      <div className="w-64 md:w-80 mb-8">
        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={(e) => setSliderValue(Number(e.target.value))}
          className="w-full accent-primary h-2 rounded-full appearance-none bg-muted cursor-pointer"
          style={{
            background: `linear-gradient(to right, hsl(300, 25%, 73%) ${sliderValue}%, hsl(224, 40%, 20%) ${sliderValue}%)`,
          }}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: sliderValue > 50 ? 1 : 0 }}
        className="text-center"
      >
        <p className="scene-text text-xl italic">"You didn't change…"</p>
        <p className="scene-text text-lg text-primary/70 mt-1">"You just stopped hiding"</p>
      </motion.div>
    </div>
  );
};

export default Transformation;
