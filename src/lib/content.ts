import "server-only";
import { and, desc, eq, sql } from "drizzle-orm";
import { db } from "./db";
import { siteContent, products, stories, orders } from "./db/schema";
import { DEFAULT_CONTENT } from "./content-defaults";
import type { ContentMap } from "./types";
import type { Product, Story } from "./db/schema";

/** Full content map = defaults overlaid with any saved DB values. */
export async function getContentMap(): Promise<ContentMap> {
  const map: ContentMap = {};
  for (const [k, v] of Object.entries(DEFAULT_CONTENT)) map[k] = { ...v };
  try {
    const rows = await db.select().from(siteContent);
    for (const r of rows) {
      map[r.key] = { id: r.valueId, en: r.valueEn || r.valueId };
    }
  } catch {
    // DB not reachable yet (e.g. before first migration) — fall back to defaults.
  }
  return map;
}

export async function saveContentEntries(
  entries: { key: string; id: string; en: string }[],
): Promise<void> {
  for (const e of entries) {
    await db
      .insert(siteContent)
      .values({ key: e.key, valueId: e.id, valueEn: e.en, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: siteContent.key,
        set: { valueId: e.id, valueEn: e.en, updatedAt: new Date() },
      });
  }
}

export async function setContentValue(key: string, value: string): Promise<void> {
  await db
    .insert(siteContent)
    .values({ key, valueId: value, valueEn: value, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: siteContent.key,
      set: { valueId: value, valueEn: value, updatedAt: new Date() },
    });
}

export async function getProducts(onlyActive = false): Promise<Product[]> {
  try {
    const rows = await db
      .select()
      .from(products)
      .orderBy(products.sortOrder, products.id);
    return onlyActive ? rows.filter((p) => p.status === "active") : rows;
  } catch {
    return [];
  }
}

export async function getApprovedStories(): Promise<Story[]> {
  try {
    return await db
      .select()
      .from(stories)
      .where(eq(stories.status, "approved"))
      .orderBy(desc(stories.createdAt));
  } catch {
    return [];
  }
}

export async function getApprovedStory(id: number): Promise<Story | null> {
  try {
    const [s] = await db
      .select()
      .from(stories)
      .where(and(eq(stories.id, id), eq(stories.status, "approved")))
      .limit(1);
    return s ?? null;
  } catch {
    return null;
  }
}

export async function getStats(): Promise<{ stories: number; orders: number }> {
  try {
    const [s] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(stories)
      .where(eq(stories.status, "approved"));
    const [o] = await db.select({ n: sql<number>`count(*)::int` }).from(orders);
    return { stories: s?.n ?? 0, orders: o?.n ?? 0 };
  } catch {
    return { stories: 0, orders: 0 };
  }
}
