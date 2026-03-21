import TimelineUpdate from "@/components/boarding/timelineUpdate";
import TimelineUpdateCreate from "@/components/boarding/timelineUpdate/create";
import { db } from "@/db";
import { boardingSession } from "@/db/schema";
import { auth } from "@/lib/auth-server";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export default async function BoardingSession({ params }: any) {
  const sessionResponse = await auth.api.getSession({
    headers: await headers(),
  });

  const session = sessionResponse?.session;
  const user = sessionResponse?.user;
  const { sessionId: boardingSessionId } = await params;

  const data = await db.query.boardingSession.findFirst({
    where: eq(boardingSession.id, boardingSessionId),
    with: { timelineUpdates: true },
  });
  if (!data) return <div>Session not found.</div>;

  const isSitter = user?.id === data.sitterId;

  return (
    <main className="flex min-h-screen w-full flex-col max-w-4xl mx-auto p-6">
      <h1 className="text-2xl">Boarding Session</h1>

      {isSitter && <TimelineUpdateCreate />}
      <TimelineUpdate />
    </main>
  );
}
