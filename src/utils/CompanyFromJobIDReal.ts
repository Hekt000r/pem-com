/****************
 * utils/CompanyFromJobID
 * This one actually does what the name says.
 * Gets the company who posted the job from the provided job ID
 ****************/

import { connectToDatabase } from "./mongodb";
import { ObjectId } from "mongodb";

/* Temporary non-complete job type interface */

type Job = {
  company_id: string;
};

/* Input a string, then use new ObjectID() */
export default async function CompanyFromJobIDReal(job_id: string) {
  const { db: usersDB } = await connectToDatabase("Users");
  const companiesDB = await usersDB.collection("Companies");

  const { db: jobsDB } = await connectToDatabase("Jobs");
  const jobsCollection = await jobsDB.collection("Standard");

  const job = await jobsCollection.findOne({ _id: new ObjectId(job_id) });

  if (!job) {
    const jobs = await jobsCollection.find().toArray();
    return `Job not found (ERR404) info: ${JSON.stringify(jobs)}`;
  }

  const companyID = job.company_id;
  const company = await companiesDB.findOne({ _id: new ObjectId(companyID) });

  return company;
}
