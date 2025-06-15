/**********
 * /api/getUserByOauthId
 * Fetches a user from database using it's Oauth ID
 **********/

import { Collection } from "mongodb";
import { NextRequest } from "next/server";


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

  }
}
run().catch(console.dir);


export async function GET(request: NextRequest) {

    const userOauthId = request.nextUrl.searchParams.get("oauthid")

    const db = client.db("Users")
    const usersCollection: Collection = db.collection("Endusers")

    const user = await usersCollection.findOne({oauthId: userOauthId})

    return Response.json(user)
}