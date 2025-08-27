export const runtime = "nodejs";
export const dynamic = 'force-dynamic';
// src/app/api/products/route.ts
import { prisma } from "@/lib/prisma";

export async function GET() {
  const products = await prisma.product.findMany({
    orderBy: { name: "asc" },
    take: 1000,
  });
  return Response.json(products);
}
