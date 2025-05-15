import * as THREE from "three";
import { useState, useEffect, useRef } from "react";
import { useThree, extend, ReactThreeFiber, useFrame } from "@react-three/fiber";
import { useTexture, shaderMaterial } from "@react-three/drei";
import { useSliderStore } from "./sliderStore";
import { useControls } from "leva";

export default function SliderImage(
  {width = 3, height = 3, fillPercent = 0.8}:
  {width?: number, height?: number, fillPercent?: number}
){
  // viewport基準のサイズ調整
  const viewport = useThree((state) => state.viewport);
  let ratio = viewport.height / (height / fillPercent);
  if(viewport.width < viewport.height) ratio = viewport.width / (width / fillPercent);

  // Slider State
  const { currentIndex, sliderItems, nextSlide } = useSliderStore();
  const imagePath = sliderItems[currentIndex].imagePath;
  const texture = useTexture(imagePath);
  const [prevImagePath, setPrevImagePath] = useState(imagePath);
  const prevTexture = useTexture(prevImagePath);
  const refMaterial = useRef<any>(null);

  const [isTransitioning, setIsTransitioning] = useState(false);
  const hasTriggeredNext = useRef(false);
  const timeline = useRef(0);

  // const controls = useControls('Transition', {
  //   speed: {
  //     value: 0.017,
  //     min: 0.001,
  //     max: 0.1,
  //     step: 0.001,
  //     label: 'scan speed'
  //   }
  // });

  // texture.flipY = prevTexture.flipY = false;
  // texture.wrapS = texture.wrapT = prevTexture.wrapS = prevTexture.wrapT = THREE.RepeatWrapping;

  useEffect(() => {
    // 新しい画像を格納
    const newImagePath = imagePath;
    if(refMaterial.current) {
      refMaterial.current.uProgress = 0;
      refMaterial.current.uScanProgress = 0;
      setIsTransitioning(true);
      hasTriggeredNext.current = false;
      timeline.current = 0;
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
    // timeline.current += delta * 0.5;
    timeline.current += delta * 0.017; 
    if(refMaterial.current) {
      refMaterial.current.uProgress = THREE.MathUtils.lerp(
        refMaterial.current.uProgress, 1, 0.05
      );
      refMaterial.current.uScanProgress = THREE.MathUtils.lerp(
        0, 1, timeline.current
      );
      refMaterial.current.uTime += delta;

      // uScanProgressが1に近づいたらnextSlideを実行
      if (isTransitioning && 
          refMaterial.current.uScanProgress > 1.0 && 
          !hasTriggeredNext.current) {
        hasTriggeredNext.current = true;
        timeline.current = 0;
        nextSlide();
      }
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
        uScanProgress={0.0}
        uTime={0.0}
        // wireframe={true}
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
    // vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // modelPosition.x += noise(modelPosition.xz * 0.5 + uTime) * 0.1;
    // modelPosition.y += noise(modelPosition.xz * 0.5 + uTime) * 0.2;

    // vec4 viewPosition = viewMatrix * modelPosition;
    // vec4 projectionPosition = projectionMatrix * viewPosition;
    vec4 projectionPosition = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
    
    gl_Position = projectionPosition;
    
    vUv = uv;
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform sampler2D uPrevTexture;
  uniform float uProgress;
  uniform float uScanProgress;
  uniform float uTime;

  void main() {
    vec2 uv = vUv;
    
    vec4 prevTexture = texture2D(uPrevTexture, vec2(1.0, uv.y));

    float edge = step(uv.x, uScanProgress);
    uv.x = mix(uv.x, uScanProgress, edge);

    vec4 curColor = texture2D(uTexture, uv);

    vec4 finalTexture = mix(prevTexture, curColor, uProgress);
    gl_FragColor = finalTexture;

    #include <colorspace_fragment>
  }
`;

const SliderImageMaterial = shaderMaterial(
  {
    uTexture: null,
    uPrevTexture: null,
    uProgress: 0.5,
    uScanProgress: 0.0,
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