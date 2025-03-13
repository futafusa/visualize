import * as THREE from "three";
import { useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { CameraControls, Grid } from "@react-three/drei";

import MainScene from "./MainScene";

export default function Base() {
  return (
    <>
      <Canvas
        camera={{ position: [8, 6, 8], fov: 50 }}
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
        <ambientLight intensity={0.5} />
        <directionalLight position={[0.8, 2, 1]} intensity={1} />
        <CameraControls />

        <MainScene />
        <Grid args={[10, 10]} />
      </Canvas>
    </>
  );
}
