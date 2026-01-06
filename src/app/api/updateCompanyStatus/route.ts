import { requireUser } from "@/utils/auth/requireUser";
import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb"; // Import ObjectId
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 1. Auth Check
    const auth = await requireUser(req);
    if (!auth.ok) return auth.response;
    const user = auth.user;

    // 2. Parse and Validate Input
    const body = await req.json().catch(() => null); // Catch JSON parse errors

    if (!body || !body.companyID || !body.status) {
      return NextResponse.json(
        { error: "Missing companyID or status" },
        { status: 400 }
      );
    }

    const { companyID, status } = body;

    const ALLOWED_STATUSES = ["APPROVED", "PENDING", "REJECTED","ACTION_REQUIRED", "AWAITING_VERIFICATION"];
    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // 3. Database Connection
    const { db } = await connectToDatabase("Users");
    const SuperadminsCollection = db.collection("Superadmins");
    const CompaniesCollection = db.collection("Companies");

    // 4. Permission Check (Superadmin)
    const superadminUser = await SuperadminsCollection.findOne({
      userID: new ObjectId(user._id),
    });

    if (!superadminUser) {
      return NextResponse.json({ error: "Not Authorized" }, { status: 403 });
    }

    // 5. Check if Company Exists
    let objectId;
    try {
      objectId = new ObjectId(companyID);
    } catch (e) {
      return NextResponse.json(
        { error: "Invalid Company ID format" },
        { status: 400 }
      );
    }

    const company = await CompaniesCollection.findOne({ _id: objectId });

    if (!company) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    // 6. Update Company
    await CompaniesCollection.updateOne(
      { _id: objectId },
      { $set: { status: status } }
    );

    return NextResponse.json(
      { message: "Company updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update Company Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
