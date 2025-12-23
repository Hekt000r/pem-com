import { MongoClient } from "mongodb";
import path from "path";

import dotenv from "dotenv";
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

// Your base connection string
const MONGO_URI = process.env.MONGODB_URI

async function runSpecificMigration() {
  const migrationFileName = process.argv[2];

  if (!migrationFileName) {
    console.error("❌ Please provide a migration name.");
    process.exit(1);
  }

  const client = new MongoClient(MONGO_URI!);

  try {
    // 1. Load the migration file
    const migrationPath = path.resolve(__dirname, "migration_types", migrationFileName);
    const migration = await import(migrationPath);

    const targetDbName = migration.DB_NAME

    await client.connect();
    const db = client.db(targetDbName);

    console.log(`🚀 Running [${migrationFileName}] on Database: [${targetDbName}]`);

    // 3. Run the migration
    await migration.up(db);
    
    console.log("✅ Migration completed successfully.");

  } catch (err: any) {
    console.error("❌ Migration failed:", err.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

runSpecificMigration();