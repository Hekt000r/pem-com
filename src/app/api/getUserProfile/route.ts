/***********
 * /api/getUserProfile
 * Params:
 * oid (user oauth id)
 ************/

import { connectToDatabase } from "@/utils/mongodb";
import { UserFromOID } from "@/utils/UserFromOID";
import { NextRequest } from "next/server";



export async function GET(req: NextRequest) {
    const oid = req.nextUrl.searchParams.get("oid")
    if (!oid) return Response.json({"message": "No OID provided"})

    const User = await UserFromOID(oid)

    const { db } = await connectToDatabase("Users")

    const UserProfile = await db.collection("Userprofiles").findOne(
        { userId: User?._id },
        { projection: { userId: 0 } }
    )

    return Response.json(UserProfile)
}