/************
 * /api/getCompanyByJobID
 * Gets a company by one of it's job posting's ID.
 ************/

import CompanyFromJobIDReal from "@/utils/CompanyFromJobIDReal";
import { NextRequest } from "next/server";


export async function GET(request: NextRequest) {
    const jobID = request.nextUrl.searchParams.get("jobID")

    if (!jobID) {
        return Response.json({status: 404, message:"No jobID provided."})
    }

    const company = await CompanyFromJobIDReal(jobID)


    return Response.json(company)
}