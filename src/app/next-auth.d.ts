import { Jwt } from "jsonwebtoken";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      _id?: string | null;
      email?: string | null;
      image?: string | null;
      oauthId?: string;
      hasProfile?: boolean; // Added hasProfile
      token?: any;
    };
  }

  interface User {
    oauthId?: string;
    hasProfile: boolean;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    oauthId?: string;
    hasProfile?: boolean;
  }
}
