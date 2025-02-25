import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { type VRM } from '@pixiv/three-vrm';
import { loadMixamoAnimation } from '~/components/common/loadMixamoAnimation';
import { RigidBody, type RapierRigidBody, CapsuleCollider, useRapier, CollisionEnterPayload } from "@react-three/rapier";
import { useKeyboardControls, useTexture } from "@react-three/drei";
import { useGlobalStore } from "../store/globalStore";
import { useControls } from "leva";

export default function PlayerVrm({ cameraControls, onLoadVRM }: { cameraControls: boolean, onLoadVRM: VRM }) {
  const [AnimationMixer, setAnimationMixer] = useState<THREE.AnimationMixer | null>(null);
  const [animationClips, setAnimationClips] = useState<any[] | null>(null);

  const refPlayer = useRef<RapierRigidBody>(null);
  const refModel = useRef<THREE.Group>(null);
  const refShadow = useRef<THREE.Mesh>(null);
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const [isJump, setIsJump] = useState<boolean>(false);
  const { rapier, world } = useRapier();
  const [smoothCameraPosition] = useState(() => new THREE.Vector3(20, 20, 20));
  const [smoothCameraTarget] = useState(() => new THREE.Vector3());

  const [playerHp, setPlayerHp] = useState<number>(100);

  const animations = {
    idle: '/models/Idle.fbx',
    walk: '/models/Walking.fbx',
    run: '/models/Running.fbx',
    jump: '/models/Jump.fbx',
  };

  const [selectAnimation, setSelectAnimation] = useState<string>('idle');

  // global state
  const { isInterfaceTouch } = useGlobalStore();

  // アニメーションの読み込み
  useEffect(() => {
    if (!onLoadVRM) return;

    const loadAnimations = async () => {
      try {
        const animationClips = await Promise.all(Object.values(animations).map((animation, index) => {
          return loadMixamoAnimation(animation, onLoadVRM, Object.keys(animations)[index]);
        }));
        setAnimationClips(animationClips);

        const currentMixer = new THREE.AnimationMixer(onLoadVRM.scene);
        const defaultAnimation = animationClips[0];
        
        if (defaultAnimation) {
          currentMixer.clipAction(defaultAnimation).play();
          setAnimationMixer(currentMixer);
        }
      } catch (error) {
        console.error('アニメーションの読み込みに失敗しました:', error);
      }
    };

    loadAnimations();
  }, [onLoadVRM]);

  // アニメーションの切り替え
  useEffect(() => {
    if(!AnimationMixer || !animationClips) return;
    
    const animationIndex = Object.keys(animations).indexOf(selectAnimation);
    
    // 新しいアクションを開始
    const newAction = AnimationMixer.clipAction(animationClips[animationIndex]);
    newAction.reset().fadeIn(0.3).play();
    
    // クリーンアップ関数
    return () => {
      newAction.fadeOut(0.3);
      // フェードアウト後にアクションを完全に停止
      // setTimeout(() => {
      //   newAction.stop();
      // }, 500);
    };
  }, [selectAnimation, AnimationMixer, animationClips]);

  const handlerRespawn = () => {
    if (!refPlayer.current) return;
    
    setPlayerHp(100);

    // 他のの更新サイクルとの競合を避けるため少し遅らせる
    setTimeout(() => {
      refPlayer.current?.setTranslation({x: 0, y: 4, z: 0}, true);
      refPlayer.current?.setLinvel({x: 0, y: 0, z: 0}, true);
      refPlayer.current?.setAngvel({x: 0, y: 0, z: 0}, true);
    }, 50);
  }

  const setVrmMaterialColor = (color: THREE.ColorRepresentation = 0xff0000, duration: number = 0.5) => {
    if (!onLoadVRM) return;

    let flashCount = 0;
    const maxFlashes = 3; // 点滅回数
    const intervalTime = duration * 1000 / (maxFlashes * 2); // 点滅の間隔

    const flash = () => {
      onLoadVRM.scene.traverse((object: any) => {
        if(object.material){
          if(Array.isArray(object.material)){
            object.material.forEach((material: any) => {
              material.color.set(flashCount % 2 === 0 ? color : '#ffffff');
              material.emissive.set(flashCount % 2 === 0 ? color : '#ffffff');
              material.emissiveIntensity = flashCount % 2 === 0 ? 2 : 0;
            });
          } else {
            object.material.color.set(flashCount % 2 === 0 ? color : '#ffffff');
            object.material.emissive.set(flashCount % 2 === 0 ? color : '#ffffff');
            object.material.emissiveIntensity = flashCount % 2 === 0 ? 2 : 0;
          }
        }
      });

      flashCount++;
      if (flashCount < maxFlashes * 2) {
        setTimeout(flash, intervalTime);
      }
    };

    flash();
  }

  // useEffectでHPの監視を行う
  useEffect(() => {
    if(playerHp <= 0) {
      handlerRespawn();
    }
  }, [playerHp]);

  const handleCollisionEnter = (event: CollisionEnterPayload) => {
    const collidingObject = event.other.rigidBodyObject;

    if(collidingObject?.name === 'damageObject') {
      console.log('damage');
      refPlayer.current?.setLinvel({x: 0, y: 0, z: 0}, true);
      refPlayer.current?.setAngvel({x: 0, y: 0, z: 0}, true);
      refPlayer.current?.applyImpulse({x: (Math.random() - 0.5) * 2, y: 2, z: (Math.random() - 0.5) * 2}, true);
      // refPlayer.current?.applyTorqueImpulse({x: 0, y: 10, z: 0}, true);
      setVrmMaterialColor('#ff0000', 0.5);
      setPlayerHp(prevHp => prevHp - 25);
    }

    if(collidingObject?.name === 'respawnObject') {
      handlerRespawn();
    }

    if(collidingObject?.name === 'pickupObject') {
      console.log('pickup');
    }
  }

  // 目標の回転角度を保持するための状態を追加
  const [targetRotation, setTargetRotation] = useState<number>(Math.PI);

  useFrame((state, delta) => {
    // 地面との接触判定
    const rayOrigin = refPlayer.current?.translation();
    if(rayOrigin) {
      rayOrigin.y  -= 0.8; // offset

      const rayDirection = {x: 0, y: -1, z: 0};
      const ray = new rapier.Ray(rayOrigin, rayDirection);
      const hit = world.castRay(ray, 50, true);

      if(hit && refShadow.current) {
        // プレイヤーの位置を取得し、Y座標のみ地面に合わせて調整
        const playerPos = refModel.current?.position;
        if (playerPos) {
          refShadow.current.position.set(
            playerPos.x,
            -0.75 - hit.timeOfImpact, // 地面のすぐ上に配置して Z-fighting を防ぐ
            playerPos.z
          );
        }
      }

      if(hit && hit.timeOfImpact > 0.15) {
        setIsJump(true);
      } else {
        setIsJump(false);
      }
    }

    // player control
    const {forward, backward, leftward, rightward} = getKeys();
    const isPlayerMove = forward || backward || leftward || rightward || isInterfaceTouch.forward || isInterfaceTouch.backward || isInterfaceTouch.leftward || isInterfaceTouch.rightward;
    // アニメーションの切り替え
    if(isPlayerMove) {
      setSelectAnimation('run');
    } else {
      setSelectAnimation('idle');
    }

    const impulse = { x: 0, y: 0, z: 0 };
    const impluseStrength = 6.3 * delta;

    // 目標の回転角度を設定
    if (forward || isInterfaceTouch.forward) {
      impulse.z += impluseStrength;
      setTargetRotation(Math.PI); // 前向き
    }
    if (backward || isInterfaceTouch.backward) {
      impulse.z -= impluseStrength;
      setTargetRotation(0); // 後ろ向き
    }
    if (leftward || isInterfaceTouch.leftward) {
      impulse.x += impluseStrength;
      setTargetRotation(-Math.PI / 2); // 左向き
    }
    if (rightward || isInterfaceTouch.rightward) {
      impulse.x -= impluseStrength;
      setTargetRotation(Math.PI / 2); // 右向き
    }

    // 現在の回転から目標の回転まで滑らかに補間
    if (refModel.current) {
      const rotationSpeed = 10 * delta; // 回転の速さを調整（値を大きくすると速く回転）
      refModel.current.rotation.y = THREE.MathUtils.lerp(
        refModel.current.rotation.y,
        targetRotation,
        rotationSpeed
      );
    }

    // プレイヤーの移動
    refPlayer.current?.applyImpulse(impulse, true);

    // アニメーションの更新
    if(onLoadVRM && AnimationMixer) {
      onLoadVRM.update(delta);
      AnimationMixer.update(delta);
    }

    // move camera
    if(!cameraControls) {
      const playerPosition = refPlayer.current?.translation();
      if(playerPosition) {
        const cameraPosition = new THREE.Vector3();
        cameraPosition.copy(playerPosition);
        cameraPosition.y += 8;
        // cameraPosition.x -= 15;
        cameraPosition.z -= 20;

        const cameraTarget = new THREE.Vector3();
        cameraTarget.copy(playerPosition);

        smoothCameraPosition.lerp(cameraPosition, 5 * delta);
        smoothCameraTarget.lerp(cameraTarget, 5 * delta);

        state.camera.position.copy(smoothCameraPosition);
        state.camera.lookAt(smoothCameraTarget);
      }
    }
  });

  // バーの更新
  const updateHpBar = () => {
    if(playerHp <= 50) {
      return 'bg-red-500';
    } else {
      return `bg-green-500`;
    }
  }

  return (
    <>
      <RigidBody
        name="player"
        ref={refPlayer}
        colliders={false}
        restitution={0.1}
        friction={1.0}
        position={[0, 2, 0]}
        lockRotations={true}
        enabledRotations={[false, false, false]}
        mass={3}
        linearDamping={4}
      >
        <primitive
          ref={refModel}
          object={onLoadVRM.scene}
          position={[0, -0.75, 0]}
          rotation={[0, Math.PI, 0]}
        />
        <CapsuleCollider 
          args={[0.5, 0.3]}
          // position={[0, 0.65, 0]}
        />
      </RigidBody>
    </>
  );
}
