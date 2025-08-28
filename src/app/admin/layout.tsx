// src/app/admin/layout.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import Link from "next/link";
import type { ReactNode } from "react";

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} style={{ padding: "8px 10px", borderRadius: 8, textDecoration: "none", color: "#111", background: "#fff", border: "1px solid #eee" }}>
    {children}
  </Link>
);

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", minHeight: "100vh", background: "#f6f7f9" }}>
      <aside style={{ padding: 16, borderRight: "1px solid #eee", background: "#fafafa" }}>
        <h2 style={{ margin: "0 0 12px", fontSize: 18 }}>Administrace</h2>
        <nav style={{ display: "grid", gap: 8 }}>
          <NavLink href="/admin">📊 Přehled</NavLink>
          <NavLink href="/admin/orders">🧾 Objednávky</NavLink>
          <NavLink href="/admin/products">🥖 Produkty</NavLink>
          <NavLink href="/admin/stores">🏪 Pobočky</NavLink>
          <NavLink href="/admin/slot-closures">⛔ Uzávěrky slotů</NavLink>
          <NavLink href="/admin/news">📰 Novinky</NavLink>
          <NavLink href="/admin/banner">🖼️ Banner</NavLink>
          <NavLink href="/admin/employees">👷 Zaměstnanci</NavLink>
          <NavLink href="/admin/emp-purchases">🧾 Firemní nákupy</NavLink>
          <NavLink href="/admin/blacklist">🚫 Blacklist čísel</NavLink>
        </nav>
      </aside>
      <main style={{ padding: 24 }}>{children}</main>
    </div>
  );
}
