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
  float noise = cnoise(vec2(vUv.x * 10.0, vUv.y * 10.0)) * 0.2;
  // 中心で1.0、端で0.0
  float distanceFromCenter = 1.0 - abs(vUv.x - 0.5) * 2.0;
  noise *= distanceFromCenter;

  float gradient = 1.0 - step(testParam, vUv.y + noise);

  vec2 ratio = vec2(
    min(uPlaneAspect / uImageAspect, 1.0),
    min((1.0 / uPlaneAspect) / (1.0 / uImageAspect), 1.0)
  );

  vec2 fixedUv = vec2(
    (vUv.x - 0.5) * ratio.x + 0.5,
    (vUv.y - 0.5) * ratio.y + 0.5
  );

  float transitionNoise = cnoise(vUv * 10.0) * 0.2;
  float boundary = smoothstep(0.0, 0.2, abs(vUv.y - testParam));
  vec2 distordedUV = fixedUv;
  distordedUV.x += transitionNoise * (1.0 - boundary);

  vec3 texture1 = texture2D(uTexture1, distordedUV).rgb;
  vec3 texture2 = texture2D(uTexture2, distordedUV).rgb;

  vec3 color = mix(texture1, texture2, gradient);

  gl_FragColor = vec4(color, 1.0);
}