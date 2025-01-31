import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { CameraControls, Grid, Html } from "@react-three/drei";
import { VRMLoaderPlugin, VRM, VRMUtils } from '@pixiv/three-vrm';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { loadMixamoAnimation } from '../../components/common/loadMixamoAnimation';
import { useControls } from "leva";
import { Perf } from "r3f-perf";

function DisplayVrm({ onLoadVRM }: { onLoadVRM: VRM }) {
  const [AnimationMixer, setAnimationMixer] = useState<THREE.AnimationMixer | null>(null);
  const [animationClips, setAnimationClips] = useState<any[] | null>(null);

  const animations = {
    idle: '/models/Idle.fbx',
    walk: '/models/Walking.fbx',
    run: '/models/Running.fbx',
    falling: '/models/Falling.fbx',
    jump: '/models/Jump.fbx',
  };

  const { selectAnimation } = useControls('Animation', {
    selectAnimation : {
      options: Object.keys(animations)
    }
  });

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

  useEffect(() => {
    if(!AnimationMixer || !animationClips) return;

    const animationIndex = Object.keys(animations).indexOf(selectAnimation);
    const newAction = AnimationMixer.clipAction(animationClips[animationIndex]);
    newAction.reset().fadeIn(0.3).play();

    return () => {
      newAction.fadeOut(0.3);
    }
  }, [selectAnimation]);

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

function DropVRM({ progress, loadVRM }: { progress: number, loadVRM: (path: string) => void }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file && file.name.endsWith('.vrm')) {
      const url = URL.createObjectURL(file);
      loadVRM(url);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDragEnter = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  return (
    <div
      className="
        absolute bottom-0 left-0
        w-full z-1000
        flex justify-center items-center
        px-4 pb-4
      "
    >
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`
          rounded-lg border border-dashed border-white/50
          bg-black/50
          w-full
          ${isDragging ? 'h-[210px]' : 'h-[60px]'}
          transition-all duration-300
          flex justify-center items-center
        `}
      >
        <p
          className="text-white text-center text-sm"
          dangerouslySetInnerHTML={{
            __html: progress < 100 ? `Loading... ${progress}%` : 'Drag & Drop .vrm Data'
          }}
        />
      </div>
    </div>
  );
}

export default function SampleVrm() {
  const { perfVisible } = useControls('Performance', {
    perfVisible: false
  });
  const refCameraControls = useRef<CameraControls | null>(null);

  // load vrm
  const [vrm, setVrm] = useState<VRM | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const loader = new GLTFLoader();
  loader.register((parser) => new VRMLoaderPlugin(parser));

  const loadVRM = (path: string) => {
    loader.load(path, (gltf) => {
      const vrm = gltf.userData.vrm;
      VRMUtils.removeUnnecessaryVertices(gltf.scene);
      VRMUtils.combineSkeletons(gltf.scene);
      VRMUtils.combineMorphs(vrm);
      setVrm(vrm);
    },
    (xhr) => {
      setProgress((xhr.loaded / xhr.total) * 100)
    },
    (error) => {
      console.log(error)
    });
  }

  // 初回vrmの読み込み
  useEffect(() => {
    loadVRM('/models/AliciaSolid.vrm');
  }, []);

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

        {vrm && <DisplayVrm onLoadVRM={vrm} />}
        <Grid position={[0, 0, 0]} infiniteGrid={true} fadeDistance={20} />
      </Canvas>
      <DropVRM progress={progress} loadVRM={loadVRM} />
    </>
  );
}

