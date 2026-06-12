/**
 * Seed script: `npm run db:seed`
 * - Inserts the default necklace products (only if the table is empty)
 * - Creates the initial admin from ADMIN_EMAIL / ADMIN_PASSWORD (only if none)
 *
 * Content copy is NOT seeded — the site falls back to DEFAULT_CONTENT until the
 * owner edits it in /seller, at which point rows are created on demand.
 *
 * Run after `npm run db:push` (or db:migrate). Reads env from .env.local via
 * `node --env-file` (see package.json).
 */
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";
import { db } from "./index";
import { products, admins } from "./schema";
import { DEFAULT_PRODUCTS } from "../content-defaults";

async function main() {
  // Products
  const [{ count: prodCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(products);
  if (prodCount === 0) {
    await db.insert(products).values(DEFAULT_PRODUCTS);
    console.log(`✓ Seeded ${DEFAULT_PRODUCTS.length} products`);
  } else {
    console.log(`• Products already present (${prodCount}) — skipped`);
  }

  // Admin
  const [{ count: adminCount }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(admins);
  if (adminCount === 0) {
    const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const password = process.env.ADMIN_PASSWORD;
    if (email && password) {
      const passwordHash = await bcrypt.hash(password, 10);
      await db.insert(admins).values({ email, passwordHash }).onConflictDoNothing();
      console.log(`✓ Seeded admin: ${email}`);
    } else {
      console.log("• ADMIN_EMAIL / ADMIN_PASSWORD not set — admin will be seeded on first login attempt");
    }
  } else {
    console.log(`• Admin already present (${adminCount}) — skipped`);
  }

  console.log("Done.");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
