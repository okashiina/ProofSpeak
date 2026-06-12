export type Lang = "id" | "en";

/** A bilingual content map: key -> { id, en }. Image URLs / single values live in `id`. */
export type ContentMap = Record<string, { id: string; en: string }>;

export const STORY_STATUSES = ["pending", "approved", "rejected"] as const;
export type StoryStatus = (typeof STORY_STATUSES)[number];

export const ORDER_STATUSES = [
  "pending",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const CONTACT_STATUSES = ["new", "read", "replied"] as const;
export type ContactStatus = (typeof CONTACT_STATUSES)[number];

/** Order pipeline shown as a timeline in the admin. */
export const ORDER_PIPELINE: OrderStatus[] = [
  "pending",
  "processing",
  "shipped",
  "delivered",
];

export interface ApiOk<T = unknown> {
  ok: true;
  data?: T;
}
export interface ApiErr {
  ok: false;
  error: string;
}
export type ApiResult<T = unknown> = ApiOk<T> | ApiErr;
