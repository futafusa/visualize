uniform float uTime;
varying vec2 vUv;
varying float vWobble;
attribute vec4 tangent;
#include "../_includes/simplexNoise4d.glsl";

float strength = 0.1;
float frequency = 1.0;
float timeFrequency = 0.2;

float atan2(in float y, in float x){
  return x == 0.0 ? sign(y) * PI / 2.0 : atan(y, x);
}

float setWobble(vec3 position) {
  vec3 warpPosition = vec3(cos(position.x * 4.0), position.y, sin(position.z * 4.0)) * frequency;
  // warpPosition += simplexNoise4d(vec4(warpPosition*1.0, uTime * timeFrequency));

  float wobble = simplexNoise4d(vec4(warpPosition, uTime * timeFrequency)) * strength;
  return wobble;
}

void main() {
  // compute twist
  // vec2 twistPosition = position.xz;
  // float r = length(twistPosition);
  // float angle = atan2(twistPosition.y, twistPosition.x);
  // float twistAngle = PI * 1.0;
  // float new_theta = angle + twistAngle * normalize(csm_Position.y);
  // vec2 twistedPosition = vec2(cos(new_theta), sin(new_theta)) * r;
  // csm_Position.xz = twistedPosition;

  // compute wobble
  float wobble = setWobble(csm_Position);
  csm_Position += wobble * normal;

  // conpute normal
  vec3 biTangent = cross(normal, tangent.xyz);
  float shift = 0.5;
  vec3 pos1 = csm_Position + tangent.xyz * shift;
  vec3 pos2 = csm_Position + biTangent * shift;
  pos1 += setWobble(pos1) * normal;
  pos2 += setWobble(pos2) * normal;
  vec3 normal1 = normalize(pos1 - csm_Position);
  vec3 normal2 = normalize(pos2 - csm_Position);
  // set normal
  // csm_Normal = cross(normal1, normal2);

  vUv = uv;
  vWobble = wobble / strength;
}