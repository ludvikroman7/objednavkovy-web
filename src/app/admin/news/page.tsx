// src/app/admin/news/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function create(formData: FormData) { "use server";
  await prisma.news.create({
    data: {
      title: String(formData.get("title")),
      body: String(formData.get("body") ?? "") || null,
      img: String(formData.get("img") ?? "") || null,
    },
  });
  revalidatePath("/admin/news");
}
async function del(formData: FormData) { "use server";
  await prisma.news.delete({ where: { id: String(formData.get("id")) } });
  revalidatePath("/admin/news");
}

export default async function NewsPage() {
  const rows = await prisma.news.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Novinky</h1>

      <form action={create} style={{ display:"grid", gap:8, background:"#fff", padding:12, border:"1px solid #eee", borderRadius:12, marginBottom:16 }}>
        <input name="title" placeholder="Titulek" required/>
        <input name="img" placeholder="URL obrázku (volitelné)"/>
        <textarea name="body" placeholder="Text (volitelné)"/>
        <button>Přidat</button>
      </form>

      <ul>
        {rows.map(n=>(
          <li key={n.id} style={{ background:"#fff", border:"1px solid #eee", borderRadius:8, padding:12, marginTop:8 }}>
            <strong>{n.title}</strong> <small style={{ color:"#667" }}>({new Date(n.createdAt).toLocaleString("cs-CZ")})</small>
            {n.img && <div><img src={n.img} alt="" style={{ maxWidth:240, marginTop:6 }}/></div>}
            {n.body && <p>{n.body}</p>}
            <form action={del}><input type="hidden" name="id" value={n.id}/><button>Smazat</button></form>
          </li>
        ))}
      </ul>
    </div>
  );
}
