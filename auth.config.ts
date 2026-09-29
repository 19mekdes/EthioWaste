import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe Auth.js v5 configuration shared between the Node runtime
 * (lib/auth.ts) and the Edge middleware. Must NOT import Prisma, bcrypt
 * or any Node-only module — middleware runs on the Edge runtime.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // `user` is typed as User | AdapterUser in beta.25; our custom fields
      // only exist on the authorize() return value, so cast is required.
      const u = user as any;
      if (u) {
        token.id = u.id;
        token.role = u.role;
        token.ecoPoints = u.ecoPoints;
        token.avatarUrl = u.avatarUrl;
      }
      if (trigger === "update" && session) {
        const s = session as any;
        if (s.ecoPoints !== undefined) token.ecoPoints = s.ecoPoints;
        if (s.role !== undefined) token.role = s.role;
        if (s.avatarUrl !== undefined) token.avatarUrl = s.avatarUrl;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const t = token as any;
        session.user.id = t.id;
        session.user.role = t.role;
        session.user.ecoPoints = t.ecoPoints;
        session.user.avatarUrl = t.avatarUrl;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;

export const ROLE_HOME: Record<string, string> = {
  CITIZEN: "/citizen",
  COLLECTOR: "/collector",
  MUNICIPAL_ADMIN: "/admin",
};
