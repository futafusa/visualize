import { Link } from "react-router";

export default function GlovalNavigation() {
  return (
    <nav className="fixed top-8 left-8 z-10">
      <Link to="/"
        className="
          bg-white
          pr-6 pl-4 py-2
          rounded-md
          drop-shadow-md
          text-sm
          transition-colors
          duration-100
          flex
          items-center
          gap-1
          hover:bg-black
          hover:text-white
        "
        viewTransition
      >
        <span className="i-ic-round-arrow-back-ios" />
        back
      </Link>
      {/* <ul className="flex space-x-2">
        <li>
          <Link to="/" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
            Home
          </Link>
        </li>
        <li>
          <Link to="/visual/sample" className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
            Visual/sample
          </Link>
        </li>
      </ul> */}
    </nav>
  );
}
