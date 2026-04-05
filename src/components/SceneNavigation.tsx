import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Volume2, VolumeX, RotateCcw } from 'lucide-react';
import { useStoryState } from '@/hooks/useStoryState';
import { TOTAL_SCENES, SCENE_TITLES } from '@/hooks/useStoryStore';

const SceneNavigation = () => {
  const { currentScene, nextScene, prevScene, audioEnabled, toggleAudio, setScene, openBook } = useStoryState();
  const isLastScene = currentScene === TOTAL_SCENES - 1;
  const isFirstScene = currentScene === 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4"
      >
        {/* Scene indicator */}
        <div className="glass-panel px-4 py-2 flex items-center gap-3">
          <button onClick={prevScene} disabled={isFirstScene} className="nav-button disabled:opacity-30 p-2">
            <ChevronLeft size={18} />
          </button>

          <div className="flex gap-1.5 items-center">
            {Array.from({ length: TOTAL_SCENES }).map((_, i) => (
              <button
                key={i}
                onClick={() => setScene(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  i === currentScene
                    ? 'bg-primary w-6 glow-soft'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
              />
            ))}
          </div>

          <button onClick={nextScene} disabled={isLastScene} className="nav-button disabled:opacity-30 p-2">
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Audio toggle */}
        <button onClick={toggleAudio} className="nav-button p-2.5">
          {audioEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
        </button>

        {/* Scene title */}
        <motion.div
          key={currentScene}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel px-4 py-2 text-sm font-body text-primary"
        >
          {SCENE_TITLES[currentScene]}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SceneNavigation;
