import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { CustomEffect } from "./CustomEffect";

export default function Base() {
  return (
    <Canvas
      shadows
      camera={{ fov: 20, near: 0.1, far: 200, position: [-10, 10, 15] }}
      gl={{toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0}}
      style={{background: '#000000'}}
    >
      <CameraControls />

      <EffectComposer>
        <Bloom intensity={0.5} mipmapBlur={true} radius={0.6}/>
        <CustomEffect />
      </EffectComposer>

      {/* LIGHT */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[1, 1, 1]} intensity={1} castShadow />
      
      {/* OBJECTS */}
      <mesh position={[1, 1.5, 0]} castShadow>
        <icosahedronGeometry args={[0.5, 1]} />
        <meshStandardMaterial color={'#ff0000'} roughness={0.5} metalness={0} flatShading />
      </mesh>
      <mesh position={[-1, 0.5, 0]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={'#0000ff'} roughness={0.5} metalness={0} flatShading />
      </mesh>
      <mesh position={[0, -0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 0.2, 5]} />
        <meshStandardMaterial color={'#ffffff'} roughness={0.5} metalness={0} />
      </mesh>
    </Canvas>
  );
}
