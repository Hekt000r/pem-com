/************
 * /api/createUserProfile
 * Creates a new profile for a user in MongoDB
 * NOTICE: The user must NOT already have a profile
 ***********/

import { UserFromOID } from "@/utils/UserFromOID";
import { NextRequest } from "next/server";


export async function GET(req: NextRequest) {
    const oid = req.nextUrl.searchParams.get("oauthid")
    if (!oid) return Response.json("No OID provided")

    const profileDataRaw = req.nextUrl.searchParams.get("profiledata")
    if (!profileDataRaw) return Response.json("No profile data provided")
    const profileData = JSON.parse(profileDataRaw)

    const user = await UserFromOID(oid)

    return Response.json(profileData)
}