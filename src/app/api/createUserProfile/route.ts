import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { uploadCV } from "@/utils/supabase/uploadCV";
import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    // Get the authenticated user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();

    const profileDataRaw = formData.get("profileData");
    if (!profileDataRaw || typeof profileDataRaw !== "string") {
      return NextResponse.json({ error: "No profile data provided" }, { status: 400 });
    }

    const profileData: { firstName: string; surName: string } = JSON.parse(profileDataRaw);

    const { db } = await connectToDatabase("Users");
    const profiles = db.collection("Userprofiles");

    // Use the user's email as unique identifier
    const existingProfile = await profiles.findOne({ email: session.user.email });
    if (existingProfile) {
      return NextResponse.json({ error: "Profile already exists" }, { status: 409 });
    }

    const cvFile = formData.get("file");
    let cvPath: string | null = null;

    if (cvFile && cvFile instanceof File) {
      try {
        cvPath = await uploadCV(cvFile);
      } catch (uploadError: any) {
        return NextResponse.json({ error: "CV upload failed: " + uploadError.message }, { status: 500 });
      }
    }

    const profileDoc = {
      email: session.user.email,
      firstName: profileData.firstName,
      userId: new ObjectId(session.user._id!),
      surname: profileData.surName,
      cvPath,
      createdAt: new Date(),
    };

    await profiles.insertOne(profileDoc);
    await db.collection("Endusers").updateOne(
      { email: session.user.email },
      { $set: { hasProfile: true } }
    );

    return NextResponse.json({ success: true, profile: profileDoc });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
