import * as THREE from "three";
import { useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useControls } from "leva";

import { VRM } from "@pixiv/three-vrm";
import { loadMixamoAnimation } from '../../components/common/loadMixamoAnimation';

export default function Character({ onLoadVRM }: { onLoadVRM: VRM }) {
  const [AnimationMixer, setAnimationMixer] = useState<THREE.AnimationMixer | null>(null);
  const [animationClips, setAnimationClips] = useState<any[] | null>(null);

  const animations = {
    idle: '/models/Idle.fbx',
    walk: '/models/Walking.fbx',
    run: '/models/Running.fbx',
    falling: '/models/Falling.fbx',
    jump: '/models/Jump.fbx',
  };

  // const { selectAnimation } = useControls('Animation', {
  //   selectAnimation : {
  //     options: Object.keys(animations),
  //   }
  // });

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
        const defaultAnimation = animationClips[2];
        
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

  // useEffect(() => {
  //   if(!AnimationMixer || !animationClips) return;

  //   const animationIndex = Object.keys(animations).indexOf(selectAnimation);
  //   const newAction = AnimationMixer.clipAction(animationClips[animationIndex]);
  //   newAction.reset().fadeIn(0.3).play();

  //   return () => {
  //     newAction.fadeOut(0.3);
  //   }
  // }, [selectAnimation]);

  // アニメーション更新
  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if(onLoadVRM && AnimationMixer) {
      onLoadVRM.update(delta);
      AnimationMixer.update(delta);
    }
  });

  return (
    <primitive object={onLoadVRM.scene} />
  );
}