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
import { UserFromOID } from "@/utils/UserFromOID";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    const userOAID = req.nextUrl.searchParams.get("userOID")
    const companyOID = req.nextUrl.searchParams.get("companyOID")

    if (!userOAID || !companyOID) {
        return NextResponse.json({error: "Missing parameters"}, {status: 400} )
    }

    const user = await UserFromOID(userOAID)

    const { db: usersDB } = await connectToDatabase("Users")

    const company = await usersDB.collection("Companies").findOne({ _id: new ObjectId(companyOID)})

    const { db: chatDB } = await connectToDatabase("Chat-DB")

    let convo = await chatDB.collection("Conversations").findOne({
        participants: [user?._id, company?._id]
    })

    if (convo) {
        return NextResponse.json({
            message: "Conversation already exists",
            convoId: convo._id
        })
    }
    // else

    const newConvo = await chatDB.collection("Conversations").insertOne({
        participants: [user?._id, company?._id]
    })

    return NextResponse.json({
        message: "Conversation created",
        convoId: newConvo.insertedId
    })

}