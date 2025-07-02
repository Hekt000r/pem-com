/***********
 * Triggers an example Pusher event for testing
 */

const Pusher = require("pusher")

export async function GET() {
    const pusher = new Pusher({
        appId: process.env.PUSHER_app_id,
        key: process.env.NEXT_PUBLIC_PUSHER_key,
        secret: process.env.PUSHER_secret,
        cluster: process.env.PUSHER_cluster
    })

    pusher.trigger("test-channel", "test-event", {
        message: "test"
    })

    return Response.json({status: 200})
}