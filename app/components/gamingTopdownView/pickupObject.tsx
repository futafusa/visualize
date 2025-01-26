import * as THREE from "three";
import { RigidBody, BallCollider } from "@react-three/rapier";
import { useState } from "react";
import { Html } from "@react-three/drei";

export default function PickupObject(
  props: {
    position: THREE.Vector3,
    size: [number, number, number],
    color: string,
    children: React.ReactNode,
    rotation: [number, number, number]
  }
) {
  const [isPlayerEnter, setIsPlayerEnter] = useState<boolean>(false);
 
  const handleIntersectionEnter = (event: any) => {
    const colliderOther = event.other.rigidBodyObject;

    if(colliderOther?.name === 'player') {
      console.log('playerCheckIn');
      setIsPlayerEnter(true);
    }
  }

  const handleIntersectionExit = (event: any) => {
    const colliderOther = event.other.rigidBodyObject;

    if(colliderOther?.name === 'player') {
      console.log('playerCheckOut');
      setIsPlayerEnter(false);
    }
  }

  return (
    <group position={props.position} rotation={props.rotation}>
      <RigidBody
        name="pickupObject"
        type="fixed"
        scale={props.size}
        colliders={false}
      >
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color={props.color} />
          <BallCollider args={[5]} sensor={true}
            onIntersectionEnter={handleIntersectionEnter}
            onIntersectionExit={handleIntersectionExit}
          />
        </mesh>
      </RigidBody>
      {isPlayerEnter ? (
        <Html center position={[0, 0, 0]} zIndexRange={[16777300, 16777271]}>
          <div className="
            bg-white text-black text-center text-sm w-[160px] rounded-md px-1 py-1 flex justify-center items-center
              -translate-y-20
              before:content-['']
              before:absolute
              before:-translate-x-1/2
              before:left-1/2
              before:top-[99%]
              before:border-8
              before:border-transparent
              before:border-t-white
            ">
            {props.children}
          </div>
        </Html>
      ) : (
        <Html center position={[0, 0, 0]} zIndexRange={[16777300, 16777271]}>
          <div className="
          bg-white text-black text-center text-sm w-[30px] h-[30px] rounded-md px-1 py-1 flex justify-center items-center
            -translate-y-20
            before:content-['']
            before:absolute
            before:-translate-x-1/2
            before:left-1/2
            before:top-[99%]
            before:border-8
            before:border-transparent
            before:border-t-white
          ">
            ?
          </div>
        </Html>
      )}
    </group>
  );
} 