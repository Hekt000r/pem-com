/**********
 * /api/getCompanyAdmins
 * 
 * Params:
 * 
 * companyID:
 * ID of the company whose admins you want to get
 * 
 * Returns an array of MongoDB documents containing user information of each admin.
 **********/

import { connectToDatabase } from "@/utils/mongodb";
import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
    const companyID = req.nextUrl.searchParams.get("companyID")

    if (!companyID) {
        return new Response("Missing companyID", { status: 400 });
    }

    const {db: UsersDB} = await connectToDatabase("Users")

    const company = await UsersDB.collection("Companies").findOne({_id: new ObjectId(companyID)})

    const CompanyAdminsIds = company?.Admins

    /* Return an array containing user data */

    if (!CompanyAdminsIds || !Array.isArray(CompanyAdminsIds)) {
        return new Response(JSON.stringify([]), { status: 200 });
    }

    const adminIds = CompanyAdminsIds.map((id: any) => new ObjectId(id));

    const users = await UsersDB.collection("Endusers")
        .find({ _id: { $in: adminIds } })
        .toArray();

    const profiles = await UsersDB.collection("Userprofiles")
        .find({ userId: { $in: adminIds } })
        .toArray();

    const admins = adminIds.map(id => {
        const user = users.find(u => u._id.equals(id));
        const profile = profiles.find(p => p.userId.equals(id));
        return { user, profile };
    });

    return new Response(JSON.stringify(admins), { status: 200 });
}