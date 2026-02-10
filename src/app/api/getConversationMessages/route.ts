/***************
 * /api/getConversationMessages
 ***************/

import { connectToDatabase } from "@/utils/mongodb";
import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";
import { requireUser } from "@/utils/auth/requireUser";

export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.response;
  const user = auth.user;

  const convoID = req.nextUrl.searchParams.get("convoID");
  const companyID = req.nextUrl.searchParams.get("companyID");

  if (!convoID) {
    return Response.json({ error: "Conversation ID is required" }, { status: 400 });
  }

  let convoObjectId: ObjectId;
  let companyObjectId: ObjectId | null = null;

  try {
    convoObjectId = new ObjectId(convoID);
    if (companyID) companyObjectId = new ObjectId(companyID);
  } catch {
    return Response.json({ error: "Invalid ID format" }, { status: 400 });
  }

  const { db: UsersDB } = await connectToDatabase("Users");
  const { db: ChatDB } = await connectToDatabase("Chat-DB");

  // 1. If acting as a company, verify the user is in that company's Users array
  if (companyObjectId) {
    const company = await UsersDB.collection("Companies").findOne({
      _id: companyObjectId,
      users: { 
        $elemMatch: { userId: new ObjectId(user._id) } 
      },
    });

    if (!company) {
      return Response.json({ error: "Forbidden: You are not a member of this company" }, { status: 403 });
    }
  }

  // 2. Build participant check
  // If companyID exists, we check if the company is a participant. 
  // Otherwise, we check if the individual user is a participant.
  const participantId = companyObjectId || new ObjectId(user._id);

  const convo = await ChatDB.collection("Conversations").findOne({
    _id: convoObjectId,
    participants: participantId,
  });

  if (!convo) {
    return Response.json({ error: "Conversation not found or access denied" }, { status: 404 });
  }

  // 3. Fetch messages
  const limit = Math.min(
    Number(req.nextUrl.searchParams.get("limit")) || 50,
    100
  );

  const messages = await ChatDB.collection("Messages")
    .find(
      { conversationId: convoObjectId },
      {
        projection: {
          content: 1,
          senderId: 1,
          timestamp: 1,
          attachments: 1,
          attachment: 1,
        },
      }
    )
    .sort({ timestamp: 1 })
    .limit(limit)
    .toArray();

  return Response.json(messages);
}