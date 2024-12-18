import * as THREE from "three";
import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { CameraControls, useTexture, shaderMaterial } from "@react-three/drei";
import { useControls } from "leva";
import VertexShader from "../../shaders/studyGLSL/type1/vertex.glsl";
import FragmentShader from "../../shaders/studyGLSL/type1/fragment.glsl";
import VertexShader2 from "../../shaders/studyGLSL/type2/vertex.glsl";
import FragmentShader2 from "../../shaders/studyGLSL/type2/fragment.glsl";
import VertexShader3 from "../../shaders/studyGLSL/type3/vertex.glsl";
import FragmentShader3 from "../../shaders/studyGLSL/type3/fragment.glsl";
import { Perf } from "r3f-perf";

function ShaderPattern() {
  const SHADER_MAPPING = {
    studyGLSL: {
      vertex: VertexShader,
      fragment: FragmentShader
    },
    studyGLSL2: {
      vertex: VertexShader2,
      fragment: FragmentShader2
    },
    studyGLSL3: {
      vertex: VertexShader3,
      fragment: FragmentShader3
    }
  }

  const { selectShader } = useControls('Shader', {
    selectShader: {
      options: Object.keys(SHADER_MAPPING),
    },
  })

  const customShaderMaterial = useMemo(() => {
    const shaders = SHADER_MAPPING[selectShader as keyof typeof SHADER_MAPPING];
    
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 },
      },
      vertexShader: shaders.vertex,
      fragmentShader: shaders.fragment,
    })
  }, [selectShader])

  useFrame((_, delta) => {
    customShaderMaterial.uniforms.uTime.value += delta;
  })

  return (
    <mesh rotation-x={-Math.PI * 0.5} material={customShaderMaterial}>
      <planeGeometry args={[1.0, 1.0, 512, 512]}/>
    </mesh>
  )
}

export default function StudyGlsl() {
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
        {perfVisible && <Perf position="bottom-right" />}
        <CameraControls makeDefault />
        <ShaderPattern />
      </Canvas>
    </>
  );
}
