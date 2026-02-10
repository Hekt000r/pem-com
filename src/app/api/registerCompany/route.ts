import { connectToDatabase } from "@/utils/mongodb";
import { UploadPublicImage } from "@/utils/supabase/uploadPublicImage";
import { ObjectId } from "mongodb";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const repRaw = formData.get("representative") as string
    const representative = JSON.parse(repRaw)

    const body = {
      _id: new ObjectId(),
      imageFile: formData.get("imageFile") as File,
      name: formData.get("name"),
      industry: formData.get("industry"),
      description: formData.get("description"),
      site: formData.get("site"),
      location: formData.get("location"),
      representative
    }

    const { db: UsersDB } = await connectToDatabase("Users");
    const companiesCollection = UsersDB.collection("Companies");
    const magicLinksCollection = UsersDB.collection("VerificationTokens");

    // Upload company image to Supabase
    let ImageURL = "https://upload.wikimedia.org/wikipedia/commons/8/89/Portrait_Placeholder.png";

    if (body.imageFile) {
      const storagePath = `logos/${body._id}`

      const supabaseUrl = await UploadPublicImage(
        body.imageFile,storagePath,body.imageFile.type || "image/png"
      )

      ImageURL = supabaseUrl
    }

    // 3. Prepare Company Document
    const companyDocument = {
      name: body.name,
      industry: body.industry,
      description: body.description,
      site: body.site,
      location: body.location,
      imgURL: ImageURL,
      representative: body.representative,
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