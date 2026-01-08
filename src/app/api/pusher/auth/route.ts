import { NextRequest, NextResponse } from "next/server";
import pusher from "@/utils/pusher";
import { requireUser } from "@/utils/auth/requireUser";
import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    const body = await req.formData();
    const socketId = body.get("socket_id") as string;
    const channel = body.get("channel_name") as string;

    if (!socketId || !channel) {
      return new NextResponse("Missing socket_id or channel_name", { status: 400 });
    }

    // Security: Only allow chat channels here
    if (!channel.startsWith("private-chat-")) {
      return new NextResponse("Unauthorized channel type", { status: 403 });
    }

    const conversationId = channel.replace("private-chat-", "");
    if (!ObjectId.isValid(conversationId)) {
      return new NextResponse("Invalid conversation ID", { status: 400 });
    }

    const auth = await requireUser(req);
    if (!auth.ok) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = new ObjectId(auth.user._id);

    // Verify if user is part of the conversation
    const { db: chatDB } = await connectToDatabase("Chat-DB");
    const conversation = await chatDB.collection("Conversations").findOne({
      _id: new ObjectId(conversationId),
      $or: [
        { participants: userId },
        // For admins, we might need a different check, but let's start with basic membership
      ]
    });

    // If not found in basic membership, check if user is an admin for any company involved
    if (!conversation) {
        // Find if this user is an admin of any company
        const { db: usersDB } = await connectToDatabase("Users");
        const company = await usersDB.collection("Companies").findOne({
            "users.userId": userId
        });

        if (company) {
            // Check if the company is a participant in this conversation
            const adminConvo = await chatDB.collection("Conversations").findOne({
                _id: new ObjectId(conversationId),
                participants: company._id
            });
            
            if (!adminConvo) {
                return new NextResponse("Forbidden", { status: 403 });
            }
        } else {
            return new NextResponse("Forbidden", { status: 403 });
        }
    }

    const authResponse = pusher.authenticate(socketId, channel);
    return NextResponse.json(authResponse);
  } catch (error) {
    console.error("Pusher Auth Error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
