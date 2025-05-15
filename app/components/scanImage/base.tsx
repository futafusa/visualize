import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { useState, useRef } from "react";

import SliderImage from "./sliderImage";  
import SliderInterface from "./sliderInterface";
import { CameraControls, Grid } from "@react-three/drei";
import { useControls, button } from "leva";
import { Perf } from "r3f-perf";
import { useSliderStore } from "./sliderStore";

export default function Base() {
  const [perfVisible, setPerfVisible] = useState(false);
  const cameraControlsRef = useRef<CameraControls>(null);
  const { nextSlide } = useSliderStore();

  // useControls('Debug', {
  //   perfVisible: {
  //     value: perfVisible,
  //     onChange: (v) => setPerfVisible(v)
  //   },
  //   nextSlide: button(() => {
  //     nextSlide();
  //   }),
  //   resetCamera: button(() => {
  //     if (cameraControlsRef.current) {
  //       cameraControlsRef.current.setLookAt(0, 0, 11.5, 0, 0, 0, true);
  //     }
  //   })
  // });

  return (
    <>
      {/* <SliderInterface /> */}
      <Canvas
        camera={{ position: [0, 0, 11.5], fov: 50 }}
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

        <CameraControls ref={cameraControlsRef} />
        <SliderImage />
      </Canvas>
    </>
  );
}

