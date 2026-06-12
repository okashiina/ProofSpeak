"use client";

import { useState } from "react";
import { apiSend } from "@/lib/client";
import { CONTACT_STATUSES, type ContactStatus } from "@/lib/types";
import type { Contact } from "@/lib/db/schema";

const LABELS: Record<ContactStatus, string> = {
  new: "Baru",
  read: "Dibaca",
  replied: "Dibalas",
};

export default function ContactsPanel({
  contacts,
  setContacts,
}: {
  contacts: Contact[];
  setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
}) {
  const [view, setView] = useState<Contact | null>(null);

  async function setStatus(id: number, status: ContactStatus) {
    const res = await apiSend(`/api/seller/contacts/${id}`, "PATCH", { status });
    if (res.ok) setContacts((prev) => prev.map((c) => (c.id === id ? { ...c, status } : c)));
  }

  async function remove(c: Contact) {
    if (!confirm("Hapus pesan ini?")) return;
    const res = await apiSend(`/api/seller/contacts/${c.id}`, "DELETE");
    if (res.ok) setContacts((prev) => prev.filter((x) => x.id !== c.id));
  }

  function open(c: Contact) {
    setView(c);
    if (c.status === "new") setStatus(c.id, "read");
  }

  return (
    <div>
      <div className="adm-title">Pesan Kontak</div>
      <div className="adm-sub">Pesan dari formulir kontak.</div>

      {contacts.length === 0 ? (
        <p className="adm-sub" style={{ margin: 0 }}>Belum ada pesan.</p>
      ) : (
        <div className="tbl-w">
          <table className="tbl">
            <thead>
              <tr>
                <th>Email</th>
                <th>Subjek</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c.id}>
                  <td>{c.email}</td>
                  <td>{c.subject || "—"}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{new Date(c.createdAt).toLocaleDateString("id-ID")}</td>
                  <td>
                    <select value={c.status} onChange={(e) => setStatus(c.id, e.target.value as ContactStatus)}>
                      {CONTACT_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {LABELS[st]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: ".4rem", flexWrap: "wrap" }}>
                      <button className="ab ab-view" onClick={() => open(c)}>
                        Lihat
                      </button>
                      <button className="ab ab-rej" onClick={() => remove(c)}>
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {view && (
        <div className="modal-bd" onClick={(e) => e.target === e.currentTarget && setView(null)}>
          <div className="modal">
            <button className="modal-x" onClick={() => setView(null)} aria-label="Tutup">
              ✕
            </button>
            <div className="modal-tag">{view.subject || "Pesan"}</div>
            <div className="modal-title" style={{ fontSize: "1.3rem" }}>{view.name || "Tanpa nama"}</div>
            <div className="modal-meta">
              <a href={`mailto:${view.email}`} style={{ color: "var(--teal)" }}>{view.email}</a> ·{" "}
              {new Date(view.createdAt).toLocaleString("id-ID")}
            </div>
            <div className="modal-body">{view.message}</div>
          </div>
        </div>
      )}
    </div>
  );
}
