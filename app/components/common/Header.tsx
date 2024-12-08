import { Link } from "react-router";
import GlovalNavigation from "./GlovalNavigation";

export default function Header() {
  return (
    <header className="bg-gray-800 text-white w-full py-2">
      {/* <h1 className="text-sm font-bold">Audio/Visual/Reactive</h1> */}
      <GlovalNavigation />
    </header>
  );
}
