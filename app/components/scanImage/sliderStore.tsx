import { create } from "zustand";

interface SliderStore {
  currentIndex: number;
  direction: string;
  sliderItems: {
    imagePath: string;
  }[];
  nextSlide: () => void;
  prevSlide: () => void;
}

export const useSliderStore = create<SliderStore>((set) => ({
  currentIndex: 0,
  direction: "start",
  sliderItems: [
    {
      imagePath: "/images/scanimage/1.webp",
    },
    {
      imagePath: "/images/scanimage/2.webp",
    },
    {
      imagePath: "/images/scanimage/3.webp",
    },
  ],
  nextSlide: () => {
    set((state) => ({
      currentIndex: (state.currentIndex + 1) % state.sliderItems.length,
      direction: "next",
    }));
    console.log(useSliderStore.getState().currentIndex);
  },
  prevSlide: () => {
    set((state) => ({
      currentIndex: (state.currentIndex - 1 + state.sliderItems.length) % state.sliderItems.length,
      direction: "prev",
    }));
    console.log(useSliderStore.getState().currentIndex);
  },
}));