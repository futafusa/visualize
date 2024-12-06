import { Link } from "react-router";

const navItems = [
  {
    label: "Visual/three",
    url: "/visual/three",
  },
  {
    label: "Visual/sample",
    url: "/visual/sample",
  },
];

export default function HomeIndex() {
  return (
    <div>
      <h1 className="px-8 py-8">Audio/Visual/Reactive</h1>
      <div className="px-4 sm:px-8">
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-8">
          {navItems.map((item, index) => (
            <li className="" key={index}>
              <Link to={item.url} className="hover:opacity-80">
                <div className="w-full h-20 bg-gray-400"></div>
                <p className="block">{item.label}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
