import * as THREE from "three";
import { RigidBody, type RapierRigidBody, useRapier, type CollisionEnterPayload } from "@react-three/rapier";
import { useFrame } from "@react-three/fiber";
import { useKeyboardControls } from "@react-three/drei";
import { useRef, useEffect, useState } from "react";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import fragmentShaderDamage from "../../shaders/gameEffect/damage/fragment.glsl";

export default function Player({ cameraControls }: { cameraControls: boolean }) {
  const refPlayer = useRef<RapierRigidBody>(null);
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const { rapier, world } = useRapier();
  const [smoothCameraPosition, setSmoothCameraPosition] = useState(() => new THREE.Vector3(20, 20, 20));
  const [smoothCameraTarget, setSmoothCameraTarget] = useState(() => new THREE.Vector3());
  // const [isDamaged, setIsDamaged] = useState(false);

  const playerMaterial = new CustomShaderMaterial({
    baseMaterial: THREE.MeshStandardMaterial,
    metalness: 0,
    roughness: 1.0,
    wireframe: false,
    fragmentShader: fragmentShaderDamage,
    flatShading: true,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#ff0000') },
      uIsFlash: { value: false },
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
    playerMaterial.uniforms.uIsFlash.value = true;

    setTimeout(() => {
      playerMaterial.uniforms.uIsFlash.value = false;
    }, 500);
  }

  const handleCollisionEnter = (event: CollisionEnterPayload) => {
    if(event.other.rigidBodyObject?.name === 'respawnObject') {
      handlerRespawn();
    }

    if(event.other.rigidBodyObject?.name === 'damageObject') {
      handlerDamage();
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

    if(!cameraControls) {
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
      position={[0, 2, 0]}
      onCollisionEnter={handleCollisionEnter}
    >
      <mesh castShadow material={playerMaterial}>
        <icosahedronGeometry args={[0.5, 1]} />
        {/* <meshStandardMaterial
          color={isDamaged ? '#ffffff' : '#ff0000'}
          flatShading={true}
          emissive={isDamaged ? '#ffffff' : '#000000'}
          emissiveIntensity={isDamaged ? 2 : 0}
        /> */}
      </mesh>
    </RigidBody>
  );
}