import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { CameraControls, Grid, Html } from "@react-three/drei";
import { VRMLoaderPlugin, VRMHumanBoneName, VRM } from '@pixiv/three-vrm';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { loadMixamoAnimation } from '../../components/common/loadMixamoAnimation';
import { useControls } from "leva";
import { Perf } from "r3f-perf";

function DisplayVrm() {
  const [vrm, setVrm] = useState<VRM | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [vrmBone, setVrmBone] = useState<any | null>(null);
  const [AnimationMixer, setAnimationMixer] = useState<THREE.AnimationMixer | null>(null);
  const [animationClips, setAnimationClips] = useState<any[] | null>(null);
  const { camera } = useThree();

  const animations = {
    idle: '/models/Idle.fbx',
    walk: '/models/Walking.fbx',
    run: '/models/Running.fbx',
    falling: '/models/Falling.fbx',
  };

  // const { selectAnimation } = useControls('Animation', {
  //   selectAnimation : {
  //     options: Object.keys(animations)
  //   }
  // });

  // vrmの読み込み
  useEffect(() => {
    if(vrm) return;

    const loader = new GLTFLoader();
    loader.register((parser) => new VRMLoaderPlugin(parser));
  
    loader.load('/models/AliciaSolid.vrm', (gltf) => {
      // console.log(gltf);
      const vrm = gltf.userData.vrm;
      setVrm(vrm);

      vrm.lookAt.target = camera;

      // ボーンの取得
      const bones = {
        head: vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName.Head),
        neck: vrm.humanoid.getRawBoneNode(VRMHumanBoneName.Neck),
        hips: vrm.humanoid.getRawBoneNode(VRMHumanBoneName.Hips),
        spine: vrm.humanoid.getRawBoneNode(VRMHumanBoneName.Spine),
        upperChest: vrm.humanoid.getRawBoneNode(VRMHumanBoneName.UpperChest),
        leftArm: vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName.LeftUpperArm),
        rightArm: vrm.humanoid.getNormalizedBoneNode(VRMHumanBoneName.RightUpperArm)
      }
      setVrmBone(bones);
    },
    (xhr) => {
      setProgress((xhr.loaded / xhr.total) * 100)
    },
    (error) => {
      console.log(error)
    }
  );
  }, []);

  // 初期ボーンの位置の設定
  // useEffect(() => {
  //   if(vrmBone) {
  //     vrmBone.leftArm.rotation.z = THREE.MathUtils.degToRad(70);
  //     vrmBone.rightArm.rotation.z = -THREE.MathUtils.degToRad(70);
  //   }
  // }, [vrmBone]);

  // アニメーションの読み込み
  useEffect(() => {
    if (!vrm) return;

    const loadAnimations = async () => {
      try {
        // const animationClips = await Promise.all([
        //   loadMixamoAnimation(animations.idle, vrm, 'idle'),
        //   loadMixamoAnimation(animations.walk, vrm, 'walk'),
        //   loadMixamoAnimation(animations.run, vrm, 'run'),
        //   loadMixamoAnimation(animations.falling, vrm, 'falling'),
        // ]);
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

  // useEffect(() => {
  //   if(!AnimationMixer || !animationClips) return;
  //   console.log(animationClips);

  //   const action = AnimationMixer.clipAction(animationClips[3]);
  //   action.reset().fadeIn(0.5).play();
  //   setAnimationMixer(AnimationMixer);

  //   return () => {
  //     action.fadeOut(0.5);
  //   }
  // }, [selectAnimation]);

   // アニメーション
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if(vrm && AnimationMixer) {
      vrm.update(delta);
      AnimationMixer.update(delta);
      // vrmBone.neck.rotation.y = Math.sin(time / Math.PI*2);
    }
  });

  return (
    <>
      {vrm ? (
        <primitive object={vrm.scene} />
      ) : (
        <Html center style={{ color: 'white' }}>{progress}</Html>
      )}
    </>
  );
}

export default function SampleVrm() {
  const { perfVisible } = useControls('Performance', {
    perfVisible: false
  });
  const refCameraControls = useRef<CameraControls | null>(null);

  return (
    <>
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 200,
          position: [2, 2, -2],
        }}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        style={{
          background: '#000000'
        }}
      >
        {perfVisible && <Perf position="bottom-right" />}

        <CameraControls 
          makeDefault 
          ref={refCameraControls}
          onUpdate={(self) => {
            // console.log(self);
            self.setTarget(0, 1, 0, false);
          }}
        />
        <ambientLight intensity={1.0} />

        <DisplayVrm />
        <Grid position={[0, 0, 0]} infiniteGrid={true} fadeDistance={20} />
      </Canvas>
    </>
  );
}

