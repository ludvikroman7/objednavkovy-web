// src/app/order/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

type Product = { id: string; name: string; priceCzk: number };

export default function OrderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [rows, setRows] = useState<{ productId: string; qty: number }[]>([
    { productId: "", qty: 1 },
  ]);
  const [submitting, setSubmitting] = useState(false);
  const [doneId, setDoneId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/products");
        const data = (await res.json()) as Product[];
        setProducts(data);
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const total = useMemo(() => {
    return rows.reduce((sum, r) => {
      const p = products.find(p => p.id === r.productId);
      if (!p) return sum;
      return sum + p.priceCzk * (r.qty || 0);
    }, 0);
  }, [rows, products]);

  function updateRow(idx: number, patch: Partial<{ productId: string; qty: number }>) {
    setRows(prev => prev.map((r, i) => i === idx ? { ...r, ...patch } : r));
  }

  function addRow() {
    setRows(prev => [...prev, { productId: "", qty: 1 }]);
  }

  function removeRow(idx: number) {
    setRows(prev => prev.filter((_, i) => i !== idx));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const payload = {
        name,
        phone,
        items: rows.filter(r => r.productId && r.qty > 0),
      };
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Chyba");
      setDoneId(data.id);
    } catch (e: any) {
      setError(e.message || "Chyba při odeslání.");
    } finally {
      setSubmitting(false);
    }
  }

  if (doneId) {
    return (
      <main style={{ padding: 24, fontFamily: "sans-serif" }}>
        <h1>Objednávka odeslána ✅</h1>
        <p>ID objednávky: <b>{doneId}</b></p>
        <p>Děkujeme! Obratem se ozveme s potvrzením.</p>
        <p><a href="/">← zpět na úvod</a></p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif", maxWidth: 720 }}>
      <h1>Objednávky</h1>
      <p>Vyplňte údaje a vyberte produkty.</p>

      {loading ? <p>Načítám produkty…</p> :
        products.length === 0 ? <p>Žádné produkty v nabídce.</p> : null}

      <form onSubmit={submit} style={{ display: "grid", gap: 16, marginTop: 12 }}>
        <label>
          Jméno a příjmení
          <input value={name} onChange={e => setName(e.target.value)} required
                 style={{ width: "100%", padding: 8, marginTop: 4 }} />
        </label>

        <label>
          Telefon
          <input value={phone} onChange={e => setPhone(e.target.value)} required
                 style={{ width: "100%", padding: 8, marginTop: 4 }} />
        </label>

        <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 40px", gap: 8, fontWeight: 600, marginBottom: 8 }}>
            <div>Produkt</div>
            <div>Množství</div>
            <div></div>
          </div>

          {rows.map((r, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 120px 40px", gap: 8, marginBottom: 8 }}>
              <select value={r.productId} onChange={e => updateRow(i, { productId: e.target.value })} required>
                <option value="">— vyberte —</option>
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.priceCzk.toFixed(2)} Kč)
                  </option>
                ))}
              </select>
              <input type="number" min={1} value={r.qty}
                     onChange={e => updateRow(i, { qty: Number(e.target.value) })}
                     required />
              <button type="button" onClick={() => removeRow(i)} aria-label="Smazat" title="Smazat">✕</button>
            </div>
          ))}

          <button type="button" onClick={addRow}>+ Přidat položku</button>
        </div>

        <div style={{ textAlign: "right", fontWeight: 700 }}>
          Celkem: {total.toFixed(2)} Kč
        </div>

        {error && <p style={{ color: "crimson" }}>{error}</p>}

        <button disabled={submitting || products.length === 0}
                style={{ padding: "10px 16px", fontWeight: 600 }}>
          {submitting ? "Odesílám…" : "Odeslat objednávku"}
        </button>
      </form>
    </main>
  );
}
