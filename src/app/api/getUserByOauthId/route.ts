/**********
 * /api/getUserByOauthId
 * Fetches a user from database using it's Oauth ID
 **********/

import { NextRequest } from "next/server";
import { UserFromOID } from "@/utils/UserFromOID";

export async function GET(request: NextRequest) {

    const userOauthId = request.nextUrl.searchParams.get("oauthid")
    if (!userOauthId) return
    const user = await UserFromOID(userOauthId)

    return Response.json(user)
}