/*****************
 * migration_types/02_job_posts_add_expired_at
 * 
 * Adds "expiredAt" date to job posts that don't have one.
 * The date is set to 15 days from the time of migration.
 * 
 *****************/

import { Db } from "mongodb";

export const id = "02_job_posts_add_expired_at"

export const DB_NAME = "Jobs"

export async function up(db: Db) {
  // 1. Calculate the expiration date (15 days from now)
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + 15);

  console.log(`Setting expiration date to: ${expirationDate.toISOString()}`);

  // 2. Update job posts in the "Standard" collection that don't have an "expiredAt" field
  const result = await db.collection("Standard").updateMany(
    { expiredAt: { $exists: false } },
    { $set: { expiredAt: expirationDate } }
  );

  console.log(`Successfully updated ${result.modifiedCount} job posts with an expiration date.`);
}
