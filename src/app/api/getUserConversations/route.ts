/******************
 * /api/getUserConversations
 * Params: oid (User OAuth ID)
 * Gets a user's conversations
 * Looks through the database till it finds
 * a conversation document that includes the user's ObjectID
 * and then keeps looking untill passes all documents
 * (automatically handled by MongoDB)
 *******************/

type User = {
  _id: string;
};

import { requireUser } from "@/utils/auth/requireUser";
import { connectToDatabase } from "@/utils/mongodb";
import { UserFromOID } from "@/utils/UserFromOID";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const auth = await requireUser(req);
  if (!auth.ok) return auth.response;

  const user = auth.user;

  const { db } = await connectToDatabase("Chat-DB");

  const conversationsCol = await db.collection("Conversations");

  const conversations = await conversationsCol
    .find({ participants: new ObjectId(user?._id) })
    .toArray();

  if (conversations) {
    return Response.json(conversations);
  } else {
    return Response.json({ message: "No conversations found" });
  }
}
