import * as THREE from "three";
import { useMemo, useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { CameraControls, useTexture } from "@react-three/drei";
import { useControls } from "leva";
import VertexShader from "../../shaders/particle/vertex.glsl";
import FragmentShader from "../../shaders/particle/fragment.glsl";

// bufferGeometryの基本
function CustomGeometry() {
  const refGeometry = useRef<THREE.BufferGeometry>(null);
  const verticesCount = 10 * 3;

  const positions = useMemo(() => {
    const positions = new Float32Array(verticesCount * 3);

    for(let i = 0; i < verticesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 3;
    }

    return positions;
  }, [verticesCount]);

  useEffect(() => {
    if(refGeometry.current) {
      refGeometry.current.computeVertexNormals();
    }
  }, [positions]);

  return (
    <mesh>
      <bufferGeometry ref={refGeometry}>
        <bufferAttribute 
          attach="attributes-position"
          count={verticesCount}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      {/* <meshBasicMaterial color="red" side={THREE.DoubleSide} /> */}
      <meshStandardMaterial color="red" side={THREE.DoubleSide} />
    </mesh>
  );
}

// mesh or points
function CustomGeometry2() {
  return (
    <points>
      <sphereGeometry args={[1, 32, 32]}  />
      <pointsMaterial color="red" size={0.02} sizeAttenuation={true} />
    </points>
  );
}

// パーティクル
function CustomGeometry3() {
  const verticesCount = 10000;
  const particleTexture = useTexture('/images/particles/9.png');
  const refGeometry = useRef<THREE.BufferGeometry>(null);

  const {positions, colors} = useMemo(() => {
    const positions = new Float32Array(verticesCount * 3);
    const colors = new Float32Array(verticesCount * 3);

    for(let i = 0; i < verticesCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
      colors[i] = Math.random();
    }

    return {positions, colors};
  }, [verticesCount]);

  useFrame(({clock}, delta) => {
    // if(refGeometry.current) {
    //   refGeometry.current.rotateY(delta/10);
    //   refGeometry.current.rotateX(delta/10);
    // }

    // if(refGeometry.current) {
    //   for(let i = 0; i < verticesCount; i++) {
    //     const i3 = i * 3;
    //     const x = refGeometry.current.attributes.position.array[i3 + 0];
    //     // const y = refGeometry.current.attributes.position.array[i3 + 1];
    //     // const z = refGeometry.current.attributes.position.array[i3 + 2];
    //     refGeometry.current.attributes.position.array[i3 + 1] = Math.sin(clock.getElapsedTime() + x);
    //   }
    //   refGeometry.current.attributes.position.needsUpdate = true;
    // }
  });

  return (
    <points>
      <bufferGeometry ref={refGeometry}>
        <bufferAttribute 
          attach="attributes-position"
          count={verticesCount}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      {/* <pointsMaterial 
        // color="red" 
        size={0.2} 
        sizeAttenuation={true} 
        map={particleTexture} 
        transparent={true}
        alphaMap={particleTexture}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        vertexColors={true}
      /> */}
      <shaderMaterial 
        vertexShader={VertexShader}
        fragmentShader={FragmentShader}
      />
    </points>
  );
}

function CustomGeometry4() {
  const {particleSize} = useControls({
    particleSize: {
      value: 0.02, 
      min: 0.001, 
      max: 0.1, 
      step: 0.001
    }
  });

  const particleCount = 10000;
  const refGeometry = useRef<THREE.BufferGeometry>(null);

  const positions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);

    for(let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      const radius = Math.random() * 3;
      const spinAngle = radius * 1;
      const branchAngle = (i % 3) / 3 * Math.PI * 2;

      const randomX = (Math.random() - 0.5) * 0.2 * radius
      const randomY = (Math.random() - 0.5) * 0.2 * radius
      const randomZ = (Math.random() - 0.5) * 0.2 * radius

      positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;
    }

    return positions;
  }, []);

  return (
    <points>
      <bufferGeometry ref={refGeometry}>
        <bufferAttribute 
          attach="attributes-position"
          count={particleCount}
          itemSize={3}
          array={positions}
        />
      </bufferGeometry>
      <pointsMaterial 
        color="red" 
        size={particleSize} 
        sizeAttenuation={true} 
      />
    </points>
  );
}

export default function SampleBufferGeometry() {
  return (
    <Canvas
      camera={{
        fov: 45,
        near: 0.1,
        far: 200,
        position: [2, 1, 2],
      }}
      gl={{
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
      }}
      style={{
        background: '#000000'
      }}
    >
      <CameraControls makeDefault />
      <ambientLight intensity={0.5} />  
      <directionalLight position={[10, 10, 10]} />

      {/* <CustomGeometry /> */}
      {/* <CustomGeometry2 /> */}
      <CustomGeometry3 />
      {/* <CustomGeometry4 /> */}
    </Canvas>
  )
}
