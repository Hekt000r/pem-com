import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("companyId");

  if (!id) {
    return Response.json({ status: 400, message: "No companyId given" }, { status: 400 });
  }

  let companyId: ObjectId;
  try {
    companyId = new ObjectId(id);
  } catch {
    return Response.json({ status: 400, message: "Invalid companyId" }, { status: 400 });
  }

  const { db } = await connectToDatabase("Chat-DB");

  const conversations = await db.collection("Conversations")
    .find({ participants: companyId })
    .toArray();

  return Response.json(conversations);
}
