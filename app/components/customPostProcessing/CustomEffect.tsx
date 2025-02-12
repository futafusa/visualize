import { forwardRef } from 'react'
import { Effect } from 'postprocessing'
import { Uniform } from 'three'

// フラグメントシェーダー
const fragmentShader = /* glsl */ `
  uniform float intensity;

  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // ここに効果を実装
    // 例：簡単な明るさ調整
    outputColor = inputColor * intensity;
  }
`

// エフェクトクラス
class CustomEffectImpl extends Effect {
  constructor() {
    super('CustomEffect', fragmentShader, {
      uniforms: new Map([
        ['intensity', new Uniform(1.0)]
      ])
    })
  }
}

// React componentとして使用するためのラッパー
export const CustomEffect = forwardRef((props, ref) => {
  return <primitive object={new CustomEffectImpl()} ref={ref} />
}) 