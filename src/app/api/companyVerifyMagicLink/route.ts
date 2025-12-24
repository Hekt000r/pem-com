import { connectToDatabase } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token } = body;

    // 1. Validation
    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const { db: UsersDB } = await connectToDatabase("Users");
    const companiesCollection = UsersDB.collection("Companies");
    const tokensCollection = UsersDB.collection("VerificationTokens");

    const magicLink = await tokensCollection.findOneAndDelete({ token });

    if (!magicLink) {
      return NextResponse.json(
        { error: "Invalid or expired verification link." },
        { status: 404 }
      );
    }

    // this should be impossible but check just in case
    if (new Date() > magicLink.expiresAt) {
      return NextResponse.json(
        { error: "This verification link has expired." },
        { status: 410 }
      );
    }

    const result = await companiesCollection.updateOne(
      { _id: magicLink.companyId },
      { 
        $set: { 
          status: "PENDING",
          "lifecycle.verifiedAt": new Date() 
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Associated company record not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Company verified successfully." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}