import { create } from 'zustand';

interface GlobalStore {
  isInterfaceTouch: {
    forward: boolean;
    backward: boolean;
    pickup: boolean;
  };
  setIsInterfaceTouch: (isInterfaceTouch: GlobalStore['isInterfaceTouch']) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  modalContent: {
    image: string;
    text: string;
  };
  setModalContent: (modalContent: GlobalStore['modalContent']) => void;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  isInterfaceTouch: {
    forward: false,
    backward: false,
    pickup: false,
  },
  setIsInterfaceTouch: (isInterfaceTouch) => set({ isInterfaceTouch }),
  isModalOpen: false,
  setIsModalOpen: (isModalOpen) => set({ isModalOpen }),
  modalContent: {
    image: '',
    text: '',
  },
  setModalContent: (modalContent) => set({ modalContent }),
}));
