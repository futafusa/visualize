import { useKeyboardControls } from "@react-three/drei";
import { useGlobalStore } from "../store/globalStore";
import { AnimatePresence } from "motion/react";

import Modal from "./modal";
import ButtonKey from "./buttonKey";

export default function BaseInterface() {
  const forward = useKeyboardControls((state) => state.forward);
  const backward = useKeyboardControls((state) => state.backward); 
  const pickup = useKeyboardControls((state) => state.pickup);

  // global state
  const { isModalOpen } = useGlobalStore();

  return (
    <>
      <div
        className="
          absolute bottom-0 left-0 w-full h-[150px]
        flex justify-center items-center gap-4
      ">
        <div className="flex flex-col gap-4 justify-center items-center">
          <ButtonKey name="forward" isActive={forward} />
          <ButtonKey name="backward" isActive={backward} />
        </div>
        <ButtonKey name="pickup" isActive={pickup} />
      </div>
      <AnimatePresence>
        {isModalOpen && <Modal key="modal" />}
      </AnimatePresence>
    </>
  );
}