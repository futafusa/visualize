import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { CameraControls, Environment, Grid } from "@react-three/drei";
import { useControls } from "leva";
import { Perf } from "r3f-perf";
import { useStore } from '../../stores/UseStore';
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

import wobbleVertexShader from "../../shaders/wobble/vertex.glsl";
import wobbleFragmentShader from "../../shaders/wobble/fragment.glsl";

function Wobble() {
  const { matMetalness, matRoughness, matColor, matTransmission, matIor, matThickness } = useControls('Basic Material Parameters', {
    matMetalness: { value: 1, min: 0, max: 1, step: 0.001 },
    matRoughness: { value: 0, min: 0, max: 1, step: 0.001 },
    matColor: { value: '#ffffff' },
    matTransmission: { value: 0, min: 0, max: 1, step: 0.001 },
    matIor: { value: 1.5, min: 0, max: 2, step: 0.001 },
    matThickness: { value: 1.5, min: 0, max: 2, step: 0.001 },
  })
  const { uPositionFrequency, uTimeFrequency, uStrength } = useControls('Base Wobble Parameters', {
    uPositionFrequency: {
      value: 0.5,
      min: 0,
      max: 2,
      step: 0.001,
    },
    uTimeFrequency: {
      value: 0.5,
      min: 0,
      max: 2,
      step: 0.001,
    },
    uStrength: {
      value: 0.5,
      min: 0,
      max: 2,
      step: 0.001,
    },
  })
  const { uWarpPositionFrequency, uWarpTimeFrequency, uWarpStrength } = useControls('Time Warp Parameters', {
    uWarpPositionFrequency: {
      value: 0.28,
      min: 0,
      max: 2,
      step: 0.001,
    },
    uWarpTimeFrequency: {
      value: 0.12,
      min: 0,
      max: 2,
      step: 0.001,
    },
    uWarpStrength: {
      value: 1.7,
      min: 0,
      max: 2,
      step: 0.001,
    },
  })
  const { colorA, colorB } = useControls('Color Parameters', {
    colorA: { value: '#009fff' },
    colorB: { value: '#00ff79' },
  })

  const uniforms = {
    uTime: { value: 0 },
    uPositionFrequency: { value: uPositionFrequency },
    uTimeFrequency: { value: uTimeFrequency },
    uStrength: { value: uStrength },
    uWarpPositionFrequency: { value: uWarpPositionFrequency },
    uWarpTimeFrequency: { value: uWarpTimeFrequency },
    uWarpStrength: { value: uWarpStrength },
    uColorA: { value: new THREE.Color(colorA) },
    uColorB: { value: new THREE.Color(colorB) },
  }

  const material = new CustomShaderMaterial({
    baseMaterial: THREE.MeshPhysicalMaterial,
    vertexShader: wobbleVertexShader,
    fragmentShader: wobbleFragmentShader,
    metalness: matMetalness,
    roughness: matRoughness,
    color: new THREE.Color(matColor),
    transmission: matTransmission,
    ior: matIor,
    thickness: matThickness,
    transparent: true,
    wireframe: false,
    uniforms: uniforms,
  })

  const depthMaterial = new CustomShaderMaterial({
    baseMaterial: THREE.MeshDepthMaterial,
    vertexShader: wobbleVertexShader,
    depthPacking: THREE.RGBADepthPacking,
    uniforms: uniforms,
  })

  const refObject = useRef<THREE.Mesh>(null);

  // Global State
  const audioArrayData = useStore((state) => state.audioArrayData);

  useFrame((state, delta) => {
    uniforms.uTime.value += delta;

    if(audioArrayData) {
      // console.log(audioArrayData);
      const audioLevel = Math.pow(audioArrayData[3] / 255, 5);
      uniforms.uWarpTimeFrequency.value = audioLevel * 2;
      uniforms.uWarpStrength.value = audioLevel * 10;
    }
  })

  useEffect(() => {
    if (refObject.current) {
      refObject.current.geometry = mergeVertices(refObject.current.geometry);
      refObject.current.geometry.computeTangents();
      // console.log(refObject.current.geometry.attributes);
    }
  }, [refObject.current]);

  return (
    <>
      {/* <Light /> */}
      <CameraControls makeDefault />

      <Environment preset="sunset" background={false} />

      <mesh ref={refObject} position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow={true} material={material} customDepthMaterial={depthMaterial}>
        {/* <planeGeometry args={[4, 4, 200, 200]} /> */}
        <icosahedronGeometry args={[2.5, 50]} />
        {/* <sphereGeometry args={[2.5, 30, 30]} /> */}
        {/* <torusKnotGeometry args={[2.5, 0.5, 100, 16]} /> */}
      </mesh>

      <Grid position={[0, -3, 0]}  infiniteGrid={true} fadeDistance={20} />
    </>
  )
}

export default function wobble() {
  const { perfVisible } = useControls({
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
        <Wobble />
      </Canvas>
    </>
  )
}