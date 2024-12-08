import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"),

  // /visual/ 以下のルーティング
  route("visual", "./routes/visual/index.tsx", [
    route("sampleAudio", "./routes/visual/sampleAudio.tsx"),
    route("sampleSimpleThree", "./routes/visual/sampleSimpleThree.tsx"),
    route("shaderWater", "./routes/visual/shaderWater.tsx"),
    route("sampleVrm", "./routes/visual/sampleVrm.tsx"),
    route("manyCircle", "./routes/visual/manyCircle.tsx"),
    // route("sampleCustomShader", "./routes/visual/sampleCustomShader.tsx"),
    // route("wobble", "./routes/visual/wobble.tsx"),
  ]),
] satisfies RouteConfig;
