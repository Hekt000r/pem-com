import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body) {
      return NextResponse.json(
        { error: "Missing required fields: email and name are mandatory." },
        { status: 400 }
      );
    }

    const { db: UsersDB } = await connectToDatabase("Users");
    const companiesCollection = UsersDB.collection("Companies");
    const magicLinksCollection = UsersDB.collection("VerificationTokens");

    // 3. Prepare Company Document
    const companyDocument = {
      ...body,
      status: "AWAITING_VERIFICATION",
      lifecycle: {
        submittedAt: new Date(),
        verifiedAt: null,
      },
    };

    const insertedDoc = await companiesCollection.insertOne(companyDocument);

    // 4. Create Verification Token
    const magicLinkDoc = {
      token: nanoid(),
      companyId: insertedDoc.insertedId,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    };

    await magicLinksCollection.insertOne(magicLinkDoc);

    // 5. Success Response
    return NextResponse.json(
      { 
        message: "Registration initiated. Please check your email for verification.",
        registrationId: insertedDoc.insertedId 
      }, 
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Registration Error:", error);
    
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}