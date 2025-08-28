// src/app/admin/slot-closures/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function create(formData: FormData) { "use server";
  await prisma.slotClosure.create({
    data: {
      date: new Date(String(formData.get("date"))),
      storeId: String(formData.get("storeId")),
      slot: Number(formData.get("slot")),
    },
  });
  revalidatePath("/admin/slot-closures");
}
async function del(formData: FormData) { "use server";
  await prisma.slotClosure.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/slot-closures");
}

export default async function SlotClosuresPage() {
  const [stores, rows] = await Promise.all([
    prisma.store.findMany({ orderBy: { name: "asc"} }),
    prisma.slotClosure.findMany({ orderBy: [{ date: "desc" }, { storeId: "asc" }] }),
  ]);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Uzávěrky slotů</h1>

      <form action={create} style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr auto", gap:8, background:"#fff", padding:12, border:"1px solid #eee", borderRadius:12, marginBottom:16 }}>
        <input type="date" name="date" required />
        <select name="storeId" required>
          <option value="">— Pobočka —</option>
          {stores.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
        <select name="slot" defaultValue="1">
          <option value="1">Slot 1</option>
          <option value="2">Slot 2</option>
        </select>
        <button type="submit">Přidat</button>
      </form>

      <table style={{ width:"100%", borderCollapse:"collapse", background:"#fff", border:"1px solid #eee", borderRadius:12, overflow:"hidden" }}>
        <thead style={{ background:"#fafafa" }}><tr><th align="left">Datum</th><th align="left">Pobočka</th><th align="left">Slot</th><th align="left">Akce</th></tr></thead>
        <tbody>
          {rows.map(r=>(
            <tr key={r.id} style={{ borderTop:"1px solid #eee" }}>
              <td>{new Date(r.date).toLocaleDateString("cs-CZ")}</td>
              <td>{r.storeId}</td>
              <td>{r.slot}</td>
              <td>
                <form action={del}>
                  <input type="hidden" name="id" value={r.id}/>
                  <button>Smazat</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
