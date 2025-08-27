"use client";

import { useState } from "react";

export default function AdminPage() {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [ok, setOk] = useState(false);
  const [err, setErr] = useState("");

  function login(e: React.FormEvent) {
    e.preventDefault();
    if (user === "Morambor" && pass === "604265189") {
      setOk(true);
      setErr("");
    } else {
      setErr("Neplatné přihlašovací údaje.");
      setOk(false);
    }
  }

  if (ok) {
    return (
      <main style={{ padding: 24, fontFamily: "sans-serif" }}>
        <h1>Administrace</h1>
        <p>Přihlášení úspěšné. (Prototyp – sem doplníme správu objednávek, produktů, banneru…)</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Přihlášení – Administrace</h1>
      <form onSubmit={login} style={{ marginTop: 16, display: "grid", gap: 12, maxWidth: 360 }}>
        <label>
          <div>Uživatel</div>
          <input
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="Morambor"
            style={{ width: "100%", padding: 8 }}
          />
        </label>
        <label>
          <div>Heslo</div>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="604265189"
            style={{ width: "100%", padding: 8 }}
          />
        </label>
        <button type="submit" style={{ padding: 10, fontWeight: 600 }}>Přihlásit</button>
        {err && <div style={{ color: "crimson", fontSize: 14 }}>{err}</div>}
      </form>
    </main>
  );
}
