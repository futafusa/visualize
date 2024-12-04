import type { Route } from "./+types/home";
import { NavLink } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <ul>
        <li><NavLink to="/about">About</NavLink></li>
        <li><NavLink to="/three">Three</NavLink></li>
      </ul>
    </div>
  );
}
