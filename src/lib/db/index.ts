import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

const connectionString = process.env.DATABASE_URL;

if (!connectionString && process.env.NODE_ENV !== "production") {
  // Warn (don't crash the build/import). Read paths catch errors and fall back to
  // defaults; write paths will surface a clear runtime error when actually called.
  console.warn(
    "[db] DATABASE_URL is not set. Copy .env.example to .env.local and add your Neon connection string.",
  );
}

// neon() requires a string; an invalid placeholder simply makes queries fail,
// which the data-access layer catches and degrades to defaults.
const sql = neon(connectionString || "postgresql://invalid:invalid@localhost/invalid");

export const db = drizzle(sql, { schema });
export { schema };
