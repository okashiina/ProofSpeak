"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiPost } from "@/lib/client";

export default function SellerLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    const res = await apiPost("/api/seller/login", { email, password });
    setBusy(false);
    if (!res.ok) {
      setErr(res.error === "__rate__" ? "Terlalu banyak percobaan. Coba lagi nanti." : res.error === "__generic__" ? "Terjadi kesalahan." : res.error);
      return;
    }
    router.refresh();
  }

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={submit}>
        <h1>ProofSpeak</h1>
        <span className="lbl">Panel Admin</span>
        {err && <div className="err-msg">{err}</div>}
        <div className="fg">
          <label htmlFor="le">Email</label>
          <input
            id="le"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@proofspeak.id"
          />
        </div>
        <div className="fg">
          <label htmlFor="lp">Password</label>
          <input
            id="lp"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="btn btn-teal btn-full" type="submit" disabled={busy}>
          {busy ? "Memproses…" : "Masuk"}
        </button>
      </form>
    </div>
  );
}
