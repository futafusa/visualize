import { RigidBody, BallCollider } from "@react-three/rapier";
import { useState, useEffect } from "react";
import { Html } from "@react-three/drei";
import { useGlobalStore } from "../store/globalStore";

export default function ForcusObject(
  props: {
    position: [number, number, number],
    rotation: [number, number, number]
    size: [number, number, number],
    coliderSize: number,
    color: string,
    children?: React.ReactNode,
  }
) {
  const [isPlayerEnter, setIsPlayerEnter] = useState<boolean>(false);

  // global state
  const pickupGlobal = useGlobalStore((state) => state.isInterfaceTouch.pickup);
  const { cameraForcus, setCameraForcus, setCameraForcusPosition } = useGlobalStore((state) => state);

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
      setCameraForcus(false);
    }
  }

  useEffect(() => {
    if (pickupGlobal && isPlayerEnter) {
      setCameraForcusPosition(props.position);

      setCameraForcus(true);
    }
  }, [pickupGlobal, isPlayerEnter]);

  return (
    <group position={props.position} rotation={props.rotation}>
      <RigidBody
        name="forcusObject"
        type="fixed"
        scale={props.size}
        colliders={false}
      >
        <mesh>
          <icosahedronGeometry args={[0.5, 1]} />
          <meshStandardMaterial color={props.color} flatShading />
          <BallCollider args={[props.coliderSize]} sensor={true}
            onIntersectionEnter={handleIntersectionEnter}
            onIntersectionExit={handleIntersectionExit}
          />
        </mesh>
      </RigidBody>
      {isPlayerEnter ? (
        <Html center position={[0, 0, 0]} zIndexRange={[16777300, 16777271]}>
          <div className="
            bg-white text-black text-center text-sm min-w-[120px] rounded-md px-2 py-2 flex justify-center items-center
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
            <div className="px-2">カメラフォーカス</div>
          </div>
        </Html>
      ) : null}
    </group>
  );
} 