import { NextRequest, NextResponse } from "next/server";
import { uploadCV } from "@/utils/supabase/uploadCV";
import { UserFromOID } from "@/utils/UserFromOID";
import { connectToDatabase } from "@/utils/mongodb";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const oid = formData.get("oauthid");
    if (!oid || typeof oid !== "string") {
      return NextResponse.json({ error: "No OID provided" }, { status: 400 });
    }

    const profileDataRaw = formData.get("profileData");
    if (!profileDataRaw || typeof profileDataRaw !== "string") {
      return NextResponse.json({ error: "No profile data provided" }, { status: 400 });
    }

    const profileData: {
      firstName: string;
      surName: string;
      age: number;
      birthday: string;
    } = JSON.parse(profileDataRaw);

    const user = await UserFromOID(oid);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { db } = await connectToDatabase("Users");
    const profiles = db.collection("Userprofiles");

    const existingProfile = await profiles.findOne({ userId: user._id });
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
      userId: user._id,
      firstName: profileData.firstName,
      surname: profileData.surName,
      age: profileData.age,
      birthday: profileData.birthday,
      cvPath,
      createdAt: new Date(),
    };

    await profiles.insertOne(profileDoc);
    await db.collection("Endusers").updateOne(
      { _id: user._id },
      { $set: { hasProfile: true } }
    )
    return NextResponse.json({ success: true, profile: profileDoc });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
