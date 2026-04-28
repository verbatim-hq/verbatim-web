import { create } from "zustand";

type AudioState = Readonly<{
  activeQuoteId: string | null;
  setActiveQuote: (id: string | null) => void;
}>;

export const useAudioStore = create<AudioState>((set) => ({
  activeQuoteId: null,
  setActiveQuote: (id) => set({ activeQuoteId: id }),
}));

