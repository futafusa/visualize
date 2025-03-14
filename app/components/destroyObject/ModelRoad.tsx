import { useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF, useTexture } from "@react-three/drei";

type ModelRoadProps = {
  position: [number, number, number];
  speed: number;
  onDestroy: () => void;
}

type GLTFResult = {
  nodes: {
    Road: THREE.Mesh;
  };
  materials: {
    [key: string]: THREE.Material;
  };
};

export default function ModelRoad({position, speed, onDestroy}: ModelRoadProps) {
  const refModel = useRef<THREE.Group>(null);
  const { nodes } = useGLTF("/models/road.glb") as unknown as GLTFResult;
  const texture = useTexture("/images/textures/grid128.png");

  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

  useFrame(() => {
    if (refModel.current) {
      refModel.current.position.z += speed;

      if (refModel.current.position.z >= 10) {
        // onDestroy();
        refModel.current.position.z = -30;
      }
    }
  });

  return (
    // <mesh ref={refModel} position={position} rotation={[Math.PI / -2, 0, 0]}>
    //   <planeGeometry args={[2, 10]} />
    //   <meshStandardMaterial color="gray" />
    // </mesh>
    <group ref={refModel} position={position}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Road.geometry}
      >
        <meshStandardMaterial map={texture} />
      </mesh>
    </group>
  );
}
