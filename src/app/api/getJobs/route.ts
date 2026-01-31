/************
 * /api/getJobs/
 * Gets ALL jobs from database
 ************/

import { connectToDatabase } from "@/utils/mongodb";
import { Collection } from "mongodb";


export async function GET() {
    const { db } = await connectToDatabase("Jobs")
    const StandardJobsCollection: Collection = db.collection("Standard")
    const Jobs = await StandardJobsCollection.find(
        {},
        {
            projection: {
                title: 1,
                company_id: 1,
                company_displayName: 1,
                Location: 1,
                city: 1,
                thumbnail: 1,
                createdAt: 1,
                salary: 1,
                expiredAt: 1
                // _id is included by default
            }
        }
    ).toArray()

    return Response.json(Jobs)
}
