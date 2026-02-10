import { requireUser } from "@/utils/auth/requireUser";
import { connectToDatabase } from "@/utils/mongodb";
import { supabaseAdmin } from "@/utils/supabase/admin";
import { supabase } from "@/utils/supabase/client";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const auth = await requireUser(req);
    if (!auth.ok) return auth.response;
    const user = auth.user;

    const userType = req.nextUrl.searchParams.get("userType");
    const convoID = req.nextUrl.searchParams.get("convoID");
    const companyID = req.nextUrl.searchParams.get("companyID");
    +console.table({ userType, convoID, companyID });

    if (userType != "user" && userType != "company") {
      return NextResponse.json(
        { error: "Provided userType is invalid" },
        { status: 400 },
      );
    }

    if (!convoID || !ObjectId.isValid(convoID)) {
      return NextResponse.json({ error: "Invalid Convo ID" }, { status: 400 });
    }

    const { db: ChatDB } = await connectToDatabase("Chat-DB");
    const { db: UsersDB } = await connectToDatabase("Users");

    let isAuthorized;
    if (userType === "user") {
      isAuthorized = await ChatDB.collection("Conversations").findOne({
        _id: new ObjectId(convoID),
        participants: new ObjectId(user._id),
      });
    }

    if (userType === "company") {
      if (!companyID) {
        return NextResponse.json(
          { error: "Missing companyID" },
          { status: 404 },
        );
      }

      const company = await UsersDB.collection("Companies").findOne({
        _id: new ObjectId(companyID),
        users: {
          $elemMatch: {
            userId: new ObjectId(user._id),
          },
        },
      });

      if (!company) {
        return NextResponse.json(
          { error: "Company not found" },
          { status: 404 },
        );
      }

      isAuthorized = await ChatDB.collection("Conversations").findOne({
        _id: new ObjectId(convoID),
        participants: company._id,
      });
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }

    const filePath = decodeURIComponent(req.nextUrl.searchParams.get("filePath") || "")
    console.log(filePath)
    if (!filePath) {
      return NextResponse.json({ error: "Missing file path" }, { status: 404 });
    }

    if (!filePath || !filePath.startsWith(`conversations/${convoID}/`)) {
      return NextResponse.json(
        { error: "Unauthorized path access" },
        { status: 403 },
      );
    }

    const { data, error } = await supabaseAdmin.storage
      .from("user-documents")
      .createSignedUrl(filePath, 3600);

    if (error) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.json({ url: data.signedUrl });
  } catch (error) {
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
