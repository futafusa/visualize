import * as THREE from "three";
import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import { CameraControls, Environment, Grid } from "@react-three/drei";
import { useControls } from "leva";
import vertexShader from "../../shaders/wobble/vertex.glsl";
import fragmentShader from "../../shaders/wobble/fragment.glsl";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

function CustomShaderObject() {
  const {metalness, roughness, color, transmission, ior, thickness, transparent, wireframe} = useControls('Material', {
    metalness: {value: 0, min: 0, max: 1, step: 0.01},
    roughness: {value: 0.5, min: 0, max: 1, step: 0.01},
    color: '#ffffff',
    transmission: {value: 0, min: 0, max: 1, step: 0.01},
    ior: {value: 1.5, min: 0, max: 10, step: 0.01},
    thickness: {value: 1.5, min: 0, max: 10, step: 0.01},
    wireframe: false
  })

  const refObject = useRef<THREE.Mesh>(null);

  const uniforms = {
    uTime: { value: 0 },
  }
  const customShaderMaterial = new CustomShaderMaterial({
    baseMaterial: THREE.MeshPhysicalMaterial,
    metalness: metalness,
    roughness: roughness,
    color: color,
    transmission: transmission,
    ior: ior,
    thickness: thickness,
    wireframe: wireframe,
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });

  useEffect(() => {
    if (refObject.current) {
      refObject.current.geometry = mergeVertices(refObject.current.geometry);
      refObject.current.geometry.computeTangents();
      console.log(refObject.current.geometry);
    }
  }, [refObject.current]);

  useFrame(({clock}) => {
    uniforms.uTime.value = clock.getElapsedTime();
  })

  return (
    <mesh ref={refObject} material={customShaderMaterial}>
      <icosahedronGeometry args={[1, 32]} />
      {/* <planeGeometry args={[2, 2, 32, 32]} /> */}
      {/* <sphereGeometry args={[1, 64, 64]} /> */}
      {/* <meshBasicMaterial color="red" side={THREE.DoubleSide} /> */}
    </mesh>
  )
}

export default function SampleCustomShader() {
  return (
    <>
      <Canvas
        shadows
        camera={{fov: 45, near: 0.1, far: 200, position: [2, 2, 2]}}
        style={{background: '#434343'}}
        gl={{toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0}}
      >
        <CameraControls makeDefault />

        <Environment preset="sunset" />
        <CustomShaderObject />

        <Grid position={[0, -2, 0]}  infiniteGrid={true} fadeDistance={20} />
        </Canvas>
    </>
  );
}
