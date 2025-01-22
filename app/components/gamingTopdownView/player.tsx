import * as THREE from "three";
import { RigidBody, type RapierRigidBody, useRapier, vec3 } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";

export default function Player() {
  const refPlayer = useRef<RapierRigidBody>(null);
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { rapier, world } = useRapier();

  const [smoothCameraPosition, setSmoothCameraPosition] = useState(() => new THREE.Vector3(20, 20, 20));
  const [smoothCameraTarget, setSmoothCameraTarget] = useState(() => new THREE.Vector3());

  const playerJump = () => {
    const origin = refPlayer.current?.translation();
    if(origin) {
      origin.y -= 0.51;

      const direction = {x: 0, y: -1, z: 0};
      const ray = new rapier.Ray(origin, direction);

      const hit = world.castRay(ray, 10, true);
      // console.log(hit);

      if(hit && hit.timeOfImpact < 0.15) {
        refPlayer.current?.applyImpulse({x: 0, y: 3, z: 0}, true);
      }
    }
  }

  useEffect(() => {
    const unsubscribePlayerJump = subscribeKeys((state) => {
      return state.jump;
    }, (value) => {
      if(value) {
        playerJump();
      }
    });

    return () => {
      unsubscribePlayerJump();
    }
  }, []);

  useFrame((state, delta) => {
    const {forward, backward, leftward, rightward, jump} = getKeys();

    const impulse = {x: 0, y: 0, z: 0};
    const torque = {x: 0, y: 0, z: 0};

    const impluseStrength = 3 * delta;
    const torqueStrength = 1 * delta;

    if(forward) {
      impulse.x -= impluseStrength;
      torque.z *= torqueStrength;
    }
    if(backward) {
      impulse.x += impluseStrength;
      torque.z -= torqueStrength;
    }
    if(leftward) {
      impulse.z += impluseStrength;
      torque.x += torqueStrength;
    }
    if(rightward) {
      impulse.z -= impluseStrength;
      torque.x -= torqueStrength;
    }

    refPlayer.current?.applyImpulse(impulse, true);
    refPlayer.current?.applyTorqueImpulse(torque, true);

    // move camera
    const playerPosition = refPlayer.current?.translation()!;
    const cameraPosition = new THREE.Vector3();
    cameraPosition.copy(playerPosition);
    cameraPosition.x += 20;
    cameraPosition.y += 20;

    const cameraTarget = new THREE.Vector3();
    cameraTarget.copy(playerPosition);

    smoothCameraPosition.lerp(cameraPosition, 5 * delta);
    smoothCameraTarget.lerp(cameraTarget, 5 * delta);

    state.camera.position.copy(smoothCameraPosition);
    state.camera.lookAt(smoothCameraTarget);
  });


  return (
    <RigidBody
      ref={refPlayer}
      colliders="ball"
      restitution={0.1}
      friction={1}
      canSleep={false}
      linearDamping={0.5}
      angularDamping={0.5}
      position={[0, 2, 0]}
    >
      <mesh castShadow>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial color={'red'} flatShading={true} />
      </mesh>
    </RigidBody>
  );
}