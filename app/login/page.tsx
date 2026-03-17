"use client";

import { authClient } from "@/lib/auth-client";
export default function LoginPage() {
  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/", // Where to go after success
    });
  };
  return (
    <div>
      <h1>Login Page</h1>
      <button onClick={handleLogin} className="px-4 py-2">
        Sign in with Google
      </button>
    </div>
  );
}
