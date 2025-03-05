import { create } from "zustand";

interface SliderStore {
  currentIndex: number;
  direction: string;
  items: {
    image: string;
    short: string;
    title: string;
    description: string;
    color: string;
  }[];
  nextSlide: () => void;
  prevSlide: () => void;
}

export const useSlider = create<SliderStore>((set) => ({
  currentIndex: 0,
  direction: "start",
  items: [
    {
      image: "/images/prerender/vellum_sample_010.webp",
      short: "br",
      title: "brain",
      description: "金属の脳みそ",
      color: "#201d24",
    },
    {
      image: "/images/prerender/vellum_sample_011.webp",
      short: "bone",
      title: "bone",
      description: "骨の頭",
      color: "#000000",
    },
    {
      image: "/images/prerender/vellum_sample_012.webp",
      short: "chi",
      title: "ckgm",
      description: "直雲",
      color: "#761191",
    },
    {
      image: "/images/prerender/view004d.webp",
      short: "pos",
      title: "post",
      description: "郵便受け",
      color: "#091a21",
    },
  ],
  nextSlide: () => {
    set((state) => ({
      currentIndex: (state.currentIndex + 1) % state.items.length,
      direction: "next",
    }));
  },
  prevSlide: () => {
    set((state) => ({
      currentIndex: (state.currentIndex - 1 + state.items.length) % state.items.length,
      direction: "prev",
    }));
  },
}));

