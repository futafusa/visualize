import { Link } from "react-router";
import { Navigation } from "./Navigation";

export default function HomeIndex() {
  return (
    <div>
      <div>
        <h1 className="px-4 py-8 sm:px-8">
          Audio/Visual/Reactive
        </h1>
        <div>
          <Link to="/about">About</Link>
        </div>
      </div>
      <Navigation />
    </div>
  );
}
