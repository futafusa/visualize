import { forwardRef, useMemo } from 'react'
import { Effect } from 'postprocessing'
import { Uniform } from 'three'

// フラグメントシェーダー
const fragmentShader = /* glsl */ `
  uniform float pixelSize; // ピクセルのサイズ
  uniform vec2 resolution; // 画面の解像度

  // mainimageはpostprocessingのEffectのデフォルトの関数名
  // inputColor: ピクセルの色, uv: ピクセルの座標, outputColor: 出力する色
  void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // UV座標をピクセルグリッドに変換
    vec2 pixels = uv * resolution;
    
    // ピクセルサイズでグリッド化
    vec2 gridUV = floor(pixels / pixelSize) * pixelSize;
    
    // 正規化されたUV座標に戻す
    vec2 pixelatedUV = gridUV / resolution;
    
    // ピクセル化されたテクスチャをサンプリング
    outputColor = texture2D(inputBuffer, pixelatedUV);
  }
`
// エフェクトクラス
class CustomEffect extends Effect {
  constructor(pixelSize: number = 8.0) {
    super('CustomEffectPixelate', fragmentShader, {
      uniforms: new Map<string, Uniform<number | Float32Array>>([
        ['pixelSize', new Uniform(pixelSize)],
        ['resolution', new Uniform(new Float32Array([window.innerWidth, window.innerHeight]))]
      ])
    })
  }
}

// React componentとして使用するためのラッパー
export const CustomEffectPixelate = forwardRef(({ pixelSize = 8.0 }: { pixelSize?: number }, ref) => {
  const effect = useMemo(() => new CustomEffect(pixelSize), [pixelSize])
  return <primitive ref={ref} object={effect} />
}) 