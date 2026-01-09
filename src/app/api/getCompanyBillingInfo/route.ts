/**********
 * /api/getCompanyBillingInfo
 * 
 * Info:
 * Gets the specified company's billing
 * 
 * Params
 * 
 * companyID: ID of company to check
 * 
 * Returns:
 * 
 * Object including 2 other objects:
 * 
 * BillingPlanInfo:
 * The active plan that the company 
 * has
 * 
 * CompanyBillingInfo:
 * The stats of the company like
 * posts, messages, ads, etc, also
 * includes an "active" boolean indicating
 * whether or not the subscription has been
 * paid for and is active
 */

import { requireUser } from "@/utils/auth/requireUser"; // Import requireUser
import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server"; // Import NextResponse

export async function GET(req: NextRequest) {
    // 1. Authentication Check
    const auth = await requireUser(req);
    if (!auth.ok) return auth.response;
    const user = auth.user;

    /* 2. Get the company */
    const companyID = req.nextUrl.searchParams.get("companyID")

    if (!companyID) {
        throw new Error("Missing companyID parameter");
    }

    const {db: UsersDB} = await connectToDatabase("Users")

    // 3. Authorization Check: Ensure user belongs to this company
    const company = await UsersDB.collection("Companies").findOne({
        _id: new ObjectId(companyID),
        users: { $elemMatch: { userId: new ObjectId(user._id) } }
    });

    if (!company) {
        return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
    }

    /* 2. Get the company's plan and usage */

    const {db: BillingDB} = await connectToDatabase("BillingDB")

    const CompanyBillingDataCollection = await BillingDB.collection("CompanyBillingData")
    const BillingPlansCollection = await BillingDB.collection("BillingPlansInfo")

    const companyBillingObject = await CompanyBillingDataCollection.findOne({companyID: new ObjectId(companyID)})

    const companyBillingPlan = await BillingPlansCollection.findOne(companyBillingObject?.billingPlanID)

    /* Format them into a single object */

    const resObj = {
        BillingPlanInfo: companyBillingPlan,
        CompanyBillingInfo: companyBillingObject,
    }

    return Response.json(resObj)
}