import { desc } from "drizzle-orm";
import { getSession, ensureAdminSeeded } from "@/lib/auth";
import { db } from "@/lib/db";
import { stories, orders, contacts } from "@/lib/db/schema";
import { getProducts, getContentMap } from "@/lib/content";
import SellerLogin from "@/components/admin/SellerLogin";
import AdminApp from "@/components/admin/AdminApp";

export const dynamic = "force-dynamic";

export default async function SellerPage() {
  // Make sure the owner can log in on first visit even before running the seed.
  await ensureAdminSeeded().catch(() => {});

  const session = await getSession();
  if (!session) return <SellerLogin />;

  let allStories: (typeof stories.$inferSelect)[] = [];
  let allOrders: (typeof orders.$inferSelect)[] = [];
  let allContacts: (typeof contacts.$inferSelect)[] = [];
  try {
    [allStories, allOrders, allContacts] = await Promise.all([
      db.select().from(stories).orderBy(desc(stories.createdAt)),
      db.select().from(orders).orderBy(desc(orders.createdAt)),
      db.select().from(contacts).orderBy(desc(contacts.createdAt)),
    ]);
  } catch (err) {
    console.error("[seller] data fetch failed:", err);
  }
  const [products, content] = await Promise.all([getProducts(false), getContentMap()]);

  return (
    <AdminApp
      email={session.email}
      initialStories={allStories}
      initialOrders={allOrders}
      initialContacts={allContacts}
      initialProducts={products}
      initialContent={content}
    />
  );
}
