/**************
 * /api/createJob
 * Params: jobData, companyID
 * Creates a new job in Standard Jobs collection
 **************/
import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const jobDataRaw = req.nextUrl.searchParams.get("jobData");
    const companyID = req.nextUrl.searchParams.get("companyID")

    if (!jobDataRaw) {
        return new Response("No jobData provided.", { status: 400 });
    }

    const jobData = JSON.parse(jobDataRaw);

    const { db } = await connectToDatabase("Jobs");
    const jobsCollection = db.collection("Standard");

    await jobsCollection.insertOne(jobData);

    /* Update company billing data */
    const {db: BillingDB} = await connectToDatabase("BillingDB")
    await BillingDB.collection("CompanyBillingData").updateOne(
        { companyID: new ObjectId(companyID!) },
        { $inc: { posts: 1 } }
      );

    return new Response(JSON.stringify({ status: 200 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}
