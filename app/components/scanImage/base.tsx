import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { useState, useRef } from "react";

import SliderImage from "./sliderImage";
import SliderInterface from "./sliderInterface";
import { Grid, KeyboardControls } from "@react-three/drei";
import { useControls, button } from "leva";
import { Perf } from "r3f-perf";
import { useSliderStore } from "./sliderStore";

export default function Base() {
  const [perfVisible, setPerfVisible] = useState(false);

  useControls('Debug', {
    perfVisible: {
      value: perfVisible,
      onChange: (v) => setPerfVisible(v)
    },
  });

  const keyboardMap = [
    { name: "resetCamera", keys: ["r"] },
  ]

  return (
    <>
      <KeyboardControls
        map={keyboardMap}
      >
        {/* <SliderInterface /> */}
        <Canvas
          camera={{ position: [0, 0, 15], fov: 50 }}
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
          {perfVisible && <Perf position="bottom-right" />}

          <SliderImage />
        </Canvas>
      </KeyboardControls>
    </>
  );
}

