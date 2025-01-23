import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid, CameraControls } from "@react-three/drei";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";
import fragmentShader from "../../shaders/gameEffect/damage/fragment.glsl";
import { useControls } from "leva";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

function FlashMaterial() {
  const {isFlash} = useControls('Effect', {
    isFlash: false,
  })

  const flashMaterial = new CustomShaderMaterial({
    baseMaterial: THREE.MeshStandardMaterial,
    metalness: 0,
    roughness: 1.0,
    wireframe: false,
    fragmentShader: fragmentShader,
    uniforms: {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color('#ff0000') },
      uIsFlash: { value: false },
    },
  })

  useFrame(({clock}) => {
    flashMaterial.uniforms.uTime.value = clock.getElapsedTime();
    flashMaterial.uniforms.uIsFlash.value = isFlash;
  })

  return (
    <mesh material={flashMaterial}>
      <icosahedronGeometry args={[1, 8]} />
      {/* <meshStandardMaterial color="red" /> */}
    </mesh>
  );
}

export default function EffectTest() {
  return (
    <Canvas
      camera={{
        fov: 50,
        near: 0.1,
        far: 200,
        position: [4, 4, -4],
      }}
      gl={{
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
      style={{
        background: '#000000'
      }}
    >
      <directionalLight
        castShadow
        position={ [ 4, 4, 1 ] }
        intensity={ 1.5 }
        shadow-mapSize={ [ 1024, 1024 ] }
        shadow-camera-near={ 1 }
        shadow-camera-far={ 10 }
        shadow-camera-top={ 10 }
        shadow-camera-right={ 10 }
        shadow-camera-bottom={ - 10 }
        shadow-camera-left={ - 10 }
      />
      <CameraControls makeDefault />

      <EffectComposer>
        <Bloom intensity={0.5} mipmapBlur={true} radius={0.6}/>
      </EffectComposer>

      <FlashMaterial />

      <Grid args={[30, 30]} position={[0, -1, 0]} />
    </Canvas>
  );
}
