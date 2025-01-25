uniform float uTime;
uniform vec3 uColor;
uniform bool uIsDamage;

void main() {
  float damage = uIsDamage ? abs(sin(uTime * 20.0)) : 1.0;
  vec3 color = mix(vec3(1.0), vec3(uColor), damage);
  vec3 emissive = mix(vec3(uColor), vec3(0.0), damage) * 2.0;

  csm_DiffuseColor = vec4(color, 1.0);
  csm_Emissive = vec3(emissive);
}
