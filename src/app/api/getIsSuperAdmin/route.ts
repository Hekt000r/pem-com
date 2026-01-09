import { connectToDatabase } from "@/utils/mongodb";
import { NextRequest } from "next/server";
import { requireUser } from "@/utils/auth/requireUser";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  /* Check if user is authenticated */

  const auth = await requireUser(req);
  if (!auth.ok) return auth.response;

  const user = auth.user;

  const { db: UsersDB } = await connectToDatabase("Users");
  const UsersCol = UsersDB.collection("Endusers");

  if (!user) {
    return Response.json({ superadmin: false }, { status: 403 });
  }

  const SuperAdminsCol = UsersDB.collection("Superadmins");
  const superadmin = await SuperAdminsCol.findOne({ userID: new ObjectId(user._id) });

  return Response.json({ superadmin: !!superadmin });
}
