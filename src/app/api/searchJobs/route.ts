/**************
 * /api/searchJobs
 * Using Atlas built-in search pipeline
 * Searches for job matching query and City
 **************/

import { connectToDatabase } from "@/utils/mongodb";
import { Collection } from "mongodb";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest, res: Response) {
  const { db } = await connectToDatabase("Jobs");
  const JobsCollection: Collection = db.collection("Standard");

  const searchTerm = req.nextUrl.searchParams.get("searchTerm");
  const searchCity = req.nextUrl.searchParams.get("searchCity");


  if (!searchTerm) {
    return new Response(JSON.stringify({ message: "no search term provided" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
    });
}

  const results = await JobsCollection.aggregate([
    {
      $search: {
        compound: {
          must: [
            {
              text: {
                query: searchTerm,
                path: ["title", "company_displayName"],
                fuzzy: {
                  maxEdits: 2,
                  prefixLength: 3,
                },
              },
            },
            ...(searchCity
              ? [
                  {
                    text: {
                      query: searchCity,
                      path: "city",
                      fuzzy: {
                        maxEdits: 2,
                        prefixLength: 2,
                      },
                    },
                  },
                ]
              : []),
          ],
        },
      },
    },
  ]).toArray();



return new Response(JSON.stringify(results), {
    headers: { "Content-Type": "application/json" },
});
}
