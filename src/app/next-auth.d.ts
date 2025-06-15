import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      oauthId?: string; // <-- Add this line
    };
  }

  interface User {
    oauthId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    oauthId?: string; // <-- Add this line
  }
}
