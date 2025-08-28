// src/app/admin/page.tsx
export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { prisma } from '@/lib/prisma';

export default async function AdminPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
    include: { items: true },
  });

  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <h1 style={{ fontSize: 22, fontWeight: 800, margin: 0 }}>Administrace</h1>
      <p style={{ color: '#666', marginTop: 8 }}>Posledních 20 objednávek</p>

      {orders.length === 0 ? (
        <p>Zatím žádné objednávky.</p>
      ) : (
        <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
          {orders.map((o) => (
            <div
              key={o.id}
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: 12,
                background: '#fff',
              }}
            >
              <div style={{ fontWeight: 700 }}>
                {o.customerName} · {o.customerPhone} ·{' '}
                {new Date(o.createdAt).toLocaleString('cs-CZ')}
              </div>
              <ul style={{ marginTop: 8 }}>
                {o.items.map((it: any) => (
                  <li key={it.id}>
                    {it.name} × {it.qty} — {it.price} Kč
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
