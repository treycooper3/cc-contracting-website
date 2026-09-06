import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase session cookie and bounces signed-out visitors to the
 * portal login. The matcher below keeps this off every public marketing route,
 * so a portal problem can never take down the site that brings in the leads.
 *
 * This is a convenience redirect, not the security boundary. RLS is the
 * boundary: even a request that gets past this middleware reads zero rows
 * without a cc_members row behind it.
 */
export async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Not configured yet: let the request through rather than 500 the site. The
  // portal pages render a "not configured" notice instead.
  if (!url || !key) return NextResponse.next();

  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (toSet) => {
        toSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        toSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  const { data } = await supabase.auth.getUser();

  if (!data.user && !request.nextUrl.pathname.startsWith("/portal/login")) {
    const login = request.nextUrl.clone();
    login.pathname = "/portal/login";
    login.searchParams.set("next", request.nextUrl.pathname);
    return NextResponse.redirect(login);
  }

  return response;
}

export const config = {
  matcher: ["/portal/:path*"],
};
