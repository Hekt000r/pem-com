import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

/* Connecting to MongoDB */
const {MongoClient, ServerApiVersion} = require("mongodb")
const uri = `mongodb+srv://hektorzaimidev:${process.env.MONGO_USER_PASSWORD}@cluster0.kn4sc1z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

/* Create a MongoClient with a MongoClientOptions object to set the Stable API version */
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

/* Connect to server */
async function run() {
  try {

    await client.connect();

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    await client.close();
  }
}
run().catch(console.dir);

/* Types */
interface Account {
  providerAccountId: string;
}


const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!
    })
  ],
  callbacks: {
    async signIn({user, account}) {

    }
  }
}

const handler = NextAuth({
  providers:[
    Google({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!
    })
  ]
})

export { handler as GET, handler as POST }