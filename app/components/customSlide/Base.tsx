import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useSpring } from "motion/react";
import { useEffect, useRef } from "react";

import ImageSlider from "./ImageSlider";
import { Slider } from "./Slider";
import { useSlider } from "./useSlider";
import { CameraControls } from "@react-three/drei";
import { useControls } from "leva";

export default function Base() {
  const { enableControls } = useControls('DEBUG', {
    enableControls: false
  });
  return (
    <>
      <Slider />
      <Canvas
        camera={{ position: [0, 0, 5], fov: 30 }}
        gl={{ toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0 }}
        style={{
          // background: "#201d24",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {enableControls && <CameraControls />}
        <AnimatedBackground />
        <ImageSlider />
      </Canvas>
    </>
  );
}

function AnimatedBackground() {
  const bgColor = useRef<any>(null);
  const { currentIndex, items } = useSlider();
  
  // 色をRGB成分に分解してアニメーションさせる
  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 0, g: 0, b: 0 };
  };
  
  const initialColor = hexToRgb(items[currentIndex].color);
  const r = useSpring(initialColor.r);
  const g = useSpring(initialColor.g);
  const b = useSpring(initialColor.b);

  useEffect(() => {
    const targetColor = hexToRgb(items[currentIndex].color);
    r.set(targetColor.r);
    g.set(targetColor.g);
    b.set(targetColor.b);
  }, [currentIndex]);

  useFrame(() => {
    if(bgColor.current) {
      bgColor.current.setRGB(r.get(), g.get(), b.get());
    }
  });

  return <color attach="background" args={[initialColor.r, initialColor.g, initialColor.b]} ref={bgColor} />;
}