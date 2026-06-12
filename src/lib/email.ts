import "server-only";
import { Resend } from "resend";
import type { Order, Story, Contact } from "./db/schema";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM || "ProofSpeak <onboarding@resend.dev>";
const to = process.env.RESEND_TO;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://proofspeak.vercel.app";

const resend = apiKey ? new Resend(apiKey) : null;

function shell(title: string, rows: [string, string][], cta?: string): string {
  const body = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 14px 6px 0;color:#888;font-size:13px;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:6px 0;color:#171817;font-size:14px">${escapeHtml(v) || "—"}</td></tr>`,
    )
    .join("");
  return `<div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px">
    <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#386069">ProofSpeak</div>
    <h2 style="font-size:20px;font-weight:600;color:#171817;margin:6px 0 18px">${title}</h2>
    <table style="border-collapse:collapse;width:100%">${body}</table>
    ${cta ? `<a href="${cta}" style="display:inline-block;margin-top:22px;background:#171817;color:#f0fc2f;text-decoration:none;padding:11px 22px;border-radius:30px;font-size:13px">Buka panel admin →</a>` : ""}
  </div>`;
}

function escapeHtml(s: string): string {
  return String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function send(subject: string, html: string): Promise<boolean> {
  if (!resend || !to) {
    // Email not configured — that's fine; the record is still saved to the DB
    // and visible in /seller. Log so the developer knows why no email arrived.
    console.warn("[email] skipped (RESEND_API_KEY / RESEND_TO not set):", subject);
    return false;
  }
  try {
    await resend.emails.send({ from, to, subject, html });
    return true;
  } catch (err) {
    console.error("[email] send failed:", err);
    return false;
  }
}

export function notifyNewStory(s: Story): Promise<boolean> {
  return send(
    `Cerita baru menunggu moderasi — "${s.title}"`,
    shell("Cerita baru masuk", [
      ["Judul", s.title],
      ["Nama", s.name || "Anonim"],
      ["Bahasa", s.lang.toUpperCase()],
      ["TW", s.trigger],
      ["Cuplikan", s.body.slice(0, 240)],
    ], `${siteUrl}/seller`),
  );
}

export function notifyNewOrder(o: Order): Promise<boolean> {
  return send(
    `Pesanan kalung baru — ${o.item} (${o.name})`,
    shell("Pesanan kalung baru", [
      ["Item", o.item],
      ["Harga", o.price],
      ["Jumlah", String(o.qty)],
      ["Warna", o.color],
      ["Nama", o.name],
      ["WhatsApp", o.phone],
      ["Email", o.email],
      ["Alamat", o.address],
      ["Pembayaran", o.payment],
      ["Catatan", o.message],
    ], `${siteUrl}/seller`),
  );
}

export function notifyNewContact(c: Contact): Promise<boolean> {
  return send(
    `Pesan kontak baru — ${c.subject || "Umum"}`,
    shell("Pesan kontak baru", [
      ["Nama", c.name || "—"],
      ["Email", c.email],
      ["Subjek", c.subject],
      ["Pesan", c.message],
    ], `${siteUrl}/seller`),
  );
}
