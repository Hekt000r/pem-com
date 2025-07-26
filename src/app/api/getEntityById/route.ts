// /api/getEntityById
import { connectToDatabase } from "@/utils/mongodb";
import { ObjectId } from "mongodb";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return new Response("Missing ID", { status: 400 });

  const { db } = await connectToDatabase("Users");

  const user = await db.collection("Endusers").findOne({ _id: new ObjectId(id) });
  if (user) return Response.json({ type: "user", data: user });

  const company = await db.collection("Companies").findOne({ _id: new ObjectId(id) });
  if (company) return Response.json({ type: "company", data: company });

  return new Response("Not found", { status: 404 });
}
