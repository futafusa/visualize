import * as THREE from "three";
import { useState, useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { CameraControls, Grid } from "@react-three/drei";
import { useControls } from "leva";

import DefaultScene from "./DefaultScene";
import MainScene from "./MainScene";
import { useVRM } from "./useVRM";
import Character from "./Character";
import { Perf } from "r3f-perf";

export default function Base() {
  const cameraPos = {
    "default": [3, 3, 3, 0, 1, 0],
    "back": [0, 2, 3.5, 0, 1, 0],
    "front": [-2, 2, -3, 0, 1, 0],
    "side": [5, 2, 0, 0, 1, 0],
  }
  const refCamera = useRef<CameraControls>(null);

  const { cameraPosition } = useControls("Camera", {
    cameraPosition: {
      options: Object.keys(cameraPos),
      value: 'default'
    }
  });

  const {vrm, progress, loadVRM} = useVRM('/models/AliciaSolid.vrm');
  
  useEffect(() => {
    if (refCamera.current && vrm) {
      refCamera.current.setTarget(0, 1, 0);
    }
  }, [vrm]);

  useEffect(() => {
    if (refCamera.current) {
      const pos = cameraPos[cameraPosition as keyof typeof cameraPos];
      refCamera.current.setLookAt(pos[0], pos[1], pos[2], pos[3], pos[4], pos[5], true);
    }
  }, [cameraPosition]);

  return (
    <>
      <Canvas
        camera={{ position: [3, 3, 3], fov: 50 }}
        gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
        style={{
          background: "#201d24",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Perf position="bottom-right" />
        <ambientLight intensity={0.5} />
        <directionalLight position={[0.8, 2, 1]} intensity={1} />
        <CameraControls ref={refCamera} />

        {/* <DefaultScene /> */}
        <MainScene />
        {vrm && <Character onLoadVRM={vrm} />}

        {/* <Grid args={[10, 10]} /> */}
      </Canvas>
    </>
  );
}