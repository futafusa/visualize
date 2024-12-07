import { Route } from "./+types/three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { useControls } from "leva";

function Box(props: JSX.IntrinsicElements["mesh"]) {
  const refMesh = useRef<THREE.Mesh>(null!);
  const [hover, setHover] = useState(false);
  const [click, setClick] = useState(false);
  const posY = 5;

  const { uColor } = useControls({
    uColor: {
      value: '#00ff00',
    },
  })

  useEffect(() => {
    // console.log(refMesh.current);
    console.log(uColor);
  }, []);

  useFrame(() => {
    refMesh.current.rotation.x += 0.01;
    refMesh.current.rotation.y += 0.02;

    if(refMesh.current.position.y > posY) {
      refMesh.current.position.y = -posY;

    } else {
      refMesh.current.position.y += 0.03;
    }
  });

  return (
    <mesh
      {...props}
      ref={refMesh}
      scale={click ? 1.5 : 1}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      onClick={() => setClick(!click)}
    >
      <boxGeometry />
      <meshStandardMaterial color={hover ? "blue" : uColor} />
    </mesh>
  );
}

export default function Three() {  
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />

        <Box position={[2, -1, 0]} />
        <Box position={[-2, 1, 0]} />
      </Canvas>
    </div>
  );
}