import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { CameraControls, useTexture, shaderMaterial } from "@react-three/drei";
import { useControls } from "leva";
import VertexShader from "../../shaders/patternNoise/vertex.glsl";
import FragmentShader from "../../shaders/patternNoise/fragment.glsl";
import { Perf } from "r3f-perf";

function ShaderPattern() {
  const { uSpeed, uScale, uMultiplier, uDepthColor, uSurfaceColor, uColorOffset } = useControls('Test', {
    uSpeed: {
      value: 0.5,
      min: 0.0,
      max: 2.0,
      step: 0.01,
    },
    uScale: {
      value: 2.0,
      min: 0.0,
      max: 10.0,
      step: 0.01,
    },
    uMultiplier: {
      value: 1.0,
      min: 0.0,
      max: 2.0,
      step: 0.01,
    },
    uDepthColor: {
      value: '#d890de',
    },
    uSurfaceColor: {
      value: '#0000FF',
    },
    uColorOffset: {
      value: 0.25,
      min: 0.0,
      max: 1.0,
      step: 0.01,
    },
  })

  const customShaderMaterial = useMemo(() => 
    new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
        uSpeed: { value: uSpeed },
        uScale: { value: uScale },
        uMultiplier: { value: uMultiplier },
        uDepthColor: { value: new THREE.Color(uDepthColor) },
        uSurfaceColor: { value: new THREE.Color(uSurfaceColor) },
      },
      vertexShader: VertexShader,
      fragmentShader: FragmentShader,
    }),[uSpeed, uScale, uMultiplier, uDepthColor, uSurfaceColor, uColorOffset]
  );

  useFrame((_, delta) => {
    customShaderMaterial.uniforms.uTime.value += delta;
  })

  return (
    <mesh rotation-x={-Math.PI * 0.5} material={customShaderMaterial}>
      <planeGeometry args={[1.0, 1.0, 512, 512]}/>
    </mesh>
  )
}

export default function SampleShaderPattern() {
  // const { perfVisible }= useControls('Performance',{
  //   perfVisible: false,
  // })

  return (
    <>
     <Canvas
        shadows
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [0, 1.5, 0],
        }}
        style={{
          background: '#434343'
        }}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
      >
        {/* {perfVisible && <Perf position="bottom-right" />} */}
        {/* <CameraControls makeDefault /> */}
        <ShaderPattern />
      </Canvas>
    </>
  );
}
