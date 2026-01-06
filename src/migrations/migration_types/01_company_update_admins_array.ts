/*****************
 * migration_types/01_company_update_admins_array
 * 
 * Updates companies old Admins array to the new Users style array
 * 
 * 
 *****************/

import { Db, ObjectId } from "mongodb";

export const id = "01_company_update_admins_array"

export const DB_NAME = "Users"


/**
 * Migration Goal:
 * Convert Admins: [id1, id2, id3] 
 * To Users: [{ userId: id1, role: "owner" }, { userId: id2, role: "admin" }, ...]
 */
interface CompanyUser {
  userId: ObjectId;
  role: "owner" | "admin";
}

export async function up(db: Db) {
  // 1. Fetch all companies that still have the old 'Admins' field
  const companies = await db.collection("Companies")
    .find({ Admins: { $exists: true, $not: { $size: 0 } } })
    .toArray();

  if (companies.length === 0) {
    console.log("No companies found requiring migration.");
    return;
  }

  // 2. Map the data in memory (Clean, readable TypeScript)
  const operations = companies.map((company) => {
    const newUsers: CompanyUser[] = company.Admins.map((userId: ObjectId, index: number) => ({
      userId,
      role: index === 0 ? "owner" : "admin",
    }));

    return {
      updateOne: {
        filter: { _id: company._id },
        update: {
          $set: { users: newUsers },
          $unset: { Admins: "" }, // Cleanup the old field
        },
      },
    };
  });

  // 3. Send all 120 updates in one single database command
  const result = await db.collection("Companies").bulkWrite(operations);
  
  console.log(`Successfully migrated ${result.modifiedCount} companies.`);
}