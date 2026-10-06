import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig, ROLE_HOME } from "@/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const session = req.auth;
  const user = session?.user;

  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (user) {
      return NextResponse.redirect(new URL(ROLE_HOME[user.role] || "/", nextUrl));
    }
    return NextResponse.next();
  }

  // Handle citizen & collector redirects
  if (pathname === "/citizen") {
    return NextResponse.redirect(new URL("/dashboard/citizen", nextUrl));
  }
  if (pathname === "/collector") {
    return NextResponse.redirect(new URL("/dashboard/collector", nextUrl));
  }
  if (pathname === "/recycling") {
    return NextResponse.redirect(new URL("/dashboard/recycling", nextUrl));
  }
  if (pathname === "/admin") {
    return NextResponse.redirect(new URL("/dashboard/admin", nextUrl));
  }

  let requiredRole: string | null = null;
  if (pathname.startsWith("/citizen") || pathname.startsWith("/dashboard/citizen")) {
    requiredRole = "CITIZEN";
  } else if (pathname.startsWith("/collector") || pathname.startsWith("/dashboard/collector")) {
    requiredRole = "COLLECTOR";
  } else if (pathname.startsWith("/recycling") || pathname.startsWith("/dashboard/recycling")) {
    requiredRole = "RECYCLING_ORGANIZATION";
  } else if (pathname.startsWith("/admin") || pathname.startsWith("/dashboard/admin")) {
    requiredRole = "MUNICIPAL_ADMIN";
  }

  if (requiredRole) {
    if (!user) {
      const loginUrl = new URL("/login", nextUrl);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (user.role !== requiredRole) {
      return NextResponse.redirect(new URL(ROLE_HOME[user.role] || "/", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/citizen/:path*",
    "/dashboard/citizen/:path*",
    "/collector/:path*",
    "/dashboard/collector/:path*",
    "/recycling/:path*",
    "/dashboard/recycling/:path*",
    "/admin/:path*",
    "/dashboard/admin/:path*",
    "/login",
    "/register",
  ],
};
