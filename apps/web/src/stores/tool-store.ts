import { create } from "zustand";

export type Tool =
  | "select"
  | "erase"
  | "addNote"
  | "starpower"
  | "metronome"
  | "timeSignature"
  | "section"
  | "event";

type ToolStore = {
  selectedTool: Tool | null;
  setSelectedTool: (tool: Tool) => void;
};

export const useToolStore = create<ToolStore>((set) => ({
  selectedTool: null,
  setSelectedTool: (tool) => set({ selectedTool: tool }),
}));
