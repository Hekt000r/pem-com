/************
 * /api/getJobs/
 * Gets ALL jobs from database
 ************/

import { connectToDatabase } from "@/utils/mongodb";
import { Collection } from "mongodb";


export async function GET() {
    const { db } = await connectToDatabase("Jobs")
    const StandardJobsCollection: Collection = db.collection("Standard")
    const Jobs = await StandardJobsCollection.find().toArray()

    return Response.json(Jobs)
}
