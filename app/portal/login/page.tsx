"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClient, isSupabaseConfigured } from "../../lib/supabase";

function LoginForm() {
  const next = useSearchParams().get("next") ?? "/portal";
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  async function send(event: React.FormEvent) {
    event.preventDefault();
    setStatus("sending");
    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;
    const { error } = await createClient().auth.signInWithOtp({
      email,
      // Invite-only: a stranger who guesses the URL gets no account here, and
      // an account without a cc_members row sees nothing anyway.
      options: { emailRedirectTo: redirectTo, shouldCreateUser: false },
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("sent");
  }

  if (!isSupabaseConfigured()) {
    return (
      <p className="text-muted">
        The portal is not configured yet. Set NEXT_PUBLIC_SUPABASE_URL and
        NEXT_PUBLIC_SUPABASE_ANON_KEY.
      </p>
    );
  }

  if (status === "sent") {
    return (
      <p className="text-muted">
        Check your email. The sign-in link goes to <span className="text-foreground">{email}</span> and is
        good for one use.
      </p>
    );
  }

  return (
    <form onSubmit={send} className="flex max-w-sm flex-col gap-3">
      <label htmlFor="email" className="text-sm text-muted">
        Work email
      </label>
      <input
        id="email"
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="rounded border border-line bg-card px-3 py-2 text-foreground"
        placeholder="treycooper@candcontracting.com"
      />
      <button
        type="submit"
        disabled={status === "sending"}
        className="rounded bg-primary px-4 py-2 font-heading text-white disabled:opacity-60"
      >
        {status === "sending" ? "Sending" : "Email me a sign-in link"}
      </button>
      {status === "error" && <p className="text-sm text-danger">{message}</p>}
    </form>
  );
}

export default function LoginPage() {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="font-heading text-2xl">Sign in</h1>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </section>
  );
}
