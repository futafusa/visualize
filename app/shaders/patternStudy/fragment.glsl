varying vec2 vUv;
uniform float uTime;
uniform float testParam;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uImageAspect;
uniform float uPlaneAspect;
#define PI 3.1415926535897932384626433832795

#include "../_includes/cnoise2d.glsl"

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

void main() {
  // グラデーション
  // float strength = vUv.x * 10.0;

  float strength = step(testParam, vUv.x);

  // 縞模様
  // float strength = mod(vUv.x * 10.0, 1.0);
  // strength = step(0.5, strength);

  // 縞模様応用
  // float strength = step(0.8, mod(vUv.x * 10.0, 1.0));
  // strength += step(0.8, mod(vUv.y * 10.0, 1.0));

  // ドット
  // float strength = step(0.4, mod(vUv.x * 10.0, 1.0));
  // strength *= step(0.9, mod(vUv.y * 10.0, 1.0));

  // ドット応用
  // float strength = step(0.4, mod(vUv.x * 10.0, 1.0) * step(0.8, mod(vUv.y * 10.0, 1.0)));
  // strength += step(0.4, mod(vUv.y * 10.0, 1.0) * step(0.8, mod(vUv.x * 10.0, 1.0)));

  // x軸のオフセット
  // float strength = abs(vUv.x - 0.5);

  // float strength = max(abs(vUv.x - 0.5), abs(vUv.y - 0.5));

  // 反転して、すこし小さくして乗算
  // float strength = step(0.2, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));
  // strength *= 1.0 - step(0.25, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5)));

  // 10倍してfloorで切り下げ、それを10で割る
  // float strength = floor(vUv.x * 10.0) / 10.0;

  // float strength = floor(vUv.x * 10.0) / 10.0 * floor(vUv.y * 10.0) / 10.0;

  // ランダム関数と合わせてドットパターン、組み合わせでひし形にもできる
  // vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor(vUv.y * 10.0) / 10.0);
  // float strength = random(gridUv);
  // vec2 gridUv = vec2(floor(vUv.x * 10.0) / 10.0, floor((vUv.y + vUv.x) * 10.0) / 10.0);
  // float strength = gridUv.y;

  // 距離
  // float strength = length(vUv);
  // float strength = distance(vUv, vec2(0.5));

  // 距離の応用
  // float strength = 0.02 / distance(vUv, vec2(0.5));
  // float strength = 0.015 / distance(vec2(vUv.x, (vUv.y - 0.5) * 5.0 + 0.5), vec2(0.5));
  // float strength = distance(vec2(vUv.x, (vUv.y + 0.5) * 5.0 - 4.5), vec2(0.5));
  // strength += 0.015 / distance(vec2(vUv.y, (vUv.x - 0.5) * 5.0 + 0.5), vec2(0.5));
  // float strength = step(0.5, distance(vUv, vec2(0.5)) + 0.25);

  // 距離の応用2
  // float strength = 1.0 - step(0.02, abs(distance(vUv, vec2(0.5)) - testParam));
  // vec2 waveUv = vec2(vUv.x + sin(vUv.y * testParam * 100.0) * 0.1, vUv.y + sin(vUv.x * testParam * 100.0) * 0.1);
  // float strength = 1.0 - step(0.02, abs(distance(waveUv, vec2(0.5)) - 0.25));

  // atanを使った角度の応用
  // float angle = atan(vUv.x - 0.5, vUv.y - 0.5) / (PI * 2.0) + 0.5;
  // float strength = angle;

  // float strength = mod(angle * 3.0, 1.0);
  // float strength = sin(angle * 50.0);

  // atanを使った角度の応用2
  // float radius = 0.25 + sin(angle * 100.0) * 0.02;
  // float strength = 1.0 - step(0.01, abs(distance(vUv, vec2(0.5)) - radius));

  // ノイズ関数を使ったサンプル
  // float strength = cnoise(vUv * 30.0);
  // float strength = step(testParam, cnoise(vUv * 10.0));
  // float strength = 1.0 - abs(cnoise(vUv * 10.0));
  // float strength = step(testParam, sin(cnoise(vUv * 10.0) * 20.0 ));

  // vec3 backColor = vec3(0.0);
  // vec3 frontColor = vec3(vUv, 1.0);
  // vec3 color = mix(backColor, frontColor, strength);

  vec3 color = vec3(strength);
  gl_FragColor = vec4(color, 1.0);
}