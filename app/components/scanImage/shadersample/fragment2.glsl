varying vec2 vUv;
uniform float uProgress;

void main() {
  vec2 uv = vUv;

  // step(a, b) は a が b より小さい場合は 1 を返し、大きい場合は 0 を返す
  // step(uv.x, uProgress) は uv.x が uProgress より小さい場合は 1 を返し、大きい場合は 0 を返す
  float edge = step(uv.x, uProgress);
  uv.x = mix(uv.x, uProgress, edge);

  vec3 color = texture2D(uTexture1, uv).rgb;

  gl_FragColor = vec4(color, 1.0);
}