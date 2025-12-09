/**********
 * /api/getUserByOauthId
 * Fetches a user from database using it's Oauth ID
 **********/

import { NextRequest, NextResponse } from "next/server";
import { UserFromOID } from "@/utils/UserFromOID";

export async function GET(request: NextRequest) {

    const userOauthId = request.nextUrl.searchParams.get("oauthid")
    if (!userOauthId) return NextResponse.json({error: "User not found"}, {status: 404})
    const user = await UserFromOID(userOauthId)

    return Response.json(user)
}