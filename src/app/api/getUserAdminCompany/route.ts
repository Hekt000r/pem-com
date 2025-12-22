import { requireUser } from "@/utils/auth/requireUser";
import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // 1. Authentication Check
    const auth = await requireUser(req);
    if (!auth.ok) return auth.response;

    const { user } = auth;

    // 2. Database Connection
    const { db } = await connectToDatabase("Users");
    const CompaniesCollection = db.collection("Companies");

    // 3. Query
    const company = await CompaniesCollection.findOne({
      users: {
        $elemMatch: {
          userId: new ObjectId(user._id),
        },
      },
    });

    // 4. Response Logic
    if (!company) {
      return NextResponse.json(
        { company: null, isAdmin: false, message: "No admin permissions found." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      company,
      isAdmin: true,
    });

  } catch (error) {
    console.error("Admin Check Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" }, 
      { status: 500 }
    );
  }
}