import { forwardRef, useMemo } from 'react'
import { Effect } from 'postprocessing'
import { Uniform } from 'three'

// フラグメントシェーダー
const fragmentShader = /* glsl */ `
  uniform float lightIntensity;

  // mainimageはpostprocessingのEffectのデフォルトの関数名
  // inputColor: ピクセルの色
  // uv: ピクセルの座標
  // outputColor: 出力する色
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    outputColor = inputColor * lightIntensity;
  }
`
// エフェクトクラス
class CustomEffect extends Effect {
  constructor(lightIntensity: number) {
    super('CustomEffectSimple', fragmentShader, {
      uniforms: new Map([
        ['lightIntensity', new Uniform(lightIntensity)]
      ])
    })
  }
}

// React componentとして使用するためのラッパー
export const CustomEffectSimple = forwardRef(({ lightIntensity = 1.0 }: { lightIntensity?: number }, ref) => {
  const effect = useMemo(() => new CustomEffect(lightIntensity), [lightIntensity])
  return <primitive ref={ref} object={effect} />
}) 