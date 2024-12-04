import {
  type RouteConfig,
  index,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  
  // 動的サンプル
  route("users/:id", "routes/users/detail.tsx"),
  
  // sample
  route("about", "routes/about.tsx"),
  route("three", "routes/three.tsx"),
  route("audio", "routes/audio.tsx"),
] satisfies RouteConfig;
