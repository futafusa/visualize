import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, CameraControls, KeyboardControls } from "@react-three/drei";
import { useControls } from "leva";
import { Perf } from "r3f-perf";
import { Physics, RigidBody, ConeCollider } from "@react-three/rapier";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

import Interface from "./interface";
import DebugStage from "./stageDebug";
import FloorBasic from "./floorBasic";
import RespawnObject from "./respawnObject";
import DamageObject from "./damageObject";
import PickupObject from "./pickupObject";

// import Player from "./player";
import PlayerVrm from "./playerVrm";

export default function base() {
  const { perfVisible } = useControls('Performance', {
    perfVisible: false
  });
  const { cameraControls } = useControls('Camera', {
    cameraControls: false
  });

  const keyboardMap = [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
    { name: 'jump', keys: ['Space'] },
    // { name: "run", keys: ["Shift"] },
    { name: "pickup", keys: ["F"] }, 
  ]

  return (
    <KeyboardControls
      map={keyboardMap}
    >
      <Canvas
        camera={{ fov: 20, near: 0.1, far: 200, position: [0, 15, -15] }}
        gl={{toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0}}
        style={{background: '#000000'}}
      >
        {perfVisible && <Perf position="bottom-right" />}

        {cameraControls && <CameraControls />}
        {/* <directionalLight
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
        /> */}
        <ambientLight intensity={2} />

        <EffectComposer>
          <Bloom intensity={0.5} mipmapBlur={true} radius={0.6}/>
          <Vignette offset={0.4} darkness={0.6}/>
        </EffectComposer>

        <Physics debug={false}>
          {/* <Player cameraControls={cameraControls} /> */}
          <PlayerVrm cameraControls={cameraControls} />

          <FloorBasic position={[0, 0, 0]} size={[4, 4]} color={'#222222'} />
          <FloorBasic position={[-3, 0, 3]} size={[2.5, 2.5]} color={'#222222'} moveSlide={true} />
          <FloorBasic position={[-6, 0, 6]} size={[4, 4]} color={'#222222'} />
          <DamageObject position={new THREE.Vector3(-6, 0, 6)} size={[2.5, 0.2, 2.5]} color={'#ff0000'} rotation={[0, Math.PI - Math.PI / 4, 0]}/>
          <FloorBasic position={[-9, 0, 9]} size={[2.5, 2.5]} color={'#222222'} moveLift={true} />
          <FloorBasic position={[-12, 2, 12]} size={[4, 4]} color={'#222222'} />
          <PickupObject position={new THREE.Vector3(-12, 2.5, 12)} size={[0.2, 0.2, 0.2]} color={'#00ff00'} rotation={[0, Math.PI - Math.PI / 4, 0]}>
            Gundam GQuuuuuuX 面白かったね
          </PickupObject>
          <RespawnObject position={new THREE.Vector3(-14, 2, 14)} size={[4, 0.2, 1.5]} color={'#ffff00'} rotation={[0, Math.PI - Math.PI / 4, 0]}/>

          {/* RESPAWN FLOOR */}
          <RespawnObject position={new THREE.Vector3(0, -10, 0)} size={[50, 0.5, 100]} color={'#ffffff'} rotation={[0, Math.PI - Math.PI / 4, 0]}/>
          {/* <DebugStage /> */}
        </Physics>
        {/* <Grid
          args={[20, 20]}
          position={[0, 0, 0]}
        /> */}
      </Canvas>
      <Interface />
    </KeyboardControls>
  );
}