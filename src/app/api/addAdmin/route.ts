import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { getToken } from "next-auth/jwt"; // ✅ Import the NextAuth token helper

// Define the structure of the decoded token (for TypeScript)
interface CustomDecodedToken {
  oauthId: string;
}

export async function POST(req: Request) {
  try {
    const token = (await getToken({ req: req as any })) as CustomDecodedToken | null;

    if (!token || !token.oauthId) {
      return new Response(JSON.stringify({ error: "Unauthorized: Invalid Session" }), { status: 401 });
    }

    const oauthId = token.oauthId;

    const { companyID, userID } = await req.json();

    if (!companyID || !userID)
      return new Response(JSON.stringify({ error: "Missing companyID or userID" }), { status: 400 });

    const { db: UsersDB } = await connectToDatabase("Users");
    const CompaniesCollection = UsersDB.collection("Companies");
    const EndusersCollection = UsersDB.collection("Endusers");

    const actingUser = await EndusersCollection.findOne({ oauthId });

    if (!actingUser?._id)
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

    // AUTHORIZATION CHECK (Is the acting user an admin of the company?)
    const company = await CompaniesCollection.findOne({
      _id: new ObjectId(companyID),
      // Check if the acting user's MongoDB ID is in the Admins array
      Admins: { $in: [actingUser._id] }, 
    });

    if (!company)
      return new Response(JSON.stringify({ error: "Forbidden: Not a company admin" }), { status: 403 });

    // Add the target userID to the company's Admins array
    await CompaniesCollection.updateOne(
      { _id: new ObjectId(companyID) },
      { $addToSet: { Admins: new ObjectId(userID) } } 
    );


    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("ADD ADMIN ERROR:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}