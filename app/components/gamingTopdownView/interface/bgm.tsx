import { useRef, useState, useEffect } from "react";
import { useControls } from "leva";

export default function Bgm() {
  const { isBGM } = useControls('BGM', {
    isBGM: false,
  })

  const refAudio = useRef<HTMLAudioElement>(null);
  // const [isPlay, setIsPlay] = useState<boolean>(false);

 useEffect(() => {
  const audio = refAudio.current;
  if (!audio) return;

  audio.volume = 0.3;
  audio.loop = true;

  if (isBGM) {
    audio.currentTime = 0;
    audio.play().catch(console.error);
  } else {
    audio.pause();
  }

  return () => {
    audio.pause();
  }
 }, [isBGM]);

  return (
    <>
      <div className="fixed top-20 left-8 z-10">
        {/* <button 
          className={`
            text-sm
            py-2 px-3
            flex justify-center items-center gap-2
            rounded-lg
            drop-shadow-md
            ${isBGM ? 'bg-black' : 'bg-white'}
            ${isBGM ? 'text-white' : 'text-black'}

            hover:bg-black
            hover:text-white
          `}
          onClick={() => setIsBGM(!isBGM)}
        >
          <span className={`
            text-lg
            ${isBGM ? 'i-ic-round-volume-up' : 'i-ic-round-volume-off'}
          `}>       
          </span>
          BGM

        </button> */}
        <audio ref={refAudio} src="/audio/echo.mp3" />
      </div>
    </>
  )
}