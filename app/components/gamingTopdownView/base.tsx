import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, CameraControls, KeyboardControls } from "@react-three/drei";
import { useControls } from "leva";
import { Perf } from "r3f-perf";
import { Physics } from "@react-three/rapier";
import Player from "./player";
import { RigidBody } from "@react-three/rapier";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

import Interface from "./interface";
import GlowingFloor from "./glowingFloor";
import RespawnObject from "./respawnObject";
import DamageObject from "./damageObject";

export default function base() {
  const { perfVisible } = useControls('Performance', {
    perfVisible: false
  });
  const { cameraControls } = useControls('Camera', {
    cameraControls: false
  });

  return (
    <KeyboardControls
      map={[
        { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
        { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
        { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
        { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
        { name: 'jump', keys: ['Space'] },
      ]}
    >
      <Canvas
        camera={{
          fov: 20,
          near: 0.1,
          far: 200,
          position: [20, 20, 0],
        }}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        style={{
          background: '#000000'
        }}
      >
        {perfVisible && <Perf position="bottom-right" />}

        {cameraControls && <CameraControls />}
        <directionalLight
          castShadow
          position={ [ 4, 4, 1 ] }
          intensity={ 1.5 }
          shadow-mapSize={ [ 1024, 1024 ] }
          shadow-camera-near={ 1 }
          shadow-camera-far={ 10 }
          shadow-camera-top={ 10 }
          shadow-camera-right={ 10 }
          shadow-camera-bottom={ - 10 }
          shadow-camera-left={ - 10 }
        />

        <EffectComposer>
          <Bloom intensity={0.5} mipmapBlur={true} radius={0.6}/>
          <Vignette offset={0.4} darkness={0.6}/>
        </EffectComposer>

        <Physics debug={false}>
          <Player cameraControls={cameraControls} />

          <group rotation={[0, Math.PI/4, 0]}>
            <GlowingFloor position={new THREE.Vector3(-3, -0.04, -4)} color={'#00ff00'}/>
            <DamageObject position={new THREE.Vector3(1, -0.04, -4)} size={[1, 1, 1]} color={'#ff0000'}/>

            <RespawnObject position={new THREE.Vector3(4, -0.04, -4)} size={[1, 1, 1]} color={'#ffff00'}/>

             {/* FLOOR */}s
            <Grid args={[20, 20]}  />
            <RigidBody type="kinematicPosition" position={[0, -0.1, 0]}>
              <mesh position={[0, -0.01, 0]} rotation={[Math.PI / -2, 0, 0]}>
              <boxGeometry args={[20, 20, 0.1]} />
              <meshStandardMaterial color={'#000000'} />
              </mesh>
            </RigidBody>

            {/* RESPAWN FLOOR */}
            <RespawnObject position={new THREE.Vector3(0, -10, 0)} size={[50, 1, 50]} color={'#ffffff'}/>
          </group>
        </Physics>
      </Canvas>
      <Interface />
    </KeyboardControls>
  );
}