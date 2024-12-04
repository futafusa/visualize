import { Route } from "./+types/detail";

// データ取得用のローダー
export async function loader({params}: Route.LoaderArgs) {
  const userId = params.id;
  // const userData = await fetchUser(userId);
  const userData = { id: userId, name: "John Doe" };

  return { user: userData };
}

export default function UserDetail({loaderData}: Route.ComponentProps) {
  const { user } = loaderData;
  
  return (
    <div>
      <h1>{user.id} - {user.name}</h1>
    </div>
  );
}