import { useKeyboardControls } from "@react-three/drei";
import { useGlobalStore } from "../store/globalStore";
import { AnimatePresence } from "motion/react";

import Modal from "./modal";
import ButtonKey from "./buttonKey";

export default function BaseInterface() {
  // const forward = useKeyboardControls((state) => state.forward);
  // const backward = useKeyboardControls((state) => state.backward); 
  // const pickup = useKeyboardControls((state) => state.pickup);
  // const leftward = useKeyboardControls((state) => state.leftward);
  // const rightward = useKeyboardControls((state) => state.rightward);

  // global state
  const { isModalOpen } = useGlobalStore();

  return (
    <>
      <div
        className="
          absolute bottom-0 left-0 w-full h-[240px]
        flex justify-center items-center gap-12
      ">
        <div className="flex flex-col gap-4 justify-center items-center">
          <div className="flex gap-4">
            <ButtonKey name="forward" />
          </div>
          <div className="flex flex-row gap-4">
            <ButtonKey name="leftward" />
            <ButtonKey name="rightward" />
          </div>
          <div>
            <ButtonKey name="backward" />
          </div>
        </div>
        <ButtonKey name="pickup" />
      </div>
      <AnimatePresence>
        {isModalOpen && <Modal key="modal" />}
      </AnimatePresence>
    </>
  );
}