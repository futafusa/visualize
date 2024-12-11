import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { useControls } from "leva";
import pattern01VertexShader from "../../shaders/pattern01/vertex.glsl";
import pattern01FragmentShader from "../../shaders/pattern01/fragment.glsl";
import { Perf } from "r3f-perf";

function ShaderPattern() {
  const { testParam } = useControls('Test', {
    testParam: {
      value: 0.0,
      min: -1.0,
      max: 1.0,
      step: 0.01,
    }
  })

  const pattern01 = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
      testParam: { value: testParam },
    },
    vertexShader: pattern01VertexShader,
    fragmentShader: pattern01FragmentShader
  });

  useFrame((_, delta) => {
    pattern01.uniforms.uTime.value += delta;
  })  

  return (
    <mesh position={[0, 0.01, 0]} rotation-x={-Math.PI * 0.5} material={pattern01}>
      <planeGeometry args={[1.6, 0.9, 512, 512]}/>
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
          position: [0, 3, 0],
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
        <CameraControls makeDefault />
        <ShaderPattern />
      </Canvas>
    </>
  );
}
