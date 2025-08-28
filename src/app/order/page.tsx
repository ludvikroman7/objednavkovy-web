// src/app/order/page.tsx
"use client";

import React, { useMemo, useState } from "react";

// ======= Konfigurace poboček =======
const STORES = [
  { id: "kralupy", name: "Kralupy nad Vltavou", card: true },
  { id: "libcice", name: "Libčice nad Vltavou", card: true },
];

// ======= Alergeny (emoji piktogramy) =======
const ALLERGENS = [
  { id: "gluten", label: "Lepek", icon: "🌾" },
  { id: "egg", label: "Vejce", icon: "🥚" },
  { id: "milk", label: "Mléko", icon: "🥛" },
  { id: "nuts", label: "Ořechy", icon: "🌰" },
  { id: "sesame", label: "Sezam", icon: "⚪" },
  { id: "soy", label: "Sója", icon: "🌱" },
  { id: "fish", label: "Ryby", icon: "🐟" },
];

function allergenMeta(id: string) {
  const found = ALLERGENS.find((a) => a.id === id);
  return found ?? { id, label: id, icon: "ℹ️" };
}

// ======= Mock produkty (můžeš později spravovat v administraci/DB) =======
type Prod = {
  id: string;
  name: string;
  price: number;
  unit: string;
  weight_g?: number;
  description?: string;
  img?: string;
  allergens?: string[];
  categories?: string[];
  availableDays?: ("mon"|"tue"|"wed"|"thu"|"fri"|"sat")[]; // Ne = nezobrazuje se
  availableSlots?: (1|2)[]; // např. [1] jen noční výroba (Slot1), [2] jen odpolední, [1,2] oboje
};

const PRODUCTS: Prod[] = [
  {
    id: "houskovy-700",
    name: "Houskový knedlík 700 g",
    price: 26,
    unit: "ks",
    weight_g: 700,
    description: "Tradiční houskový knedlík, ideální k omáčkám.",
    img: "https://images.unsplash.com/photo-1549931319-19f6c5c7a3b2?q=80&w=800&auto=format&fit=crop",
    allergens: ["gluten", "egg", "milk"],
    categories: ["Knedlíky"],
    availableDays: ["mon","tue","wed","thu","fri","sat"],
    availableSlots: [1,2],
  },
  {
    id: "ruzenin",
    name: "Růženín – chléb s červenou řepou",
    price: 69,
    unit: "ks",
    weight_g: 800,
    description: "Pšenično-žitný chléb s jemnou chutí řepy.",
    img: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=800&auto=format&fit=crop",
    allergens: ["gluten", "sesame"],
    categories: ["Chléb"],
    availableDays: ["mon","tue","wed","thu","fri","sat"],
    availableSlots: [2], // vyrábíme odpoledne
  },
  {
    id: "vetrnik",
    name: "Větrník",
    price: 45,
    unit: "ks",
    weight_g: 120,
    description: "Nadýchaný větrník s karamelovou šlehačkou.",
    img: "https://images.unsplash.com/photo-1607920591413-4c3b2e2cdb50?q=80&w=800&auto=format&fit=crop",
    allergens: ["gluten", "milk", "egg"],
    categories: ["Sladké"],
    availableDays: ["fri","sat"], // jen pá-so
    availableSlots: [2],
  },
];

// ======= Pomocné funkce =======
const CZK = (n: number) =>
  new Intl.NumberFormat("cs-CZ", { style: "currency", currency: "CZK", maximumFractionDigits: 0 }).format(n);

const pricePer100 = (p: Prod) =>
  p.weight_g ? +(p.price / (p.weight_g / 100)).toFixed(2) : undefined;

const toISO = (d: Date | string) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.toISOString().slice(0, 10);
};
const jsDow = (iso: string) => new Date(iso + "T00:00:00").getDay(); // 0=Ne ... 6=So
const DOW_ID: Record<number, "sun"|"mon"|"tue"|"wed"|"thu"|"fri"|"sat"> =
  {0:"sun",1:"mon",2:"tue",3:"wed",4:"thu",5:"fri",6:"sat"};

