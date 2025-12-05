import { connectToDatabase } from "@/utils/mongodb";
import bcrypt from "bcryptjs";
import {nanoid} from "nanoid"
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { email, password } = body;

  // First: check if user already exists
  const { db } = await connectToDatabase("Users");
  const EndusersCollection = await db.collection("Endusers");

  const existingUser = await EndusersCollection.findOne({ email: email });

  if (existingUser) {
    return NextResponse.json(
      { error: "Email already in use" },
      { status: 409 }
    );
  }

  // if doesnt exist, add user

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = {
    email,
    password: hashedPassword,
    oauthId: nanoid(),
    image: "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png",     // use placeholder avatar image, user can choose their own later
    hasProfile: false
  }

  await EndusersCollection.insertOne(user)

  return NextResponse.json(
    {success: true}, {status: 201}
  )

}
