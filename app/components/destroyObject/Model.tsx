import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

type ModelProps = {
  shape: string;
  position: [number, number, number];
  speed: number;
  onDestroy: () => void;
}

export default function Model({shape, position, speed, onDestroy}: ModelProps) {
  const refModel = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (refModel.current) {
      refModel.current.position.z += speed;

      if (refModel.current.position.z > 5) {
        onDestroy();
      }
    }
  });

  return (
    <mesh ref={refModel} position={position}>
      {shape === "cube"
        ? (
          <>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" />
          </>
        ) : shape === "sphere" ? (
          <>
            <sphereGeometry args={[0.5, 16, 16]} />
            <meshStandardMaterial color="blue" />
          </>
        ) : (
          <>
            <cylinderGeometry args={[0, 0.8, 1, 3]} />
            <meshStandardMaterial color="red" />
          </>
        )
      }
    </mesh>
  );
}
