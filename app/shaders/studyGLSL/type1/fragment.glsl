varying vec2 vUv;
uniform float uTime;
#define PI 3.1415926535897932384626433832795

float atan2(float y, float x) {
  if(x == 0.0) {
    return sign(y) * PI / 2.0;
  } else {
    return atan(y, x);
  }
}

vec2 xyToPolar(vec2 xy) {
  return vec2(atan2(xy.y, xy.x), length(xy));
}

vec2 polarToXy(vec2 polar) {
  return polar.y * vec2(cos(polar.x), sin(polar.x));
}

// 
vec3 tex(vec2 st) {
  vec3[3] colors = vec3[](
    vec3(0.0, 0.0, 1.0),
    vec3(1.0, 0.0, 0.0),
    vec3(1.0)
  );

  st.s = st.s / PI + 1.0; // 偏角範囲を0~2にする
  int index = int(st.s);
  // [index % 2]は0-1を繰り返す、[(index + 1)  % 2]は1-0を繰り返す
  vec3 color = mix(colors[index % 2], colors[(index + 1) % 2], fract(st.s));

  return mix(colors[2], color, st.t);
}

vec3 tex2(vec2 st) {// s:偏角, t:動径
  float time = uTime * 0.2;
  vec3 circle = vec3(polarToXy(vec2(time, 0.5)) + 0.5, 1.0);

  vec3[3] colors = vec3[](
    circle.rgb, circle.gbr, circle.brg
  );
  // vec3[3] colors = vec3[](
  //   vec3(0.0, 0.0, 1.0),
  //   vec3(1.0, 0.0, 0.0),
  //   vec3(1.0)
  // );

  st.s = st.s / PI + 1.0; // 偏角範囲を0~2にする
  st.s += time;
  int index = int(st.s);
  vec3 color = mix(colors[index % 2], colors[(index + 1) % 2], fract(st.s));

  return mix(colors[2], color, st.t);
}

void main() {
  // vec3 red = vec3(1.0, 0.0, 0.0);
  // vec3 blue = vec3(0.0, 0.0, 1.0);
  // vec3 green = vec3(0.0, 1.0, 0.0);
  // vec3 yellow = vec3(1.0, 1.0, 0.0);
  // vec3 colors[] = vec3[](red, blue, green, yellow);

  // float posX = vUv.x * 2.0;
  // int index = int(posX);
  // // vec3 color = mix(colors[index], colors[index + 1], fract(posX));
  // vec3 color = mix(mix(colors[0], colors[1], vUv.x), mix(colors[2], colors[3], vUv.x), vUv.y);

  // チャンネルごとに色を変える
  // float n = 5.0;
  // vec2 pos = vUv * n;
  // int channel = int(2.0 * vUv.x);

  // if(channel == 0) {
  //   pos = floor(pos) + step(0.5, fract(pos));
  // } else {
  //   float threshold = 0.25 * sin(uTime);
  //   pos = floor(pos) + smoothstep(0.25 + threshold, 0.75 + threshold, fract(pos));
  // }
  // pos = pos / n;
  // vec3 color = mix(mix(colors[0], colors[1], pos.x), mix(colors[2], colors[3], pos.x), pos.y);

  // 極座標
  vec2 pos = vUv;
  pos = 2.0 * pos.xy - vec2(1.0); // 0~1を-1~1にする
  pos = xyToPolar(pos);
  vec3 color = tex2(pos);
  // vec3 color = vec3(pos.x, pos.y, 1.0);

  gl_FragColor = vec4(color, 1.0);
}