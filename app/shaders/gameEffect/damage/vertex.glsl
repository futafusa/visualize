uniform float uTime;
uniform vec3 uColor;
uniform bool uIsDamage;

#include "../../_includes/simplexNoise4d.glsl";

void main() {
  vec3 pos = position;
  
  float strength = uIsDamage ? 0.8 : 0.0;
  float distortion = simplexNoise4d(vec4(position*10.0, uTime * 5.0)) * strength;

  pos += normal * distortion;
  
  csm_Position = pos;
}