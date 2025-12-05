import { connectToDatabase } from "@/utils/mongodb";
import NextAuth, { AuthOptions, User } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

/* Types */
interface Account {
  providerAccountId: string;
}

export const authOptions: AuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "emrimbiemri@faqja.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Search for the user
        const { db } = await connectToDatabase("Users");
        const EndusersCollection = await db.collection("Endusers");

        const user = await EndusersCollection.findOne({
          email: credentials?.email,
        });

        if (!user) return null;

        if (!user.password) {
          // User registered with Google or has no password set
          return null;
        }

        // Compare password

        if (!credentials?.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          hasProfile: user.hasProfile,
          oauthId: user.oauthId
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: User; account: Account | null }) {
      const { db } = await connectToDatabase("Users");
      const EndusersCollection = await db.collection("Endusers");

      const existingUser = await EndusersCollection.findOne({
        oauthId: account?.providerAccountId,
      });

      if (!existingUser) {
        console.log("No existing user");
        await EndusersCollection.insertOne({
          oauthId: account?.providerAccountId,
          email: user.email,
          name: user.name,
          image: user.image,
          hasProfile: false,
        });
      }

      return true;
    },

    async jwt({ token, user, account }) {
      // Store oauthId and user id
      if (user) {
        token.oauthId = user.oauthId;
        token.id = user.id
      }
      return token;
    },

    async session({ session, token, user }) {
      // Attach oauthId to session.user
      if (session?.user) {
        session.user.oauthId = token.oauthId
        session.user._id = token.id as string | null | undefined;
      }

      return session; 
    },
  },
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
