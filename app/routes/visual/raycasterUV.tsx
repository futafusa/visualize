import { Suspense } from "react";
import Loading from "~/components/common/Loading";
import Base from "~/components/raycasterUV/base";

export default function RaycasterUV() {
  return (
    <Suspense fallback={<Loading />}>
      <Base />
    </Suspense>
  )
}
