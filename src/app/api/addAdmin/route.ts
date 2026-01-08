import { requireUser } from "@/utils/auth/requireUser";
import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 🔐 Authentication
    const auth = await requireUser(req);
    if (!auth.ok) return auth.response;

    const actingUserId = auth.user?._id;
    if (!actingUserId) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404 }
      );
    }

    // 📦 Input validation
    const { companyID, userID } = await req.json();
    if (!companyID || !userID) {
      return new Response(
        JSON.stringify({ error: "Missing companyID or userID" }),
        { status: 400 }
      );
    }

    const companyObjectId = new ObjectId(companyID);
    const targetUserObjectId = new ObjectId(userID);
    const actingUserObjectId = new ObjectId(actingUserId);

    // 🗄️ DB
    const { db } = await connectToDatabase("Users");
    const Companies = db.collection("Companies");

    // 🛂 Authorization: acting user must be admin or owner of THIS company
    const company = await Companies.findOne({
      _id: companyObjectId,
      users: {
        $elemMatch: {
          userId: actingUserObjectId,
          role: { $in: ["admin", "owner"] },
        },
      },
    });

    if (!company) {
      return new Response(
        JSON.stringify({ error: "Forbidden: Not a company admin or owner" }),
        { status: 403 }
      );
    }

    // ➕ Promote user to admin
    await Companies.updateOne(
      { _id: companyObjectId },
      {
        $addToSet: {
          users: {
            userId: targetUserObjectId,
            role: "admin",
          },
        },
      }
    );

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    );
  } catch (error) {
    console.error("ADD ADMIN ERROR:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500 }
    );
  }
}
