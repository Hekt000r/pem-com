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


    return Response.json(company)
}