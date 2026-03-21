import { db } from "@/db";
import { boardingSession } from "@/db/schema";
import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const listOfBoardingSessions = await db.select().from(boardingSession);
  
  if (!session) {
    return (
      <div>
        Please <Link href="/login">log in</Link>
      </div>
    );
  }

  const { user } = session;
  return (
    <main className="flex min-h-screen w-full flex-col max-w-3xl mx-auto p-6">
      <h1>{user.name}</h1>
      <ul className="flex flex-col gap-1">
        {listOfBoardingSessions.map((boardingSession) => (
          <li className="border p-2 rounded" key={boardingSession.id}>
            <Link href={`/boarding/${boardingSession.id}`}>
              {boardingSession.ownerName}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
