import { MongoClient, Db } from "mongodb"

const uri = process.env.MONGODB_URI // e.g. "mongodb+srv://user:pass@cluster.mongodb.net/myDB"
const options = {}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// Reuse client in development to avoid hot-reload problems
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (!uri) {
  throw new Error("Please define the MONGODB_URI environment variable")
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function connectToDatabase(dbName: string): Promise<{ db: Db }> {
  const client = await clientPromise
  const db = client.db(dbName) // Defaults to database in URI, or you can specify like client.db("myDB")
  return { db }
}