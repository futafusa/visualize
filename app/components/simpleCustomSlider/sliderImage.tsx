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
        refMaterial.current.uProgress, 1, 0.1
      );
      refMaterial.current.uTime += delta / 10.0;
    }
  });

  return (
    <mesh>
      <planeGeometry args={[width * ratio, height * ratio, 32, 32]} />
      {/* <boxGeometry args={[width * ratio, height * ratio, width * ratio]} /> */}
      {/* <cylinderGeometry args={[1, 1, 3]} /> */}
      <sliderImageMaterial
        ref={refMaterial}
        uTexture={texture}
        uPrevTexture={prevTexture}
        uProgress={0.5}
        uDirection={direction === "next" ? 1.0 : -1.0}
        uTime={0.0}
        // wireframe={true}
        // side={THREE.DoubleSide}
      />
    </mesh>
  );
}

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform sampler2D uPrevTexture;
  uniform float uProgress;
  uniform float uDirection;
  uniform float uTime;

  void main() {
    vec2 uv = vUv;
    vec2 uvPosition = vec2(uv.x - (1.0 - uProgress) * uDirection, uv.y);
    vec4 curTexture = texture2D(uTexture, uvPosition);

    vec2 uvPositionPrev = vec2(uv.x + uProgress * uDirection, uv.y);
    // vec2 uvPositionPrev = vec2(uv.x + 0.1, uv.y + 0.2);
    vec4 prevTexture = texture2D(uPrevTexture, uvPositionPrev);

    vec4 finalTexture = mix(prevTexture, curTexture, uProgress);

    vec4 color = finalTexture;
    gl_FragColor = color;

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