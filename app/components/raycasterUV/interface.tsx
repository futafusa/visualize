import { useKeyboardControls } from "@react-three/drei";
import { useGameStore } from "./store/gameStore";

function ButtonKey(props: { name: string, width: number, isActive: boolean}) {
  const getWidthClass = () => {
    switch(props.width) {
      case 10:
        return 'w-10';
      case 15:
        return 'w-15';
      case 32:
        return 'w-32';
      default:
        return 'w-10';
    }
  }

  const setIsInterfaceTouch = useGameStore((state) => state.setIsInterfaceTouch);

  function toushStart(event: React.TouchEvent<HTMLButtonElement>) {
    const buttonName = event.currentTarget.dataset.name;
    setIsInterfaceTouch({
      leftward: buttonName === 'leftward',
      rightward: buttonName === 'rightward',
      space: buttonName === 'space'
    });
  }

  function toushEnd(event: React.TouchEvent<HTMLButtonElement>) {
    const buttonName = event.currentTarget.dataset.name;
    setIsInterfaceTouch({
      leftward: buttonName === 'leftward' && false,
      rightward: buttonName === 'rightward' && false,
      space: buttonName === 'space' && false
    });
  }
  
  return (
    <button
      data-name={props.name} 
      className={`h-20 border-2 border-gray-500 rounded-lg flex justify-center items-center
      ${getWidthClass()}
      ${props.isActive ? 'bg-gray-500' : 'bg-gray-500/10'}`}
      onTouchStart={toushStart}
      onTouchEnd={toushEnd}
    >
      {props.name === 'leftward' && <div className="i-ic-baseline-arrow-back"></div>}
      {props.name === 'rightward' && <div className="i-ic-baseline-arrow-forward"></div>}
      {props.name === 'space' && <div>space</div>}
    </button>

  )
}

export default function Interface() {
  // const forward = useKeyboardControls((state) => state.forward);
  // const backward = useKeyboardControls((state) => state.backward);
  const leftward = useKeyboardControls((state) => state.leftward);
  const rightward = useKeyboardControls((state) => state.rightward);
  const jump = useKeyboardControls((state) => state.jump);

  return (
    <div className="absolute top-0 left-0 w-full h-full text-white">
      <div className="flex flex-col gap-2 absolute bottom-[10%] left-0 w-full">
        {/* <div className="flex justify-center">
          <ButtonKey name="forward" width={10} isActive={forward} />
        </div> */}
        <div className="flex flex-row justify-center gap-4">
          <ButtonKey name="leftward" width={32} isActive={leftward} />
          {/* <ButtonKey name="backward" width={10} isActive={backward} /> */}
          <ButtonKey name="rightward" width={32} isActive={rightward} />
        </div>
        {/* <div className="flex justify-center gap-2">
          <ButtonKey name="space" width={32} isActive={jump} />
        </div> */}
      </div>
    </div>
  )
}