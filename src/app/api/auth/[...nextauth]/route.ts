import NextAuth, { AuthOptions, User } from "next-auth";
import Google from "next-auth/providers/google";

/* Connecting to MongoDB */
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://hektorzaimidev:${process.env.MONGO_USER_PASSWORD}@cluster0.kn4sc1z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Do nothing here
  }
}
run().catch(console.dir);

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
      const db = client.db("Users");
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
