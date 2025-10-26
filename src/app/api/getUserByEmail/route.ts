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
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get("email")

    const {db: UsersDB} = await connectToDatabase("Users")

    const user = await UsersDB.collection("Endusers").findOne({email: email})

    return Response.json(user)
}