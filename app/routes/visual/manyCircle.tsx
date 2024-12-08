import AudioInput from "../../components/common/AudioInput";
import * as THREE from "three";
import { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { CameraControls } from "@react-three/drei";
import { Perf } from "r3f-perf";
import { useControls } from "leva";
import { useStore } from "../../stores/UseStore";

// circle count
const circleCount = 64;

function Circle() {
  // Global State
  const audioArrayData = useStore((state) => state.audioArrayData);

  const refGroup = useRef<THREE.Group>(null);
  const [positions, setPositions] = useState<THREE.Vector3[]>();

  useEffect(() => {
    const positions = Array.from({ length: circleCount }).map((_, index) => {
      return new THREE.Vector3(0, 0, (index * 0.1) - 3.2);
    });
    setPositions(positions);

  }, []);
  
  useFrame((state, delta) => {
    if(!audioArrayData || !refGroup.current) return;
    
    refGroup.current?.children.forEach((self, index) => {
      const time = state.clock.elapsedTime;
      const audioNormalized = Math.pow(audioArrayData[index] / 255, 4);

      // self.position.y = Math.sin(self.position.z + time) * (audioNormalized * 2);
      // self.position.x = Math.cos(self.position.z + time) * (audioNormalized * 2);
      self.scale.set(audioNormalized * 2, audioNormalized * 2, audioNormalized * 2);

      self.position.z =  Math.cos(self.position.z + time * Math.random()* index) * (audioNormalized * 2);
    });

    refGroup.current.rotation.y += delta * 0.2;
  });

  return (
    <>
      <group ref={refGroup}>
        {Array.from({ length: circleCount }).map((_, index) => (
          <mesh position={positions?.[index]} key={index}>
            <torusGeometry args={[1, 0.005, 16, 128]} />
            <meshStandardMaterial
              color={`hsl(${index * 2.5}, 100%, 75%)`}
              emissive={`hsl(${index * 2.5}, 100%, 80%)`}
              emissiveIntensity={1}
            />
          </mesh>
        ))}
      </group>
    </>
  );
}

export default function ManyCircle() {
  const { perfVisible } = useControls('Performance', {
    perfVisible: false
  });

  return (
    <>
      <AudioInput FFT_SIZE={circleCount} />
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [0, 0, 1],
        }}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        style={{
          background: '#000000'
        }}
      >
        <ambientLight intensity={0.5} />
        <CameraControls makeDefault />
        {perfVisible && <Perf position="bottom-right" />}

        <EffectComposer>
          <Bloom intensity={1.0} mipmapBlur={true} />
        </EffectComposer>
        <Circle />
      </Canvas>
    </>
  );
}
