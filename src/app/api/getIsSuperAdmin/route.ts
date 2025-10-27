import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/utils/mongodb";
import { NextRequest } from "next/server";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.oauthId) {
    return Response.json({ superadmin: false }, { status: 401 });
  }

  const { db: UsersDB } = await connectToDatabase("Users");
  const UsersCol = UsersDB.collection("Endusers");
  const user = await UsersCol.findOne({ oauthId: session.user.oauthId });

  if (!user) {
    return Response.json({ superadmin: false }, { status: 403 });
  }

  const SuperAdminsCol = UsersDB.collection("Superadmins");
  const superadmin = await SuperAdminsCol.findOne({ userID: user._id });

  return Response.json({ superadmin: !!superadmin });
}
