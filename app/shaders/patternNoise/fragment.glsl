varying vec2 vUv;
uniform float uTime;
uniform float uSpeed;
uniform float uScale;
uniform float uMultiplier;
uniform vec3 uDepthColor;
uniform vec3 uSurfaceColor;
uniform float uColorOffset;
#define PI 3.1415926535897932384626433832795

#include "../_includes/cnoise3d.glsl"

vec3 randomColor(float time, float scale) {
  float r = sin(cnoise3d(vec3(vUv * scale, time)));
  float g = sin(cnoise3d(vec3(vUv * scale, time + 1.0)));
  float b = sin(cnoise3d(vec3(vUv * scale, time + 2.0))) ;
  return vec3(r, g, b);
}

void main() {
  float time = uTime * uSpeed;
  vec2 displacedUv = 1.0 - abs(vUv + cnoise3d(vec3(vUv * uScale, time)));
  // vec2 displacedUv = step(vec2(0.6), vUv + cnoise3d(vec3(vUv * uScale, uTime)));

  float strength = sin(cnoise3d(vec3(displacedUv * uScale, time))) * 20.0;
  vec3 rndColor = randomColor(time, uScale) * 20.0;
  float rndStrength = sin(cnoise3d(vec3(vUv * uScale * 0.5, time)));

  vec3 color_fit = vec3(strength * rndStrength) * uMultiplier;
  vec3 color = (color_fit + rndColor) * uMultiplier;


  // test2
  float strength2 = cnoise3d(vec3(displacedUv * uScale, time));

  for(float i = 0.0; i < 3.0; i++) {
    strength2 -= abs(cnoise3d(vec3(displacedUv * uScale, time * 0.2)) * i);
  }

  vec3 color2 = vec3(strength2) * uMultiplier;
  vec3 mixColor = mix(uDepthColor, uSurfaceColor, strength2 + uColorOffset);
  gl_FragColor = vec4(mixColor, 1.0);

  #include <colorspace_fragment>
}