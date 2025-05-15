import { useSliderStore } from "./sliderStore";

function SliderButton({ direction, onClick }: { direction: string, onClick: () => void }) {
  let css = "absolute top-1/2 -translate-y-1/2 pointer-events-auto";

  const icon = direction === "prev" ? "i-ic-baseline-arrow-back" : "i-ic-baseline-arrow-forward";

  return (
    <button className={css} onClick={onClick}>
      <div className={`${icon} text-white text-3xl`} />
    </button>
  )
}

export default function SliderInterface() {
  const { nextSlide, prevSlide } = useSliderStore();

  return (
    <div className="relative w-full h-full z-10 pointer-events-none flex justify-center items-center overflow-hidden">
      <SliderButton direction="next" onClick={nextSlide} />
    </div>
  )
}
