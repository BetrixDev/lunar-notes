import { create } from "zustand";

type Tool =
  | "select"
  | "erase"
  | "addNote"
  | "starpower"
  | "metronome"
  | "timeSignature"
  | "section"
  | "event";

type EditorStore = {
  selectedTool: Tool | null;
  setSelectedTool: (tool: Tool) => void;
  currentTime: number;
  setCurrentTime: (time: number) => void;
  incrementCurrentTime: (dt: number) => void;
  decrementCurrentTime: (dt: number) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  hyperspeed: number;
  setHyperspeed: (hyperspeed: number) => void;
};

export const useEditorStore = create<EditorStore>((set) => ({
  selectedTool: null,
  setSelectedTool: (tool) => set({ selectedTool: tool }),
  currentTime: 0,
  setCurrentTime: (time) => set({ currentTime: Math.max(0, time) }),
  incrementCurrentTime: (dt) =>
    set((state) => ({ currentTime: state.currentTime + dt })),
  decrementCurrentTime: (dt) =>
    set((state) => ({ currentTime: Math.max(0, state.currentTime - dt) })),
  speed: 1.0,
  setSpeed: (speed) => set({ speed }),
  hyperspeed: 1.0,
  setHyperspeed: (hyperspeed) => set({ hyperspeed }),
}));
