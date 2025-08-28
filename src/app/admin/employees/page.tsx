// src/app/admin/employees/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function create(formData: FormData) { "use server";
  await prisma.employee.create({
    data: {
      name: String(formData.get("name")),
      pinHash: String(formData.get("pinHash")),
      active: formData.get("active") === "on",
    }
  });
  revalidatePath("/admin/employees");
}
async function toggle(formData: FormData) { "use server";
  const id = String(formData.get("id"));
  const active = String(formData.get("active")) === "true";
  await prisma.employee.update({ where: { id }, data: { active: !active } });
  revalidatePath("/admin/employees");
}

export default async function EmployeesPage() {
  const rows = await prisma.employee.findMany({ orderBy: { name: "asc" } });
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Zaměstnanci</h1>
      <form action={create} style={{ display:"grid", gap:8, background:"#fff", padding:12, border:"1px solid #eee", borderRadius:12, marginBottom:16 }}>
        <input name="name" placeholder="Jméno" required />
        <input name="pinHash" placeholder="PIN (hash)" required />
        <label><input type="checkbox" name="active" defaultChecked/> aktivní</label>
        <button>Přidat</button>
      </form>

      <ul>
        {rows.map(e=>(
          <li key={e.id} style={{ background:"#fff", border:"1px solid #eee", borderRadius:8, padding:12, marginTop:8 }}>
            <strong>{e.name}</strong> — {e.active ? "aktivní" : "neaktivní"}
            <form action={toggle} style={{ display:"inline-block", marginLeft:12 }}>
              <input type="hidden" name="id" value={e.id}/>
              <input type="hidden" name="active" value={String(e.active)}/>
              <button>Přepnout</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
