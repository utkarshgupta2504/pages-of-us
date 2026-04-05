import { motion } from 'framer-motion';
import { useStoryState } from '@/hooks/useStoryState';

const FinalPage = () => {
  const { setScene } = useStoryState();

  return (
    <div className="h-full flex flex-col items-center justify-center">
      {/* Soft lavender glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, hsl(300, 25%, 73%, 0.08) 0%, transparent 60%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 2 }}
        className="text-center relative z-10"
      >
        <motion.p
          className="scene-text text-4xl md:text-5xl mb-6"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Kasturi…
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 2 }}
          className="scene-text text-3xl md:text-4xl text-glow mb-16"
        >
          You is home 💙
        </motion.p>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4 }}
          onClick={() => setScene(0)}
          className="nav-button px-10 py-4 text-lg glow-soft"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Replay us ↺
        </motion.button>
      </motion.div>

      {/* Floating hearts */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-lg pointer-events-none"
          style={{
            left: `${10 + Math.random() * 80}%`,
            bottom: '-5%',
          }}
          animate={{
            y: [0, -window.innerHeight * 1.2],
            x: [0, (Math.random() - 0.5) * 100],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: 5 + Math.random() * 5,
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'easeOut',
          }}
        >
          💙
        </motion.div>
      ))}
    </div>
  );
};

export default FinalPage;
