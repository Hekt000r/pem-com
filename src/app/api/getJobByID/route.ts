/************
 * /api/getJobByID
 * Gets a job by its ID
 ************/


import JobFromID from "@/utils/JobFromID";
import { NextRequest } from "next/server";


export async function GET(request: NextRequest) {
    const id = request.nextUrl.searchParams.get("id")

    if (!id) {
        return Response.json({status: 404, message:"No id provided."})
    }

    const job = await JobFromID(id)


    return Response.json(job)
} 