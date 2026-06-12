"use client";

import { useState } from "react";
import { apiPost } from "@/lib/client";

export default function SettingsPanel({ email }: { email: string }) {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState("");
  const [err, setErr] = useState("");

  async function save() {
    setErr("");
    setNote("");
    if (pw.length < 8) {
      setErr("Password minimal 8 karakter.");
      return;
    }
    if (pw !== pw2) {
      setErr("Konfirmasi password tidak cocok.");
      return;
    }
    setBusy(true);
    const res = await apiPost("/api/seller/password", { password: pw });
    setBusy(false);
    if (!res.ok) {
      setErr(res.error === "__generic__" ? "Gagal menyimpan." : res.error);
      return;
    }
    setPw("");
    setPw2("");
    setNote("✓ Password berhasil diubah.");
    setTimeout(() => setNote(""), 4000);
  }

  return (
    <div>
      <div className="adm-title">Pengaturan</div>
      <div className="adm-sub">Akun admin: {email}</div>

      <div className="fcard" style={{ maxWidth: 460, margin: 0 }}>
        <div style={{ fontFamily: "var(--fd)", fontSize: "1.2rem", marginBottom: "1.25rem" }}>
          Ubah Password
        </div>
        {err && <div className="err-msg">{err}</div>}
        <div className="fg">
          <label>Password Baru</label>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            autoComplete="new-password"
            placeholder="Minimal 8 karakter"
          />
        </div>
        <div className="fg">
          <label>Konfirmasi Password</label>
          <input
            type="password"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            autoComplete="new-password"
          />
        </div>
        <button className="btn btn-primary" onClick={save} disabled={busy}>
          {busy ? "Menyimpan…" : "Simpan"}
        </button>
        {note && <div className="save-note">{note}</div>}
      </div>
    </div>
  );
}
