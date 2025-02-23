import { RigidBody } from "@react-three/rapier";

export default function SimpleFloor() {
  return (
    <RigidBody type="fixed">
      <mesh scale={[1, 0.1, 20]} position={[0, 0, 0]}>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </RigidBody>
  );
}