// ======= Sloty a pravidla =======
// všední dny: Slot1 výdej 8–14 (příjem do 22:00 předchozího dne), Slot2 výdej 15–18 (příjem do 8:00 daného dne)
// sobota: přijímáme do pátku 18:00, výdej 8–12, jen Slot1
// neděle: zavřeno
function slotCaption(dow: number, slot: 1|2) {
  if (dow === 6) return "Sobota – výdej 8:00–12:00 (jen Slot 1)";
  if (slot === 1) return "Slot 1 – výdej 8:00–14:00";
  return "Slot 2 – výdej 15:00–18:00";
}
function slot1AllowedByTime(iso: string) {
  const dow = jsDow(iso);
  if (dow === 0) return false;
  if (dow === 6) {
    // Sobota: přijímáme do pátku 18:00
    const d = new Date(iso + "T00:00:00");
    const prev = new Date(d);
    prev.setDate(d.getDate() - 1);
    prev.setHours(18, 0, 0, 0);
    return Date.now() <= prev.getTime();
  }
  // všední: do 22:00 předchozího dne
  const d = new Date(iso + "T00:00:00");
  const prev = new Date(d);
  prev.setDate(d.getDate() - 1);
  prev.setHours(22, 0, 0, 0);
  return Date.now() <= prev.getTime();
}

