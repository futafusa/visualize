import { RigidBody } from "@react-three/rapier";

export default function SimpleFloor() {
  return (
    <RigidBody type="fixed" position={[0, 0, 0]}>
      <mesh scale={[20, 0.1, 5]} position={[0, 0, 0]}>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </RigidBody>
  );
}
