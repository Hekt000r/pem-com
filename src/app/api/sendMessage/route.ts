/***************
 * /api/sendMessage
 * params: message (the text for message)
 * channel (the convoID)
 *********/

import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import pusher from "@/utils/pusher";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    const { message, channel } = await req.json();

    if (!message || !channel) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!ObjectId.isValid(channel)) {
      return NextResponse.json({ error: "Invalid channel ID" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session || !session.user?._id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = new ObjectId(session.user._id);

    /* 1. Authorization: Check if user is part of the conversation */
    const { db: chatDB } = await connectToDatabase("Chat-DB");
    const conversation = await chatDB.collection("Conversations").findOne({
      _id: new ObjectId(channel),
      participants: userId,
    });

    if (!conversation) {
      return NextResponse.json({ error: "Unauthorized: You are not part of this conversation" }, { status: 403 });
    }

    /* 2. Create the message document */
    const messagesCol = chatDB.collection("Messages");
    const messageDocument = {
      conversationId: new ObjectId(channel),
      senderId: userId,
      content: message,
      timestamp: new Date(),
    };

    /* 3. Insert into DB */
    await messagesCol.insertOne(messageDocument);

    /* 4. Trigger Pusher event */
    await pusher.trigger(`private-chat-${channel}`, "newMessageEvent", {
      newMessage: messageDocument,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error [sendMessage]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
