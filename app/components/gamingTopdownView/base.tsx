import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, CameraControls, KeyboardControls } from "@react-three/drei";
import { useControls } from "leva";
import { Perf } from "r3f-perf";
import { Physics } from "@react-three/rapier";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { useEffect, useState, useCallback } from "react";
import { VRM, VRMLoaderPlugin, VRMUtils } from "@pixiv/three-vrm";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

import Interface from "./interface/interface";
import DebugStage from "./stageDebug";
import StageAction01 from "./stageAction01";
import Bgm from "./interface/bgm";
import PlayerVrm from "./playerVrm";
import DropVRM from "./interface/dropVrm";

const useVRM = (initialPath: string) => {
  const [vrm, setVrm] = useState<VRM | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const loader = new GLTFLoader();
  loader.register((parser) => new VRMLoaderPlugin(parser));

  const loadVRM = useCallback((path: string) => {
    loader.load(
      path,
      (gltf) => {
        const vrmData = gltf.userData.vrm;
        VRMUtils.removeUnnecessaryVertices(gltf.scene);
        VRMUtils.combineSkeletons(gltf.scene);
        VRMUtils.combineMorphs(vrmData);
        setVrm(vrmData);
      },
      (xhr) => {
        setProgress((xhr.loaded / xhr.total) * 100);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  useEffect(() => {
    loadVRM(initialPath);
  }, [initialPath, loadVRM]);

  return { vrm, progress, loadVRM };
};

export default function Base() {
  const { perfVisible, cameraControls, selectStage } = useControls('Debug', {
    perfVisible: false,
    cameraControls: false,
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

  const {vrm, progress, loadVRM} = useVRM('/models/AliciaSolid.vrm');

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
        <ambientLight intensity={2} />

        <EffectComposer>
          <Bloom intensity={0.5} mipmapBlur={true} radius={0.6}/>
          <Vignette offset={0.4} darkness={0.6}/>
        </EffectComposer>

        <Physics debug={false}>
          {/* <Player cameraControls={cameraControls} /> */}
          {vrm && <PlayerVrm cameraControls={cameraControls} onLoadVRM={vrm} />}
          

          {selectStage === 'stageAction01' ? <StageAction01 /> : <DebugStage />}
        </Physics>
        {/* <Grid
          args={[20, 20]}
          position={[0, 0, 0]}
        /> */}
      </Canvas>
      <DropVRM progress={progress} loadVRM={loadVRM} />
      <Interface />
      <Bgm />
    </KeyboardControls>
  );
}