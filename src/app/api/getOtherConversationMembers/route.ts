/*****************
 * /api/getOtherConversationMembers
 * Gets the conversation member that ISN'T the one specified
 * params: oid (OAuth ID), convoID (conversation _id)
 ****************/

import { connectToDatabase } from "@/utils/mongodb";
import { UserFromOID } from "@/utils/UserFromOID";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const oid = req.nextUrl.searchParams.get("oid");
  const convoID = req.nextUrl.searchParams.get("convoID");

  if (!oid || !convoID) {
    return Response.json(
      { status: 400, message: "Missing oid or convoID" },
      { status: 400 }
    );
  }

  // Connect to Chat DB
  const { db: chatDb } = await connectToDatabase("Chat-DB");

  const convosCol = chatDb.collection("Conversations");
  const convo = await convosCol.findOne({ _id: new ObjectId(convoID) });

  if (!convo) {
    return Response.json(
      { status: 404, message: "Conversation not found" },
      { status: 404 }
    );
  }

  const user = await UserFromOID(oid);
  if (!user || !user._id) {
    return Response.json(
      { status: 404, message: "User not found from OID" },
      { status: 404 }
    );
  }

  const user_id_str = user._id.toString();

  // Find the other participant's MongoDB _id
  const otherParticipantIdStr = convo.participants
    .map((p: any) => p.toString())
    .find((pid: string) => pid !== user_id_str);

  if (!otherParticipantIdStr) {
    return Response.json(
      { status: 404, message: "Other participant not found" },
      { status: 404 }
    );
  }

  // Connect to Users/Companies DB
  const { db: usersDb } = await connectToDatabase("Users");
  const endusersCol = usersDb.collection("Companies");

  /* Temporary Fix: Users can only chat with companies,
  since we are only searching in the Companies collection.
  TODO: Search in both Endusers and Companies till the 
  other user is found. */

  const otherUser = await endusersCol.findOne({_id: new ObjectId(otherParticipantIdStr)});

  if (!otherUser) {
    return Response.json(
      { status: 404, message: "Other user not found" },
      { status: 404 }
    );
  }

  return Response.json(otherUser);
}
