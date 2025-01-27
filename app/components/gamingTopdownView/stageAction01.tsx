import * as THREE from "three";
import FloorBasic from "./floorBasic";
import DamageObject from "./damageObject";
import RespawnObject from "./respawnObject";
import PickupObject from "./pickupObject";

export default function stageAction01() {
  return (
    <group>
      <FloorBasic position={[0, 0, 0]} size={[4, 4]} color={'#222222'} />
      <FloorBasic position={[-3, 0, 3]} size={[2.5, 2.5]} color={'#222222'} moveSlide={true} />
      <FloorBasic position={[-6, 0, 6]} size={[4, 4]} color={'#222222'} />
      {/* <DamageObject position={new THREE.Vector3(-6, 0, 6)} size={[2.5, 0.2, 2.5]} color={'#ff0000'} rotation={[0, Math.PI - Math.PI / 4, 0]}/> */}
      <FloorBasic position={[-9, 0, 9]} size={[2.5, 2.5]} color={'#222222'} moveLift={true} />
      <FloorBasic position={[-12, 2, 12]} size={[4, 4]} color={'#222222'} />
      <PickupObject position={new THREE.Vector3(-12, 2.5, 12)} size={[0.2, 0.2, 0.2]} color={'#00ff00'} rotation={[0, Math.PI - Math.PI / 4, 0]}>
        Gundam GQuuuuuuX 面白かったね
      </PickupObject>
      <RespawnObject position={new THREE.Vector3(-14, 2, 14)} size={[4, 0.2, 1.5]} color={'#ffff00'} rotation={[0, Math.PI - Math.PI / 4, 0]}/>

      {/* RESPAWN FLOOR */}
      <RespawnObject position={new THREE.Vector3(0, -10, 0)} size={[50, 0.5, 100]} color={'#ffffff'} rotation={[0, Math.PI - Math.PI / 4, 0]}/>
    </group>
  )
}