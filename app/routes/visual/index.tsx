import { Outlet } from "react-router";
import GlovalNavigation from "../../components/common/GlovalNavigation";

export default function VisualIndex() {
  return (
    <>
      <GlovalNavigation />
      <Outlet />
    </>
  );
}
