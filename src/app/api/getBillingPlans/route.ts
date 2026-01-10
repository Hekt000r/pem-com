import { connectToDatabase } from "@/utils/mongodb";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { db } = await connectToDatabase("BillingDB");
    const plansCollection = db.collection("BillingPlansInfo");

    const plans = await plansCollection.find({}).toArray();

    return NextResponse.json(plans);
  } catch (error: any) {
    console.error("Error fetching billing plans:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  }
}
