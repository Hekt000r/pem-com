import "server-only";
import { getToken } from "next-auth/jwt";
import { connectToDatabase } from "@/utils/mongodb";
import { NextRequest } from "next/server";
import { ObjectId } from "mongodb";

type AuthResult =
  | { ok: true; user: SafeUser }
  | { ok: false; response: Response };

export async function requireUser(req: NextRequest): Promise<AuthResult> {
  const token = await getToken({ req });

  if (!token || !("oauthId" in token)) {
    return {
      ok: false,
      response: Response.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const { db } = await connectToDatabase("Users");

  const userDoc = await db.collection("Endusers").findOne(
    { oauthId: token.oauthId },
    {
      projection: {
        _id: 1,
        name: 1,
        email: 1,
        image: 1,
        hasProfile: 1,
        oauthId: 1
      },
    }
  );

  if (!userDoc) {
    return {
      ok: false,
      response: Response.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const user: SafeUser = {
    _id: userDoc._id.toString(),
    name: userDoc.name,
    email: userDoc.email,
    image: userDoc.image,
    oauthId: userDoc.oauthId,
    hasProfile: userDoc.hasProfile,
  };

  return { ok: true, user };
}
