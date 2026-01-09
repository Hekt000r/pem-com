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

    if (!company || typeof company === 'string') {
        return Response.json({ status: 404, message: "Company not found" })
    }

    // Projection: Allow List ONLY
    const safeCompany = {
        _id: company._id,
        name: company.name,
        industry: company.industry,
        description: company.description,
        site: company.site,
        location: company.location,
        imgURL: company.imgURL,
    };

    return Response.json(safeCompany)
}