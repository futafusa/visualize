import * as THREE from "three";
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber";
import { CameraControls, useTexture } from "@react-three/drei";
import { EffectComposer, Bloom, Pixelation, Sepia } from "@react-three/postprocessing";
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
  const { normalEdgeStrength, depthEdgeStrength, pixelSize, sepia } = useControls('CustomEffectEdge', {
    normalEdgeStrength: {value: 1.0, min: 0.0, max: 20.0, step: 0.1},
    depthEdgeStrength: {value: 0.5, min: 0.0, max: 10.0, step: 0.1},
    pixelSize: {value: 8, min: 0, max: 32, step: 1},
    sepia: {value: 0.3, min: 0.0, max: 1.0, step: 0.1},
  })

  return (
    <>
      <CameraControls />

      <EffectComposer>
        <CustomEffectEdge
          normalEdgeStrength={normalEdgeStrength}
          depthEdgeStrength={depthEdgeStrength}
        />
        <Pixelation granularity={pixelSize} />
        <Sepia intensity={sepia} />
      </EffectComposer>
    
      {/* LIGHT */}
      <ambientLight intensity={1} />
      <directionalLight position={[1, 1, 1]} intensity={2} castShadow />

      {/* OBJECTS */}
      <Objects />
    </>
  )
}

function Objects(props: any) {
  const refObject = useRef<THREE.Mesh>(null)!;
  const texFloor = useTexture('/images/textures/tile64.png')

  useFrame(() => {
    if (!refObject.current) return;
    refObject.current.rotation.y += 0.01
    refObject.current.rotation.z += 0.01
    refObject.current.position.y = 1 + Math.sin(refObject.current!.rotation.y) * 0.5
  })

  return (
   <>
    <mesh ref={refObject} position={[1, 1, 0]} castShadow>
      <icosahedronGeometry args={[0.5, 0]} /> 
      <meshPhongMaterial color={'#ff0000'} specular={'#ffffff'} shininess={100} />
    </mesh>
    <mesh position={[-1, 0.5, 0]} castShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshPhongMaterial color={'#0000ff'} specular={'#ffffff'} shininess={100} />
    </mesh>

    {/* FLOOR */}
    <mesh position={[0, -0, 0]} rotation-x={-Math.PI / 2} castShadow receiveShadow>
      <planeGeometry args={[5, 5]} />
      <meshPhongMaterial color={'#ffffff'} map={texFloor} />
    </mesh>
   </>
  )
}
