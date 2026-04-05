import { Canvas } from '@react-three/fiber';
import { Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FloatingBook from './three/FloatingBook';
import Particles from './three/Particles';
import { useStoryState } from '@/hooks/useStoryState';

const EntryScreen = () => {
  const { bookOpen, openBook } = useStoryState();

  return (
    <AnimatePresence>
      {!bookOpen && (
        <motion.div
          className="fixed inset-0 z-50"
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5 }}
        >
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.3} />
              <pointLight position={[5, 5, 5]} intensity={0.5} color="#C8A2C8" />
              <pointLight position={[-5, -5, 5]} intensity={0.3} color="#E8B4D8" />
              <Particles count={150} spread={12} />
              <FloatingBook onClick={openBook} isOpen={bookOpen} />
            </Suspense>
          </Canvas>

          {/* Overlay text */}
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-32 pointer-events-none">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 1.5 }}
              className="scene-text text-2xl md:text-3xl text-center italic mb-4"
            >
              Kasturi… this isn't just a card
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.5, duration: 1.5 }}
              className="scene-text text-lg md:text-xl text-center text-primary/70"
            >
              It's every "Ki na, wo na, mai na…" we never finished
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.5, 1] }}
              transition={{ delay: 4.5, duration: 2, repeat: Infinity }}
              className="scene-text text-sm mt-8 text-primary/50 pointer-events-auto cursor-pointer"
              onClick={openBook}
            >
              Click the book to begin ✨
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EntryScreen;
