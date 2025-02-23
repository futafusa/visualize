import * as THREE from "three";
import { RigidBody, BallCollider } from "@react-three/rapier";
import { useState, useEffect } from "react";
import { Html, useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useGlobalStore } from "../store/globalStore";

export default function PickupObject(
  props: {
    position: [number, number, number],
    rotation: [number, number, number]
    size: [number, number, number],
    coliderSize: number,
    color: string,
    modalContent: {
      image: string,
      text: string,
    },
    children?: React.ReactNode,
  }
) {
  const [isPlayerEnter, setIsPlayerEnter] = useState<boolean>(false);
  const pickupGlobal = useGlobalStore((state) => state.isInterfaceTouch.pickup);
  const { isModalOpen, setIsModalOpen, modalContent, setModalContent } = useGlobalStore();

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
    }
  }

  useEffect(() => {
    if (pickupGlobal && isPlayerEnter) {
      setModalContent({
        image: props.modalContent.image,
        text: props.modalContent.text,
      });

      setIsModalOpen(true);
    }
  }, [pickupGlobal, isPlayerEnter]);

  useFrame(() => {
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
          <BallCollider args={[props.coliderSize]} sensor={true}
            onIntersectionEnter={handleIntersectionEnter}
            onIntersectionExit={handleIntersectionExit}
          />
        </mesh>
      </RigidBody>
      {isPlayerEnter ? (
        <Html center position={[0, 0, 0]} zIndexRange={[16777300, 16777271]}>
          <div className="
            bg-white text-black text-center text-sm min-w-[80px] rounded-md px-2 py-2 flex justify-center items-center
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
            <div className="px-2">調べる</div>
          </div>
        </Html>
      ) : null}
    </group>
  );
} 