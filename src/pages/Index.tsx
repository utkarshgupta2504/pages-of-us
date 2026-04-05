import { StoryProvider, useStoryState } from '@/hooks/useStoryState';
import EntryScreen from '@/components/EntryScreen';
import SceneContainer from '@/components/SceneContainer';
import SceneNavigation from '@/components/SceneNavigation';

const StoryContent = () => {
  const { bookOpen } = useStoryState();

  return (
    <div className="w-full h-screen overflow-hidden relative">
      <EntryScreen />
      {bookOpen && (
        <>
          <SceneContainer />
          <SceneNavigation />
        </>
      )}
    </div>
  );
};

const Index = () => (
  <StoryProvider>
    <StoryContent />
  </StoryProvider>
);

export default Index;
