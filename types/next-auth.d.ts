import { DefaultSession } from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
      ecoPoints: number;
      avatarUrl?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: Role;
    ecoPoints: number;
    avatarUrl?: string | null;
  }
}

// In Auth.js beta.25 the JWT interface is declared by @auth/core/jwt and
// re-exported through next-auth/jwt — augment BOTH so callbacks type-check.
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: Role;
    ecoPoints: number;
    avatarUrl?: string | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: Role;
    ecoPoints: number;
    avatarUrl?: string | null;
  }
}
