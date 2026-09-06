import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client. SERVER ONLY, and only for the two callers that have no
 * user session to act as: the n8n lead webhook and the calendar feed. Both are
 * guarded by their own shared secret. This key bypasses RLS, so it must never
 * be imported into a client component and must never be prefixed NEXT_PUBLIC_.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Service-role Supabase environment is not configured.");
  return createClient(url, key, { auth: { persistSession: false } });
}

/**
 * Constant-time-ish shared secret check. Compares full length regardless of
 * where the first mismatch is, so the response time does not leak the prefix.
 */
export function secretMatches(provided: string | null, expected: string | undefined) {
  if (!provided || !expected || provided.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) {
    diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
