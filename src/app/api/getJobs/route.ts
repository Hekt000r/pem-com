/************
 * /api/getJobs/
 * Gets ALL jobs, regardless of location.
 * Note: Has to be updated each time a new city is added.
 * Current cities: Tetovo
 ************/

import { Collection } from "mongodb";


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

export async function GET() {
    const db = client.db("Jobs")
    const StandardJobsCollection: Collection = db.collection("Standard")
    const Jobs = await StandardJobsCollection.find().toArray()

    return Response.json(Jobs)
}
