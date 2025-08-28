// src/app/admin/orders/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true, store: true },
  });

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Objednávky</h1>
      <p style={{ color: "#667" }}>Celkem: {orders.length}</p>

      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
        <thead style={{ background: "#fafafa" }}>
          <tr><th align="left">#</th><th align="left">Zákazník</th><th align="left">Telefon</th><th align="left">Pobočka</th><th align="left">Datum</th><th align="left">Slot</th><th align="right">Celkem (položky)</th></tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} style={{ borderTop: "1px solid #eee" }}>
              <td>{o.id}</td>
              <td>{o.customerName}</td>
              <td>{o.customerPhone}</td>
              <td>{o.store?.name ?? o.storeId ?? "-"}</td>
              <td>{o.pickupDate ? new Date(o.pickupDate).toLocaleDateString("cs-CZ") : "-"}</td>
              <td>{o.slot ?? "-"}</td>
              <td align="right">{o.items.reduce((s, i) => s + i.priceCzk, 0).toLocaleString("cs-CZ")} Kč</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
