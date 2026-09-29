import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig, ROLE_HOME } from "@/auth.config";

const { auth } = NextAuth(authConfig);

/**
 * Role-Based Access Control middleware.
 *
 * Route rules:
 *  - `/login` & `/register`: public, but authenticated users are
 *    redirected to their role home.
 *  - `/citizen/*`   → requires an authenticated CITIZEN
 *  - `/collector/*` → requires an authenticated COLLECTOR
 *  - `/admin/*`     → requires an authenticated MUNICIPAL_ADMIN
 *  - everything else (/, /api, static) is public.
 */
export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const session = req.auth;
  const user = session?.user;

  // 1. Auth pages — bounce already-authenticated users to their role home
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (user) {
      return NextResponse.redirect(new URL(ROLE_HOME[user.role] || "/", nextUrl));
    }
    return NextResponse.next();
  }

  // 2. Determine required role for protected sections
  let requiredRole: string | null = null;
  if (pathname.startsWith("/citizen")) requiredRole = "CITIZEN";
  else if (pathname.startsWith("/collector")) requiredRole = "COLLECTOR";
  else if (pathname.startsWith("/admin")) requiredRole = "MUNICIPAL_ADMIN";

  if (requiredRole) {
    // Unauthenticated → login with callbackUrl so we can return them
    if (!user) {
      const loginUrl = new URL("/login", nextUrl);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Wrong role → redirect to their own role home
    if (user.role !== requiredRole) {
      return NextResponse.redirect(new URL(ROLE_HOME[user.role] || "/", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/citizen/:path*", "/collector/:path*", "/admin/:path*", "/login", "/register"],
};
