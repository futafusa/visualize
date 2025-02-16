import { forwardRef, useMemo } from 'react'
import { Effect } from 'postprocessing'
import * as THREE from 'three';

// フラグメントシェーダー
const fragmentShader = /* glsl */ `
  uniform vec4 resolution;
  uniform float pixelSize;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  vec3 sat(vec3 rgb, float adjustment) {
    const vec3 W = vec3(0.2125, 0.7154, 0.0721);
    vec3 intensity = vec3(dot(rgb, W));
    return mix(intensity, rgb, adjustment);
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec2 normalizedPixelSize = pixelSize / resolution.xy;
    float rowIndex = floor(uv.x / normalizedPixelSize.x);
    vec2 uvPixel = normalizedPixelSize * floor(uv / normalizedPixelSize);

    vec4 color = texture2D(inputBuffer, uvPixel);

    float luma = dot(vec3(0.2126, 0.7152, 0.0722), color.rgb);
    vec2 cellUV = fract(uv / normalizedPixelSize);
    // color = vec4(1.0);

    const float stripesMatrix[64] = float[64](
      0.2, 1.0, 1.0, 0.2, 0.2, 1.0, 1.0, 0.2,
      0.2, 0.2, 1.0, 1.0, 0.2, 0.2, 1.0, 1.0,
      1.0, 0.2, 0.2, 1.0, 1.0, 0.2, 0.2, 1.0,
      1.0, 1.0, 0.2, 0.2, 1.0, 1.0, 0.2, 0.2,
      0.2, 1.0, 1.0, 0.2, 0.2, 1.0, 1.0, 0.2,
      0.2, 0.2, 1.0, 1.0, 0.2, 0.2, 1.0, 1.0,
      1.0, 0.2, 0.2, 1.0, 1.0, 0.2, 0.2, 1.0,
      1.0, 1.0, 0.2, 0.2, 1.0, 1.0, 0.2, 0.2
    );

    const float crossStripeMatrix[64] = float[64](
      1.0, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 1.0,
      0.2, 1.0, 0.2, 0.2, 0.2, 0.2, 1.0, 0.2,
      0.2, 0.2, 1.0, 0.2, 0.2, 1.0, 0.2, 0.2,
      0.2, 0.2, 0.2, 1.0, 1.0, 0.2, 0.2, 0.2,
      0.2, 0.2, 0.2, 1.0, 1.0, 0.2, 0.2, 0.2,
      0.2, 0.2, 1.0, 0.2, 0.2, 1.0, 0.2, 0.2,
      0.2, 1.0, 0.2, 0.2, 0.2, 0.2, 1.0, 0.2,
      1.0, 0.2, 0.2, 0.2, 0.2, 0.2, 0.2, 1.0
    );

    int x = int(cellUV.x * 8.0);
    int y = int(cellUV.y * 8.0);
    int index = y * 8 + x;
    
    if(luma < 0.6) {
        color *= (stripesMatrix[index] > luma) ? vec4(1.0) : vec4(0.0, 0.31, 0.933, 1.0);
    } else {
        color *= (crossStripeMatrix[index] > luma) ? vec4(1.0) : vec4(0.0, 0.31, 0.933, 1.0);
    }

    outputColor = color;
  }
`
// エフェクトクラス
class CustomEffect extends Effect {
  constructor(pixelSize: number) {
    super('CustomEffectPixel', fragmentShader, {
      uniforms: new Map<string, THREE.Uniform<any>>([
        ['resolution', new THREE.Uniform(new THREE.Vector4(window.innerWidth, window.innerHeight, 1.0 / window.innerWidth, 1.0 / window.innerHeight))],
        ['pixelSize', new THREE.Uniform(pixelSize)]
      ])
    })
  }
}

// React componentとして使用するためのラッパー
export const CustomEffectPixel = forwardRef(({ pixelSize = 8 }: { pixelSize?: number }, ref) => {
  const effect = useMemo(() => new CustomEffect(pixelSize), [pixelSize])
  return <primitive ref={ref} object={effect} />
}) 