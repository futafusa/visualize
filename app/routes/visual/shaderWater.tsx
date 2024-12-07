import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { useControls } from "leva";
import waterVertexShader from "../../shaders/water/vertex.glsl";
import waterFragmentShader from "../../shaders/water/fragment.glsl";
import { Perf } from "r3f-perf";

function Water() {
  const { uBigWavesElevation, uBigWavesFrequency, uBigWavesSpeed } = useControls({
    uBigWavesElevation: {
      value: 0.2,
      min: 0,
      max: 1,
      step: 0.01
    },
    uBigWavesFrequency: { 
      value: { x: 4, y: 1.5 },
    },
    uBigWavesSpeed: {
      value: 0.75,
      min: 0,
      max: 4,
      step: 0.01
    },
  })
  const { uDepthColor, uSurfaceColor, uColorOffset, uColorMultiplier } = useControls({
    uDepthColor: '#00ffd9',
    uSurfaceColor: '#de6f6f',
    uColorOffset: {
      value: 0.25,
      min: 0,
      max: 1,
      step: 0.001
    },
    uColorMultiplier: {
      value: 2.0,
      min: 0,
      max: 10,
      step: 0.001
    },
  })
  const { uSmallWavesElevation, uSmallWavesFrequency, uSmallWavesSpeed, uSmallIterations } = useControls({
    uSmallWavesElevation: { 
      value: 0.15,
      min: 0,
      max: 1,
      step: 0.001
    },
    uSmallWavesFrequency: {
      value: 3.0,
      min: 0,
      max: 30,
      step: 0.001
    },
    uSmallWavesSpeed: {
      value: 0.2,
      min: 0,
      max: 4,
      step: 0.001
    },
    uSmallIterations: {
      value: 4.0,
      min: 0,
      max: 10,
      step: 1
    },
  })

  const waterShader = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uBigWavesElevation: { value: uBigWavesElevation },
      uBigWavesFrequency: { value: uBigWavesFrequency },
      uBigWavesSpeed: { value: uBigWavesSpeed },
      uDepthColor: { value: new THREE.Color(uDepthColor) },
      uSurfaceColor: { value: new THREE.Color(uSurfaceColor) },
      uColorOffset: { value: uColorOffset },
      uColorMultiplier: { value: uColorMultiplier },
      uSmallWavesElevation: { value: uSmallWavesElevation },
      uSmallWavesFrequency: { value: uSmallWavesFrequency },
      uSmallWavesSpeed: { value: uSmallWavesSpeed },
      uSmallIterations: { value: uSmallIterations },
    },
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader
  });

  useFrame((_, delta) => {
    waterShader.uniforms.uTime.value += delta;
  })

  return (
    <mesh position={[0, 0.01, 0]} rotation-x={-Math.PI * 0.5} material={waterShader}>
      <planeGeometry args={[2, 2, 512, 512]}/>
    </mesh>
  )
}

export default function shaderWater() {
  const { perfVisible }= useControls('Performance',{
    perfVisible: false,
  })

  return (
    <>
     <Canvas
        shadows
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [2, 2, -2],
        }}
        style={{
          background: '#000000'
        }}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
      >
        {perfVisible && <Perf position="bottom-right" />}
        <CameraControls makeDefault />
        <Water />
      </Canvas>
    </>
  );
}
