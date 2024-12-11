import { useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { CameraControls, Grid, Environment, Lightformer } from "@react-three/drei";
import { RigidBody, Physics, RapierRigidBody, BallCollider } from "@react-three/rapier";
import { EffectComposer, Bloom, N8AO } from "@react-three/postprocessing";
import AudioInput from "../../components/common/AudioInput";
import { useStore } from "../../stores/UseStore";

import { useControls } from "leva";
import { Perf } from "r3f-perf";

function Pointer({ vec = new THREE.Vector3(0, 0, 0) }) {
  const audioArrayData = useStore((state) => state.audioArrayData);
  const refPointer = useRef<RapierRigidBody>(null);

  useFrame(({ clock }) => {
    if(!refPointer.current || !audioArrayData) return;

    const audioLavel = Math.pow(audioArrayData[3] / 255, 4) * 4;
    refPointer.current.setNextKinematicTranslation(
      vec.set(Math.sin(clock.getElapsedTime() *10) * audioLavel, 0, 0)
    );
  });

  return (
    <RigidBody ref={refPointer} type="kinematicPosition" colliders={false}>
      <BallCollider args={[0.1]} scale={2} />
    </RigidBody>
  )
}

function Ball({
  position = new THREE.Vector3(0, 0, 0),
  scale = 0.2,
  vec = new THREE.Vector3(0, 0, 0),
  color = new THREE.Color(0, 0, 1.0)
}) {
  const refBall = useRef<RapierRigidBody>(null);

  useFrame(({ clock }) => {
    if(!refBall.current) return;

    // vec.copy(～.translation())で現在位置を取得＆コピーして、negate()（ベクトル反転）することで中心に向かうベクトルに変換
    // multiplyScalar()でベクトルの大きさを調整、applyImpulse()でベクトルを適用
    refBall.current?.applyImpulse(vec.copy(refBall.current.translation()).negate().multiplyScalar(0.01), false);
  });

  return (
    <RigidBody
      ref={refBall}
      position={position}
      scale={scale}
      colliders="ball"
      linearDamping={2}
      angularDamping={1}
      friction={0.1}
      restitution={0.2}
    >
      <mesh receiveShadow castShadow>
        <sphereGeometry args={[scale, 32, 32]} />
        <meshStandardMaterial color={color} metalness={0} roughness={0.2} />
      </mesh>
    </RigidBody>
  )
}

export default function BallAttract() {
  const { perfVisible } = useControls('Performance', {
    perfVisible: false
  });

  return (
    <>
      <AudioInput />
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [2, 2, -2],
        }}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        style={{
          background: '#000000'
        }}
        >
        {perfVisible && <Perf position="bottom-right" />}
        <CameraControls makeDefault />

        {/* Lighing */}
        <ambientLight intensity={1} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        {/* <Environment resolution={256}>
          <group rotation={[-Math.PI / 3, 0, 1]}>
            <Lightformer form="circle" intensity={100} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={2} />
            <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={2} />
            <Lightformer form="circle" intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={2} />
            <Lightformer form="circle" intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={8} />
            <Lightformer form="ring" color="#ffffff" intensity={40} onUpdate={(self) => self.lookAt(0, 0, 0)} position={[20, 20, 0]} scale={10} />
          </group>
        </Environment> */}

        {/* Postprocessing */}
        <EffectComposer enableNormalPass multisampling={8}>
          {/* <Bloom intensity={0.2} mipmapBlur={true} /> */}
          <N8AO distanceFalloff={1} aoRadius={1} intensity={4} />
        </EffectComposer>

        <Physics debug={true} gravity={[0, 0, 0]}>
          <Pointer />
          {Array.from({ length: 50 }, (_, index) => (
            <Ball
              key={index}
              position={new THREE.Vector3(Math.random()-0.5 * 2, (Math.random()-0.5) * 2, (Math.random()-0.5) * 2)}
              scale={Math.random() * 0.2 + 0.25}
              vec={new THREE.Vector3(Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25, Math.random() * 0.5 - 0.25)}
              color={new THREE.Color(`hsl(0, 100%, ${Math.random() > 0.2 ? 100 : 0}%)`)}
            />
          ))}
        </Physics>
        {/* <Grid position={[0, 0, 0]} infiniteGrid={true} fadeDistance={20} /> */}
      </Canvas>
    </>
  );
}
