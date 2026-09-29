import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { auth } from "@/lib/auth";
import { ROLE_HOME } from "@/auth.config";

/**
 * Returns the authenticated session user, or null.
 * Safe to call from Server Components and Server Actions.
 */
export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}

/**
 * Requires an authenticated session; redirects to /login otherwise.
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

/**
 * Requires an authenticated session with one of the allowed roles.
 * Redirects to /login when unauthenticated, or to the user's role home
 * when the role does not match.
 */
export async function requireRole(allowedRoles: Role[]) {
  const user = await requireUser();
  if (!allowedRoles.includes(user.role)) {
    redirect(ROLE_HOME[user.role] || "/");
  }
  return user;
}

