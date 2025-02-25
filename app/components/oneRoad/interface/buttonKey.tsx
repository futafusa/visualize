import { useState } from "react";
import { useGlobalStore } from "../store/globalStore";

export default function ButtonKey({ name, isActive }: { name: string, isActive?: boolean }) {
  const { setIsInterfaceTouch } = useGlobalStore();
  
  const handlerTouchStart = (event: React.TouchEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement>) => {
    const buttonName = event.currentTarget.dataset.name;

    setIsInterfaceTouch({
      forward: buttonName === 'forward',
      backward: buttonName === 'backward',
      pickup: buttonName === 'pickup',
      leftward: buttonName === 'leftward',
      rightward: buttonName === 'rightward',
    });
  }

  const handlerTouchEnd = (event: React.TouchEvent<HTMLButtonElement> | React.MouseEvent<HTMLButtonElement>) => {
    const buttonName = event.currentTarget.dataset.name;

    setIsInterfaceTouch({
      forward: buttonName === 'forward' && false,
      backward: buttonName === 'backward' && false,
      pickup: buttonName === 'pickup' && false,
      leftward: buttonName === 'leftward' && false,
      rightward: buttonName === 'rightward' && false,
    });
  }
    
  return (
    <button
      data-name={name}
      className={`
        flex justify-center items-center
        w-16 h-16 
        border-2 border-white rounded-lg
        text-white text-center
        active:bg-white/90
        lg:hover:bg-white/40
        ${name === 'leftward' || name === 'rightward' ? 'w-24 h-14' : ''}
        ${name === 'forward' || name === 'backward' ? 'w-20 h-12' : ''}
        ${name === 'pickup' ? 'w-16 h-16' : ''}
      `}
      onMouseDown={handlerTouchStart}
      onMouseUp={handlerTouchEnd}
      onMouseLeave={handlerTouchEnd}
      onTouchStart={handlerTouchStart}
      onTouchEnd={handlerTouchEnd}
    >
      {name === 'forward' && <div className="i-ic-baseline-arrow-upward text-xl"></div>}
      {name === 'backward' && <div className="i-ic-baseline-arrow-downward text-xl"></div>}
      {name === 'leftward' && <div className="i-ic-baseline-arrow-back text-2xl"></div>}
      {name === 'rightward' && <div className="i-ic-baseline-arrow-forward text-2xl"></div>}
      {name === 'pickup' && <div className="i-ic-outline-circle text-2xl">調べる</div>}
    </button>
  )
}
