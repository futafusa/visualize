import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useRef, useState } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";
import { useGameStore } from "./store/gameStore";

export default function GlowingFloor(props: {position: [number, number, number], color: string}) {
  const refMesh = useRef<THREE.Mesh>(null);
  const [isActive, setIsActive] = useState(false);
  const setIsCollisionArea = useGameStore((state) => state.setIsCollisionArea);

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
        type="fixed"
        name="glowingFloor"
        position={props.position}
        rotation={[0, 0, 0]}
        onCollisionEnter={handlerCollisionEnter}
        onCollisionExit={handlerCollisionExit}
      >
        <mesh ref={refMesh} rotation={[-Math.PI*0.5, 0, Math.PI]}>
          {/* <boxGeometry args={[10, 0.1, 2]} /> */}
          <planeGeometry args={[10, 2]} />
          <meshStandardMaterial
            color={'#ffffff'}
            emissive={'#000000'}
            emissiveIntensity={0}
            roughness={0.5}
            // metalness={0.8}
          />
        </mesh>
        <CuboidCollider args={[4.2, 2, 1]} sensor
          onIntersectionEnter={() => setIsCollisionArea(true)}
          onIntersectionExit={() => setIsCollisionArea(false)}
        />
      </RigidBody>

      {/* <RigidBody name="glowingFloor" type="fixed" position={[5, -0.1, 0]}>
        <mesh>
          <boxGeometry args={[0.1, 0.1, 2]} />
          <meshStandardMaterial color={'#ffffff'} />
        </mesh>
      </RigidBody> */}
    </group>

  );
}
