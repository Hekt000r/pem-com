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

    const magicLink = await tokensCollection.findOne({ token });

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

    const company = await companiesCollection.findOne({ _id: magicLink.companyId });

    if (!company) {
      return NextResponse.json(
        { error: "Associated company record not found." },
        { status: 404 }
      );
    }

    const { db: UsersDB_2 } = await connectToDatabase("Users");
    const endusersCollection = UsersDB_2.collection("Endusers");
    const existingUser = await endusersCollection.findOne({ email: company.representative.email });

    if (existingUser) {
      // 1. Link existing user as owner
      await companiesCollection.updateOne(
        { _id: company._id },
        { $set: { ownerId: existingUser._id } }
      );
      // 2. Delete the token since verification is complete
      await tokensCollection.deleteOne({ token });
    }

    return NextResponse.json(
      { 
        message: "Company verified successfully.",
        company: {
          id: company._id,
          name: company.name,
          representative: company.representative
        },
        userExists: !!existingUser
      },
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