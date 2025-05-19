varying vec2 vUv;
uniform float uProgress;

void main() {
  vec2 uv = vUv;

  if(uv.x < uProgress) {
    uv.x = uProgress;
  }

  vec3 color = texture2D(uTexture1, uv).rgb;

  gl_FragColor = vec4(color, 1.0);
}