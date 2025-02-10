import * as THREE from "three";
import { RigidBody, type RapierRigidBody, useRapier, type CollisionEnterPayload, type CollisionExitPayload } from "@react-three/rapier";
import { useFrame, useThree } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import vertexShaderDamage from "../../shaders/gameEffect/damage/vertex.glsl";
import fragmentShaderDamage from "../../shaders/gameEffect/damage/fragment.glsl";
import { useGameStore } from "./store/gameStore";

export default function Player({ cameraControls }: { cameraControls: boolean }) {
  const refPlayer = useRef<RapierRigidBody>(null);
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { rapier, world } = useRapier();
  const [smoothCameraPosition, setSmoothCameraPosition] = useState(() => new THREE.Vector3(20, 20, 20));
  const [smoothCameraTarget, setSmoothCameraTarget] = useState(() => new THREE.Vector3());
  // const [isDamaged, setIsDamaged] = useState(false);
  const [isCollision, setIsCollision] = useState(false);

  // global state
  const setCurrentUV = useGameStore((state) => state.setCurrentUV);
  const isCollisionArea = useGameStore((state) => state.isCollisionArea);

  const playerMaterial = new CustomShaderMaterial({
    baseMaterial: THREE.MeshStandardMaterial,
    metalness: 0,
    roughness: 1.0,
    wireframe: false,
    vertexShader: vertexShaderDamage,
    fragmentShader: fragmentShaderDamage,
    flatShading: true,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#ff0000') },
      uIsDamage: { value: false },
    },
  })

  const playerJump = () => {
    const origin = refPlayer.current?.translation();
    if(origin) {
      origin.y -= 0.51;
      const direction = {x: 0, y: -1, z: 0};
      const ray = new rapier.Ray(origin, direction);
      const hit = world.castRay(ray, 10, true);

      if(hit && hit.timeOfImpact < 0.15) {
        refPlayer.current?.applyImpulse({x: 0, y: 3, z: 0}, true);
      }
    }
  }

  const handlerRespawn = () => {
    refPlayer.current?.setTranslation({x: 0, y: 2, z: 0}, true);
    refPlayer.current?.setLinvel({x: 0, y: 0, z: 0}, true);
    refPlayer.current?.setAngvel({x: 0, y: 0, z: 0}, true);
  }

  const handlerDamage = () => {
    playerMaterial.uniforms.uIsDamage.value = true;
    setTimeout(() => {
      playerMaterial.uniforms.uIsDamage.value = false;
    }, 500);

    refPlayer.current?.applyImpulse({x: 0, y: 3, z: 0}, true);
  }

  const handleCollisionEnter = (event: CollisionEnterPayload) => {
    if(event.other.rigidBodyObject?.name === 'respawnObject') {
      handlerRespawn();
    }


    if(event.other.rigidBodyObject?.name === 'damageObject') {
      handlerDamage();
    }

    if(event.other.rigidBodyObject?.name === 'glowingFloor') {
      setIsCollision(true);
    }
  }

  const handleCollisionExit = (event: CollisionExitPayload) => {
    if(event.other.rigidBodyObject?.name === 'glowingFloor') {
      setIsCollision(false);
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

  const { scene } = useThree();
  const rayCaster = new THREE.Raycaster();

  useFrame((state, delta) => {
    if(isCollisionArea) {
      const playerPosition = refPlayer.current?.translation()!;
      const rayOrigin = new THREE.Vector3(playerPosition.x, playerPosition.y, playerPosition.z);
      const rayDirection = new THREE.Vector3(0, -1, 0);
      rayCaster.set(rayOrigin, rayDirection);   
      const intersects = rayCaster.intersectObjects(scene.children, true);
      // console.log(intersects);
      if (intersects.length > 0) {
        const intersection = intersects[0];
        if (intersection.uv) {
          console.log(intersection.uv.x);
          setCurrentUV(intersection.uv);
        }
      }
    }

    const {forward, backward, leftward, rightward, jump} = getKeys();

    const impulse = {x: 0, y: 0, z: 0};
    const torque = {x: 0, y: 0, z: 0};

    const impluseStrength = 5 * delta;
    const torqueStrength = 1 * delta;

    // if(forward) {
    //   impulse.z += impluseStrength;
    //   torque.x += torqueStrength;
    // }
    // if(backward) {
    //   impulse.z -= impluseStrength;
    //   torque.x -= torqueStrength;
    // }
    if(leftward) {
      impulse.x += impluseStrength;
      torque.z -= torqueStrength;
    }
    if(rightward) {
      impulse.x -= impluseStrength;
      torque.z += torqueStrength;
    }

    refPlayer.current?.applyImpulse(impulse, true);
    refPlayer.current?.applyTorqueImpulse(torque, true);

    if(!cameraControls) {
      // move camera
      const playerPosition = refPlayer.current?.translation()!;
      const cameraPosition = new THREE.Vector3();
      cameraPosition.copy(playerPosition);
      cameraPosition.z -= 20;
      cameraPosition.y += 5;

      const cameraTarget = new THREE.Vector3();
      cameraTarget.copy(playerPosition);

      smoothCameraPosition.lerp(cameraPosition, 5 * delta);
      smoothCameraTarget.lerp(cameraTarget, 5 * delta);

      state.camera.position.copy(smoothCameraPosition);
      state.camera.lookAt(smoothCameraTarget);
    }

    // update damage effect
    playerMaterial.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <RigidBody
      name="player"
      ref={refPlayer}
      colliders="ball"
      restitution={0.1}
      friction={1}
      canSleep={false}
      linearDamping={0.5}
      angularDamping={0.5}
      position={[8, 2, 0]}
      onCollisionEnter={handleCollisionEnter}
      onCollisionExit={handleCollisionExit}
    >
      <mesh castShadow material={playerMaterial}>
        <icosahedronGeometry args={[0.5, 1]} />

      </mesh>
    </RigidBody>
  );
}