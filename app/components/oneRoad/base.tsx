import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { CameraControls, KeyboardControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { useControls } from "leva";
import { Physics } from "@react-three/rapier";
import { useState, useCallback, useEffect } from "react";
import { VRM, VRMUtils, VRMLoaderPlugin } from "@pixiv/three-vrm";
import { GLTFLoader } from "three/examples/jsm/Addons.js";

import PlayerVrm from "./player/playerVrm";
import BaseEnviroment from "./enviroment/baseEnviroment";
import BaseInterface from "./interface/baseInterface";
export default function Base() {
  const { perfVisible, cameraControls } = useControls('Debug', {
    perfVisible: false,
    cameraControls: false,
  });

  const keyboardMap = [
    { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
    { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
    // { name: 'jump', keys: ['Space'] },
    { name: "pickup", keys: ["KeyE"] }, 
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

        <Physics debug={true}>
          <BaseEnviroment />

          {vrm && <PlayerVrm cameraControls={cameraControls} onLoadVRM={vrm} />}
        </Physics>
      </Canvas>
      <BaseInterface />
    </KeyboardControls>
  );
}

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