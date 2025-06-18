import { connectToDatabase } from "@/utils/mongodb";
import NextAuth, { AuthOptions, User } from "next-auth";
import Google from "next-auth/providers/google";

/* Types */
interface Account {
  providerAccountId: string;
}

const authOptions: AuthOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }: { user: User; account: Account | null }) {
      const { db } = await connectToDatabase("Users")
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
        });
      }

      return true;
    },

    async jwt({ token, account }) {
      // Only set oauthId during sign-in
      if (account) {
        token.oauthId = account.providerAccountId;
      }
      return token;
    },

    async session({ session, token }) {
      // Attach oauthId to session.user
      if (session?.user) {
        session.user.oauthId = token.oauthId;
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