// ======= UI komponenta =======
export default function OrderPage() {
  // výběry
  const [storeId, setStoreId] = useState(STORES[0].id);
  const [date, setDate] = useState(toISO(new Date()));
  const dow = jsDow(date);
  const dowId = DOW_ID[dow];
  const [slot, setSlot] = useState<1|2>(1);
  const [category, setCategory] = useState<string>("Vše");
  const [cart, setCart] = useState<Record<string, number>>({});

  // když vyberu sobotu, vynutíme Slot1; když neděli, nic se neobjednává
  const effectiveSlot: 1|2 | "closed" = dow === 0 ? "closed" : dow === 6 ? 1 : slot;
  const slot1UsableNow = dow === 6 ? slot1AllowedByTime(date) : slot1AllowedByTime(date);

  // kategorie z produktů
  const categories = useMemo(() => {
    const s = new Set<string>();
    PRODUCTS.forEach(p => (p.categories ?? []).forEach(c => s.add(c)));
    return ["Vše", ...Array.from(s).sort((a, b) => a.localeCompare(b, "cs"))];
  }, []);

  // filtr produktů podle dne a slotu
  const filtered = useMemo(() => {
    if (effectiveSlot === "closed") return [];
    const dayOk = (p: Prod) =>
      !p.availableDays || p.availableDays.includes(dowId as any);
    const slotOk = (p: Prod) =>
      !p.availableSlots || p.availableSlots.includes(effectiveSlot as 1|2);
    const catOk = (p: Prod) =>
      category === "Vše" || (p.categories ?? []).includes(category);
    return PRODUCTS.filter(p => dayOk(p) && slotOk(p) && catOk(p));
  }, [date, dowId, effectiveSlot, category]);

  // košík
  const items = Object.entries(cart)
    .filter(([, q]) => q > 0)
    .map(([id, qty]) => {
      const p = PRODUCTS.find(x => x.id === id)!;
      return { ...p, qty };
    });
  const total = items.reduce((s, it) => s + it.price * it.qty, 0);

  function inc(id: string) {
    setCart(c => ({ ...c, [id]: (c[id] ?? 0) + 1 }));
  }
  function dec(id: string) {
    setCart(c => ({ ...c, [id]: Math.max(0, (c[id] ?? 0) - 1) }));
  }

  // styly (čisté, zaoblené, „appkový“ vzhled)
  const styles: Record<string, React.CSSProperties> = {
    page: { padding: 24, maxWidth: 1180, margin: "0 auto", color: "#333" },
    bar: {
      display: "grid",
      gridTemplateColumns: "repeat(3, minmax(0,1fr))",
      gap: 12,
      marginBottom: 16,
    },
    select: {
      width: "100%",
      padding: "10px 12px",
      borderRadius: 12,
      border: "1px solid #e3e3e3",
      background: "#fff",
      fontSize: 14,
    },
    cats: { display: "flex", gap: 8, flexWrap: "wrap", margin: "8px 0 16px" },
    cat: (active: boolean): React.CSSProperties => ({
      padding: "6px 12px",
      borderRadius: 999,
      border: "1px solid #e3e3e3",
      background: active ? "#111" : "#fff",
      color: active ? "#fff" : "#111",
      cursor: "pointer",
      fontSize: 12,
    }),
    grid: {
      display: "grid",
      gap: 12,
      // 5 karet na řádku na desktopu
      gridTemplateColumns:
        "repeat(1, minmax(0,1fr))",
    } as React.CSSProperties,
    card: {
      background: "#fff",
      border: "1px solid #eee",
      borderRadius: 16,
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    },
    img: { width: "100%", height: 140, objectFit: "cover" },
    cardBody: { padding: 12, display: "flex", flexDirection: "column", gap: 6, flex: 1 },
    price: { fontWeight: 700 },
    allergens: { display: "flex", gap: 6, flexWrap: "wrap" },
    pill: { fontSize: 22, lineHeight: 1 },
    qtyBar: {
      marginTop: "auto",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 8,
    },
    qtyBtns: { display: "flex", alignItems: "center", gap: 6 },
    btn: (filled = false): React.CSSProperties => ({
      border: "1px solid #ddd",
      background: filled ? "#D99A66" : "#fff",
      color: filled ? "#fff" : "#333",
      borderRadius: 12,
      padding: "8px 12px",
      cursor: "pointer",
      fontWeight: 600,
      minWidth: 38,
      textAlign: "center",
      userSelect: "none",
    }),
    cart: {
      position: "sticky",
      bottom: 0,
      background: "#fff",
      borderTop: "1px solid #eee",
      padding: 12,
      marginTop: 18,
      borderRadius: 12,
    },
    hint: { fontSize: 12, color: "#666" },
    banner: {
      background: "#fff",
      border: "1px dashed #e3cdb6",
      color: "#8a6a4a",
      borderRadius: 16,
      padding: 12,
      marginBottom: 12,
    },
  };

  // media – 5 sloupců na velké obrazovce
  // (malé obrazovky automaticky 1–2–3 pomocí CSS @media)
  (styles.grid as any)["gridTemplateColumns"] =
    "repeat(2, minmax(0,1fr))";
  if (typeof window !== "undefined") {
    const w = window.innerWidth;
    if (w >= 640) (styles.grid as any)["gridTemplateColumns"] = "repeat(3, minmax(0,1fr))";
    if (w >= 900) (styles.grid as any)["gridTemplateColumns"] = "repeat(4, minmax(0,1fr))";
    if (w >= 1100) (styles.grid as any)["gridTemplateColumns"] = "repeat(5, minmax(0,1fr))"; // požadavek
  }

  return (
    <main style={styles.page}>
      <h1 style={{ marginTop: 0 }}>Objednat</h1>

      {/* info banner + platba kartou */}
      <div style={styles.banner}>
        <strong>Aktuálně:</strong> poslední novinka/bannery se sem napojí z administrace.{" "}
        <span style={styles.hint}>
          (Na obou pobočkách lze platit kartou.)
        </span>
      </div>

      {/* výběr pobočky / datum / slot */}
      <div style={styles.bar}>
        <div>
          <label style={styles.hint}>Pobočka</label>
          <select
            value={storeId}
            onChange={(e) => setStoreId(e.target.value)}
            style={styles.select}
          >
            {STORES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} {s.card ? "• karta" : ""}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label style={styles.hint}>Datum vyzvednutí</label>
          <input
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setSlot(1);
            }}
            style={styles.select}
          />
          {dow === 0 && (
            <div style={{ ...styles.hint, color: "#b30000", marginTop: 6 }}>
              V neděli máme odpočinek – vyber jiný termín.
            </div>
          )}
          {dow === 6 && (
            <div style={{ ...styles.hint, marginTop: 6 }}>
              Sobota: výdej 8:00–12:00, objednávky přijímáme do pátku 18:00.
            </div>
          )}
        </div>
        <div>
          <label style={styles.hint}>Slot</label>
          {effectiveSlot === "closed" ? (
            <input style={styles.select} value="Zavřeno (neděle)" disabled />
          ) : dow === 6 ? (
            <input style={styles.select} value="Slot 1 (8–12)" disabled />
          ) : (
            <select
              value={String(slot)}
              onChange={(e) => setSlot(e.target.value === "1" ? 1 : 2)}
              style={styles.select}
            >
              <option value="1" disabled={!slot1UsableNow}>
                Slot 1 (8–14)
              </option>
              <option value="2">Slot 2 (15–18)</option>
            </select>
          )}
          {effectiveSlot !== "closed" && (
            <div style={{ ...styles.hint, marginTop: 6 }}>
              {slotCaption(dow, (effectiveSlot as 1|2))}
            </div>
          )}
        </div>
      </div>

      {/* kategorie */}
      <div style={styles.cats}>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            style={styles.cat(category === c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* dlaždice 5 na řádku (desktop), velká tlačítka +/- po straně v kartě */}
      <div style={styles.grid}>
        {filtered.map((p) => (
          <div key={p.id} style={styles.card}>
            <img src={p.img} alt={p.name} style={styles.img} />
            <div style={styles.cardBody}>
              <div style={{ fontWeight: 600 }}>{p.name}</div>
              {p.description && (
                <div style={styles.hint}>{p.description}</div>
              )}
              <div style={styles.price}>
                {CZK(p.price)} / {p.unit}
              </div>
              {p.weight_g && (
                <div style={styles.hint}>
                  Cena za 100 g: {pricePer100(p)?.toFixed(2)} Kč • {p.weight_g} g
                </div>
              )}
              {!!(p.allergens?.length) && (
                <div style={styles.allergens}>
                  {p.allergens!.map((a) => {
                    const m = allergenMeta(a);
                    return (
                      <span key={a} title={m.label} aria-label={m.label} style={styles.pill}>
                        {m.icon}
                      </span>
                    );
                  })}
                </div>
              )}
              <div style={styles.qtyBar}>
                <div style={styles.hint}>
                  {p.availableSlots?.length === 1
                    ? `Dostupné pouze v Slot ${p.availableSlots[0]}`
                    : `Dostupné Slot 1/2`}
                </div>
                <div style={styles.qtyBtns}>
                  <button style={styles.btn()} onClick={() => dec(p.id)}>-</button>
                  <div style={{ minWidth: 24, textAlign: "center", fontWeight: 700 }}>
                    {cart[p.id] ?? 0}
                  </div>
                  <button style={styles.btn(true)} onClick={() => inc(p.id)}>+</button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ opacity: 0.7 }}>
            Pro zvolený **den/slot** nejsou žádné produkty. Změň datum/slot nebo kategorii.
          </div>
        )}
      </div>

      {/* košík – vždy viditelný dole (sticky) */}
      <div style={styles.cart}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <strong>Košík:</strong>{" "}
            {items.length === 0
              ? <span style={styles.hint}>prázdný</span>
              : items.map(i => `${i.name}×${i.qty}`).join(", ")
            }
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div><strong>Celkem:</strong> {CZK(total)}</div>
            <button
              style={styles.btn(true)}
              onClick={() => {
                if (effectiveSlot === "closed") return alert("V neděli je zavřeno.");
                if (dow === 6 && !slot1UsableNow) return alert("Na sobotu přijímáme do pátku 18:00.");
                if (items.length === 0) return alert("Košík je prázdný.");
                alert("Objednávka odeslána (prototyp). Další krok: napojíme API a DB.");
                setCart({});
              }}
            >
              Odeslat
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

    </main>
  );
}
