/**************
 * /api/createJob
 * Params: jobData
 * Creates a new job in Standard Jobs collection
 **************/

import { connectToDatabase } from "@/utils/mongodb";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const jobDataRaw = req.nextUrl.searchParams.get("jobData")

    if (!jobDataRaw) {
        return "No jobData provided."
    }

    const jobData = JSON.parse(jobDataRaw)

    const { db } = await connectToDatabase("Jobs")

    const jobsCollection = db.collection("Standard")

    const job = await jobsCollection.insertOne(jobData)

    return Response.json({status: 200})
}