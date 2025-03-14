import { Suspense } from "react";
import Loading from "~/components/common/Loading";
import Base from "~/components/gamingTopdownView/base";

export default function GamingTopdownView() {
  return (
    <Suspense fallback={<Loading />}>
      <Base />
    </Suspense>
  );
}