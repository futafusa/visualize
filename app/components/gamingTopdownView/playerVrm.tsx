import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { VRMLoaderPlugin, VRMHumanBoneName, VRM } from '@pixiv/three-vrm';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { loadMixamoAnimation } from '../../components/common/loadMixamoAnimation';
import { useControls } from "leva";
import { useKeyboardControls } from "@react-three/drei";
import { RigidBody, type RapierRigidBody, CapsuleCollider, useRapier, CollisionEnterPayload } from "@react-three/rapier";
import Ecctrl, { EcctrlAnimation, type CustomEcctrlRigidBody } from "ecctrl";
import { $ } from "node_modules/react-router/dist/development/fog-of-war-BkI3XFdx.mjs";

export default function PlayerVrm({ cameraControls }: { cameraControls: boolean }) {
  const [vrm, setVrm] = useState<VRM | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [vrmBone, setVrmBone] = useState<any | null>(null);
  const [AnimationMixer, setAnimationMixer] = useState<THREE.AnimationMixer | null>(null);
  const [animationClips, setAnimationClips] = useState<any[] | null>(null);

  const refPlayer = useRef<RapierRigidBody>(null);
  const refModel = useRef<THREE.Group>(null);
  const [subscribeKeys, getKeys] = useKeyboardControls();
  const [isJump, setIsJump] = useState<boolean>(false);
  const { rapier, world } = useRapier();

  const [smoothCameraPosition, setSmoothCameraPosition] = useState(() => new THREE.Vector3(20, 20, 20));
  const [smoothCameraTarget, setSmoothCameraTarget] = useState(() => new THREE.Vector3());

  const [playerHp, setPlayerHp] = useState<number>(100);

  const animations = {
    idle: '/models/Idle.fbx',
    walk: '/models/Walking.fbx',
    run: '/models/Running.fbx',
    jump: '/models/Jump.fbx',
  };

  // const { selectAnimation } = useControls('Animation', {
  //   selectAnimation : {
  //     options: Object.keys(animations)
  //   }
  // });
  const [selectAnimation, setSelectAnimation] = useState<string>('idle');

  // vrmの読み込み
  useEffect(() => {
    if(vrm) return;

    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));
  
    loader.load('/models/AliciaSolid.vrm', (gltf) => {
      // console.log(gltf);
      const vrm = gltf.userData.vrm;
      setVrm(vrm);

      // ボーンの取得
      // const bones = {
      //   head: vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName.Head),
      //   neck: vrm.humanoid.getRawBoneNode(VRMHumanBoneName.Neck),
      //   hips: vrm.humanoid.getRawBoneNode(VRMHumanBoneName.Hips),
      //   spine: vrm.humanoid.getRawBoneNode(VRMHumanBoneName.Spine),
      //   upperChest: vrm.humanoid.getRawBoneNode(VRMHumanBoneName.UpperChest),
      //   leftArm: vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName.LeftUpperArm),
      //   rightArm: vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName.RightUpperArm)
      // }
      // setVrmBone(bones);
      },
    (xhr) => {
      setProgress((xhr.loaded / xhr.total) * 100)
    },
    (error) => {
      console.log(error)
    }
  );
  }, []);

  // アニメーションの読み込み
  useEffect(() => {
    if (!vrm) return;

    const loadAnimations = async () => {
      try {
        const animationClips = await Promise.all(Object.values(animations).map((animation, index) => {
          return loadMixamoAnimation(animation, vrm, Object.keys(animations)[index]);
        }));
        setAnimationClips(animationClips);

        const currentMixer = new THREE.AnimationMixer(vrm.scene);
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
  }, [vrm]);

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
      refPlayer.current?.applyImpulse({x: 0, y: 2, z: 0}, true);
      // refPlayer.current?.applyTorqueImpulse({x: 0, y: 10, z: 0}, true);
      setVrmMaterialColor('#ff0000', 0.5);
      setPlayerHp(prevHp => prevHp - 20);
    }

    if(collidingObject?.name === 'respawnObject') {
      handlerRespawn();
    }
  }

  const setVrmMaterialColor = (color: THREE.ColorRepresentation = 0xff0000, duration: number = 0.5) => {
    if (!vrm) return;

    let flashCount = 0;
    const maxFlashes = 3; // 点滅回数
    const intervalTime = duration * 1000 / (maxFlashes * 2); // 点滅の間隔

    const flash = () => {
      vrm?.scene.traverse((object: any) => {
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

  // アニメーション
  useFrame((state, delta) => {
    // 地面との接触判定
    const rayOrigin = refPlayer.current?.translation();
    if(rayOrigin) {
      rayOrigin.y  -= 0.8; // offset

      const rayDirection = {x: 0, y: -1, z: 0};
      const ray = new rapier.Ray(rayOrigin, rayDirection);
      const hit = world.castRay(ray, 50, true);
      // const hit = world.castRay(
      //   ray,
      //   rayLength,
      //   true, // 貫通を許可するか
      //   undefined, // フィルターグループ
      //   undefined, // 除外対象のColliderハンドル
      //   undefined, // 除外対象のRigidBodyハンドル
      // );

      if(hit && Math.abs(hit.timeOfImpact) > 0.15) {
        setIsJump(true);
      } else {
        setIsJump(false);
      }
    }

    if(vrm && AnimationMixer) {
      vrm.update(delta);
      AnimationMixer.update(delta);
      // vrmBone.neck.rotation.y = Math.sin(time / Math.PI*2);
    }

    // player control
    const {forward, backward, leftward, rightward, jump, run} = getKeys();
    const isPlayerMove = forward || backward || leftward || rightward;
    const isPlayerRun = run;
    if(isJump) {
      setSelectAnimation('jump');
    } else if(isPlayerMove && isPlayerRun) {
      setSelectAnimation('run');
    } else if(isPlayerMove) {
      setSelectAnimation('walk');
    } else {
      setSelectAnimation('idle');
    }

    if(!cameraControls) {
      // move camera
      const playerPosition = refPlayer.current?.translation();
      if(playerPosition) {
        const cameraPosition = new THREE.Vector3();
        cameraPosition.copy(playerPosition);
        cameraPosition.y += 15;
        cameraPosition.z -= 15;

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
      {vrm ? (
        <group>
          <Ecctrl
            debug={true}
            name="player"
            ref={refPlayer}
            characterInitDir={Math.PI}
            disableFollowCam={true}
            disableFollowCamPos={{ x: 0, y: 15, z: -15 }}
            capsuleHalfHeight={0.5}
            capsuleRadius={0.3}
            floatHeight={0}
            autoBalanceSpringOnY={1}
            maxVelLimit={2}
            jumpVel={4}
            onCollisionEnter={handleCollisionEnter}
            jumpForceToGroundMult={0}
            slopJumpMult={0}
            autoBalanceSpringK={1}
          >
            <primitive
              ref={refModel}
              object={vrm.scene}
              position={[0, -0.75, 0]}
              rotation={[0, Math.PI, 0]}
            />
            <Html center style={{ color: 'white' }} position={[0, 1.2, 0]}>
              {/* <div className="bg-white text-black text-center text-xs">
                <p>HP: {playerHp}</p>
              </div> */}
              <div className="bg-black text-white w-[100px] h-[10px] border-solid border-white border-2">
                <div className={`flex justify-center items-center h-full ${updateHpBar()}`} style={{width: `${playerHp}%`}} />
              </div>
            </Html>
          </Ecctrl>
        </group>
      ) : (
        <Html center style={{ color: 'white' }}>{progress}</Html>
      )}
    </>
  );
}
