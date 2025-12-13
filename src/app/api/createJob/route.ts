/**************
 * /api/createJob
 * Params: jobData, companyID
 * Creates a new job in Standard Jobs collection
 **************/
import { requireUser } from "@/utils/auth/requireUser";
import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const jobDataRaw = req.nextUrl.searchParams.get("jobData");
  const companyID = req.nextUrl.searchParams.get("companyID");

  /* Check if user is authenticated */

  const auth = await requireUser(req);
  if (!auth.ok) return auth.response;

  const user = auth.user;

  /* Check if user is authorized to post a job in that company */

  const { db: UsersDB } = await connectToDatabase("Users");

  const EndusersCollection = await UsersDB.collection("Endusers");
  const CompaniesCollection = await UsersDB.collection("Companies");

  const actingUser = await EndusersCollection.findOne({ oauthId: user.oauthId });

  if (!actingUser?._id)
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 404,
    });

  const company = await CompaniesCollection.findOne({
    _id: new ObjectId(companyID!),
    // Check if the acting user's MongoDB ID is in the Admins array
    Admins: { $in: [actingUser._id] },
  });

  if (!company)
    return new Response(
      JSON.stringify({ error: "Forbidden: Not a company admin" }),
      { status: 403 }
    );

  if (!jobDataRaw) {
    return new Response("No jobData provided.", { status: 400 });
  }

  const jobData = JSON.parse(jobDataRaw);

  const { db } = await connectToDatabase("Jobs");
  const jobsCollection = db.collection("Standard");

  await jobsCollection.insertOne(jobData);

  /* Update company billing data */
  const { db: BillingDB } = await connectToDatabase("BillingDB");
  await BillingDB.collection("CompanyBillingData").updateOne(
    { companyID: new ObjectId(companyID!) },
    { $inc: { posts: 1 } }
  );

  return new Response(JSON.stringify({ status: 200 }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
