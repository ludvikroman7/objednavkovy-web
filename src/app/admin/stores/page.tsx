// src/app/admin/stores/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function create(formData: FormData) { "use server";
  await prisma.store.create({
    data: {
      id: String(formData.get("id")),
      name: String(formData.get("name")),
      address: String(formData.get("address")),
      card: formData.get("card") === "on",
    },
  });
  revalidatePath("/admin/stores");
}
async function update(formData: FormData) { "use server";
  const id = String(formData.get("id"));
  await prisma.store.update({
    where: { id },
    data: {
      name: String(formData.get("name")),
      address: String(formData.get("address")),
      card: formData.get("card") === "on",
    },
  });
  revalidatePath("/admin/stores");
}
async function del(formData: FormData) { "use server";
  await prisma.store.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/stores");
}

export default async function StoresPage() {
  const rows = await prisma.store.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Pobočky</h1>

      <details><summary>Přidat pobočku</summary>
        <form action={create} style={{ display:"grid", gap:8, marginTop: 8 }}>
          <input name="id" placeholder="ID" required />
          <input name="name" placeholder="Název" required />
          <input name="address" placeholder="Adresa" required />
          <label><input type="checkbox" name="card" defaultChecked /> karta OK</label>
          <button type="submit">Uložit</button>
        </form>
      </details>

      <ul>
        {rows.map(s=>(
          <li key={s.id} style={{ background:"#fff", border:"1px solid #eee", borderRadius:8, padding:12, marginTop:8 }}>
            <div><strong>{s.name}</strong> — {s.address} {s.card ? "• karta OK" : ""}</div>
            <details style={{ marginTop:8 }}>
              <summary>Upravit</summary>
              <form action={update} style={{ display:"grid", gap:6, marginTop:6 }}>
                <input name="id" defaultValue={s.id} readOnly />
                <input name="name" defaultValue={s.name} />
                <input name="address" defaultValue={s.address} />
                <label><input type="checkbox" name="card" defaultChecked={s.card} /> karta OK</label>
                <button>Uložit</button>
              </form>
            </details>
            <form action={del} style={{ marginTop:6 }}>
              <input type="hidden" name="id" value={s.id} />
              <button>Smazat</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
