import * as THREE from "three";
import { RigidBody } from "@react-three/rapier";
import { Grid } from "@react-three/drei";
import { ConeCollider } from "@react-three/rapier";

import GlowingFloor from "./glowingFloor";
import DamageObject from "./damageObject";
import RespawnObject from "./respawnObject";
import PickupObject from "./pickupObject";

export default function stageDebug() {
  return (
    <group rotation={[0, Math.PI - Math.PI / 4, 0]}>
      <GlowingFloor position={new THREE.Vector3(-3, -0.04, -4)} color={'#00ff00'}/>
      <DamageObject position={new THREE.Vector3(1, -0.04, -4)} size={[1, 1, 1]} color={'#ff0000'} rotation={[0, 0, 0]}/>
      <RespawnObject position={new THREE.Vector3(4, -0.04, -4)} size={[1, 1, 1]} color={'#ffff00'} rotation={[0, 0, 0]}/>
  
      <PickupObject position={new THREE.Vector3(3, 0.5, 0)} size={[0.2, 0.2, 0.2]} color={'#00ff00'} rotation={[0, 0, 0]}>
        サンプルテキストサンプルテキストサンプルテキスト
      </PickupObject>

      <PickupObject position={new THREE.Vector3(5, 0.5, 0)} size={[0.2, 0.2, 0.2]} color={'#2600ff'} rotation={[0, 0, 0]}>
        Gundam GQuuuuuuX 面白かったね
      </PickupObject>
  
      {/* FLOOR */}
      <Grid args={[20, 20]}  />
      <RigidBody name="floor" type="fixed" position={[0, -0.1, 0]}>
        <mesh position={[0, 0, 0]} rotation={[Math.PI / -2, 0, 0]} receiveShadow>
        <boxGeometry args={[20, 20, 0.1]} />
        <meshStandardMaterial color={'#000000'} />
        </mesh>
      </RigidBody>
  
      {/* 離れ小島 */}
      <RigidBody name="floor2" type="fixed" position={[0, -0.1, 0]}>
        <mesh position={[14, -0.01, 0]} rotation={[Math.PI / -2, 0, 0]}>
        <boxGeometry args={[4, 4, 0.1]} />
        <meshStandardMaterial color={'#000000'} />
        </mesh>
      </RigidBody>
  
      {/* 斜面 */}
      <RigidBody name="floor3" type="fixed" position={[0, -0.1, 0]} colliders={false} friction={2} restitution={2} >
        <mesh position={[-3, 1, 3]} rotation={[0, 0, 0]}>
          <coneGeometry args={[3, 2, 16]} />
          <meshStandardMaterial color={'#230a43'} flatShading roughness={0.1} metalness={0} />
        </mesh>
        <ConeCollider args={[1, 3]} position={[-3, 1, 3]} />
      </RigidBody>
      {/* RESPAWN FLOOR */}
      <RespawnObject position={new THREE.Vector3(0, -10, 0)} size={[50, 1, 50]} color={'#ffffff'} rotation={[0, 0, 0]}/>
    </group>
  )
}