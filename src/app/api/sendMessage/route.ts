/***************
 * /api/sendMessage
 * params: message (the text for message)
 * oid (user oauth id)
 * channel (the convoID)
 *********/

import { connectToDatabase } from "@/utils/mongodb";
import { UserFromOID } from "@/utils/UserFromOID";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

const Pusher = require("pusher");

export async function GET(req: NextRequest) {
  const message = req.nextUrl.searchParams.get("message");
  const oid = req.nextUrl.searchParams.get("oid");
  const channel = req.nextUrl.searchParams.get("channel");

  const pusher = new Pusher({
    appId: process.env.PUSHER_app_id,
    key: process.env.NEXT_PUBLIC_PUSHER_key,
    secret: process.env.PUSHER_secret,
    cluster: process.env.PUSHER_cluster,
  });

  /* Get the user that created post */

  let senderObjectId;

  const user = await UserFromOID(oid!);
  if (user) {
    senderObjectId = user._id;
  } else {
    // If no user, treat as company: find company by admin's OAuth ID
    const { db } = await connectToDatabase("Users");
    const company = await db
      .collection("Companies")
      .findOne({ Admins: oid });
    if (!company) return new Response("Company not found", { status: 404 });
    senderObjectId = company._id;
  }

  /* Create the message document */

  const { db } = await connectToDatabase("Chat-DB");
  const messagesCol = await db.collection("Messages");

  const messageDocument = {
    conversationId: new ObjectId(channel!),
    senderId: new ObjectId(senderObjectId),
    content: message,
    timestamp: new Date(),
  };

  /* insert into DB */

  const insertedMessage = await messagesCol.insertOne(messageDocument);

  /* Trigger new message event, informing the clients */

  pusher.trigger(channel, "newMessageEvent", {
    newMessage: messageDocument,
  });

  return Response.json({ status: 200 });
}
