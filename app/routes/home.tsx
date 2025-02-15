import type { Route } from "./+types/home";
import { Link } from "react-router";
import { HomeNavigation } from "../components/common/homeNavigation";
import Header from "../components/common/Header";
export default function Home() {
  return (
    <>
      <div className="px-4 py-4 md:px-8 sm:py-8">
        <Header />
        <main>
          <HomeNavigation />
        </main>
      </div>
    </>
  );
}
