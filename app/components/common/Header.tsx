import { Link } from "react-router";
import About from "./About";
import { useState } from "react";
export default function Header() {
  const [isAbout, setIsAbout] = useState(false);

  const clickAbout = () => {
    if (isAbout) {
      setIsAbout(false);
    } else {
      setIsAbout(true);
    }
  }

  return (
    <header>
      <div className="flex justify-between items-center pb-8">
        <h1>
          audio/visual/reactive
        </h1>
        <button
          onClick={clickAbout}
          className={`hover:underline flex items-center gap-0`}
        >
          About
          <span className={`i-ic-baseline-keyboard-arrow-down w-5 h-5 ${isAbout ? 'rotate-180' : ''}`} />
        </button>
      </div>
      {isAbout && (
        <About />
      )}
    </header>
  );
}
