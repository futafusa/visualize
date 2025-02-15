import * as THREE from "three";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { CameraControls, shaderMaterial, useFBO } from "@react-three/drei";
import { useControls } from "leva";
import { useRef, useMemo } from "react";

export default function Base() {
  return (
    <Canvas
      shadows
      camera={{ fov: 20, near: 0.1, far: 200, position: [-10, 10, 15] }}
      gl={{toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.0}}
      style={{background: '#444444'}}
    >
      <Scene />
    </Canvas>
  );
}

function Scene() {
  const mainRenderTarget = useFBO({depth: true});
  const normalRenderTarget = useFBO();
  const normalMaterial = useMemo(() => new THREE.MeshNormalMaterial(), []);

  useFrame((state) => {
    const { gl, scene, camera } = state;

    // シーンをmainRenderTargetに描画（depthMapも同時に作成）
    gl.setRenderTarget(mainRenderTarget);
    gl.render(scene, camera);
    
    // renderTargetに対してnormalMaterialを適用して描画
    const overrideMaterial = scene.overrideMaterial; // デフォルトのmaterialを保存
    gl.setRenderTarget(normalRenderTarget); // renderTargetを変更
    scene.overrideMaterial = normalMaterial; // normalMaterialを適用
    gl.render(scene, camera); // postprocess用のrenderTargetに描画

     // マテリアルを元に戻してデフォルトのrenderTargetに描画
     scene.overrideMaterial = overrideMaterial; 
     gl.setRenderTarget(null);
  })
  return (
    <>
      <CameraControls />
    
      {/* LIGHT */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[1, 1, 1]} intensity={2} castShadow />

      {/* OBJECTS */}
      <Fuwafuwa position={[1, 1, 0]} />
      <mesh position={[-1, 0.45, 0]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={'#0000ff'} roughness={0.5} metalness={0} flatShading />
      </mesh>
      <mesh position={[0, -0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[5, 0.1, 5]} />
        <meshStandardMaterial color={'#ffffff'} roughness={0.5} metalness={0} />
      </mesh>

      <mesh position={[2, 1, -2]}>
        <planeGeometry args={[4, 2]} />
        <meshBasicMaterial color={'#ffffff'} map={normalRenderTarget.texture} />
      </mesh>

      <mesh position={[-2, 1, -2]}>
        <planeGeometry args={[4, 2]} />
        <shaderMaterial
          uniforms={{
            depthTexture: { value: mainRenderTarget.depthTexture }
          }}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform sampler2D depthTexture;
            varying vec2 vUv;

            float getLinearDepth(float depth) {
              float near = 0.01;  // カメラのnear値に合わせる
              float far = 10.0; // カメラのfar値に合わせる
              return near * far / (far + near - depth * (far - near));
            }

            void main() {
              float depth = texture2D(depthTexture, vUv).r;
              depth = getLinearDepth(depth);
              gl_FragColor = vec4(vec3(1.0 - depth), 1.0);
            }
          `}
        />
      </mesh>
    </>
  )
}

function Fuwafuwa(props: any) {
  const refObject = useRef<THREE.Mesh>(null)!;

  useFrame(() => {
    refObject.current!.rotation.y += 0.01
    refObject.current!.rotation.z += 0.01
    refObject.current!.position.y = props.position[1] + Math.sin(refObject.current!.rotation.y) * 0.5
  })

  return (
   <>
    <mesh ref={refObject} {...props} castShadow>
      <coneGeometry args={[0.5, 0.7, 4]} />
      <meshStandardMaterial color={'#ff0000'} roughness={0.5} metalness={0} flatShading />
    </mesh>
   </>
  )
}
