import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import * as THREE from "three";

export default function DamageObject(
	props: {
		position: [number, number, number],
		size: [number, number, number],
		color: string},
) {
  const refMesh = useRef<THREE.Mesh>(null);

  return (
    <RigidBody
      name="damageObject"
      type="fixed"
      position={props.position}
    >
      <mesh ref={refMesh}>
        <boxGeometry args={props.size} />
        <meshStandardMaterial
          color={props.color}
          emissive={props.color}
          emissiveIntensity={2}
          roughness={0.5}
          // metalness={0.8}
        />
      </mesh>
    </RigidBody>
  );
}
