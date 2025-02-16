import { forwardRef, useMemo } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { Effect } from 'postprocessing'

const fragmentShader = /* glsl */ `
  uniform sampler2D depthMap;
  uniform sampler2D normalMap;
  uniform vec4 resolution;
  uniform float normalEdgeStrength;
  uniform float depthEdgeStrength;

  float getDepth(vec2 uv, int x, int y) {
    return texture2D(depthMap, uv + vec2(x, y) * resolution.zw).r;
  }

  vec3 getNormal(vec2 uv, int x, int y) {
    // テクスチャから取得したvec3の値を*2-1して（-1〜1）の範囲に変換
    return texture2D(normalMap, uv + vec2(x, y) * resolution.zw ).rgb * 2.0 - 1.0;
  }

  float neighborNormalEdgeIndicator(vec2 uv, int x, int y, float depth, vec3 normal) {
    float depthDiff = getDepth(uv, x, y) - depth;
    
    // 現在のピクセルと隣接ピクセルの法線ベクトルの差を計算し、バイアス方向との内積を取る
    vec3 normalEdgeBias = vec3(1.0, 1.0, 1.0);
    float normalDiff = dot(normal - getNormal(uv, x, y), normalEdgeBias);

    // 法線ベクトルの差が閾値を超えた場合、1.0を返す
    float normalIndicator = clamp(smoothstep(-0.01, 0.01, normalDiff), 0.0, 1.0);
    // デプスの差が閾値を超えた場合、1.0を返す
    float depthIndicator = clamp(sign(depthDiff * 0.25 + 0.0025), 0.0, 1.0);

    // 法線ベクトルの差とデプスの差を乗算して返す
    return distance(normal, getNormal(uv, x, y)) * depthIndicator * normalIndicator;
  }

  float depthEdgeIndicator(vec2 uv) {
    float depth = getDepth(uv, 0, 0);
    vec3 normal = getNormal(uv, 0, 0);

    float diff = 0.0;
    diff += clamp(getDepth(uv, 1, 0) - depth, 0.0, 1.0);
    diff += clamp(getDepth(uv, -1, 0) - depth, 0.0, 1.0);
    diff += clamp(getDepth(uv, 0, 1) - depth, 0.0, 1.0);
    diff += clamp(getDepth(uv, 0, -1) - depth, 0.0, 1.0);

    return floor(smoothstep(0.01, 0.02, diff) * 2.0) / 2.0;
  }

  float normalEdgeIndicator(vec2 uv) {
    float depth = getDepth(uv, 0, 0);
    vec3 normal = getNormal(uv, 0, 0);

    float indicator = 0.0;
    indicator += neighborNormalEdgeIndicator(uv, 0, -1, depth, normal);
    indicator += neighborNormalEdgeIndicator(uv, 0, 1, depth, normal);
    indicator += neighborNormalEdgeIndicator(uv, -1, 0, depth, normal);
    indicator += neighborNormalEdgeIndicator(uv, 1, 0, depth, normal);

    return step(0.1, indicator);
  }

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    float normalEdgeCoefficient = normalEdgeStrength;
    float depthEdgeCoefficient = depthEdgeStrength;

    float depthEdgeIndicator = depthEdgeIndicator(uv);
    float normalEdgeIndicator = normalEdgeIndicator(uv);

    float coefficient = depthEdgeIndicator > 0.0 // デプスエッジが検出された場合
      ? (1.0 - depthEdgeCoefficient * depthEdgeIndicator)
      : (1.0 + normalEdgeCoefficient * normalEdgeIndicator); // 法線エッジが検出された場合

    outputColor = inputColor * coefficient;
    // outputColor = inputColor;
    // outputColor = vec4(1.0 - vec3(coefficient), 1.0);
  }
`

class CustomEffect extends Effect {
  scene: THREE.Scene;
  camera: THREE.Camera;
  mainRenderTarget: THREE.WebGLRenderTarget;
  normalRenderTarget: THREE.WebGLRenderTarget;
  normalMaterial: THREE.Material;

  constructor(scene: THREE.Scene, camera: THREE.Camera, normalEdgeStrength: number, depthEdgeStrength: number) {
    super('CustomEffectEdge', fragmentShader, {
      uniforms: new Map<string, THREE.Uniform<any>>([
        ["depthMap", new THREE.Uniform(null)],
        ["normalMap", new THREE.Uniform(null)], 
        ["resolution", new THREE.Uniform(new THREE.Vector4(window.innerWidth, window.innerHeight, 1.0 / window.innerWidth, 1.0 / window.innerHeight))],
        ["normalEdgeStrength", new THREE.Uniform(normalEdgeStrength)],
        ["depthEdgeStrength", new THREE.Uniform(depthEdgeStrength)],
      ])
    })

    this.mainRenderTarget = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        depthTexture: new THREE.DepthTexture(window.innerWidth, window.innerHeight),
        depthBuffer: true,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
      }
    );

    this.normalRenderTarget = new THREE.WebGLRenderTarget( window.innerWidth,
      window.innerHeight,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat
      }
    );

    this.scene = scene;
    this.camera = camera;
    this.normalMaterial = new THREE.MeshNormalMaterial();
  }

  update(renderer: THREE.WebGLRenderer) {
    // シーンをmainRenderTargetに描画（depthMapも同時に作成）
    renderer.setRenderTarget(this.mainRenderTarget);
    renderer.render(this.scene, this.camera);
    
    // renderTargetに対してnormalMaterialを適用して描画
    const overrideMaterial = this.scene.overrideMaterial;
    renderer.setRenderTarget(this.normalRenderTarget);
    this.scene.overrideMaterial = this.normalMaterial;
    renderer.render(this.scene, this.camera);

    // マテリアルを元に戻してデフォルトのrenderTargetに描画
    this.scene.overrideMaterial = overrideMaterial;
    renderer.setRenderTarget(null);

    this.uniforms.get('depthMap')!.value = this.mainRenderTarget.depthTexture;
    this.uniforms.get('normalMap')!.value = this.normalRenderTarget.texture;
  }
}

type CustomEffectEdgeProps = {
  normalEdgeStrength?: number,
  depthEdgeStrength?: number,
}

export const CustomEffectEdge = forwardRef(({normalEdgeStrength = 1.0, depthEdgeStrength = 0.5}: CustomEffectEdgeProps, ref) => {
  const { scene, camera } = useThree();
  
  const effect = useMemo(() => {
    return new CustomEffect(scene, camera, normalEdgeStrength, depthEdgeStrength)
  }, [scene, camera, normalEdgeStrength, depthEdgeStrength]);

  return <primitive ref={ref} object={effect} />
})
