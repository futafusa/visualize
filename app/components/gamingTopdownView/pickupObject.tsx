import * as THREE from "three";
import { RigidBody, BallCollider } from "@react-three/rapier";
import { useState, useEffect } from "react";
import { Html, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

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
  const [showMessage, setShowMessage] = useState<boolean>(false);
  const [isMessageToggled, setIsMessageToggled] = useState<boolean>(false);
  const [prevPickupState, setPrevPickupState] = useState<boolean>(false);
  const [_, getKeys] = useKeyboardControls();

  const handleIntersectionEnter = (event: any) => {
    const colliderOther = event.other.rigidBodyObject;

    if(colliderOther?.name === 'player') {
      setIsPlayerEnter(true);
    }
  }

  const handleIntersectionExit = (event: any) => {
    const colliderOther = event.other.rigidBodyObject;

    if(colliderOther?.name === 'player') {
      setIsPlayerEnter(false);
      setIsMessageToggled(false);
      setPrevPickupState(false);
    }
  }

  useFrame(() => {
    const { pickup } = getKeys();
    
    if (pickup && !prevPickupState && isPlayerEnter) {
      setIsMessageToggled(prev => !prev);
    }
    setPrevPickupState(pickup);
    setShowMessage(isMessageToggled);
  })

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
      {isPlayerEnter && !showMessage ? (
        <Html center position={[0, 0, 0]} zIndexRange={[16777300, 16777271]}>
          <div className="
            bg-white text-black text-center text-sm rounded-md py-2 flex justify-center items-center gap-1 w-[100px]
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
            <div className="bg-white text-black text-center text-sm w-[25px] h-[25px] rounded-md flex justify-center items-center border border-black">
              F
            </div>
            <div className="px-2">調べる</div>
          </div>
        </Html>
      ) : isPlayerEnter && showMessage ? (
        <Html center position={[0, 0, 0]} zIndexRange={[16777300, 16777271]}>
          <div className="
            bg-white text-black text-center text-sm w-[160px] rounded-md px-2 py-2 flex justify-center items-center
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
      ) : null}
    </group>
  );
} 