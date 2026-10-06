import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import { auth } from "@/lib/auth";
import { ROLE_HOME } from "@/auth.config";


export async function getCurrentUser() {
  const session = await auth();
  return session?.user ?? null;
}


export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}


export async function requireRole(allowedRoles: Role[]) {
  const user = await requireUser();
  if (!allowedRoles.includes(user.role)) {
    redirect(ROLE_HOME[user.role] || "/");
  }
  return user;
}

