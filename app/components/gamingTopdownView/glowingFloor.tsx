import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import * as THREE from "three";

export default function GlowingFloor(props: {position: [number, number, number], color: string}) {
  const refMesh = useRef<THREE.Mesh>(null);

  const handlerCollisionEnter = () => {
    const material = refMesh.current?.material as THREE.MeshStandardMaterial;
    material?.color.set(props.color);
    material.emissive.set(props.color);
    material.emissiveIntensity = 2;
  }

  const handlerCollisionExit = () => {
    const material = refMesh.current?.material as THREE.MeshStandardMaterial;
    material?.color.set('#ffffff');
    material.emissive.set('#000000');
    material.emissiveIntensity = 0;
  }

  return (
    <RigidBody type="fixed" position={props.position}
      onCollisionEnter={handlerCollisionEnter}
      onCollisionExit={handlerCollisionExit}
    >
      <mesh ref={refMesh}>
        <boxGeometry args={[4, 0.1, 4]} />
        <meshStandardMaterial 
          color={'#ffffff'} 
          emissive={'#000000'}
          emissiveIntensity={0}
          roughness={0.5}
          // metalness={0.8}
        />
      </mesh>
    </RigidBody>
  );
}
