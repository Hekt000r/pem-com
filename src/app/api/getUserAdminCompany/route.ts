import { connectToDatabase } from "@/utils/mongodb";
import { UserFromOID } from "@/utils/UserFromOID";
import { Collection, ObjectId } from "mongodb";
import { NextRequest } from "next/server";



export async function GET(req: NextRequest) {
    /* Get the User's OID */
    const oid = req.nextUrl.searchParams.get("oid")

    const user = await UserFromOID(oid!)

    const { db } = await connectToDatabase("Users")
    const companiesCollection: Collection = db.collection("Companies")

    const company = await companiesCollection.findOne({
        Admins: new ObjectId(user?._id)
    });

    if (!company) {
        return new Response(JSON.stringify({ error: "No admin company found for this user." }), {
            status: 404,
            headers: { "Content-Type": "application/json" }
        });
    }

    return Response.json(company)
}