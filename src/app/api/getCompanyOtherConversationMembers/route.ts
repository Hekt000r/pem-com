import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const companyId = req.nextUrl.searchParams.get("companyId");
  const convoID = req.nextUrl.searchParams.get("convoID");

  if (!companyId || !convoID) {
    return Response.json(
      { status: 400, message: "Missing companyId or convoID" },
      { status: 400 }
    );
  }

  const { db: chatDb } = await connectToDatabase("Chat-DB");
  const convosCol = chatDb.collection("Conversations");
  const convo = await convosCol.findOne({ _id: new ObjectId(convoID) });

  if (!convo) {
    return Response.json(
      { status: 404, message: "Conversation not found" },
      { status: 404 }
    );
  }

  const companyIdStr = companyId.toString();

  // Find the other participant that is NOT the company
  const otherParticipantIdStr = convo.participants
    .map((p: any) => p.toString())
    .find((pid: string) => pid !== companyIdStr);

  if (!otherParticipantIdStr) {
    return Response.json(
      { status: 404, message: "Other participant not found" },
      { status: 404 }
    );
  }

  const { db: usersDb } = await connectToDatabase("Users");
  const companiesCol = usersDb.collection("Companies");
  const endusersCol = usersDb.collection("Endusers");

  // The other participant should usually be an Enduser (person),
  // but just in case, check both collections.
  let otherUser = await companiesCol.findOne({ _id: new ObjectId(otherParticipantIdStr) });
  if (!otherUser) {
    otherUser = await endusersCol.findOne({ _id: new ObjectId(otherParticipantIdStr) });
  }

  if (!otherUser) {
    return Response.json(
      { status: 404, message: "Other user not found in Companies or Endusers" },
      { status: 404 }
    );
  }

  return Response.json(otherUser);
}
