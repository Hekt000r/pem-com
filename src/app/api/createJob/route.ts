import { requireUser } from "@/utils/auth/requireUser";
import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 1. Extract and Validate Input
    const { jobData, companyID } = await req.json();

    if (!jobData || !companyID) {
      return NextResponse.json({ error: "Missing jobData or companyID" }, { status: 400 });
    }

    // 2. Authentication
    const auth = await requireUser(req);
    if (!auth.ok) return auth.response;
    const user = auth.user;

    // 3. Authorization Check
    const { db: UsersDB } = await connectToDatabase("Users");
    
    // Check if the user is in the 'users' array of the specific company
    const company = await UsersDB.collection("Companies").findOne({
      _id: new ObjectId(companyID),
      users: {
        $elemMatch: {
          userId: new ObjectId(user._id),
          role: { $in: ["admin", "owner"] },
        },
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Forbidden: Not a company member" }, { status: 403 });
    }

    // 4. Create Job
    const { db: JobsDB } = await connectToDatabase("Jobs");
    const jobsCollection = JobsDB.collection("Standard");

    const result = await jobsCollection.insertOne({
      title: jobData.title,
      company_id: companyID,
      Location: jobData.Location,
      salary: jobData.salary,
      description: jobData.description,
      company_displayName: company.displayName,
      thumbnail: jobData.thumbnail,
      city: jobData.city,
      createdAt: new Date(),
      expiredAt: new Date(jobData.expiredAt)
    });

    // 5. Update Company Billing Data
    const { db: BillingDB } = await connectToDatabase("BillingDB");
    await BillingDB.collection("CompanyBillingData").updateOne(
      { companyID: new ObjectId(companyID) },
      { $inc: { posts: 1 } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, jobId: result.insertedId });

  } catch (error) {
    console.error("API Error [createJob]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
