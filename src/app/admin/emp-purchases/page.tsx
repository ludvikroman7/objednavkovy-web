// src/app/admin/emp-purchases/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";

export default async function EmpPurchasesPage() {
  const rows = await prisma.empPurchase.findMany({
    orderBy: { createdAt: "desc" },
    include: { employee: true },
  });

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Firemní nákupy</h1>
      <table style={{ width:"100%", borderCollapse:"collapse", background:"#fff", border:"1px solid #eee", borderRadius:12, overflow:"hidden" }}>
        <thead style={{ background:"#fafafa" }}><tr><th align="left">Zaměstnanec</th><th align="left">Vytvořeno</th><th align="right">Celkem</th><th align="left">Zaplaceno</th></tr></thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.id} style={{ borderTop:"1px solid #eee" }}>
              <td>{r.employee?.name ?? "-"}</td>
              <td>{new Date(r.createdAt).toLocaleString("cs-CZ")}</td>
              <td align="right">{r.total.toLocaleString("cs-CZ")} Kč</td>
              <td>{r.paid ? `Ano (${r.paidAt ? new Date(r.paidAt).toLocaleString("cs-CZ") : ""})` : "Ne"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
