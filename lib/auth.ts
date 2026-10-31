import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

function allowedEmails(): string[] {
  return (process.env.ALLOWED_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      const allowed = allowedEmails();
      // Fail closed: an empty allowlist means nobody is let in, rather than
      // accidentally opening the dashboard to any Google account.
      if (allowed.length === 0) return false;
      return allowed.includes(user.email.toLowerCase());
    },
    async session({ session }) {
      return session;
    },
  },
  session: { strategy: "jwt" },
};
