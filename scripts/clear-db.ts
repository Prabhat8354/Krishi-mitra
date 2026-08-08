import { connectDB } from "../lib/db";
import mongoose from "mongoose";

async function clearDatabase() {
  console.log("========================================");
  console.log("🧹 [KRISHIMITRA DATABASE CLEANER]");
  console.log("========================================");

  try {
    console.log("⚡ Connecting to MongoDB...");
    await connectDB();

    if (!mongoose.connection.db) {
      console.log("ℹ️ No active MongoDB database connection.");
      process.exit(0);
    }

    const collections = await mongoose.connection.db.collections();
    
    if (collections.length === 0) {
      console.log("ℹ️ No collections found to clear.");
      process.exit(0);
    }

    console.log(`📋 Found ${collections.length} collection(s): ${collections.map(c => c.collectionName).join(", ")}`);

    for (const collection of collections) {
      const deleted = await collection.deleteMany({});
      console.log(`🗑️ Cleared collection '${collection.collectionName}': ${deleted.deletedCount} document(s) deleted.`);
    }

    console.log("========================================");
    console.log("✨ MongoDB database successfully wiped clean!");
    console.log("========================================");
  } catch (error: any) {
    console.error("❌ Failed to clear database:", error.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

clearDatabase();
