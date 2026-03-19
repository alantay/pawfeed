import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // 1. If not logged in, show the login page
  if (!session) {
    redirect("/login");
  }

  // 2. If logged in but bio is missing, send to onboarding
  if (!session.user.sitterBio) {
    redirect("/profile/edit");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Link href="/login">Login</Link>
      </main>
    </div>
  );
}
