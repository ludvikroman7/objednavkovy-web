// src/app/admin/orders/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";

export default async function OrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Objednávky</h1>
      <p style={{ color: "#667" }}>Celkem: {orders.length}</p>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr><th align="left">#</th><th align="left">Zákazník</th><th align="left">Pobočka</th><th align="left">Slot</th><th align="right">Celkem</th><th align="left">Vytvořeno</th></tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} style={{ borderTop: "1px solid #eee" }}>
              <td>{o.id}</td>
              <td>{o.customerName}</td>
              <td>{o.storeId}</td>
              <td>{o.slot}</td>
              <td align="right">{o.totalCzk?.toLocaleString("cs-CZ")} Kč</td>
              <td>{new Date(o.createdAt).toLocaleString("cs-CZ")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
