import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { getToken } from "next-auth/jwt"; // ✅ Import the NextAuth token helper

// Define the structure of the decoded token (for TypeScript)
interface CustomDecodedToken {
  oauthId: string;
}

export async function POST(req: Request) {
  try {
    // 1. UNIVERSAL AUTHENTICATION (Web via Cookie, Mobile via Authorization Header)
    // The getToken function automatically looks for the NextAuth session token
    // in both cookies and the 'Authorization: Bearer <token>' header.
    const token = (await getToken({ req: req as any })) as CustomDecodedToken | null;

    if (!token || !token.oauthId) {
      // This handles: Missing cookie (web), Missing/Invalid Authorization header (mobile)
      return new Response(JSON.stringify({ error: "Unauthorized: Invalid Session" }), { status: 401 });
    }

    const oauthId = token.oauthId;

    // 2. INPUT VALIDATION
    const { companyID, userID } = await req.json();

    if (!companyID || !userID)
      return new Response(JSON.stringify({ error: "Missing companyID or userID" }), { status: 400 });

    // 3. DATABASE CONNECTION & COLLECTIONS
    const { db: UsersDB } = await connectToDatabase("Users");
    const CompaniesCollection = UsersDB.collection("Companies");
    const EndusersCollection = UsersDB.collection("Endusers");

    // 4. VERIFY ACTING USER (The user making the request)
    // Lookup by the oauthId from the securely verified token
    const actingUser = await EndusersCollection.findOne({ oauthId });

    if (!actingUser?._id)
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

    // 5. AUTHORIZATION CHECK (Is the acting user an admin of the company?)
    const company = await CompaniesCollection.findOne({
      _id: new ObjectId(companyID),
      // Check if the acting user's MongoDB ID is in the Admins array
      Admins: { $in: [actingUser._id] }, 
    });

    if (!company)
      return new Response(JSON.stringify({ error: "Forbidden: Not a company admin" }), { status: 403 });

    // 6. EXECUTE ACTION (Add the target userID to the company's Admins array)
    await CompaniesCollection.updateOne(
      { _id: new ObjectId(companyID) },
      // Use $addToSet to ensure the userID is only added once
      { $addToSet: { Admins: new ObjectId(userID) } } 
    );

    // 7. SUCCESS RESPONSE
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error("ADD ADMIN ERROR:", err);
    // You should use the error handling provided by NextAuth for specific JWT errors,
    // but this general block catches database/network issues.
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}