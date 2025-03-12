import { useState, useEffect, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { CameraControls, Grid, Html } from "@react-three/drei";
import { VRMLoaderPlugin, VRM, VRMUtils } from '@pixiv/three-vrm';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { loadMixamoAnimation } from '../../components/common/loadMixamoAnimation';
import { useControls, button } from "leva";
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
          className="text-white text-center text-sm pointer-events-none"
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

  const refCameraControls = useRef<CameraControls>(null)!;
  const cameraPositions = {
    "default": [
      2, 2, -2,
      0, 1, 0
    ],
    "face": [
      0.37973153478934085, 1.384184149429858, -0.5100098040906823,
      -0.03344901044390385, 1.3395703401713253, 0.03573992249643781
    ],
    "under": [
      -1.0328286020019157, 0.30231885242679624, -1.743724344177738,
      0.06229085438140309, 0.7308072386944194, 0.03359618924203886
    ],
    "back": [
      0, 2.4, 3,
      0, 1, 0
    ]
  }

  const { cameraPosition } = useControls("Camera", {
    "getLookAt (to console)": button(() => {
      const position = refCameraControls.current?.getPosition(new THREE.Vector3());
      const target = refCameraControls.current?.getTarget(new THREE.Vector3());
      if (position && target) {
        console.log([...position.toArray(), ...target.toArray()]);
      }
    }),
    cameraPosition: {
      options: Object.keys(cameraPositions),
      value: 'default'
    }
  });
  
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

  useEffect(() => {
    refCameraControls.current?.setTarget(0, 1, 0, false);
  }, [vrm]);

  useEffect(() => {
    const pos = cameraPositions[cameraPosition as keyof typeof cameraPositions];
    refCameraControls.current?.setLookAt(
      pos[0], pos[1], pos[2],
      pos[3], pos[4], pos[5],
      true
    );
  }, [cameraPosition]);

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
        />
        <ambientLight intensity={1.0} />

        {vrm && <DisplayVrm onLoadVRM={vrm} />}
        <Grid position={[0, 0, 0]} infiniteGrid={true} fadeDistance={20} />
      </Canvas>
      <DropVRM progress={progress} loadVRM={loadVRM} />
    </>
  );
}

