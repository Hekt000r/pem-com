/**********
 * /api/companySendMessage
 * params:
 * companyID (the id of the company who sent the message)
 * channel (the id of the convo where the message was sent)
 * message
 *
 ***************/

import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

const Pusher = require("pusher");

export async function GET(req: NextRequest) {
  const message = req.nextUrl.searchParams.get("message");
  const id = req.nextUrl.searchParams.get("companyID");
  const channel = req.nextUrl.searchParams.get("channel");

  const pusher = new Pusher({
    appId: process.env.PUSHER_app_id,
    key: process.env.NEXT_PUBLIC_PUSHER_key,
    secret: process.env.PUSHER_secret,
    cluster: process.env.PUSHER_cluster,
  });

  const messageDocument = {
    conversationId: new ObjectId(channel!),
    senderId: new ObjectId(id!),
    content: message,
    timestamp: new Date(),
  };

  const { db } = await connectToDatabase("Chat-DB");

  await db.collection("Messages").insertOne(messageDocument);

  /* Trigger new message event, informing the clients */

  pusher.trigger(channel, "newMessageEvent", {
    newMessage: messageDocument,
  });

  /* Update company's billing info */

  const { db: BillingDB } = await connectToDatabase("BillingDB");

  await BillingDB.collection("CompanyBillingData").updateOne(
    { companyID: new ObjectId(id!) },
    { $inc: { messages: 1 } }
  );

  return Response.json({ message: "success" });
}
