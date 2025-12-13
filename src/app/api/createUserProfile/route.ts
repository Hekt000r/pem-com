import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { uploadCV } from "@/utils/supabase/uploadCV";
import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { getToken } from "next-auth/jwt";
import { requireUser } from "@/utils/auth/requireUser";

export async function POST(req: NextRequest) {
  try {
    /* Check if user is authenticated */

    const auth = await requireUser(req);
    if (!auth.ok) return auth.response;

    const user = auth.user;

    const formData = await req.formData();

    const profileDataRaw = formData.get("profileData");
    if (!profileDataRaw || typeof profileDataRaw !== "string") {
      return NextResponse.json(
        { error: "No profile data provided" },
        { status: 400 }
      );
    }

    const profileData: { firstName: string; surName: string } =
      JSON.parse(profileDataRaw);

    const { db } = await connectToDatabase("Users");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const profiles = db.collection("Userprofiles");

    // Use the user's email as unique identifier
    const existingProfile = await profiles.findOne({
      email: user.email,
    });
    if (existingProfile) {
      return NextResponse.json(
        { error: "Profile already exists" },
        { status: 409 }
      );
    }

    const cvFile = formData.get("file");
    let cvPath: string | null = null;

    if (cvFile && cvFile instanceof File) {
      try {
        cvPath = await uploadCV(cvFile);
      } catch (uploadError: any) {
        return NextResponse.json(
          { error: "CV upload failed: " + uploadError.message },
          { status: 500 }
        );
      }
    }

    const profileDoc = {
      email: user.email,
      firstName: profileData.firstName,
      userId: new ObjectId(user._id!),
      surname: profileData.surName,
      cvPath,
      createdAt: new Date(),
    };

    await profiles.insertOne(profileDoc);
    await db
      .collection("Endusers")
      .updateOne({ email: user.email }, { $set: { hasProfile: true } });

    return NextResponse.json({ success: true, profile: profileDoc });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
