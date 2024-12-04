import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import "dotenv/config";

const client = createClient({
  url: process.env.DB_URL || "file:local.db",
  authToken: process.env.DB_AUTH_TOKEN,
});

const db = drizzle(client);

async function main() {
  try {
    await migrate(db, {
      migrationsFolder: "drizzle",
    });
    console.log("Migration completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    process.exit(1);
  }
}

main();