import { useState } from "react";
import { useGlobalStore } from "../store/globalStore";
import { motion } from "motion/react";

export default function Modal() {
  const { isModalOpen, setIsModalOpen, modalContent } = useGlobalStore();

  return (
    <motion.div
      data-name="modal"
      className="
        absolute top-0 left-0 w-full h-full bg-black/80 z-modal
        flex justify-center items-center
        transition-opacity duration-300
        opacity-1
      "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="relative w-full h-full flex flex-col justify-center items-center gap-8">
        <motion.div
          className="bg-white w-11/12 sm:w-[500px] h-fit p-4 rounded-md"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex gap-4 justify-center items-center flex-col sm:flex-row">
            <div className="sm:w-1/2">
              <img src={modalContent.image} alt="modal" />
            </div>
            <div className="sm:w-1/2 text-base">
              {modalContent.text}
            </div>
          </div>
        </motion.div>
        <button
          className="
            bg-white text-black
            rounded-full
            w-16 h-16
            lg:hover:bg-black lghover:text-white
            active:bg-black active:text-white
          "
          onClick={() => {
            setIsModalOpen(false);
          }}
        >
          <div className="i-ic-outline-close text-2xl relative top-[3px]"></div>
        </button>
      </div>
    </motion.div>
  );
}
