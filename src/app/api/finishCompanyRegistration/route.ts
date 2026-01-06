import { connectToDatabase } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { token, password } = body;

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters long" },
        { status: 400 }
      );
    }

    const { db: UsersDB } = await connectToDatabase("Users");
    const companiesCollection = UsersDB.collection("Companies");
    const tokensCollection = UsersDB.collection("VerificationTokens");
    const endusersCollection = UsersDB.collection("Endusers");

    // 1. Find and validate token
    const magicLink = await tokensCollection.findOne({ token });

    if (!magicLink) {
      return NextResponse.json(
        { error: "Invalid or expired verification link." },
        { status: 404 }
      );
    }

    if (new Date() > magicLink.expiresAt) {
      await tokensCollection.deleteOne({ token });
      return NextResponse.json(
        { error: "This verification link has expired." },
        { status: 410 }
      );
    }

    // 2. Find associated company
    const company = await companiesCollection.findOne({
      _id: magicLink.companyId,
    });

    if (!company) {
      return NextResponse.json(
        { error: "Associated company record not found." },
        { status: 404 }
      );
    }

    // 3. Check if user already exists (just in case)
    const existingUser = await endusersCollection.findOne({
      email: company.representative.email,
    });
    if (existingUser) {
      // If user already exists, just delete the token and return success
      await tokensCollection.deleteOne({ token });
      return NextResponse.json(
        { message: "User already exists and is verified." },
        { status: 200 }
      );
    }

    // 4. Create User Account
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      email: company.representative.email,
      name: company.representative.repName,
      password: hashedPassword,
      hasProfile: false,
      companyId: company._id,
      createdAt: new Date(),
      image:
        "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
    };

    const userResult = await endusersCollection.insertOne(newUser);

    // 5. Update Company with Owner ID
    await companiesCollection.updateOne(
      { _id: company._id },
      {
        $set: {
          ownerId: userResult.insertedId,
          status: "PENDING", // Ensure it's marked as pending for admin approval
        },
      }
    );

    // 6. Delete the token
    await tokensCollection.deleteOne({ token });

    return NextResponse.json(
      { message: "Registration finished successfully. User account created." },
      { status: 201 }
    );
  } catch (error) {
    console.error("Finish Registration Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
