import { motion } from "motion/react";
import { useSlider } from "./useSlider";
const TEXT_TRANSITION_HEIGHT = 150;

export const Slider = () => {
  const { currentIndex, direction, items, nextSlide, prevSlide } = useSlider();
  let prevIndex = direction === 'next' ? currentIndex - 1 : currentIndex + 1;
  if(prevIndex === items.length) {
    prevIndex = 0;
  } else if(prevIndex === -1) {
    prevIndex = items.length - 1;
  }

  return (
    <div className="grid place-content-center h-full select-none overflow-hidden pointer-events-none relative z-10">
      {/* MIDDLE CONTAINER */}
      <div className="h-auto w-screen aspect-square max-h-[80vh] md:w-auto md:h-[80vh] relative max-w-[100vw]">
        {/* TOP LEFT */}
        <div className="w-48 md:w-72 left-4 md:left-0 md:-translate-x-1/2 absolute -top-8 ">
          <h1
            className="
              relative antialiased overflow-hidden font-display 
              text-[5rem] h-[4rem]  leading-[4rem]
              md:text-[11rem] md:h-[7rem]  md:leading-[7rem] font-bold text-white block"
          >
            {items.map((_item, index) => (
              <motion.span
                key={index}
                className="absolute top-0 left-0 md:text-center w-full"
                animate={ index === currentIndex ? "current" : index === prevIndex ? "prev" : "next" }
                variants={{
                  current: {
                    translateY: 0,
                    transition: {
                      duration: 0.8,
                      from: direction === "prev" ? -TEXT_TRANSITION_HEIGHT : TEXT_TRANSITION_HEIGHT,
                      type: "spring",
                      bounce: 0.2,
                      delay: 0.4,
                    },
                  },
                  prev: {
                    translateY:
                      direction === "prev" ? TEXT_TRANSITION_HEIGHT : -TEXT_TRANSITION_HEIGHT,
                    transition: {
                      type: "spring",
                      bounce: 0.2,
                      delay: 0.2,
                      from: direction === "start" ? -TEXT_TRANSITION_HEIGHT : 0,
                    },
                  },
                  next: {
                    translateY: TEXT_TRANSITION_HEIGHT,
                    transition: {
                      from: TEXT_TRANSITION_HEIGHT,
                    },
                  },
                }}
              >
                {items[index].short}
              </motion.span>
            ))}
          </h1>
        </div>
        {/* MIDDLE ARROWS */}
        <button
          className="absolute left-4 md:-left-14 top-1/2 -translate-y-1/2 pointer-events-auto"
          onClick={prevSlide}
        >
          <div className="i-ic-baseline-arrow-back text-white text-3xl" />
        </button>
        <button
          className="absolute right-4 md:-right-14 top-1/2 -translate-y-1/2 pointer-events-auto"
          onClick={nextSlide}
        >
          <div className="i-ic-baseline-arrow-forward text-white text-3xl" />
        </button>
        {/* BOTTOM RIGHT */}
        <div className="absolute right-auto md:right-auto md:left-full md:-ml-20 bottom-8">
          <h2
            className="antialiased font-display font-bold 
            block  relative w-[50vw]
            text-4xl h-16 overflow-hidden
            md:text-8xl md:h-28"
          >
            {items.map((item, index)=> (
              <motion.div 
                key={index}
                className="absolute inset-0"
                animate={ index === currentIndex ? "current" : index === prevIndex ? "prev" : "next" }
                variants={{
                  current: { transition: {delay: 0.4, staggerChildren: 0.06} }
                }}
              >
                {item.title.split("").map((char, index)=> (
                  <motion.span
                    key={index}
                    className="inline-block"
                    variants={{
                      current: {
                        translateY: 0,
                        transition: {
                          duration: 0.8,
                          from:
                            direction === "prev" ? -TEXT_TRANSITION_HEIGHT : TEXT_TRANSITION_HEIGHT,
                          type: "spring",
                          bounce: 0.2,
                        },
                      },
                      prev: {
                        translateY: direction === "prev" ? TEXT_TRANSITION_HEIGHT : -TEXT_TRANSITION_HEIGHT,
                        transition: {
                          duration: 0.8,
                          from: direction === "start" ? -TEXT_TRANSITION_HEIGHT : 0,
                        },
                      },
                      next: {
                        translateY: TEXT_TRANSITION_HEIGHT,
                        transition: {
                          from: TEXT_TRANSITION_HEIGHT,
                        },
                      },
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.div>
            ))}
          </h2>
        </div>
        <div className="absolute right-4 md:right-auto md:left-full md:top-full md:-mt-10 bottom-8 md:bottom-auto">
          <p className="text-white w-64 text-sm font-thin italic ml-4 relative">
            {items[currentIndex].description}
          </p>
        </div>
      </div>
    </div>
  );
};
