import { RigidBody } from "@react-three/rapier";
import { useRef, useState } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";

export default function GlowingFloor(props: {position: THREE.Vector3, color: string}) {
  const refMesh = useRef<THREE.Mesh>(null);
  const [isActive, setIsActive] = useState(false);

  const handlerCollisionEnter = ({manifold, target, other}: {manifold: any, target: any, other: any}) => {
    const material = refMesh.current?.material as THREE.MeshStandardMaterial;
    material?.color.set(props.color);
    material.emissive.set(props.color);
    material.emissiveIntensity = 2;

    if (other.rigidBodyObject) {
      console.log(target.rigidBodyObject.name, " collided with ", other.rigidBodyObject.name);
    }

    setIsActive(true);
  }

  const handlerCollisionExit = () => {
    const material = refMesh.current?.material as THREE.MeshStandardMaterial;
    material?.color.set('#ffffff');
    material.emissive.set('#000000');
    material.emissiveIntensity = 0;

    setIsActive(false);
  }

  return (
    <group>
      <RigidBody
        name="glowingFloor"
        type="fixed"
        position={props.position}
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
      <Text
        scale={0.1}
        position={props.position.clone().add(new THREE.Vector3(0, 1, -0.5))}
        fontSize={4}
      >
        {isActive ? 'Active' : 'Not Active'}
      </Text>
    </group>
  );
}
