"use client";

import { useRouter } from "next/navigation";
import { createClient } from "../lib/supabase";

export default function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    await createClient().auth.signOut();
    router.push("/portal/login");
    router.refresh();
  }

  return (
    <button type="button" onClick={signOut} className="text-muted hover:text-foreground">
      Sign out
    </button>
  );
}
