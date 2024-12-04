import { create } from "zustand";

interface AudioArrayState {
  audioArrayData: Uint8Array | null;
  setAudioArrayData: (array: Uint8Array) => void;
}

export const useStore = create<AudioArrayState>((set) => ({
  audioArrayData: null,
  setAudioArrayData: (array: Uint8Array) => set({ audioArrayData: array }),
}));
