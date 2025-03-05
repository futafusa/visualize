import * as THREE from "three";
import { Canvas } from "@react-three/fiber";

import SliderImage from "./sliderImage";
import SliderInterface from "./sliderInterface";
import { CameraControls } from "@react-three/drei";

export default function Base() {
  return (
    <>
      <SliderInterface />
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <color attach="background" args={["#1d241f"]} />
        <CameraControls />
        <SliderImage />
      </Canvas>
    </>
  );
}

