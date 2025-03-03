import { useThree, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useSlider } from "./useSlider";
import { useEffect, useState, useMemo, useRef } from "react";
import * as THREE from "three";

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
  uniform float uProgression;

  void main() {
    vec2 uv = vUv;
    vec4 curTexture = texture2D(uTexture, vUv);
    vec4 prevTexture = texture2D(uPrevTexture, vUv);

    vec4 finalTexture = mix(prevTexture, curTexture, uProgression);
    gl_FragColor = finalTexture;
  }
`;

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

  // 画像読み込み
  const { items, currentIndex } = useSlider();
  const image = items[currentIndex].image;
  const texture = useTexture(image);
  const [lastImage, setLastImage] = useState(image);
  const prevTexture = useTexture(lastImage);
  const refMaterial = useRef<THREE.Mesh>(null);

  useSlider.getState().items.forEach((item) => {
    useTexture.preload(item.image);
  });

  const customShaderMaterial = useMemo(() => {    
    return new THREE.ShaderMaterial({
      uniforms: {
        uTexture: { value: texture },
        uPrevTexture: { value: prevTexture },
        uProgression: { value: 0.5 },
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
    })
  }, [texture, prevTexture])

  useEffect(() => {
    const newImage = image;
    if(refMaterial.current){
      const material = refMaterial.current.material as THREE.ShaderMaterial;
      material.uniforms.uProgression.value = 0;
    }

    return () => {
      setLastImage(newImage);
    };
  }, [image]);

  useFrame(() => {
    if(refMaterial.current){
      const material = refMaterial.current.material as THREE.ShaderMaterial;
      material.uniforms.uProgression.value = THREE.MathUtils.lerp(material.uniforms.uProgression.value, 1.0, 0.02);
    }
  });

  return (  
   <mesh ref={refMaterial} material={customShaderMaterial}>
      <planeGeometry args={[width * ratio, height * ratio]} />
    </mesh>
  );
}
