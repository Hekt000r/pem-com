/************
 * /api/getCompanyByID
 * Gets a company by its ID
 ************/

import CompanyFromJobID from "@/utils/CompanyFromJobID";
import { NextRequest } from "next/server";


export async function GET(request: NextRequest) {
    const companyID = request.nextUrl.searchParams.get("companyID")

    if (!companyID) {
        return Response.json({status: 404, message:"No companyID provided."})
    }

    const company = await CompanyFromJobID(companyID)

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