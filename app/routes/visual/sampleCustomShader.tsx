import * as THREE from "three";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import CustomShaderMaterial from "three-custom-shader-material";

export default function SampleCustomShader() {
  // const refMaterial = useRef<CustomShaderMaterial<typeof THREE.MeshPhysicalMaterial>>(null);

  // useFrame(() => {
  //   if (refMaterial.current) {
  //     refMaterial.current.uniforms.uTime.value += 0.01;
  //   }
  // });

  return (
    <mesh>
      <boxGeometry />
      <CustomShaderMaterial 
        baseMaterial={THREE.MeshPhysicalMaterial}
        // vertexShader={vertexShader}
        // fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
        }}
        flatShading
        color={"#ff0000"}
      />
    </mesh>
  );
}
