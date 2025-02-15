import { Suspense } from "react";
import Loading from "~/components/common/Loading";
import Base from "~/components/renderTarget/base";

export default function RenderTarget() {
  return (
    <Suspense fallback={<Loading />}>
      <Base />
    </Suspense>
  )
}

