varying vec2 vUv;
uniform float uTime;
#define PI 3.1415926535897932384626433832795;

uint k = 0x453759abu;
const uint UINT_MAX = 0xffffffffu;

uint uhash11(uint n) {
  n ^= (n << 1);
  n ^= (n >> 1);
  n *= k;
  n ^= (n << 1);
  return n * k;
}
float hash11(float p) {
  uint n = floatBitsToUint(p); // ビット列を符号なし整数（uint）に変換
  return float(uhash11(n)) / float(UINT_MAX); // 正規化
}

void main() {
  float time = floor(uTime * 60.0);
  vec2 pos = vUv.xy * time;
  vec3 color = vec3(hash11(pos.x));

  gl_FragColor = vec4(color, 1.0);
}