// src/app/admin/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";

export default async function AdminHome() {
  const recent = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
    take: 10,
  });

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Přehled</h1>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, marginBottom: 24 }}>
        <Stat title="Počet objednávek (celkem)" value={(await prisma.order.count()).toString()} />
        <Stat title="Tržby (součet Kč)" value={(await prisma.order.aggregate({ _sum: { totalCzk: true } }))._sum.totalCzk?.toString() ?? "0"} />
        <Stat title="Dnes" value={(await prisma.order.count({ where: { createdAt: { gte: new Date(new Date().toDateString()) } } })).toString()} />
      </div>

      <h2>Poslední objednávky</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr><th align="left">#</th><th align="left">Zákazník</th><th align="left">Pobočka</th><th align="left">Datum</th><th align="right">Celkem</th></tr>
        </thead>
        <tbody>
          {recent.map(o => (
            <tr key={o.id} style={{ borderTop: "1px solid #eee" }}>
              <td>{o.id}</td>
              <td>{o.customerName}</td>
              <td>{o.storeId}</td>
              <td>{new Date(o.createdAt).toLocaleString("cs-CZ")}</td>
              <td align="right">{o.totalCzk?.toLocaleString("cs-CZ")} Kč</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <div style={{ padding: 16, border: "1px solid #eee", borderRadius: 12, background: "#fff" }}>
      <div style={{ fontSize: 12, color: "#667" }}>{title}</div>
      <div style={{ fontSize: 24, fontWeight: 800 }}>{value}</div>
    </div>
  );
}
