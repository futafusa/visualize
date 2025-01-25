import { RigidBody } from "@react-three/rapier";
import { useRef } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";

export default function DamageObject(
	props: {
		position: THREE.Vector3,
		size: [number, number, number],
		color: string},
) {
  const refMesh = useRef<THREE.Mesh>(null);

  return (
    <group>
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
      <Text
        scale={0.1}
        position={props.position.clone().add(new THREE.Vector3(0, 1, -0.5))}
        fontSize={4}
      >
        Damage
      </Text>
    </group>
  );
}
