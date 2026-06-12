import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

/**
 * site_content — bilingual key/value store for ALL editable copy + image URLs +
 * contact info. One row per logical field. `valueId` = Indonesian (also used as
 * the single value for non-bilingual fields like image URLs); `valueEn` = English.
 * The admin "Editor" writes here; the public site reads (falling back to defaults).
 */
export const siteContent = pgTable("site_content", {
  key: text("key").primaryKey(),
  valueId: text("value_id").notNull().default(""),
  valueEn: text("value_en").notNull().default(""),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

/** products — the solidarity necklaces. */
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: text("price").notNull(), // human string e.g. "Rp 185.000"
  descId: text("desc_id").notNull().default(""),
  descEn: text("desc_en").notNull().default(""),
  symbol: text("symbol").notNull().default("○"), // emoji/glyph fallback when no image
  colors: jsonb("colors").$type<string[]>().notNull().default([]),
  imageUrl: text("image_url").notNull().default(""),
  status: text("status").notNull().default("active"), // active | inactive
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** stories — survivor testimonies submitted by visitors (moderated). */
export const stories = pgTable("stories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default(""), // empty => anonymous
  title: text("title").notNull(),
  body: text("body").notNull(),
  trigger: text("trigger").notNull().default(""), // content warning
  lang: text("lang").notNull().default("id"),
  status: text("status").notNull().default("pending"), // pending | approved | rejected
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** orders — necklace purchase requests. */
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  productId: integer("product_id"),
  item: text("item").notNull(),
  price: text("price").notNull().default(""),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull().default(""),
  address: text("address").notNull(),
  qty: integer("qty").notNull().default(1),
  color: text("color").notNull().default(""),
  payment: text("payment").notNull().default(""),
  message: text("message").notNull().default(""),
  status: text("status").notNull().default("pending"), // pending|processing|shipped|delivered|cancelled
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** contacts — general contact-form messages. */
export const contacts = pgTable("contacts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().default(""),
  email: text("email").notNull(),
  subject: text("subject").notNull().default(""),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"), // new | read | replied
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** admins — owner login(s) for /seller. Seeded from env on first run. */
export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/** rate_limits — fixed-window per-IP counters for public POST endpoints. */
export const rateLimits = pgTable("rate_limits", {
  key: text("key").primaryKey(), // `${ip}:${action}`
  count: integer("count").notNull().default(0),
  resetAt: timestamp("reset_at", { withTimezone: true }).notNull(),
});

export type Product = typeof products.$inferSelect;
export type Story = typeof stories.$inferSelect;
export type Order = typeof orders.$inferSelect;
export type Contact = typeof contacts.$inferSelect;
export type Admin = typeof admins.$inferSelect;
