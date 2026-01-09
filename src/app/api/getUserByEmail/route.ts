/************
 * /api/getUserByEmail
 * 
 * Gets user object by their email
 * 
 * Params:
 * 
 * email
 *********/

import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/utils/auth/requireUser";

export async function GET(req: NextRequest) {
    const auth = await requireUser(req);
    if (!auth.ok) return auth.response;
    const user = auth.user;

    const email = req.nextUrl.searchParams.get("email");
    if (!email) return NextResponse.json({ error: "Email is required" }, { status: 400 });

    const {db: UsersDB} = await connectToDatabase("Users");

    // Authorization: Check if the requester belongs to at least one company
    // This implies they are a business user potentially looking to invite someone
    const requesterCompany = await UsersDB.collection("Companies").findOne({
        "users.userId": new ObjectId(user._id)
    });

    if (!requesterCompany) {
        return NextResponse.json({ error: "Forbidden: Only company members can search for users" }, { status: 403 });
    }

    const foundUser = await UsersDB.collection("Endusers").findOne(
        { email: email },
        { projection: { name: 1, email: 1, image: 1, _id: 1 } } // ALLOW LIST ONLY
    );

    if (!foundUser) return NextResponse.json(null);

    return Response.json(foundUser);
}