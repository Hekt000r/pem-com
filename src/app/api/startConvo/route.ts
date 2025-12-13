/**********
 * /api/startConvo
 * Starts a conversation between a user and a Business
 * 
 * Requirements:
 * 
 * Check to make sure they haven't already opened a conversation
 * If already existing then redirect them to convo
 * Create object in Conversations collection
 * Link the User's ObjectID and the companies ObjectID
 * 
 * Params:
 * 
 * userOID: Oauthid of the user
 * companyOID: ObjectID of the company
 * 
 ***********/

import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";


import { requireUser } from "@/utils/auth/requireUser";

export async function GET(req: NextRequest) {
    const auth = await requireUser(req);
    
    if (!auth.ok) {
        return auth.response;
    }

    const companyOID = req.nextUrl.searchParams.get("companyOID")

    if (!companyOID) {
        return NextResponse.json({error: "Missing parameters"}, {status: 400} )
    }

    const { db: usersDB } = await connectToDatabase("Users")
    
    // Validate Company ID format
    if (!ObjectId.isValid(companyOID)) {
          return NextResponse.json({error: "Invalid Company ID"}, {status: 400})
    }

    const company = await usersDB.collection("Companies").findOne({ _id: new ObjectId(companyOID)})

    if (!company) {
        return NextResponse.json({error: "Company not found"}, {status: 404})
    }

    const { db: chatDB } = await connectToDatabase("Chat-DB")

    const userId = new ObjectId(auth.user._id);
    const companyId = company._id;

    // Check for existing conversation (check both orders just in case, though we create in one order)
    let convo = await chatDB.collection("Conversations").findOne({
        participants: { $all: [userId, companyId] }
    })

    if (convo) {
        return NextResponse.json({
            message: "Conversation already exists",
            convoId: convo._id
        })
    }

    const newConvo = await chatDB.collection("Conversations").insertOne({
        participants: [userId, companyId],
        createdAt: new Date(),
        updatedAt: new Date()
    })

    return NextResponse.json({
        message: "Conversation created",
        convoId: newConvo.insertedId
    })

}