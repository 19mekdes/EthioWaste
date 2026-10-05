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


  let requiredRole: string | null = null;
  if (pathname.startsWith("/citizen")) requiredRole = "CITIZEN";
  else if (pathname.startsWith("/collector")) requiredRole = "COLLECTOR";
  else if (pathname.startsWith("/admin")) requiredRole = "MUNICIPAL_ADMIN";

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
  matcher: ["/citizen/:path*", "/collector/:path*", "/admin/:path*", "/login", "/register"],
};
