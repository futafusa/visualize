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
    route("sample", "./routes/visual/sample.tsx"),
    route("three", "./routes/visual/three.tsx"),
  ]),
] satisfies RouteConfig;
