export const dynamic = 'force-dynamic';
// src/app/api/order/route.ts
import { prisma } from "@/lib/prisma";

type Body = {
  name: string;
  phone: string;
  items: { productId: string; qty: number }[];
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    if (!body.name || !body.phone || !Array.isArray(body.items) || body.items.length === 0) {
      return new Response(JSON.stringify({ error: "Neplatná data." }), { status: 400 });
    }

    // načteme produkty kvůli ceně/jménu
    const productIds = body.items.map(i => i.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, name: true, priceCzk: true },
    });

    // složíme položky + spočítáme cenu
    const orderItems = body.items.map((i) => {
      const p = products.find(p => p.id === i.productId);
      if (!p) throw new Error("Produkt nenalezen.");
      return {
        productId: p.id,
        name: p.name,
        qty: i.qty,
        priceCzk: p.priceCzk,
      };
    });

    const order = await prisma.order.create({
      data: {
        customerName: body.name,
        customerPhone: body.phone,
        status: "new",
        items: {
          create: orderItems.map(i => ({
            productId: i.productId,
            name: i.name,
            qty: i.qty,
            priceCzk: i.priceCzk,
          })),
        },
      },
      select: { id: true },
    });

    return Response.json({ ok: true, id: order.id });
  } catch (e: any) {
    console.error(e);
    return new Response(JSON.stringify({ error: "Chyba při ukládání objednávky." }), { status: 500 });
  }
}
