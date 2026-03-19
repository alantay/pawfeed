import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <div>Please log in</div>;
  }

  const { user } = session;
  return (
    <div>
      <h1>{user.name}</h1>
    </div>
  );
}
