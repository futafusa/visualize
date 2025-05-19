import * as THREE from "three";
import { useState, useEffect, useRef } from "react";
import { useThree, extend, ReactThreeFiber, useFrame } from "@react-three/fiber";
import { useTexture, shaderMaterial } from "@react-three/drei";
import { useSliderStore } from "./sliderStore";

export default function SliderImage(
  {width = 3, height = 3, fillPercent = 0.8}:
  {width?: number, height?: number, fillPercent?: number}
){
  // viewport基準のサイズ調整
  const viewport = useThree((state) => state.viewport);
  let ratio = viewport.height / (height / fillPercent);
  if(viewport.width < viewport.height) ratio = viewport.width / (width / fillPercent);

  // Slider State
  const { currentIndex, direction, sliderItems } = useSliderStore();
  const imagePath = sliderItems[currentIndex].imagePath;
  const texture = useTexture(imagePath);
  const [prevImagePath, setPrevImagePath] = useState(imagePath);
  const prevTexture = useTexture(prevImagePath);
  const refMaterial = useRef<any>(null);

  // texture.flipY = prevTexture.flipY = false;
  // texture.wrapS = texture.wrapT = prevTexture.wrapS = prevTexture.wrapT = THREE.RepeatWrapping;

  useEffect(() => {
    // 新しい画像を格納
    const newImagePath = imagePath;
    if(refMaterial.current) {
      refMaterial.current.uProgress = 0;
      // refMaterial.current.uTime = 0.0;
    }

    return () => {
      // imagePathが変わるとき（アンマウント時）に現在の画像を一つ前の画像として保持
      setPrevImagePath(newImagePath);
    }
  }, [imagePath]);

  useSliderStore.getState().sliderItems.forEach((item) => {
    useTexture.preload(item.imagePath);
  });

  useFrame((state, delta) => {
    if(refMaterial.current) {
      refMaterial.current.uProgress = THREE.MathUtils.lerp(
        refMaterial.current.uProgress, 1, 0.001
      );
      refMaterial.current.uTime += delta / 10.0;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[1920*0.01, 1080*0.01, 200, 124]} />
      {/* <boxGeometry args={[width * ratio, height * ratio, width * ratio]} /> */}
      {/* <cylinderGeometry args={[1, 1, 3]} /> */}
      <sliderImageMaterial
        ref={refMaterial}
        uTexture={texture}
        uPrevTexture={prevTexture}
        uProgress={0.5}
        uDirection={direction === "next" ? 1.0 : -1.0}
        uTime={0.0}
        wireframe={true}
        // side={THREE.DoubleSide}
      />
    </mesh>
  );
}

const vertexShader = `
  varying vec2 vUv;
  uniform float uTime;

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

  void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    modelPosition.x += noise(modelPosition.xz * 0.5 + uTime) * 0.1;
    modelPosition.y += noise(modelPosition.xz * 0.5 + uTime) * 0.2;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectionPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectionPosition;
    
    vUv = uv;
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform sampler2D uPrevTexture;
  uniform float uProgress;
  uniform float uDirection;
  uniform float uTime;
  #define OCTAVES 4

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
  
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;

    for(int i = 0; i < OCTAVES; i++) {
      value += amplitude * noise(p);
      p *= 2.0;
      amplitude *= 0.5;
    }

    return value;
  }

  void main() {
    vec2 uv = vUv;
    float noiseFactor = fbm(gl_FragCoord.xy * 0.1 + uProgress);
    
    vec2 distortedPosition = vec2(uv.x - float(uDirection) * (1.0 - uProgress) * noiseFactor, uv.y);
    vec4 curTexture = texture2D(uTexture, distortedPosition);

    vec2 distortedPositionPrev = vec2(uv.x + float(uDirection) * uProgress * noiseFactor, uv.y);
    vec4 prevTexture = texture2D(uPrevTexture, distortedPositionPrev);

    vec4 finalTexture = mix(prevTexture, curTexture, uProgress);
    gl_FragColor = finalTexture;

    #include <colorspace_fragment>
  }
`;

const SliderImageMaterial = shaderMaterial(
  {
    uTexture: null,
    uPrevTexture: null,
    uProgress: 0.5,
    uDirection: 1,
    uTime: 0.0,
  },
  vertexShader,
  fragmentShader
);

extend({ SliderImageMaterial });

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'sliderImageMaterial': any
    }
  }
}