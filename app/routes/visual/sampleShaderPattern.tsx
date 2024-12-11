import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { CameraControls, ScrollControls, useTexture, useScroll } from "@react-three/drei";
import { useControls } from "leva";
import VertexShader from "../../shaders/patternStudy/vertex.glsl";
import FragmentShader from "../../shaders/patternStudy/fragment.glsl";
import { Perf } from "r3f-perf";

function ShaderPattern() {
  const { testParam } = useControls('Test', {
    testParam: {
      value: 0.0,
      min: 0.0,
      max: 1.0,
      step: 0.01,
    }
  })

  const texture1 = useTexture('/images/sample1.png');
  const texture2 = useTexture('/images/sample2.png');
  // console.log(texture);
  
  const pattern01 = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
      testParam: { value: testParam },
      uTexture1: { value: texture1 },
      uTexture2: { value: texture2 },
      uImageAspect: { value: texture1.image.width / texture1.image.height },
      uPlaneAspect: { value: 1.6 / 0.9 },
    },
    vertexShader: VertexShader,
    fragmentShader: FragmentShader
  });


  useFrame((_, delta) => {
    // pattern01.uniforms.testParam.value = scroll.offset;
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
