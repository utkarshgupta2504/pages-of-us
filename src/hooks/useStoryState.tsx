import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { TOTAL_SCENES } from './useStoryStore';

interface StoryState {
  currentScene: number;
  bookOpen: boolean;
  audioEnabled: boolean;
  setScene: (scene: number) => void;
  nextScene: () => void;
  prevScene: () => void;
  openBook: () => void;
  toggleAudio: () => void;
}

const StoryContext = createContext<StoryState | null>(null);

export const StoryProvider = ({ children }: { children: ReactNode }) => {
  const [currentScene, setCurrentScene] = useState(0);
  const [bookOpen, setBookOpen] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const setScene = useCallback((s: number) => setCurrentScene(s), []);
  const nextScene = useCallback(() => setCurrentScene(s => Math.min(s + 1, TOTAL_SCENES - 1)), []);
  const prevScene = useCallback(() => setCurrentScene(s => Math.max(s - 1, 0)), []);
  const openBook = useCallback(() => setBookOpen(true), []);
  const toggleAudio = useCallback(() => setAudioEnabled(a => !a), []);

  return (
    <StoryContext.Provider value={{ currentScene, bookOpen, audioEnabled, setScene, nextScene, prevScene, openBook, toggleAudio }}>
      {children}
    </StoryContext.Provider>
  );
};

export const useStoryState = () => {
  const ctx = useContext(StoryContext);
  if (!ctx) throw new Error('useStoryState must be used within StoryProvider');
  return ctx;
};
