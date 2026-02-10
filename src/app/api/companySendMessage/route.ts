import { requireUser } from "@/utils/auth/requireUser";
import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { fileTypeFromBuffer } from "file-type";
import pusher from "@/utils/pusher";
import { supabaseAdmin } from "@/utils/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const companyID = formData.get("companyID") as string;
    const channel = formData.get("channel") as string;
    const message = formData.get("message") as string;
    const attachment = formData.get("attachment") as File | null;

    if (attachment && attachment.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large (Max 5MB)" },
        { status: 400 },
      );
    }

    if (!companyID || !channel || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
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
          role: { $in: ["admin", "owner"] },
        },
      },
    });

    if (!company) {
      return NextResponse.json(
        { error: "Forbidden: Not a company admin" },
        { status: 403 },
      );
    }

    // 4. Save Message
    const { db: ChatDB } = await connectToDatabase("Chat-DB");

    // Fix IDOR: Ensure company is part of the conversation
    const conversation = await ChatDB.collection("Conversations").findOne({
      _id: new ObjectId(channel),
      participants: new ObjectId(companyID),
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Forbidden: Company not part of this conversation" },
        { status: 403 },
      );
    }

    const newMessageID = new ObjectId();

    // Attachment handling:
    const allowedMimes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // Standard .docx
      "application/msword", // Older .doc
    ];

    const allowedExtensions = [
      "pdf",
      "jpg",
      "jpeg",
      "png",
      "webp",
      "docx",
      "doc",
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
      const sanitizedOriginalName = attachment.name.replace(/[^a-z0-9.]/gi, '_');
      const filePath = `conversations/${channel}/${newMessageID.toString()}/${sanitizedOriginalName}`;

      // Upload document to Supabase

      const { data, error: uploadError } = await supabaseAdmin.storage
        .from("user-documents")
        .upload(filePath, buffer, {
          contentType: isDocxZip
            ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            : detectedType?.mime,
          upsert: false,
        });
      if (uploadError) throw new Error("Upload Failed! " + uploadError);

      msgAttachment = {
        name: sanitizedOriginalName,
        path: filePath,
        size: attachment.size,
        type: isDocxZip
          ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          : detectedType?.mime,
      };
    }

    const messageDocument = {
      _id: newMessageID,
      conversationId: new ObjectId(channel),
      senderId: new ObjectId(companyID),
      content: message,
      timestamp: new Date(),
      attachments: msgAttachment ? [msgAttachment] : [],
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
      { upsert: true }, // Creates record if it doesn't exist
    );

    return NextResponse.json({
      success: true,
      messageId: messageDocument.conversationId,
    });
  } catch (error) {
    console.error("API Error [companySendMessage]:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
