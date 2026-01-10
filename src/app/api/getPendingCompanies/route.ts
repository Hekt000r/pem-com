import { requireUser } from "@/utils/auth/requireUser";
import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // 1. Auth Check
    const auth = await requireUser(req);
    if (!auth.ok) return auth.response;
    const user = auth.user;

    // 2. Database Connection
    const { db } = await connectToDatabase("Users");
    const SuperadminsCollection = db.collection("Superadmins");
    const CompaniesCollection = db.collection("Companies");

    // 3. Permission Check (Superadmin)
    const superadminUser = await SuperadminsCollection.findOne({
      userID: new ObjectId(user._id),
    });

    if (!superadminUser) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 403 });
    }

    // 4. Fetch Pending Companies
    const pendingCompanies = await CompaniesCollection.find({ 
      status: "PENDING" 
    }).sort({ "lifecycle.submittedAt": -1 }).toArray();

    return NextResponse.json(pendingCompanies, { status: 200 });
  } catch (error) {
    console.error("Get Pending Companies Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
