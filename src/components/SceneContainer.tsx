import { lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStoryState } from '@/hooks/useStoryState';

const SweetBeginning = lazy(() => import('@/scenes/SweetBeginning'));
const ShyComfort = lazy(() => import('@/scenes/ShyComfort'));
const TerraceScene = lazy(() => import('@/scenes/TerraceScene'));
const Confession = lazy(() => import('@/scenes/Confession'));
const MemoryMap = lazy(() => import('@/scenes/MemoryMap'));
const KizaKaya = lazy(() => import('@/scenes/KizaKaya'));
const ScooterJourney = lazy(() => import('@/scenes/ScooterJourney'));
const FiftyKmRide = lazy(() => import('@/scenes/FiftyKmRide'));
const SunsetPoint = lazy(() => import('@/scenes/SunsetPoint'));
const EightMinuteHug = lazy(() => import('@/scenes/EightMinuteHug'));
const PrincessCarry = lazy(() => import('@/scenes/PrincessCarry'));
const YouCameAnyway = lazy(() => import('@/scenes/YouCameAnyway'));
const Transformation = lazy(() => import('@/scenes/Transformation'));
const FinalPage = lazy(() => import('@/scenes/FinalPage'));

const scenes = [
  SweetBeginning, ShyComfort, TerraceScene, Confession, MemoryMap,
  KizaKaya, ScooterJourney, FiftyKmRide, SunsetPoint,
  EightMinuteHug, PrincessCarry, YouCameAnyway, Transformation, FinalPage,
];

const SceneLoader = () => (
  <div className="h-full flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
      className="text-4xl"
    >
      ✨
    </motion.div>
  </div>
);

const SceneContainer = () => {
  const { currentScene } = useStoryState();
  const CurrentSceneComponent = scenes[currentScene];

  return (
    <div className="w-full h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, hsl(224, 70%, 10%) 0%, hsl(224, 60%, 15%) 40%, hsl(300, 20%, 20%) 100%)',
        }}
      />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="relative z-10 h-full"
        >
          <Suspense fallback={<SceneLoader />}>
            <CurrentSceneComponent />
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SceneContainer;
