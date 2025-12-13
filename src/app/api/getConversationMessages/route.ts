/***************
 * /api/getConversationMessages
 *
 * params:
 * convoID: ID of the conversation
 * companyID: id of the company [optional] [if enduser, then dont provide]
 ***************/

import { connectToDatabase } from "@/utils/mongodb";
import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { requireUser } from "@/utils/auth/requireUser";

export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.response;
  const user: SafeUser = auth.user;

  // Get convoID and optional companyID
  const convoID = req.nextUrl.searchParams.get("convoID");
  const companyID = req.nextUrl.searchParams.get("companyID");

  if (!convoID) {
    return Response.json({ error: "Conversation not found" }, { status: 404 });
  }

  let convoObjectId: ObjectId;
  try {
    convoObjectId = new ObjectId(convoID);
  } catch {
    return Response.json({ error: "Conversation not found" }, { status: 404 });
  }

  const { db: UsersDB } = await connectToDatabase("Users");
  const { db: ChatDB } = await connectToDatabase("Chat-DB");

  // If acting on behalf of a company, check admin access
  if (companyID) {
    let companyObjectId: ObjectId;
    try {
      companyObjectId = new ObjectId(companyID);
    } catch {
      return Response.json({ error: "Invalid companyId" }, { status: 400 });
    }

    const company = await UsersDB.collection("Companies").findOne({
      _id: companyObjectId,
      Admins: new ObjectId(user._id), // Assuming each company has an 'admins' array
    });

    if (!company) {
      return Response.json({ error: "Forbidden" }, { status: 405 });
    }
  }

  // Build participant check
  const participantCheck: any = companyID
    ? { participants: new ObjectId(companyID) } // acting as company
    : { participants: new ObjectId(user._id) }; // acting as user

  // Fetch the conversation

  console.table({ _id: convoObjectId, ...participantCheck });

  const convo = await ChatDB.collection("Conversations").findOne({
    _id: convoObjectId,
    ...participantCheck,
  });

  if (!convo) {
    return Response.json({ error: "Conversation not found" }, { status: 401 });
  }

  // Fetch messages
  const limit = Math.min(
    Number(req.nextUrl.searchParams.get("limit")) || 50,
    100
  );
  const messages = await ChatDB.collection("Messages")
    .find(
      { conversationId: convoObjectId },
      { projection: { content: 1, senderId: 1, timestamp: 1 } }
    )
    .sort({ timestamp: 1 })
    .limit(limit)
    .toArray();
    

  return Response.json(messages);
}
