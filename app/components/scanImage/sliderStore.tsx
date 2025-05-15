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
      imagePath: "/images/scanimage/1.png",
    },
    {
      imagePath: "/images/scanimage/2.png",
    },
    {
      imagePath: "/images/scanimage/3.png",
    },
    {
      imagePath: "/images/scanimage/4.png",
    },
    {
      imagePath: "/images/scanimage/5.png",
    },
    {
      imagePath: "/images/scanimage/6.png",
    },
    {
      imagePath: "/images/scanimage/7.png",
    },
    {
      imagePath: "/images/scanimage/8.png",
    },
    {
      imagePath: "/images/scanimage/9.png",
    },
    {
      imagePath: "/images/scanimage/10.png",
    },
    {
      imagePath: "/images/scanimage/11.png",
    },
    {
      imagePath: "/images/scanimage/12.png",
    },
    {
      imagePath: "/images/scanimage/13.png",
    },
    {
      imagePath: "/images/scanimage/14.png",
    },
    {
      imagePath: "/images/scanimage/15.png",
    },
    {
      imagePath: "/images/scanimage/16.png",
    },
    {
      imagePath: "/images/scanimage/17.png",
    },
    {
      imagePath: "/images/scanimage/18.png",
    },
    {
      imagePath: "/images/scanimage/19.png",
    },
    {
      imagePath: "/images/scanimage/20.png",
    },
    {
      imagePath: "/images/scanimage/21.png",
    },
    {
      imagePath: "/images/scanimage/22.png",
    },
    {
      imagePath: "/images/scanimage/23.png",
    },
    {
      imagePath: "/images/scanimage/24.png",
    },
    {
      imagePath: "/images/scanimage/25.png",
    },
    {
      imagePath: "/images/scanimage/26.png",
    },
    {
      imagePath: "/images/scanimage/27.png",
    },
    {
      imagePath: "/images/scanimage/28.png",
    },
    {
      imagePath: "/images/scanimage/29.png",
    },
    {
      imagePath: "/images/scanimage/30.png",
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