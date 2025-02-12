import { Suspense } from "react";
import Loading from "~/components/common/Loading";
import Base from "~/components/customPostProcessing/base";

export default function CustomPostProcessing() {
  return (
    <Suspense fallback={<Loading />}>
      <Base />
    </Suspense>
  )
}

