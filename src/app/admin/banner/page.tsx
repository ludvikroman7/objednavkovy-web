// src/app/admin/banner/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function save(formData: FormData) { "use server";
  await prisma.banner.upsert({
    where: { id: 1 },
    update: {
      enabled: formData.get("enabled") === "on",
      width: Number(formData.get("width") ?? 1200),
      height: Number(formData.get("height") ?? 280),
      img: String(formData.get("img") ?? "") || null,
      link: String(formData.get("link") ?? "") || null,
    },
    create: {
      id: 1,
      enabled: formData.get("enabled") === "on",
      width: Number(formData.get("width") ?? 1200),
      height: Number(formData.get("height") ?? 280),
      img: String(formData.get("img") ?? "") || null,
      link: String(formData.get("link") ?? "") || null,
    }
  });
  revalidatePath("/admin/banner");
}

export default async function BannerPage() {
  const b = await prisma.banner.findUnique({ where: { id: 1 } });
  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Banner</h1>
      <form action={save} style={{ display:"grid", gap:8, background:"#fff", padding:12, border:"1px solid #eee", borderRadius:12 }}>
        <label><input type="checkbox" name="enabled" defaultChecked={b?.enabled ?? true}/> Zapnuto</label>
        <input name="width" type="number" defaultValue={b?.width ?? 1200} placeholder="Šířka"/>
        <input name="height" type="number" defaultValue={b?.height ?? 280} placeholder="Výška"/>
        <input name="img" defaultValue={b?.img ?? ""} placeholder="URL obrázku"/>
        <input name="link" defaultValue={b?.link ?? ""} placeholder="Odkaz po kliku"/>
        <button>Uložit</button>
      </form>
    </div>
  );
}
