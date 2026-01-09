import { requireUser } from "@/utils/auth/requireUser";
import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import pusher from "@/utils/pusher";

export async function POST(req: NextRequest) {
  try {
    // 1. Extract and Validate Input
    const { companyID, channel, message } = await req.json();

    if (!companyID || !channel || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 2. Authentication
    const auth = await requireUser(req);
    if (!auth.ok) return auth.response;
    const user = auth.user;

    // 3. Authorization Check
    const { db: UsersDB } = await connectToDatabase("Users");
    
    // We check if the user is in the Admins array of the specific company
    const company = await UsersDB.collection("Companies").findOne({
      _id: new ObjectId(companyID),
      users: {
        $elemMatch: {
          userId: new ObjectId(user._id),
          role: { $in: ["admin", "owner"] } 
        },
      },
    });

    if (!company) {
      return NextResponse.json({ error: "Forbidden: Not a company admin" }, { status: 403 });
    }

    // 4. Save Message
    const { db: ChatDB } = await connectToDatabase("Chat-DB");

    // Fix IDOR: Ensure company is part of the conversation
    const conversation = await ChatDB.collection("Conversations").findOne({
        _id: new ObjectId(channel),
        participants: new ObjectId(companyID) 
    });

    if (!conversation) {
         return NextResponse.json({ error: "Forbidden: Company not part of this conversation" }, { status: 403 });
    }

    const messageDocument = {
      conversationId: new ObjectId(channel),
      senderId: new ObjectId(companyID),
      content: message,
      timestamp: new Date(),
    };

    await ChatDB.collection("Messages").insertOne(messageDocument);

    // 5. Trigger Real-time Event
    await pusher.trigger(`private-chat-${channel}`, "newMessageEvent", {
      newMessage: messageDocument,
    });

    // 6. Update Billing (Fire and forget or await depending on priority)
    const { db: BillingDB } = await connectToDatabase("BillingDB");
    await BillingDB.collection("CompanyBillingData").updateOne(
      { companyID: new ObjectId(companyID) },
      { $inc: { messages: 1 } },
      { upsert: true } // Creates record if it doesn't exist
    );

    return NextResponse.json({ success: true, messageId: messageDocument.conversationId });

  } catch (error) {
    console.error("API Error [companySendMessage]:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}