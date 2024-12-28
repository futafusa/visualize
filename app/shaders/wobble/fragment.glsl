uniform float uTime;
varying vec2 vUv;
varying float vWobble;

void main() {
  // csm_Metalness = step(0.0, sin(vUv.y * 50.0));
  // csm_Roughness = 1.0 - step(0.0, sin(vUv.y * 50.0));

  vec3 color1 = vec3(0.4549, 0.9725, 0.1765);
  vec3 color2 = vec3(0.0, 1.0, 1.0);
  vec3 color = mix(color1, color2, vWobble);
  // csm_DiffuseColor.rgb = color;
}