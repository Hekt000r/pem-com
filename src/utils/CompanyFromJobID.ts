/****************
 * utils/CompanyFromJobID
 * Does precisely NOT what the name says.
 * Gets the company who posted the job, by entering the company_id connected to the job
 ****************/

import { connectToDatabase } from "./mongodb";
import { ObjectId } from "mongodb";

/* Input a string, then use new ObjectID() */
export default async function CompanyFromJobID(company_foreign_id: string) {
    const { db } = await connectToDatabase("Users");
    const companiesDB = db.collection("Companies");

    const company = await companiesDB.findOne({ _id: new ObjectId(company_foreign_id) });

    if (!company) return "Company not found (ERR404)";

    return company;
}