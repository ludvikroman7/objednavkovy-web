// src/app/admin/blacklist/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function add(formData: FormData) { "use server";
  await prisma.blacklistNumber.upsert({ where: { phone: String(formData.get("phone")) }, update: {}, create: { phone: String(formData.get("phone")) }});
  revalidatePath("/admin/blacklist");
}
async function remove(formData: FormData) { "use server";
  await prisma.blacklistNumber.delete({ where: { phone: String(formData.get("phone")) } });
  revalidatePath("/admin/blacklist");
}

export default async function BlacklistPage() {
  const rows = await prisma.blacklistNumber.findMany({ orderBy: { phone: "asc" } });

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Blacklist čísel</h1>

      <form action={add} style={{ display:"flex", gap:8, background:"#fff", padding:12, border:"1px solid #eee", borderRadius:12, marginBottom:16 }}>
        <input name="phone" placeholder="+420..." required />
        <button>Přidat</button>
      </form>

      <ul>
        {rows.map(r=>(
          <li key={r.phone} style={{ background:"#fff", border:"1px solid #eee", borderRadius:8, padding:10, marginTop:8 }}>
            {r.phone}
            <form action={remove} style={{ display:"inline-block", marginLeft:8 }}>
              <input type="hidden" name="phone" value={r.phone}/>
              <button>Smazat</button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
