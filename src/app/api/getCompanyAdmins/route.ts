import { connectToDatabase } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
    const companyID = req.nextUrl.searchParams.get("companyID");

    // 1. Quick Guard Clauses
    if (!companyID || !ObjectId.isValid(companyID)) {
        return NextResponse.json({ error: "Invalid Company ID" }, { status: 400 });
    }

    try {
        const { db } = await connectToDatabase("Users");

        // 2. Fetch the company first
        const company = await db.collection("Companies").findOne({ _id: new ObjectId(companyID) });

        if (!company || !company.users) {
            return NextResponse.json([]);
        }

        // 3. Extract IDs
        const adminIds = company.users.map((u: any) => new ObjectId(u.userId));

        // 4. Fetch Users and Profiles in PARALLEL (Faster than sequential)
        const [users, profiles] = await Promise.all([
            db.collection("Endusers").find({ _id: { $in: adminIds } }).toArray(),
            db.collection("Userprofiles").find({ userId: { $in: adminIds } }).toArray()
        ]);

        // 5. Map the data together
        const result = adminIds.map((id: ObjectId) => ({
            user: users.find(u => u._id.equals(id)) || null,
            profile: profiles.find(p => p.userId.equals(id)) || null
        }));

        return NextResponse.json(result);

    } catch (error) {
        return NextResponse.json({ error: "Server Error" }, { status: 500 });
    }
}