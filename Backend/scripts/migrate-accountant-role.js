import "dotenv/config";
import mongoose from "mongoose";
import User from "../Models/User.js";

async function run() {
  if (!process.env.MONGO_URI) {
    console.error("MONGO_URI is not set. Aborting migration.");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  try {
    const legacyCount = await User.countDocuments({ role: "accountant" });

    if (legacyCount === 0) {
      console.log("No users with role 'accountant' found. Nothing to migrate.");
      return;
    }

    const result = await User.updateMany(
      { role: "accountant" },
      { $set: { role: "account" } }
    );

    console.log(`Migration completed. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
  } finally {
    await mongoose.disconnect();
  }
}

run()
  .then(() => process.exit(0))
  .catch(async (err) => {
    console.error("Migration failed:", err.message);
    try {
      await mongoose.disconnect();
    } catch {
      // Ignore disconnect errors on failure path.
    }
    process.exit(1);
  });
