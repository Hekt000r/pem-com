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
    _id: string
}
 /* THESE TYPES ARE MAKING ME SO ANNOYED
 TODO PUT ALL TYPES IN A D.TS AND EXPORT THEM INSTEAD OF THIS STUPID BS */
import { connectToDatabase } from "@/utils/mongodb";
import { UserFromOID } from "@/utils/UserFromOID";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const oauthid = req.nextUrl.searchParams.get("oid");

  if (!oauthid) {
    return Response.json({ status: 404, message: "No oid given" },{status: 404});
  }

  const user = await UserFromOID(oauthid);

  const { db } = await connectToDatabase("Chat-DB")

  const conversationsCol = await db.collection("Conversations")

  const conversations = await conversationsCol.find({participants: user?._id}).toArray()

  if (conversations) {
    return Response.json(conversations)
  } else {
    return Response.json({message: "No conversations found"})
  }
}
