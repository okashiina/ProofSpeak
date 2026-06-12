import { z } from "zod";

const trimmed = (max: number) => z.string().trim().max(max);

export const storySchema = z.object({
  name: trimmed(120).optional().default(""),
  title: trimmed(160).min(1, "Judul wajib diisi."),
  body: trimmed(8000).min(1, "Cerita wajib diisi."),
  trigger: trimmed(160).optional().default(""),
  lang: z.enum(["id", "en"]).default("id"),
  consent: z.literal(true, { errorMap: () => ({ message: "Persetujuan diperlukan." }) }),
});
export type StoryInput = z.infer<typeof storySchema>;

export const orderSchema = z.object({
  productId: z.number().int().positive().nullable().optional(),
  item: trimmed(200).min(1, "Pilih kalung."),
  price: trimmed(60).optional().default(""),
  name: trimmed(160).min(1, "Nama wajib diisi."),
  phone: trimmed(60).min(3, "WhatsApp wajib diisi."),
  email: z.union([z.string().trim().email("Email tidak valid."), z.literal("")]).optional().default(""),
  address: trimmed(800).min(3, "Alamat wajib diisi."),
  qty: z.coerce.number().int().min(1).max(20).default(1),
  color: trimmed(60).optional().default(""),
  payment: trimmed(120).optional().default(""),
  message: trimmed(400).optional().default(""),
});
export type OrderInput = z.infer<typeof orderSchema>;

export const contactSchema = z.object({
  name: trimmed(160).optional().default(""),
  email: z.string().trim().email("Email tidak valid."),
  subject: trimmed(120).optional().default(""),
  message: trimmed(4000).min(1, "Pesan wajib diisi."),
});
export type ContactInput = z.infer<typeof contactSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export const contentSaveSchema = z.object({
  entries: z
    .array(
      z.object({
        key: z.string().min(1).max(120),
        id: z.string().max(8000),
        en: z.string().max(8000),
      }),
    )
    .max(500),
});

export const productSchema = z.object({
  name: trimmed(120).min(1),
  price: trimmed(60).min(1),
  descId: trimmed(600).optional().default(""),
  descEn: trimmed(600).optional().default(""),
  symbol: trimmed(12).optional().default("○"),
  colors: z.array(z.string().trim().max(40)).max(12).default([]),
  imageUrl: trimmed(600).optional().default(""),
  status: z.enum(["active", "inactive"]).default("active"),
  sortOrder: z.coerce.number().int().default(0),
});
