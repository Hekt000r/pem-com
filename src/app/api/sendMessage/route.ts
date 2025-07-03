/***************
 * /api/sendMessage
 * params: message (the text for message)
 * oid (user oauth id)
 * channel (the convoID)
 *********/

import { NextRequest } from "next/server"

const Pusher = require("pusher")

export async function GET(req: NextRequest) {
    const message = req.nextUrl.searchParams.get("message")
    const oid = req.nextUrl.searchParams.get("oid")
    const channel = req.nextUrl.searchParams.get("channel")


    const pusher = new Pusher({
        appId: process.env.PUSHER_app_id,
        key: process.env.NEXT_PUBLIC_PUSHER_key,
        secret: process.env.PUSHER_secret,
        cluster: process.env.PUSHER_cluster
    })
    

    pusher.trigger(channel, "newMessageEvent", {
        message: message
    })

    return Response.json({status: 200})
}