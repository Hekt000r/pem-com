/*********
 * /api/addAdmin
 *
 * Method: POST
 *
 * Body:
 * {
 *   "companyID": string,
 *   "userID": string
 * }
 *
 ********/

import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  // ✅ 1. Verify user is logged in
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ 2. Parse request body
  const { companyID, userID } = await req.json();

  if (!companyID || !userID) {
    return Response.json({ error: "Missing companyID or userID" }, { status: 400 });
  }

  // ✅ 3. Connect to database
  const { db: UsersDB } = await connectToDatabase("Users");
  const CompaniesCollection = UsersDB.collection<Company>("Companies");
  const EndusersCollection = UsersDB.collection("Endusers");

  // ✅ 4. Find the logged-in user's record
  const actingUser = await EndusersCollection.findOne({
    email: session.user.email,
  });

  if (!actingUser?._id) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  // ✅ 5. Check if the acting user is an admin in the company
  const company = await CompaniesCollection.findOne({
    _id: new ObjectId(companyID),
    Admins: { $in: [actingUser._id] },
  });

  if (!company) {
    return Response.json({ error: "Forbidden: Not a company admin" }, { status: 403 });
  }

  // ✅ 6. Add the new admin (avoid duplicates)
  await CompaniesCollection.updateOne(
    { _id: new ObjectId(companyID) },
    { $addToSet: { Admins: new ObjectId(userID) } } // $addToSet prevents duplicates
  );

  // ✅ 7. Respond
  return Response.json({ success: true }, { status: 200 });
}
