export const dynamic = "force-dynamic";
// src/app/admin/page.tsx
export const revalidate = 0;

import { prisma } from "@/lib/prisma";

export default async function AdminPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    include: { items: true },
  });

  return (
    <main style={{ padding: 24, fontFamily: "sans-serif" }}>
      <h1>Administrace</h1>
      <p>Posledních 20 objednávek:</p>

      {orders.length === 0 && <p>Zatím žádné objednávky.</p>}

      <div style={{ display: "grid", gap: 12 }}>
        {orders.map(o => (
          <div key={o.id} style={{ border: "1px solid #ddd", borderRadius: 8, padding: 12 }}>
            <div style={{ fontWeight: 700 }}>
              {o.customerName} • {o.customerPhone} • {new Date(o.createdAt).toLocaleString("cs-CZ")}
            </div>
            <div style={{ color: "#666" }}>Stav: {o.status}</div>
            <ul style={{ marginTop: 8 }}>
              {o.items.map(it => (
                <li key={it.id}>
                  {it.qty}× {it.name} — {(it.priceCzk * it.qty).toFixed(2)} Kč
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p style={{ marginTop: 16 }}><a href="/">← zpět na úvod</a></p>
    </main>
  );
}
