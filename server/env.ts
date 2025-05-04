import * as dotenv from "dotenv";
dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL not found in .env");
  process.exit(1);
} else {
  console.log("✅ DATABASE_URL loaded successfully");
}
