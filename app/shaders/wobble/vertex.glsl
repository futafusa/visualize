uniform float uTime;
uniform float uPositionFrequency;
uniform float uTimeFrequency;
uniform float uStrength;
uniform float uWarpPositionFrequency;
uniform float uWarpTimeFrequency;
uniform float uWarpStrength;

varying vec2 vUv;
varying float vWobble;
attribute vec4 tangent;

#include "../_includes/simplexNoise4d.glsl"

float getWobble(vec3 position) {
  vec3 warpedPosition = position;
  warpedPosition += simplexNoise4d(
    vec4(
      position * uWarpPositionFrequency,
      uTime * uWarpTimeFrequency
    )
  ) * uWarpStrength;

  return simplexNoise4d(vec4(
    warpedPosition * uPositionFrequency,
    uTime * uTimeFrequency
  )) * uStrength;
}

void main() {
  vec3 bitangent = cross(normal, tangent.xyz);

  // neighboring positions
  float shift = 0.01;
  vec3 p1 = csm_Position + tangent.xyz * shift;
  vec3 p2 = csm_Position + bitangent * shift;

  float wobble = getWobble(csm_Position);
  csm_Position += wobble * normal;
  p1 += getWobble(p1) * normal;
  p2 += getWobble(p2) * normal;

  // compute normal
  vec3 toP1 = normalize(p1 - csm_Position);
  vec3 toP2 = normalize(p2 - csm_Position);
  csm_Normal = cross(toP1, toP2);

  // varyings
  vUv = uv;
  vWobble = wobble / uStrength;
}
