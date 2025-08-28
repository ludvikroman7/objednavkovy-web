// src/app/admin/products/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

function parseList(v: FormDataEntryValue | null) {
  if (!v) return [] as string[];
  return String(v)
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
}

async function createProduct(formData: FormData) {
  "use server";
  await prisma.product.create({
    data: {
      id: String(formData.get("id")),
      name: String(formData.get("name")),
      priceCzk: Number(formData.get("priceCzk") ?? 0),
      unit: String(formData.get("unit") ?? "ks"),
      weight_g: formData.get("weight_g") ? Number(formData.get("weight_g")) : null,
      img: String(formData.get("img") ?? "") || null,
      description: String(formData.get("description") ?? "") || null,
      allergens: parseList(formData.get("allergens")),
      categories: parseList(formData.get("categories")),
      availableDays: parseList(formData.get("availableDays")),
    },
  });
  revalidatePath("/admin/products");
}

async function updateProduct(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  await prisma.product.update({
    where: { id },
    data: {
      name: String(formData.get("name")),
      priceCzk: Number(formData.get("priceCzk") ?? 0),
      unit: String(formData.get("unit") ?? "ks"),
      weight_g: formData.get("weight_g") ? Number(formData.get("weight_g")) : null,
      img: String(formData.get("img") ?? "") || null,
      description: String(formData.get("description") ?? "") || null,
      allergens: parseList(formData.get("allergens")),
      categories: parseList(formData.get("categories")),
      availableDays: parseList(formData.get("availableDays")),
    },
  });
  revalidatePath("/admin/products");
}

async function deleteProduct(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}

export default async function ProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Produkty</h1>

      {/* CREATE */}
      <details style={{ margin: "12px 0 24px" }}>
        <summary><strong>Přidat produkt</strong></summary>
        <form action={createProduct} style={{ display: "grid", gap: 8, marginTop: 12, background: "#fff", padding: 16, borderRadius: 12, border: "1px solid #eee" }}>
          <input name="id" placeholder="ID (např. chleb-ruzenin)" required />
          <input name="name" placeholder="Název" required />
          <input name="priceCzk" type="number" step="0.01" placeholder="Cena Kč" required />
          <input name="unit" placeholder="Jednotka (ks/g/kg)" defaultValue="ks" />
          <input name="weight_g" type="number" placeholder="Hmotnost v g (volitelné)" />
          <input name="img" placeholder="URL obrázku (volitelné)" />
          <textarea name="description" placeholder="Popis (volitelné)" />
          <input name="allergens" placeholder="Alergeny (csv např. gluten,egg,soy)" />
          <input name="categories" placeholder="Kategorie (csv např. Chléb,Sladké)" />
          <input name="availableDays" placeholder="Dny (csv: mon,tue,wed,thu,fri,sat)" />
          <button type="submit">Uložit</button>
        </form>
      </details>

      {/* LIST */}
      <table style={{ width: "100%", borderCollapse: "collapse", background: "#fff", border: "1px solid #eee", borderRadius: 12, overflow: "hidden" }}>
        <thead style={{ background: "#fafafa" }}>
          <tr><th align="left">ID</th><th align="left">Název</th><th align="right">Cena</th><th align="left">Jedn.</th><th align="left">Kat.</th><th align="left">Dny</th><th align="left">Alergeny</th><th align="left">Akce</th></tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p.id} style={{ borderTop: "1px solid #eee" }}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td align="right">{p.priceCzk.toLocaleString("cs-CZ")} Kč</td>
              <td>{p.unit}</td>
              <td>{p.categories.join(", ")}</td>
              <td>{p.availableDays.join(", ")}</td>
              <td>{p.allergens.join(", ")}</td>
              <td>
                <details>
                  <summary>Upravit</summary>
                  <form action={updateProduct} style={{ display: "grid", gap: 6, marginTop: 8 }}>
                    <input name="id" defaultValue={p.id} readOnly />
                    <input name="name" defaultValue={p.name} />
                    <input name="priceCzk" type="number" step="0.01" defaultValue={p.priceCzk} />
                    <input name="unit" defaultValue={p.unit} />
                    <input name="weight_g" type="number" defaultValue={p.weight_g ?? undefined} />
                    <input name="img" defaultValue={p.img ?? ""} />
                    <textarea name="description" defaultValue={p.description ?? ""} />
                    <input name="allergens" defaultValue={p.allergens.join(",")} />
                    <input name="categories" defaultValue={p.categories.join(",")} />
                    <input name="availableDays" defaultValue={p.availableDays.join(",")} />
                    <button type="submit">Uložit změny</button>
                  </form>
                </details>
                <form action={deleteProduct} style={{ marginTop: 6 }}>
                  <input type="hidden" name="id" value={p.id} />
                  <button type="submit">Smazat</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
