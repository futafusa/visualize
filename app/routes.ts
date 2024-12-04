import {
  type RouteConfig,
  index,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("about", "routes/about.tsx"),

  // 動的サンプル
  route("users/:id", "routes/users/detail.tsx"),

  // three sample
  route("three", "routes/three.tsx"),
] satisfies RouteConfig;
