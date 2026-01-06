import { connectToDatabase } from "@/utils/mongodb";
import NextAuth, { AuthOptions, User } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

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
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { db } = await connectToDatabase("Users");
        const EndusersCollection = db.collection("Endusers");

        if (!credentials?.email || !credentials?.password) return null;

        const user = await EndusersCollection.findOne({ email: credentials.email });

        if (!user) throw new Error("Ky email nuk ekziston."); // Email does not exist

        if (!user.password) return null; // User registered via OAuth, no password

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Fjalëkalimi është i gabuar."); // Incorrect password

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          hasProfile: user.hasProfile,
          oauthId: user.oauthId,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      const { db } = await connectToDatabase("Users");
      const EndusersCollection = db.collection("Endusers");

      const existingUser = await EndusersCollection.findOne({ email: user.email });

      if (!existingUser && account) {
        // Insert new OAuth user
        await EndusersCollection.insertOne({
          oauthId: account.providerAccountId,
          email: user.email,
          name: user.name,
          image: user.image,
          hasProfile: false,
        });
      } else if (existingUser && account && !existingUser.oauthId) {
        // Update existing credentials user with oauthId
        await EndusersCollection.updateOne(
          { email: user.email },
          { $set: { oauthId: account.providerAccountId } }
        );
      }
      
      return true;
    },

    async jwt({ token, user, account }) {
      if (user && account?.provider === "credentials") {
        // Credentials login: user object is fully populated from authorize
        token.id = user.id;
        token.oauthId = (user as any).oauthId;
        token.hasProfile = (user as any).hasProfile;
        token.companyId = (user as any).companyId;
        token.role = (user as any).role;
      } else if (token.email) {
        // OAuth login or subsequent sessions: fetch user from DB to ensure fresh data
        const { db } = await connectToDatabase("Users");
        const EndusersCollection = db.collection("Endusers");
        
        const dbUser = await EndusersCollection.findOne({ email: token.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.oauthId = dbUser.oauthId;
          token.hasProfile = dbUser.hasProfile;
          token.name = dbUser.name;
          token.image = dbUser.image;
          token.companyId = dbUser.companyId?.toString();
          token.role = dbUser.role;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user._id = token.id as string;
        session.user.oauthId = token.oauthId as string;
        session.user.hasProfile = token.hasProfile as boolean;
        session.user.name = token.name as string;
        session.user.image = token.image as string;
        (session.user as any).companyId = token.companyId;
        (session.user as any).role = token.role;
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
