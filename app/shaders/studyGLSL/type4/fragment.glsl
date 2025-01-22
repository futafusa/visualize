varying vec2 vUv;
uniform float uTime;
uniform vec3 uColorDepth;
uniform vec3 uColorSurface;
#include "../../_includes/cnoise3d.glsl";

#define OCTAVES 4

float fbm(vec3 p) {
  float value = 0.0;
  float amplitude = 0.5;

  for(int i = 0; i < OCTAVES; i++) {
    value += amplitude * cnoise3d(p);
    p *= 2.0;
    amplitude *= 0.5;
  }

  return value;
}

vec3 blend(float a, float b){
  float time = abs(mod(0.1 * uTime, 2.0) - 1.0);
  vec3[2] col2 = vec3[](
      vec3(a, a, 1),
      vec3(0, b, b)
  );
  return mix(col2[0], col2[1], smoothstep(0.5 - 0.5 * time, 0.5 + 0.5 * time, b / (a + b)));
}

void main() {
  float time = uTime * 0.1;
  vec2 distortUv = vUv * fbm(vec3(vec2(vUv.x * 100.0, vUv.y + time), time));
  float strength = fbm(vec3(distortUv * 10.0, time));
  
  // float centerY = 0.5 + sin(uTime) * 0.5;
  // float gradient = pow(1.0 - distance(vUv, vec2(vUv.x, 0)), sin(uTime) * 5.0);
  // float finalStrength = strength * gradient;
  
  vec3 color = mix(uColorDepth, uColorSurface, strength);
  gl_FragColor = vec4(color, 1.0);

  // vec2 strength = vec2(fbm(vec3(distortUv * 10.0, time)), fbm(vec3(distortUv * 10.0 + 10.0, time)));
  // strength -= 0.5;

  // bvec2 b = bvec2(step(strength, vec2(0)));
  // vec4 x = vec4(
  //   b[0] && b[1], 
  //   b[0] && !b[1],
  //   !b[0] && b[1],
  //   !(b[0] || b[1])
  // );
  // vec3[4] color4 = vec3[](
  //   vec3(1, 0, 0),
  //   vec3(0, 1, 0),
  //   vec3(0, 0, 1),
  //   vec3(1, 1, 0)
  // );

  // for(int i = 0; i < 4; i++){
  //   gl_FragColor.rgb += x[i] * color4[i];
  // }
  // gl_FragColor.a = 1.0;
}