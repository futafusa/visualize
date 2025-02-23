import { useState } from "react";
import { useGlobalStore } from "../store/globalStore";

export default function ButtonKey({ name, isActive }: { name: string, isActive: boolean }) {
  const { setIsInterfaceTouch } = useGlobalStore();
  
  const handlerTouchStart = (event: React.TouchEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement>) => {
    const buttonName = event.currentTarget.dataset.name;

    setIsInterfaceTouch({
      forward: buttonName === 'forward',
      backward: buttonName === 'backward',
      pickup: buttonName === 'pickup',
    });
  }

  const handlerTouchEnd = (event: React.TouchEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement>) => {
    const buttonName = event.currentTarget.dataset.name;

    setIsInterfaceTouch({
      forward: buttonName === 'forward' && false,
      backward: buttonName === 'backward' && false,
      pickup: buttonName === 'pickup' && false,
    });
  }
    
  return (
    <button
      data-name={name}
      className={`
        flex justify-center items-center
        w-20 h-10 
        border-2 border-white rounded-lg
        text-white text-center
        hover:bg-white/40 active:bg-white/90
      `}
      onMouseDown={handlerTouchStart}
      onMouseUp={handlerTouchEnd}
      onMouseLeave={handlerTouchEnd}
      onTouchStart={handlerTouchStart}
      onTouchEnd={handlerTouchEnd}
    >
      {name === 'forward' && <div className="i-ic-baseline-arrow-upward"></div>}
      {name === 'backward' && <div className="i-ic-baseline-arrow-downward"></div>}
      {name === 'pickup' && <div>調べる</div>}
    </button>
  )
}
