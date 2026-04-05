import { create } from 'zustand';

interface StoryState {
  currentScene: number;
  bookOpen: boolean;
  audioEnabled: boolean;
  setScene: (scene: number) => void;
  nextScene: () => void;
  prevScene: () => void;
  openBook: () => void;
  toggleAudio: () => void;
  totalScenes: number;
}

// We'll use a simple zustand-like pattern with useState instead
// since zustand isn't installed. We'll use React context.

export const TOTAL_SCENES = 10;

export const SCENE_TITLES = [
  "Sweet Beginning",
  "Shy → Comfort",
  "The Terrace",
  "Confession",
  "Memory Map",
  "Scooter Journey",
  "8-Minute Hug",
  "Princess Carry",
  "Transformation",
  "Forever"
];
