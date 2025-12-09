import { connectToDatabase } from "@/utils/mongodb";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  const { db } = await connectToDatabase("Users");
  const EndusersCollection = await db.collection("Endusers");

  // First: check if user already exists
  const existingUser = await EndusersCollection.findOne({ email });

  if (existingUser) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 409 }
    );
  }

  // Attempt insert (catch duplicate insert caused by race condition)
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      email,
      password: hashedPassword,
      oauthId: nanoid(),
      image:
        "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",
      hasProfile: false,
    };

    await EndusersCollection.insertOne(user);

    return NextResponse.json({ success: true }, { status: 201 });

  } catch (err: any) {
    // MongoDB duplicate key error (email unique index)
    if (err.code === 11000) {
      return NextResponse.json(
        { error: "Email already in use" },
        { status: 409 }
      );
    }

    console.error("Registration error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
