import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { fileTypeFromBuffer } from "file-type";
import pusher from "@/utils/pusher";
import { requireUser } from "@/utils/auth/requireUser";
import { supabaseAdmin } from "@/utils/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const message = formData.get("message") as string;
    const channel = formData.get("channel") as string;
    const attachment = formData.get("attachment") as File | null;

    if (attachment && attachment.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large (Max 5MB)" },
        { status: 400 },
      );
    }

    if (!message || !channel) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (!ObjectId.isValid(channel)) {
      return NextResponse.json(
        { error: "Invalid channel ID" },
        { status: 400 },
      );
    }

    const auth = await requireUser(req);
    if (!auth.ok) return auth.response;
    const user = auth.user;

    const userId = new ObjectId(user._id);

    /* 1. Authorization: Check if user is part of the conversation */
    const { db: chatDB } = await connectToDatabase("Chat-DB");
    const conversation = await chatDB.collection("Conversations").findOne({
      _id: new ObjectId(channel),
      participants: userId,
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Unauthorized: You are not part of this conversation" },
        { status: 403 },
      );
    }

    const newMessageID = new ObjectId();

    // 2. Attachment handling:
    const allowedMimes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Standard .docx
      "application/msword", // Older .doc
    ];

    let msgAttachment = null;
    if (attachment && attachment instanceof File) {
      const buffer = Buffer.from(await attachment.arrayBuffer());
      const detectedType = await fileTypeFromBuffer(buffer);
      const clientExtension = attachment.name.split(".").pop()?.toLowerCase();

      const isDocxZip =
        detectedType?.mime === "application/zip" && clientExtension === "docx";
      const isValidMime =
        detectedType && allowedMimes.includes(detectedType.mime);

      if (!isValidMime && !isDocxZip) {
        return NextResponse.json(
          { error: "Invalid file type. Please upload PDF, Word, or Images." },
          { status: 400 },
        );
      }

      const finalExtension = isDocxZip ? "docx" : detectedType?.ext;
      const sanitizedOriginalName = attachment.name.replace(
        /[^a-z0-9.]/gi,
        "_",
      );
      const filePath = `conversations/${channel}/${newMessageID.toString()}/${sanitizedOriginalName}`;

      const { error: uploadError } = await supabaseAdmin.storage
        .from("user-documents")
        .upload(filePath, buffer, {
          contentType: isDocxZip
            ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            : detectedType?.mime,
          upsert: false,
        });

      if (uploadError) {
        console.error("Supabase Upload Error:", uploadError);
        throw new Error("Upload Failed!");
      }

      msgAttachment = {
        name: sanitizedOriginalName,
        path: filePath,
        type: isDocxZip
          ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          : detectedType?.mime,
        size: attachment.size,
      };
    }

    /* 3. Create the message document */
    const messagesCol = chatDB.collection("Messages");
    const messageDocument = {
      _id: newMessageID,
      conversationId: new ObjectId(channel),
      senderId: userId,
      content: message,
      timestamp: new Date(),
      attachments: msgAttachment ? [msgAttachment] : [],
    };

    /* 4. Insert into DB */
    await messagesCol.insertOne(messageDocument);

    /* 5. Trigger Pusher event */
    await pusher.trigger(`private-chat-${channel}`, "newMessageEvent", {
      newMessage: messageDocument,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API Error [sendMessage]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
