import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { useRef } from "react";
import * as THREE from "three";
import { Text } from "@react-three/drei";

export default function RespawnObject(props: {
	position: THREE.Vector3;
	size: [number, number, number];
	color: string;
	rotation: [number, number, number];
}) {
	const refMesh = useRef<THREE.Mesh>(null);

	return (
		<group>
			<RigidBody
				name="respawnObject"
				type="fixed"
				position={props.position}
				rotation={props.rotation}
				// colliders={false}
			>
				<mesh ref={refMesh}>
					<boxGeometry args={props.size} />
					<meshStandardMaterial
						color={props.color}
						emissive={props.color}
						emissiveIntensity={2}
						roughness={0.5}
						// metalness={0.8}
					/>
				</mesh>
				{/* <CuboidCollider args={props.size} position={[0, 0, 0]} /> */}
			</RigidBody>
			{/* <Text
				scale={0.1}
				position={props.position.clone().add(new THREE.Vector3(0, 1, -0.5))}
				fontSize={4}
			>
				Respawn
			</Text> */}
		</group>
	);
}
