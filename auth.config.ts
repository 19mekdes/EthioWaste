import type { NextAuthConfig } from "next-auth";

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
  CITIZEN: "/dashboard/citizen",
  COLLECTOR: "/dashboard/collector",
  RECYCLING_ORGANIZATION: "/dashboard/recycling",
  MUNICIPAL_ADMIN: "/dashboard/admin",
};
