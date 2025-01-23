uniform float uTime;
uniform vec3 uColor;
uniform bool uIsFlash;

void main() {
  float flash = uIsFlash ? abs(sin(uTime * 20.0)) : 1.0;
  vec3 color = mix(vec3(1.0), vec3(uColor), flash);
  vec3 emissive = mix(vec3(uColor), vec3(0.0), flash) * 2.0;

  csm_DiffuseColor = vec4(color, 1.0);
  csm_Emissive = vec3(emissive);
}
