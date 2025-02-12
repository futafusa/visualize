import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { CameraControls, useFBO } from "@react-three/drei";
import { EffectComposer, Bloom, Outline } from "@react-three/postprocessing";
import { CustomEffectSimple } from "./CustomEffectSimple";
import { CustomEffectPixelate } from "./CustomEffectPixelate";
import { CustomEffectEdge } from "./CustomEffectEdge";
import { useControls } from "leva";
import { useRef } from "react";

export default function Base() {
  return (
    <Canvas
      shadows
      camera={{ fov: 20, near: 0.1, far: 200, position: [-10, 10, 15] }}
      gl={{toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0}}
      style={{background: '#000000'}}
    >
      <Scene />
    </Canvas>
  );
}

function Scene() {
  const mainRenderTarget = useFBO();
  const refPlane = useRef<THREE.Mesh<THREE.PlaneGeometry, THREE.MeshBasicMaterial>>(null)!;

  useFrame((state) => {
    const { gl, scene, camera } = state;

    gl.setRenderTarget(mainRenderTarget);
    gl.render(scene, camera);

    if (refPlane.current) {
      refPlane.current.material.map = mainRenderTarget.texture;
    }

    gl.setRenderTarget(null);
  })

  return (
    <>
      <CameraControls />
      {/* <EffectComposer>
        <Bloom intensity={0.5} mipmapBlur={true} radius={0.6}/>
        <CustomEffectPixelate pixelSize={4} />
      </EffectComposer> */}

      {/* LIGHT */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[1, 1, 1]} intensity={1} castShadow />

      {/* OBJECTS */}
      <Fuwafuwa position={[1, 1, 0]} />
      <mesh position={[-1, 0.5, 0]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={'#0000ff'} roughness={0.5} metalness={0} flatShading />
      </mesh>
      <mesh position={[0, -0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 0.2, 5]} />
        <meshStandardMaterial color={'#ffffff'} roughness={0.5} metalness={0} />
      </mesh>

      <mesh ref={refPlane} position={[0, 1, 2]}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={'#ffffff'} />
      </mesh>
    </>
  )
}

function Fuwafuwa(props: any) {
  const refObject = useRef<THREE.Mesh>(null)!;

  useFrame(() => {
    refObject.current!.rotation.y += 0.01
    refObject.current!.position.y = props.position[1] + Math.sin(refObject.current!.rotation.y) * 0.5
  })

  return (
   <>
    <mesh ref={refObject} {...props}>
      <icosahedronGeometry args={[0.5, 1]} />
      <meshStandardMaterial color={'#ff0000'} roughness={0.5} metalness={0} flatShading />
    </mesh>
   </>
  )
}