import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Grid, useTexture } from "@react-three/drei";
import { RigidBody, type RapierRigidBody } from "@react-three/rapier";

export default function FloorBasic(props: {
  position: [number, number, number],
  size: [number, number],
  color: string,
  moveSlide?: boolean,
  moveLift?: boolean
}) {
  const refFloor = useRef<RapierRigidBody>(null)!;
  const floorTexture = useTexture('/images/textures/grid128.png');
  
  useFrame((state) => {
    const move = Math.sin(state.clock.getElapsedTime()) * 2;

    if (props.moveSlide) {
      refFloor.current?.setNextKinematicTranslation({x: props.position[0] + move, y:  props.position[1], z: props.position[2] + move});
    }
    if (props.moveLift) {
      refFloor.current?.setNextKinematicTranslation({x: props.position[0], y:  props.position[1] + move, z: props.position[2]});
    }
  });

  return (
    <group rotation={[0, 0, 0]}>
    {/* <group rotation={[0, Math.PI - Math.PI / 4, 0]}> */}
      <RigidBody
        ref={refFloor}
        name="floorBasic"
        type="kinematicPosition"
        position={props.position}
        rotation={[0, Math.PI - Math.PI / 4, 0]}
      >
        <mesh>
          <boxGeometry args={[props.size[0], 0.2, props.size[1]]} />
          <meshStandardMaterial map={floorTexture} />
        </mesh>
      </RigidBody>
    </group>
  )
}
