import { useRef, useState, useEffect } from "react";

export default function Bgm() {
  const refAudio = useRef<HTMLAudioElement>(null);
  const [isPlay, setIsPlay] = useState<boolean>(false);

 useEffect(() => {
  const audio = refAudio.current;
  if (!audio) return;

  audio.volume = 0.3;
  audio.loop = true;

  if (isPlay) {
    audio.currentTime = 0;
    audio.play().catch(console.error);
  } else {
    audio.pause();
  }

  return () => {
    audio.pause();
  }
 }, [isPlay]);

  return (
    <>
      <div className="fixed top-20 left-8 z-10">
        <button 
          className={`
            text-black 
            bg-white
            rounded-lg
            py-2
            px-3
            flex
            justify-center
            items-center
            gap-2
            drop-shadow-md 
            ${isPlay ? 'bg-white' : 'bg-transparent'}
            hover:bg-black
            hover:text-white
            group
            relative
          `}
          onClick={() => setIsPlay(!isPlay)}
        >
          {/* <div className={`text-lg ${isPlay ? 'i-ic-round-volume-up group-hover:text-white' : 'i-ic-round-volume-off group-hover:text-white'}`}></div> */}
          <div className={`text-sm ${isPlay ? 'group-hover:text-white' : 'group-hover:text-white'}`}>BGM</div>
        </button>
        <audio ref={refAudio} src="/audio/echo.mp3" />
      </div>
    </>
  )
}