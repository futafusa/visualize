import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, CameraControls, KeyboardControls } from "@react-three/drei";
import { useControls } from "leva";
import { Perf } from "r3f-perf";
import { Physics } from "@react-three/rapier";
import Player from "./player";
import { RigidBody } from "@react-three/rapier";

import Interface from "./interface";

export default function base() {
  const { perfVisible } = useControls('Performance', {
    perfVisible: false
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

        {/* <CameraControls /> */}
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

        <Physics debug={true}>
          <Player />

          <group rotation={[0, Math.PI/4, 0]}>
            <Grid args={[30, 30]}  />
            <RigidBody type="kinematicPosition" position={[0, -0.1, 0]}>
              <mesh position={[0, -0.01, 0]} rotation={[Math.PI / -2, 0, 0]}>
              <boxGeometry args={[30, 30, 0.1]} />
              <meshStandardMaterial color={'#000000'} />
              </mesh>
            </RigidBody>
          </group>
        </Physics>
      </Canvas>
      <Interface />
    </KeyboardControls>
  );
}