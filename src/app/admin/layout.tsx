// src/app/admin/layout.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from "next/link";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", minHeight: "100vh" }}>
      <aside style={{ padding: 16, borderRight: "1px solid #eee", background: "#fafafa" }}>
        <h2 style={{ margin: "0 0 12px", fontSize: 18 }}>Administrace</h2>
        <nav style={{ display: "grid", gap: 8 }}>
          <Link href="/admin">📊 Přehled</Link>
          <Link href="/admin/orders">🧾 Objednávky</Link>
          <Link href="/admin/products">🥖 Produkty</Link>
          <Link href="/admin/categories">🏷️ Kategorie</Link>
          <Link href="/admin/users">👤 Uživatelé</Link>
          <Link href="/admin/roles">🔐 Role & oprávnění</Link>
          <Link href="/admin/settings">⚙️ Nastavení</Link>
        </nav>
      </aside>
      <main style={{ padding: 24 }}>{children}</main>
    </div>
  );
}
