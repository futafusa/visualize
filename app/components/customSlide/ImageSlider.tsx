import { useThree, useFrame, extend, ReactThreeFiber } from "@react-three/fiber";
import { useTexture, shaderMaterial } from "@react-three/drei";
import { useSlider } from "./useSlider";
import { useEffect, useState, useRef } from "react";
import * as THREE from "three";
import { useSpring } from "motion/react";

const vertexShader = `
  varying vec2 vUv;
  varying float vPushed;

  uniform float uPushForce;
  uniform vec2 uMousePosition;

  void main() {
    vUv = uv;
    vec2 centerdUv = (vUv - 0.5) * 2.0;
    float pushed = length(centerdUv - uMousePosition);
    pushed = 1.0 - smoothstep(0.0, 1.5, pushed);
    pushed = -uPushForce * pushed;
    vPushed = pushed;
    vec3 dispPosition = position;
    dispPosition.z += pushed;
    
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(dispPosition, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying float vPushed;

  uniform sampler2D uTexture; 
  uniform sampler2D uPrevTexture;
  uniform float uProgression;
  uniform float uDirection;

  float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
  }

  float noise(vec2 p){
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);

    float res = mix(
      mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
      mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
    return res*res;
  }

  float sdRoundedBox( in vec2 p, in vec2 b, in vec4 r ) {
    r.xy = (p.x>0.0) ? r.xy : r.zw;
    r.x  = (p.y>0.0) ? r.x  : r.y;
    vec2 q = abs(p) - b + r.x;
    return min(max(q.x, q.y), 0.0) + length(max(q,0.0)) - r.x;
  }

  void main() {
    vec2 uv = vUv;
    float noiseFactor = noise(gl_FragCoord.xy * 0.5);

    vec2 distortedPosition = vec2(uv.x - float(uDirection) * (1.0 - uProgression) * noiseFactor, uv.y);
    float curTextureR = texture2D(uTexture, distortedPosition + vec2(vPushed * 0.052)).r;
    float curTextureG = texture2D(uTexture, distortedPosition + vec2(vPushed * 0.012)).g;
    float curTextureB = texture2D(uTexture, distortedPosition + vec2(vPushed * -0.022)).b;
    float curTextureA = texture2D(uTexture, distortedPosition).a;
    vec4 curTexture = vec4(curTextureR, curTextureG, curTextureB, curTextureA);
              
    vec2 distortedPositionPrev = vec2(uv.x + float(uDirection) * uProgression * noiseFactor, uv.y);
    vec4 prevTexture = texture2D(uPrevTexture, distortedPositionPrev);

    vec4 finalTexture = mix(prevTexture, curTexture, uProgression);

    // vec2 centeredUv = (vUv - 0.5) * 2.0;
    // float frame = sdRoundedBox(centeredUv, vec2(1.0), vec4(0.2, 0.0, 0.0, 0.2));
    // frame = smoothstep(0.0, 0.002, -frame);
    // finalTexture.a *= frame;

    gl_FragColor = finalTexture;

    #include <colorspace_fragment>
  }
`;

const PUSH_FORCE = 2.4;

const ImageSliderMaterial = shaderMaterial(
  {
    uTexture: null,
    uPrevTexture: null,
    uProgression: 0.5,
    uDirection: 1,
    uPushForce: PUSH_FORCE,
    uMousePosition: [0, 0],
  },
  vertexShader,
  fragmentShader
);
extend({ ImageSliderMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    imageSliderMaterial: ReactThreeFiber.Object3DNode<
      THREE.ShaderMaterial, 
      typeof ImageSliderMaterial
    > & {
      uTexture?: THREE.Texture
      uPrevTexture?: THREE.Texture
      uProgression?: number
      uDirection?: number
      uPushForce?: number
      uMousePosition?: [number, number]
    }
  }
}

export default function ImageSlider(
  {width = 3, height = 3, fillPercent = 0.8}: 
  {width?: number, height?: number, fillPercent?: number}
){
  // 大きさ調整
  const viewport = useThree((state) => state.viewport);
  let ratio = viewport.height  / (height / fillPercent);
  if(viewport.width < viewport.height){
    ratio = viewport.width / (width / fillPercent);
  }

  // global state
  const { items, currentIndex, direction } = useSlider();
  
  // 画像読み込み
  const image = items[currentIndex].image;
  const texture = useTexture(image);
  const [lastImage, setLastImage] = useState(image);
  const prevTexture = useTexture(lastImage);
  const refMaterial = useRef<THREE.ShaderMaterial>(null);
  const hovered = useRef(false);

  useSlider.getState().items.forEach((item) => {
    useTexture.preload(item.image);
  });

  const [transition, setTransition] = useState(false);
  const progression = useSpring(0, { stiffness: 1500, damping: 250, mass: 2 });

  texture.wrapS = texture.wrapT = prevTexture.wrapS = prevTexture.wrapT = THREE.RepeatWrapping;

  useEffect(() => {
    const newImage = image;
    const material = refMaterial.current as THREE.ShaderMaterial;
    material.uniforms.uProgression.value = 0;
    progression.setCurrent(0);
    progression.set(1.0);

    material.uniforms.uMousePosition.value = [direction === "prev" ? -1 : 1, 0];
    setTransition(true);

    const timeOut = setTimeout(() => {
      setTransition(false);
    }, 1600);

    return () => {
      setLastImage(newImage);
      clearTimeout(timeOut);
    };
  }, [image]);

  useFrame((state) => {
    if(!refMaterial.current) return;
    const material = refMaterial.current;

    material.uniforms.uProgression.value = THREE.MathUtils.lerp(material.uniforms.uProgression.value, 1.0, 0.1);
    
    material.uniforms.uMousePosition.value = [
      THREE.MathUtils.lerp(
        material.uniforms.uMousePosition.value[0],
        transition
          ? (direction === "prev" ? -1 : 1) * material.uniforms.uProgression.value
          : state.pointer.x,
        0.05
      ),
      THREE.MathUtils.lerp(
        material.uniforms.uMousePosition.value[1],
        transition
          ? -1.0 * material.uniforms.uProgression.value
          : state.pointer.y,
        0.05
      ),
    ];

    material.uniforms.uPushForce.value = THREE.MathUtils.lerp(
      material.uniforms.uPushForce.value,
      transition
        ? PUSH_FORCE * 0.82 * Math.sin(material.uniforms.uProgression.value * Math.PI)
        : hovered.current
          ? PUSH_FORCE
          : 0.0,
      0.05
    );
  });

  return (  
    <mesh
      onPointerEnter={() => (hovered.current = true)}
      onPointerLeave={() => (hovered.current = false)}
    >
      <planeGeometry args={[width * ratio, height * ratio, 32, 32]} />
      <imageSliderMaterial
        ref={refMaterial}
        uTexture={texture}
        uPrevTexture={prevTexture}
        uProgression={0.5}
        uDirection={direction === "next" ? 1 : -1}
        wireframe={false}
        transparent={true}
      />
    </mesh>
  );
}
