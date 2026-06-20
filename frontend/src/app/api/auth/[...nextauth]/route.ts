import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID || "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET || "",
    }),
  ],
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async signIn({ user }: { user: any }) {
      if (!user.email) return false;
      try {
        const backendUrl = process.env.BACKEND_API_URL || "http://127.0.0.1:8000";
        const res = await fetch(`${backendUrl}/users/verify?email=${encodeURIComponent(user.email)}`);
        if (res.ok) {
          const data = await res.json();
          user.role = data.role; // Store role temporarily on the user object
          return true; // Whitelist matched, log in user
        }
      } catch (err) {
        console.error("NextAuth signIn callback: Failed to connect to user verification backend", err);
      }
      return "/login?error=AccessDenied"; // Denied, redirect with parameter
    },
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      if (session.user) {
        session.user.role = token.role || "viewer";
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
