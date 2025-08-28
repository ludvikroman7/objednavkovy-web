// src/app/admin/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";

function Card({ title, value }: { title: string; value: string | number }) {
  return (
    <div style={{ padding: 16, border: "1px solid #eee", borderRadius: 12, background: "#fff" }}>
      <div style={{ fontSize: 12, color: "#667" }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 800 }}>{value}</div>
    </div>
  );
}

export default async function AdminHome() {
  const [ordersTotal, ordersToday] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: new Date(new Date().toDateString()) } } }),
  ]);
  const sum = await prisma.orderItem.aggregate({ _sum: { priceCzk: true } });

  const recent = await prisma.order.findMany({ orderBy: { createdAt: "desc" }, include: { items: true }, take: 10 });

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Přehled</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <Card title="Počet objednávek (celkem)" value={ordersTotal} />
        <Card title="Součet položek (Kč)" value={(sum._sum.priceCzk ?? 0).toLocaleString("cs-CZ")} />
        <Card title="Dnes" value={ordersToday} />
      </div>

      <h2>Poslední objednávky</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
        <thead style={{ background: "#fafafa" }}>
          <tr><th align="left">#</th><th align="left">Zákazník</th><th align="left">Pobočka</th><th align="left">Slot</th><th align="right">Položky</th><th align="left">Vytvořeno</th></tr>
        </thead>
        <tbody>
          {recent.map(o => (
            <tr key={o.id} style={{ borderTop: "1px solid #eee" }}>
              <td>{o.id}</td>
              <td>{o.customerName}</td>
              <td>{o.storeId ?? "-"}</td>
              <td>{o.slot ?? "-"}</td>
              <td align="right">{o.items.reduce((s, i) => s + i.priceCzk, 0).toLocaleString("cs-CZ")} Kč</td>
              <td>{new Date(o.createdAt).toLocaleString("cs-CZ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
