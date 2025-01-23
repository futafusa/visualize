import { useKeyboardControls } from "@react-three/drei";

function ButtonKey(props: { name: string, width: number, isActive: boolean}) {
  const getWidthClass = () => {
    switch(props.width) {
      case 10:
        return 'w-10';
      case 20:
        return 'w-20';
      default:
        return 'w-10';
    }
  }
  
  return (
    <div data-name={props.name} 
      className={`h-10 border-2 border-white rounded-lg
      ${getWidthClass()}
      ${props.isActive ? 'bg-white' : 'bg-white/10'}`}>
    </div>
  )
}

export default function Interface() {
  const forward = useKeyboardControls((state) => state.forward);
  const backward = useKeyboardControls((state) => state.backward);
  const leftward = useKeyboardControls((state) => state.leftward);
  const rightward = useKeyboardControls((state) => state.rightward);
  const jump = useKeyboardControls((state) => state.jump);

  return (
    <div className="absolute top-0 left-0 w-full h-full text-white pointer-events-none">
      <div className="flex flex-col gap-2 absolute bottom-[5%] left-0 w-full">
        <div className="flex justify-center">
          <ButtonKey name="forward" width={10} isActive={forward} />
        </div>
        <div className="flex flex-row justify-center gap-2">
          <ButtonKey name="leftward" width={10} isActive={leftward} />
          <ButtonKey name="backward" width={10} isActive={backward} />
          <ButtonKey name="rightward" width={10} isActive={rightward} />
        </div>
        <div className="flex justify-center">
          <ButtonKey name="space" width={20} isActive={jump} />
        </div>
      </div>
    </div>
  )
}