import { create } from 'zustand';

interface GlobalStore {
  isInterfaceTouch: {
    forward: boolean;
    backward: boolean;
    pickup: boolean;
    leftward: boolean;
    rightward: boolean;
  };
  setIsInterfaceTouch: (isInterfaceTouch: GlobalStore['isInterfaceTouch']) => void;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  modalContent: {
    image: string;
    text: string;
  };
  setModalContent: (modalContent: GlobalStore['modalContent']) => void;
  cameraForcus: boolean;
  setCameraForcus: (cameraForcus: boolean) => void;
  cameraForcusPosition: [number, number, number];
  setCameraForcusPosition: (cameraForcusPosition: [number, number, number]) => void;
}

export const useGlobalStore = create<GlobalStore>((set) => ({
  // インターフェースのタッチ状態管理
  isInterfaceTouch: {
    forward: false,
    backward: false,
    pickup: false,
    leftward: false,
    rightward: false,
  },
  setIsInterfaceTouch: (isInterfaceTouch) => set({ isInterfaceTouch }),
  
  // モーダルの状態管理
  isModalOpen: false,
  setIsModalOpen: (isModalOpen) => set({ isModalOpen }),
  // モーダルの内容保持
  modalContent: {
    image: '',
    text: '',
  },
  setModalContent: (modalContent) => set({ modalContent }),
  
  // カメラ位置の状態管理
  cameraForcus: false,
  setCameraForcus: (cameraForcus) => set({ cameraForcus }),
  // カメラ位置の保持
  cameraForcusPosition: [0, 0, 0],
  setCameraForcusPosition: (cameraForcusPosition) => set({ cameraForcusPosition }),
}));
