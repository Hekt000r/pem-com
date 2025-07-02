/***************
 * /api/getConversationMessages
 * Gets the messages in a conversation using its ID
 * Params: convoID (Conversation ID)
 ***************/

import { connectToDatabase } from "@/utils/mongodb";
import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
    const convoID = req.nextUrl.searchParams.get("convoID")

    if (!convoID) {
        return Response.json({status: 404, message: "No convoID provided"}, {status: 404})
    }

    const {db} = await connectToDatabase("Chat-DB")

    const messagesCol = await db.collection("Messages")
    let query;
    try {
        query = { conversationId: new ObjectId(convoID) };
    } catch (e) {
        return Response.json({ status: 400, message: "Invalid convoID format" }, { status: 400 });
    }
    const messages = await messagesCol.find(query).toArray()

    return Response.json(messages)
}