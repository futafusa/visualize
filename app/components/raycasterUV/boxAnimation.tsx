import * as THREE from 'three'
import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { useGLTF, useAnimations } from '@react-three/drei'
import type { GLTF } from "three-stdlib";
import { useGameStore } from './store/gameStore';

type GLTFResult = GLTF & {
  nodes: {
    [key: string]: THREE.Mesh;
  };
  materials: {
    [key: string]: THREE.Material;
  };
};

export default function BoxAnimation(props: {
  position: [number, number, number],
  rotation: [number, number, number],
  scale: [number, number, number],
}) {
  const group = useRef<THREE.Group>(null);
  const { nodes, materials, animations } = useGLTF('/models/boxanim.glb') as GLTFResult;
  const { actions } = useAnimations(animations, group);
  const currentUV = useGameStore((state) => state.currentUV);
  const animDuration = useRef<number>(0);

  useEffect(() => {
    if (actions?.anim1) {
      animDuration.current = animations[0].duration;
      actions.anim1.time = 0.3;
      actions.anim1.play();
      actions.anim1.paused = true; // 一時停止状態で開始
    }
  }, [actions]);

  useFrame(() => {
    if (actions?.anim1 && currentUV) {
      console.log(currentUV.x);
      actions.anim1.time = currentUV.x * animDuration.current;
    }
  });

  return (
    <group ref={group} {...props} dispose={null}>

      <group name="geo2">
        <group name="piece_0">
          <mesh
            name="bonedeform1"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1.geometry}
            material={nodes.bonedeform1.material}
          />
        </group>
        <group name="piece_1">
          <mesh
            name="bonedeform1_1"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_1.geometry}
            material={nodes.bonedeform1_1.material}
          />
        </group>
        <group name="piece_2">
          <mesh
            name="bonedeform1_2"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_2.geometry}
            material={nodes.bonedeform1_2.material}
          />
        </group>
        <group name="piece_3">
          <mesh
            name="bonedeform1_3"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_3.geometry}
            material={nodes.bonedeform1_3.material}
          />
        </group>
        <group name="piece_4">
          <mesh
            name="bonedeform1_4"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_4.geometry}
            material={nodes.bonedeform1_4.material}
          />
        </group>
        <group name="piece_5">
          <mesh
            name="bonedeform1_5"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_5.geometry}
            material={nodes.bonedeform1_5.material}
          />
        </group>
        <group name="piece_6">
          <mesh
            name="bonedeform1_6"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_6.geometry}
            material={nodes.bonedeform1_6.material}
          />
        </group>
        <group name="piece_7">
          <mesh
            name="bonedeform1_7"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_7.geometry}
            material={nodes.bonedeform1_7.material}
          />
        </group>
        <group name="piece_8">
          <mesh
            name="bonedeform1_8"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_8.geometry}
            material={nodes.bonedeform1_8.material}
          />
        </group>
        <group name="piece_9">
          <mesh
            name="bonedeform1_9"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_9.geometry}
            material={nodes.bonedeform1_9.material}
          />
        </group>
        <group name="piece_10">
          <mesh
            name="bonedeform1_10"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_10.geometry}
            material={nodes.bonedeform1_10.material}
          />
        </group>
        <group name="piece_11">
          <mesh
            name="bonedeform1_11"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_11.geometry}
            material={nodes.bonedeform1_11.material}
          />
        </group>
        <group name="piece_12">
          <mesh
            name="bonedeform1_12"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_12.geometry}
            material={nodes.bonedeform1_12.material}
          />
        </group>
        <group name="piece_13">
          <mesh
            name="bonedeform1_13"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_13.geometry}
            material={nodes.bonedeform1_13.material}
          />
        </group>
        <group name="piece_14">
          <mesh
            name="bonedeform1_14"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_14.geometry}
            material={nodes.bonedeform1_14.material}
          />
        </group>
        <group name="piece_15">
          <mesh
            name="bonedeform1_15"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_15.geometry}
            material={nodes.bonedeform1_15.material}
          />
        </group>
        <group name="piece_16">
          <mesh
            name="bonedeform1_16"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_16.geometry}
            material={nodes.bonedeform1_16.material}
          />
        </group>
        <group name="piece_17">
          <mesh
            name="bonedeform1_17"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_17.geometry}
            material={nodes.bonedeform1_17.material}
          />
        </group>
        <group name="piece_18">
          <mesh
            name="bonedeform1_18"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_18.geometry}
            material={nodes.bonedeform1_18.material}
          />
        </group>
        <group name="piece_19">
          <mesh
            name="bonedeform1_19"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_19.geometry}
            material={nodes.bonedeform1_19.material}
          />
        </group>
        <group name="piece_20">
          <mesh
            name="bonedeform1_20"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_20.geometry}
            material={nodes.bonedeform1_20.material}
          />
        </group>
        <group name="piece_21">
          <mesh
            name="bonedeform1_21"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_21.geometry}
            material={nodes.bonedeform1_21.material}
          />
        </group>
        <group name="piece_22">
          <mesh
            name="bonedeform1_22"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_22.geometry}
            material={nodes.bonedeform1_22.material}
          />
        </group>
        <group name="piece_23">
          <mesh
            name="bonedeform1_23"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_23.geometry}
            material={nodes.bonedeform1_23.material}
          />
        </group>
        <group name="piece_24">
          <mesh
            name="bonedeform1_24"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_24.geometry}
            material={nodes.bonedeform1_24.material}
          />
        </group>
        <group name="piece_25">
          <mesh
            name="bonedeform1_25"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_25.geometry}
            material={nodes.bonedeform1_25.material}
          />
        </group>
        <group name="piece_26">
          <mesh
            name="bonedeform1_26"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_26.geometry}
            material={nodes.bonedeform1_26.material}
          />
        </group>
        <group name="piece_27">
          <mesh
            name="bonedeform1_27"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_27.geometry}
            material={nodes.bonedeform1_27.material}
          />
        </group>
        <group name="piece_28">
          <mesh
            name="bonedeform1_28"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_28.geometry}
            material={nodes.bonedeform1_28.material}
          />
        </group>
        <group name="piece_29">
          <mesh
            name="bonedeform1_29"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_29.geometry}
            material={nodes.bonedeform1_29.material}
          />
        </group>
        <group name="piece_30">
          <mesh
            name="bonedeform1_30"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_30.geometry}
            material={nodes.bonedeform1_30.material}
          />
        </group>
        <group name="piece_31">
          <mesh
            name="bonedeform1_31"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_31.geometry}
            material={nodes.bonedeform1_31.material}
          />
        </group>
        <group name="piece_32">
          <mesh
            name="bonedeform1_32"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_32.geometry}
            material={nodes.bonedeform1_32.material}
          />
        </group>
        <group name="piece_33">
          <mesh
            name="bonedeform1_33"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_33.geometry}
            material={nodes.bonedeform1_33.material}
          />
        </group>
        <group name="piece_34">
          <mesh
            name="bonedeform1_34"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_34.geometry}
            material={nodes.bonedeform1_34.material}
          />
        </group>
        <group name="piece_35">
          <mesh
            name="bonedeform1_35"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_35.geometry}
            material={nodes.bonedeform1_35.material}
          />
        </group>
        <group name="piece_36">
          <mesh
            name="bonedeform1_36"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_36.geometry}
            material={nodes.bonedeform1_36.material}
          />
        </group>
        <group name="piece_37">
          <mesh
            name="bonedeform1_37"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_37.geometry}
            material={nodes.bonedeform1_37.material}
          />
        </group>
        <group name="piece_38">
          <mesh
            name="bonedeform1_38"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_38.geometry}
            material={nodes.bonedeform1_38.material}
          />
        </group>
        <group name="piece_39">
          <mesh
            name="bonedeform1_39"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_39.geometry}
            material={nodes.bonedeform1_39.material}
          />
        </group>
        <group name="piece_40">
          <mesh
            name="bonedeform1_40"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_40.geometry}
            material={nodes.bonedeform1_40.material}
          />
        </group>
        <group name="piece_41">
          <mesh
            name="bonedeform1_41"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_41.geometry}
            material={nodes.bonedeform1_41.material}
          />
        </group>
        <group name="piece_42">
          <mesh
            name="bonedeform1_42"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_42.geometry}
            material={nodes.bonedeform1_42.material}
          />
        </group>
        <group name="piece_43">
          <mesh
            name="bonedeform1_43"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_43.geometry}
            material={nodes.bonedeform1_43.material}
          />
        </group>
        <group name="piece_44">
          <mesh
            name="bonedeform1_44"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_44.geometry}
            material={nodes.bonedeform1_44.material}
          />
        </group>
        <group name="piece_45">
          <mesh
            name="bonedeform1_45"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_45.geometry}
            material={nodes.bonedeform1_45.material}
          />
        </group>
        <group name="piece_46">
          <mesh
            name="bonedeform1_46"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_46.geometry}
            material={nodes.bonedeform1_46.material}
          />
        </group>
        <group name="piece_47">
          <mesh
            name="bonedeform1_47"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_47.geometry}
            material={nodes.bonedeform1_47.material}
          />
        </group>
        <group name="piece_48">
          <mesh
            name="bonedeform1_48"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_48.geometry}
            material={nodes.bonedeform1_48.material}
          />
        </group>
        <group name="piece_49">
          <mesh
            name="bonedeform1_49"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_49.geometry}
            material={nodes.bonedeform1_49.material}
          />
        </group>
        <group name="piece_50">
          <mesh
            name="bonedeform1_50"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_50.geometry}
            material={nodes.bonedeform1_50.material}
          />
        </group>
        <group name="piece_51">
          <mesh
            name="bonedeform1_51"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_51.geometry}
            material={nodes.bonedeform1_51.material}
          />
        </group>
        <group name="piece_52">
          <mesh
            name="bonedeform1_52"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_52.geometry}
            material={nodes.bonedeform1_52.material}
          />
        </group>
        <group name="piece_53">
          <mesh
            name="bonedeform1_53"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_53.geometry}
            material={nodes.bonedeform1_53.material}
          />
        </group>
        <group name="piece_54">
          <mesh
            name="bonedeform1_54"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_54.geometry}
            material={nodes.bonedeform1_54.material}
          />
        </group>
        <group name="piece_55">
          <mesh
            name="bonedeform1_55"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_55.geometry}
            material={nodes.bonedeform1_55.material}
          />
        </group>
        <group name="piece_56">
          <mesh
            name="bonedeform1_56"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_56.geometry}
            material={nodes.bonedeform1_56.material}
          />
        </group>
        <group name="piece_57">
          <mesh
            name="bonedeform1_57"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_57.geometry}
            material={nodes.bonedeform1_57.material}
          />
        </group>
        <group name="piece_58">
          <mesh
            name="bonedeform1_58"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_58.geometry}
            material={nodes.bonedeform1_58.material}
          />
        </group>
        <group name="piece_59">
          <mesh
            name="bonedeform1_59"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_59.geometry}
            material={nodes.bonedeform1_59.material}
          />
        </group>
        <group name="piece_60">
          <mesh
            name="bonedeform1_60"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_60.geometry}
            material={nodes.bonedeform1_60.material}
          />
        </group>
        <group name="piece_61">
          <mesh
            name="bonedeform1_61"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_61.geometry}
            material={nodes.bonedeform1_61.material}
          />
        </group>
        <group name="piece_62">
          <mesh
            name="bonedeform1_62"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_62.geometry}
            material={nodes.bonedeform1_62.material}
          />
        </group>
        <group name="piece_63">
          <mesh
            name="bonedeform1_63"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_63.geometry}
            material={nodes.bonedeform1_63.material}
          />
        </group>
        <group name="piece_64">
          <mesh
            name="bonedeform1_64"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_64.geometry}
            material={nodes.bonedeform1_64.material}
          />
        </group>
        <group name="piece_65">
          <mesh
            name="bonedeform1_65"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_65.geometry}
            material={nodes.bonedeform1_65.material}
          />
        </group>
        <group name="piece_66">
          <mesh
            name="bonedeform1_66"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_66.geometry}
            material={nodes.bonedeform1_66.material}
          />
        </group>
        <group name="piece_67">
          <mesh
            name="bonedeform1_67"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_67.geometry}
            material={nodes.bonedeform1_67.material}
          />
        </group>
        <group name="piece_68">
          <mesh
            name="bonedeform1_68"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_68.geometry}
            material={nodes.bonedeform1_68.material}
          />
        </group>
        <group name="piece_69">
          <mesh
            name="bonedeform1_69"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_69.geometry}
            material={nodes.bonedeform1_69.material}
          />
        </group>
        <group name="piece_70">
          <mesh
            name="bonedeform1_70"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_70.geometry}
            material={nodes.bonedeform1_70.material}
          />
        </group>
        <group name="piece_71">
          <mesh
            name="bonedeform1_71"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_71.geometry}
            material={nodes.bonedeform1_71.material}
          />
        </group>
        <group name="piece_72">
          <mesh
            name="bonedeform1_72"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_72.geometry}
            material={nodes.bonedeform1_72.material}
          />
        </group>
        <group name="piece_73">
          <mesh
            name="bonedeform1_73"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_73.geometry}
            material={nodes.bonedeform1_73.material}
          />
        </group>
        <group name="piece_74">
          <mesh
            name="bonedeform1_74"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_74.geometry}
            material={nodes.bonedeform1_74.material}
          />
        </group>
        <group name="piece_75">
          <mesh
            name="bonedeform1_75"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_75.geometry}
            material={nodes.bonedeform1_75.material}
          />
        </group>
        <group name="piece_76">
          <mesh
            name="bonedeform1_76"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_76.geometry}
            material={nodes.bonedeform1_76.material}
          />
        </group>
        <group name="piece_77">
          <mesh
            name="bonedeform1_77"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_77.geometry}
            material={nodes.bonedeform1_77.material}
          />
        </group>
        <group name="piece_78">
          <mesh
            name="bonedeform1_78"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_78.geometry}
            material={nodes.bonedeform1_78.material}
          />
        </group>
        <group name="piece_79">
          <mesh
            name="bonedeform1_79"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_79.geometry}
            material={nodes.bonedeform1_79.material}
          />
        </group>
        <group name="piece_80">
          <mesh
            name="bonedeform1_80"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_80.geometry}
            material={nodes.bonedeform1_80.material}
          />
        </group>
        <group name="piece_81">
          <mesh
            name="bonedeform1_81"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_81.geometry}
            material={nodes.bonedeform1_81.material}
          />
        </group>
        <group name="piece_82">
          <mesh
            name="bonedeform1_82"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_82.geometry}
            material={nodes.bonedeform1_82.material}
          />
        </group>
        <group name="piece_83">
          <mesh
            name="bonedeform1_83"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_83.geometry}
            material={nodes.bonedeform1_83.material}
          />
        </group>
        <group name="piece_84">
          <mesh
            name="bonedeform1_84"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_84.geometry}
            material={nodes.bonedeform1_84.material}
          />
        </group>
        <group name="piece_85">
          <mesh
            name="bonedeform1_85"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_85.geometry}
            material={nodes.bonedeform1_85.material}
          />
        </group>
        <group name="piece_86">
          <mesh
            name="bonedeform1_86"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_86.geometry}
            material={nodes.bonedeform1_86.material}
          />
        </group>
        <group name="piece_87">
          <mesh
            name="bonedeform1_87"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_87.geometry}
            material={nodes.bonedeform1_87.material}
          />
        </group>
        <group name="piece_88">
          <mesh
            name="bonedeform1_88"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_88.geometry}
            material={nodes.bonedeform1_88.material}
          />
        </group>
        <group name="piece_89">
          <mesh
            name="bonedeform1_89"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_89.geometry}
            material={nodes.bonedeform1_89.material}
          />
        </group>
        <group name="piece_90">
          <mesh
            name="bonedeform1_90"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_90.geometry}
            material={nodes.bonedeform1_90.material}
          />
        </group>
        <group name="piece_91">
          <mesh
            name="bonedeform1_91"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_91.geometry}
            material={nodes.bonedeform1_91.material}
          />
        </group>
        <group name="piece_92">
          <mesh
            name="bonedeform1_92"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_92.geometry}
            material={nodes.bonedeform1_92.material}
          />
        </group>
        <group name="piece_93">
          <mesh
            name="bonedeform1_93"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_93.geometry}
            material={nodes.bonedeform1_93.material}
          />
        </group>
        <group name="piece_94">
          <mesh
            name="bonedeform1_94"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_94.geometry}
            material={nodes.bonedeform1_94.material}
          />
        </group>
        <group name="piece_95">
          <mesh
            name="bonedeform1_95"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_95.geometry}
            material={nodes.bonedeform1_95.material}
          />
        </group>
        <group name="piece_96">
          <mesh
            name="bonedeform1_96"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_96.geometry}
            material={nodes.bonedeform1_96.material}
          />
        </group>
        <group name="piece_97">
          <mesh
            name="bonedeform1_97"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_97.geometry}
            material={nodes.bonedeform1_97.material}
          />
        </group>
        <group name="piece_98">
          <mesh
            name="bonedeform1_98"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_98.geometry}
            material={nodes.bonedeform1_98.material}
          />
        </group>
        <group name="piece_99">
          <mesh
            name="bonedeform1_99"
            castShadow
            receiveShadow
            geometry={nodes.bonedeform1_99.geometry}
            material={nodes.bonedeform1_99.material}
          />
        </group>
      </group>
    </group>
  )
}
