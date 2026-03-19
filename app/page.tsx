import { auth } from "@/lib/auth-server";
import { headers } from "next/headers";
import Image from "next/image";
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
    <main className="flex min-h-screen w-full flex-col">
      <div className="bg-background w-full p-12">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-4">
          <div>
            <h1 className="text-4xl font-bold">
              Share every moment, <br /> Earn owner trust
            </h1>
            <p>
              Give pet owners real-time peace of mind with our live activity
              feed. Document every walk, meal, and playful moment
            </p>
          </div>
          <Image
            src="/hero-image.jpg"
            alt="dog looking at camera"
            className="rounded-2xl"
            width={300}
            height={300}
          />
        </div>
      </div>
      <Link href="/login">Login</Link>
    </main>
  );
}
