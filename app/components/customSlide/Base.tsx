import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { motion } from "motion/react";

import ImageSlider from "./ImageSlider";
import { Slider } from "./Slider";

export default function Base() {
  return (
    <>
      <Slider />
      <Canvas
        camera={{ position: [0, 0, 5], fov: 30 }}
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
        <ImageSlider />
      </Canvas>
    </>
  );
}
