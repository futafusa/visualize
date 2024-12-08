import { Route } from "./+types/sampleAudio";
import AudioInput from "~/components/common/AudioInput";

// データ取得用のローダー
// export async function loader() {
//   return {
//     title: "Sample Page",
//     description: "This is sample page"
//   };  
// }

// コンポーネント
export default function Sample({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      {/* <h1>{loaderData?.title}</h1>
      <p>{loaderData?.description}</p> */}
      <AudioInput />
    </div>
  );
}
