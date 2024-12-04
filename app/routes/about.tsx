import { Route } from "./+types/about";

// データ取得用のローダー
export async function loader() {
  return {
    title: "About Page",
    description: "This is about page"
  };  
}

// コンポーネント
export default function About({ loaderData }: Route.ComponentProps) {
  return (
    <div>
      <h1>{loaderData.title}</h1>
      <p>{loaderData.description}</p>
    </div>
  );
}
