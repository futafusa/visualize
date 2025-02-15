import * as THREE from "three";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { CameraControls, useTexture } from "@react-three/drei";
import { EffectComposer, Bloom, Pixelation } from "@react-three/postprocessing";
import { useControls } from "leva";
import { useRef } from "react";
import { CustomEffectEdge } from "./CustomEffectEdge";
import { Perf } from "r3f-perf";

export default function Base() {
  const { isPerf } = useControls('Debug', {
    isPerf: false
  })
  return (
    <Canvas
      shadows
      camera={{ fov: 20, near: 0.1, far: 200, position: [-10, 10, 15] }}
      gl={{toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0}}
      style={{background: '#444444'}}
    >
      <Scene />
      {isPerf && <Perf position="bottom-right" />}
    </Canvas>
  );
}

function Scene() {
  const { normalEdgeStrength, depthEdgeStrength, pixelSize } = useControls('CustomEffectEdge', {
    normalEdgeStrength: {value: 1.0, min: 0.0, max: 20.0, step: 0.1},
    depthEdgeStrength: {value: 0.5, min: 0.0, max: 10.0, step: 0.1},
    pixelSize: {value: 8, min: 0, max: 32, step: 1},
  })

  const texFloor = useTexture('/images/textures/tile64.png')

  return (
    <>
      <CameraControls />

      <EffectComposer>
        <CustomEffectEdge normalEdgeStrength={normalEdgeStrength} depthEdgeStrength={depthEdgeStrength} />
        <Pixelation granularity={pixelSize} />
      </EffectComposer>
    
      {/* LIGHT */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[1, 1, 1]} intensity={2} castShadow />

      {/* OBJECTS */}
      <Fuwafuwa position={[1, 1, 0]} />
      <mesh position={[-1, 0.5, 0]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={'#0000ff'} roughness={0.5} metalness={0} flatShading />
      </mesh>
      <mesh position={[0, -0, 0]} rotation-x={-Math.PI / 2} castShadow receiveShadow>
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial color={'#ffffff'} roughness={0.5} metalness={0} map={texFloor} />
      </mesh>
    </>
  )
}

function Fuwafuwa(props: any) {
  const refObject = useRef<THREE.Mesh>(null)!;

  useFrame(() => {
    refObject.current!.rotation.y += 0.01
    refObject.current!.rotation.z += 0.01
    refObject.current!.position.y = props.position[1] + Math.sin(refObject.current!.rotation.y) * 0.5
  })

  return (
   <>
    <mesh ref={refObject} {...props} castShadow>
      <coneGeometry args={[0.5, 0.7, 4]} />
      <meshStandardMaterial color={'#ff0000'} roughness={0.5} metalness={0} flatShading />
    </mesh>
   </>
  )
}
