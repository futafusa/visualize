varying vec2 vUv;
uniform float uTime;
uniform float testParam;
uniform sampler2D uTexture1;
uniform sampler2D uTexture2;
uniform float uImageAspect;
uniform float uPlaneAspect;
#include "../_includes/cnoise2d.glsl"

vec2 ratio(float baseAspect, float imageAspect) {
  return vec2(min(baseAspect / imageAspect, 1.0), min((1.0 / baseAspect) / (1.0 / imageAspect), 1.0));
}

vec2 fixedUv(vec2 uv, vec2 ratio) {
  return vec2((uv.x - 0.5) * ratio.x + 0.5, (uv.y - 0.5) * ratio.y + 0.5);
}

void main() {
  float noise = cnoise(vec2(vUv.x * 10.0, vUv.y * 10.0)) * 2.0;
  // 中心で1.0、端で0.0、中心に行くほどノイズが大きくなるように調整
  float distanceFromCenter = (1.0 - abs(vUv.x - 0.5) * 2.0) * 0.5;
  noise *= distanceFromCenter;

  // float gradient = step(testParam, vUv.y);
  float gradient = (vUv.y * 5.0 - testParam * 5.0);
  gradient += noise;
  gradient = clamp(gradient, 0.0, 1.0);

  float transitionNoise = cnoise(vUv * 10.0) * 0.2;
  float boundary = smoothstep(0.0, 0.2, abs(vUv.y - testParam));
  vec2 distordedUV = fixedUv(vUv, ratio(uPlaneAspect, uImageAspect));
  distordedUV.x += transitionNoise * (1.0 - boundary);

  vec3 texture1 = texture2D(uTexture1, distordedUV).rgb;
  vec3 texture2 = texture2D(uTexture2, distordedUV).rgb;

  vec3 color = mix(texture1, texture2, gradient);
  // vec3 color = vec3(gradient);

  gl_FragColor = vec4(color, 1.0);
}