import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { CameraControls, Grid } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { useControls } from "leva";
import { Physics } from "@react-three/rapier";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { KeyboardControls } from "@react-three/drei";

import FloorBasic from "./floorBasic";
import Player from "./player";
import GlowingFloor from "./glowingFloor";
import BoxAnimation from "./boxAnimation";
import Interface from "./interface";
import RespawnObject from "./respawnObject";

const keyboardMap = [
  { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
  { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
  { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
  { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
  { name: 'jump', keys: ['Space'] },
  // { name: "run", keys: ["Shift"] },
  { name: "pickup", keys: ["KeyF"] }, 
]

export default function Base() {
  const {perfVisible, cameraControls} = useControls('Debug', {
    perfVisible: false,
    cameraControls: false,
  })

  return (
    <KeyboardControls map={keyboardMap}>
      <Canvas
          camera={{ fov: 20, near: 0.1, far: 200, position: [0, 10, 15] }}
          gl={{toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0}}
          style={{background: '#000000'}}
        >
        {perfVisible && <Perf position="bottom-right" />}

        {cameraControls && <CameraControls />}

        <directionalLight
          castShadow
          position={ [ -5, 4, -4 ] }
          intensity={ 1.5 }
          shadow-mapSize={ [ 1024, 1024 ] }
          shadow-camera-near={ 1 }
          shadow-camera-far={ 10 }
          shadow-camera-top={ 10 }
          shadow-camera-right={ 10 }
          shadow-camera-bottom={ - 10 }
          shadow-camera-left={ - 10 }
        />
        <ambientLight intensity={1} />

        <EffectComposer>
          <Bloom intensity={0.5} mipmapBlur={true} radius={0.6}/>
        </EffectComposer>

        {/* MAIN OBJECTS */}
        <BoxAnimation  position={[0, 0, 4]} rotation={[0, 0, 0]} scale={[3, 3, 3]}/>

        <Physics debug={false}>
          <Player cameraControls={cameraControls} />

          <GlowingFloor position={[0, -0.09, 0]} color={"#00ff00"} />
          <Grid args={[20, 10]}  />
          <FloorBasic position={[0, -0.2, 0]} size={[20, 10]} color="black" />
          <RespawnObject position={[0, -4, 0]} size={[50, 0.2, 5]} color={"#ffffff"} rotation={[0, 0, 0]} />
        </Physics>

      </Canvas>
      <Interface />
    </KeyboardControls>
  )
}
