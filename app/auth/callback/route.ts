import { NextResponse, type NextRequest } from "next/server";
import { createServerSupabase } from "../../lib/supabase-server";

/**
 * Magic-link landing. Exchanges the one-time code for a session cookie, then
 * sends the member where they were headed.
 */
export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = request.nextUrl.searchParams.get("next") ?? "/portal";

  if (!code) {
    return NextResponse.redirect(new URL("/portal/login?error=missing_code", request.url));
  }

  const supabase = await createServerSupabase();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(new URL("/portal/login?error=exchange_failed", request.url));
  }

  return NextResponse.redirect(new URL(next, request.url));
}
