/****************
 * utils/JobFromID
 * Gets a job from its ID
 ****************/

import { connectToDatabase } from "./mongodb";
import { ObjectId } from "mongodb";

/* Input a string, then use new ObjectID() */
export default async function JobFromID(id: string) {
    const { db } = await connectToDatabase("Jobs");
    const jobsCollection = db.collection("Standard");

    const job = await jobsCollection.findOne({ _id: new ObjectId(id) });

    if (!job) return "job not found (ERR404)";

    return job;
}