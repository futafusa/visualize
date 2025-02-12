import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"),
  // route("about", "./routes/about.tsx"),

  // /visual/ 以下のルーティング
  route("visual", "./routes/visual/index.tsx", [
    route("sampleAudio", "./routes/visual/sampleAudio.tsx"),
    route("sampleSimpleThree", "./routes/visual/sampleSimpleThree.tsx"),
    route("shaderWater", "./routes/visual/shaderWater.tsx"),
    route("manyCircle", "./routes/visual/manyCircle.tsx"),
    route("ballAttract", "./routes/visual/ballAttract.tsx"),
    route("sampleShaderPattern", "./routes/visual/sampleShaderPattern.tsx"),
    route("imageSlide", "./routes/visual/imageSlide.tsx"),
    route("sampleBufferGeometry", "./routes/visual/sampleBufferGeometry.tsx"),
    route("sampleShaderNoise", "./routes/visual/sampleShaderNoise.tsx"),
    route("studyGlsl", "./routes/visual/studyGlsl.tsx"),
    route("sampleCustomShader", "./routes/visual/sampleCustomShader.tsx"),
    route("gamingTopdownView", "./routes/visual/gamingTopdownView.tsx"),
    route("effectTest", "./routes/visual/effectTest.tsx"),
    route("sampleVrm", "./routes/visual/sampleVrm.tsx"),
    route("preRenderMovie", "./routes/visual/preRenderMovie.tsx"),
    route("preRenderImage", "./routes/visual/preRenderImage.tsx"),
    route("raycasterUV", "./routes/visual/raycasterUV.tsx"),
    route("customPostProcessing", "./routes/visual/customPostProcessing.tsx"),
  ]),
] satisfies RouteConfig;
