import * as THREE from 'three';
import { create } from 'zustand';

interface gameState {
  currentUV: THREE.Vector2 | null;
  setCurrentUV: (uv: THREE.Vector2 | null) => void;
  isCollisionArea: boolean;
  setIsCollisionArea: (isCollisionArea: boolean) => void;
  isInterfaceTouch: {
    leftward: boolean;
    rightward: boolean;
    space: boolean;
  };
  setIsInterfaceTouch: (isInterfaceTouch: {
    leftward: boolean;
    rightward: boolean;
    space: boolean;
  }) => void;
}

export const useGameStore = create<gameState>((set) => ({
  currentUV: null,
  setCurrentUV: (uv) => set({ currentUV: uv }),
  isCollisionArea: false,
  setIsCollisionArea: (isCollisionArea) => set({ isCollisionArea: isCollisionArea }),
  isInterfaceTouch: {
    leftward: false,
    rightward: false,
    space: false,
  },
  setIsInterfaceTouch: (isInterfaceTouch) => set({ isInterfaceTouch: isInterfaceTouch }),
}));
