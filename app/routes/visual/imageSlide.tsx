import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { CameraControls, ScrollControls, useTexture, useScroll } from "@react-three/drei";
import { useControls } from "leva";
import slideImageVertexShader from "../../shaders/slideImage/vertex.glsl";
import slideImageFragmentShader from "../../shaders/slideImage/fragment.glsl";
import { Perf } from "r3f-perf";
import AudioInput from "../../components/common/AudioInput";
import { useStore } from "../../stores/UseStore";

function ShaderSlideImage() {
  const { testParam } = useControls('Test', {
    testParam: {
      value: 0.0,
      min: -0.2,
      max: 1.2,
      step: 0.01,
    }
  })

  const texture1 = useTexture('/images/sample1.png');
  const texture2 = useTexture('/images/sample2.png');
  // console.log(texture);

  // Global State
  const audioArrayData = useStore((state) => state.audioArrayData);

  const pattern01 = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0.0 },
      testParam: { value: testParam },
      uTexture1: { value: texture1 },
      uTexture2: { value: texture2 },
      uImageAspect: { value: texture1.image.width / texture1.image.height },
      uPlaneAspect: { value: 1.6 / 0.9 },
    },
    vertexShader: slideImageVertexShader,
    fragmentShader: slideImageFragmentShader
  });


  useFrame((_, delta) => {
    pattern01.uniforms.testParam.value = audioArrayData ? audioArrayData[2] / 255 : testParam;
  })

  return (
    <mesh position={[0, 0.01, 0]} rotation-x={-Math.PI * 0.5} material={pattern01}>
      <planeGeometry args={[1.6, 0.9, 512, 512]}/>
    </mesh>
  )
}

export default function ImageSlide() {
  const { perfVisible }= useControls('Performance',{
    perfVisible: false,
  })

  return (
    <>
      <AudioInput />
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
        <ShaderSlideImage />
      </Canvas>
    </>
  );
}
