"use client";

import type { ApiResult } from "./types";

/** Minimal JSON POST helper used by the public forms + admin. */
export async function apiPost<T = unknown>(url: string, body: unknown): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => ({}));
    if (res.status === 429) return { ok: false, error: "__rate__" };
    if (!res.ok || json?.ok === false) {
      return { ok: false, error: json?.error || "__generic__" };
    }
    return { ok: true, data: json?.data as T };
  } catch {
    return { ok: false, error: "__generic__" };
  }
}

export async function apiSend<T = unknown>(
  url: string,
  method: "PATCH" | "DELETE" | "PUT",
  body?: unknown,
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json?.ok === false) return { ok: false, error: json?.error || "__generic__" };
    return { ok: true, data: json?.data as T };
  } catch {
    return { ok: false, error: "__generic__" };
  }
}
