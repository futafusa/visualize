import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, CameraControls, KeyboardControls } from "@react-three/drei";
import { useControls } from "leva";
import { Perf } from "r3f-perf";
import { Physics, RigidBody, ConeCollider } from "@react-three/rapier";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";

import Interface from "./interface";
import DebugStage from "./stageDebug";
import StageAction01 from "./stageAction01";
import Bgm from "./bgm";
// import Player from "./player";
import PlayerVrm from "./playerVrm";

export default function base() {
  const { perfVisible } = useControls('Performance', {
    perfVisible: false
  });
  const { cameraControls } = useControls('Camera', {
    cameraControls: false
  });

  const { selectStage } = useControls('Stage', {
    selectStage: {
      value: 'stageAction01',
      options: ['stageAction01', 'stageDebug']
    }
  });

  const keyboardMap = [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
    { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
    { name: 'jump', keys: ['Space'] },
    // { name: "run", keys: ["Shift"] },
    { name: "pickup", keys: ["KeyF"] }, 
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

          {selectStage === 'stageAction01' ? <StageAction01 /> : <DebugStage />}
        </Physics>
        {/* <Grid
          args={[20, 20]}
          position={[0, 0, 0]}
        /> */}
      </Canvas>
      <Interface />
      <Bgm />
    </KeyboardControls>
  );
}