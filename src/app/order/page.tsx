'use client';

import React, { useMemo, useState } from 'react';

/** ==========
 *  Barvy + základní styly (čistý „appkový“ vzhled, zaoblené rohy)
 *  ========== */
const UI = {
  bg: '#FAF4EE',
  card: '#FFFFFF',
  text: '#222222',
  subtle: '#6B7280',
  primary: '#D99A66',
  primaryDark: '#B87333',
  border: '#E5E7EB',
};

const pageWrap: React.CSSProperties = {
  minHeight: '100vh',
  background: UI.bg,
  color: UI.text,
  fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, sans-serif',
};

const container: React.CSSProperties = {
  maxWidth: 1180,
  margin: '0 auto',
  padding: '24px 16px',
};

const card: React.CSSProperties = {
  background: UI.card,
  border: `1px solid ${UI.border}`,
  borderRadius: 16,
  padding: 16,
};

const h1: React.CSSProperties = { fontSize: 24, fontWeight: 800, margin: 0 };
const sectionTitle: React.CSSProperties = { fontSize: 18, fontWeight: 700, margin: 0 };

const grid5: React.CSSProperties = {
  display: 'grid',
  gap: 16,
  gridTemplateColumns: 'repeat(5, minmax(0, 1fr))', // přesně 5 dlaždic na řádek
};

const touchBtn: React.CSSProperties = {
  borderRadius: 12,
  border: `1px solid ${UI.border}`,
  padding: '10px 12px',
  background: UI.card,
  cursor: 'pointer',
  fontWeight: 600,
};

const ctaBtn: React.CSSProperties = {
  ...touchBtn,
  background: UI.primary,
  color: '#fff',
  borderColor: UI.primary,
};

const iconBtn: React.CSSProperties = {
  ...touchBtn,
  width: 44,
  height: 44,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 20,
};

const input: React.CSSProperties = {
  width: '100%',
  borderRadius: 12,
  border: `1px solid ${UI.border}`,
  padding: '10px 12px',
  fontSize: 16,
  background: '#fff',
};

const label: React.CSSProperties = { fontSize: 12, color: UI.subtle, marginBottom: 6, display: 'block' };
const hint: React.CSSProperties = { fontSize: 12, color: UI.subtle };

/** ==========
 *  Pobočky
 *  ========== */
const STORES = [
  { id: 'kralupy', name: 'Kralupy nad Vltavou', address: 'Jungmannova 89/6, Kralupy', card: true },
  { id: 'libcice', name: 'Libčice nad Vltavou', address: 'Chýnovská 240, Libčice', card: true },
];

/** ==========
 *  14 EU alergenů (kompletní seznam)
 *  ========== */
export type AllergenId =
  | 'gluten'
  | 'crustaceans'
  | 'egg'
  | 'fish'
  | 'peanuts'
  | 'soy'
  | 'milk'
  | 'nuts'
  | 'celery'
  | 'mustard'
  | 'sesame'
  | 'sulphites'
  | 'lupin'
  | 'molluscs';

const ALLERGENS: { id: AllergenId; label: string; icon: string }[] = [
  { id: 'gluten',       label: 'Lepek (pšenice/žito/ječmen/oves)', icon: '🌾' },
  { id: 'crustaceans',  label: 'Korýši',                           icon: '🦐' },
  { id: 'egg',          label: 'Vejce',                            icon: '🥚' },
  { id: 'fish',         label: 'Ryby',                             icon: '🐟' },
  { id: 'peanuts',      label: 'Arašídové',                        icon: '🥜' },
  { id: 'soy',          label: 'Sója',                             icon: '🌱' },
  { id: 'milk',         label: 'Mléko (vč. laktózy)',              icon: '🥛' },
  { id: 'nuts',         label: 'Skořápkové plody',                 icon: '🌰' },
  { id: 'celery',       label: 'Celer',                            icon: '🥬' },
  { id: 'mustard',      label: 'Hořčice',                          icon: '🥄' },
  { id: 'sesame',       label: 'Sezam',                            icon: '⚪' },
  { id: 'sulphites',    label: 'Oxid siřičitý a siřičitany',       icon: '🫧' },
  { id: 'lupin',        label: 'Vlčí bob (lupina)',                icon: '🌼' },
  { id: 'molluscs',     label: 'Měkkýši',                          icon: '🐚' },
];

/** ==========
 *  Demo produkty (sloty + dny výroby)
 *  ========== */
type DayId = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat'; // neděle se nevyrábí

type Product = {
  id: string;
  name: string;
  price: number;
  unit: 'ks' | 'g' | 'kg';
  weight_g?: number;
  description?: string;
  img?: string;
  allergens: AllergenId[];
  categories: string[];
  availableDays: DayId[];    // viditelnost podle dne výroby
  slots: (1 | 2)[];          // ve kterém slotu je produkt dostupný
};

const PRODUCTS: Product[] = [
  {
    id: 'knedlik-700',
    name: 'Houskový knedlík 700 g',
    price: 26,
    unit: 'ks',
    weight_g: 700,
    description: 'Tradiční houskový knedlík, ideální k omáčkám.',
    img: 'https://images.unsplash.com/photo-1549931319-19f6c5c7a3b2?q=80&w=1200&auto=format&fit=crop',
    allergens: ['gluten', 'egg'],
    categories: ['Knedlíky'],
    availableDays: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
    slots: [2], // odpolední výroba
  },
  {
    id: 'chleb-ruzenin',
    name: 'Růženín – chléb s červenou řepou',
    price: 49,
    unit: 'ks',
    weight_g: 800,
    description: 'Pšenično-žitný chléb s jemnou chutí řepy.',
    img: 'https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=1200&auto=format&fit=crop',
    allergens: ['gluten', 'sesame'],
    categories: ['Chléb'],
    availableDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    slots: [1], // noční/ráno – k výdeji v Slotu 1
  },
  {
    id: 'kolac-tvaroh',
    name: 'Tvarohový koláč',
    price: 45,
    unit: 'ks',
    description: 'Jemný tvaroh, poctivé máslo.',
    img: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1200&auto=format&fit=crop',
    allergens: ['gluten', 'milk', 'egg'],
    categories: ['Sladké'],
    availableDays: ['fri', 'sat'],
    slots: [1, 2], // lze vyrobit pro oba sloty dle potřeby
  },
];

/** ==========
 *  Pomocné funkce (datum, sloty)
 *  ========== */
const CZK = (n: number) =>
  new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 }).format(n);

const pricePer100 = (p: Product) => {
  if (!p.weight_g) return null;
  const v = p.price / (p.weight_g / 100);
  return Number.isFinite(v) ? v : null;
};

const toISODate = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.toISOString().slice(0, 10);
};

const getJsDow = (iso: string) => new Date(iso + 'T00:00:00').getDay(); // 0=Ne, 1=Po, ...

const dayIdFromISO = (iso: string): DayId | null => {
  const map: Record<number, DayId | null> = {
    0: null, // Ne – zavřeno
    1: 'mon',
    2: 'tue',
    3: 'wed',
    4: 'thu',
    5: 'fri',
    6: 'sat',
  };
  return map[getJsDow(iso)];
};

function pickupWindow(iso: string, slot: 1 | 2) {
  const dow = getJsDow(iso);
  if (dow === 0) return { closed: true, text: 'V neděli je zavřeno.' };
  if (dow === 6) return { closed: false, slot: 1 as const, text: 'Sobota: výdej 8:00–12:00 (příjem do pátku 18:00).' };
  if (slot === 1)
    return { closed: false, slot: 1 as const, text: 'Slot 1: výdej 8:00–18:00 (příjem do 22:00 předchozího dne).' };
  return { closed: false, slot: 2 as const, text: 'Slot 2: výdej 15:00–18:00 (příjem do 8:00 daného dne).' };
}

function slot1StillAllowed(iso: string) {
  const dow = getJsDow(iso);
  if (dow === 0) return false;
  if (dow === 6) {
    // Sobota → cutoff Pá 18:00
    const d = new Date(iso + 'T00:00:00');
    const prev = new Date(d);
    prev.setDate(d.getDate() - 1);
    prev.setHours(18, 0, 0, 0);
    return Date.now() <= prev.getTime();
  }
  // všední dny → cutoff 22:00 předchozího dne
  const d = new Date(iso + 'T00:00:00');
  const prev = new Date(d);
  prev.setDate(d.getDate() - 1);
  prev.setHours(22, 0, 0, 0);
  return Date.now() <= prev.getTime();
}

/** ==========
 *  Stránka Objednat (zákaznická část)
 *  ========== */
export default function OrderPage() {
  // výběr pobočky / datum / slot
  const [storeId, setStoreId] = useState<string>(STORES[0].id);
  const [date, setDate] = useState<string>(() => toISODate(new Date()));
  const [selectedSlot, setSelectedSlot] = useState<1 | 2>(1);

  // košík a zákazník
  const [cart, setCart] = useState<Record<string, number>>({});
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [agree, setAgree] = useState(false);

  // filtry
  const [category, setCategory] = useState<string>('Vše');

  const dow = getJsDow(date);
  const forcedSlot = dow === 6 ? (1 as const) : (dow === 0 ? null : undefined); // So jen Slot1, Ne zavřeno
  const effectiveSlot: 1 | 2 | 'closed' =
    dow === 0 ? 'closed' : ((forcedSlot ?? selectedSlot) as 1 | 2);

  const categories = useMemo(
    () => Array.from(new Set(PRODUCTS.flatMap((p) => p.categories))).sort(),
    []
  );

  const dayId = dayIdFromISO(date);

  // filtrování produktů podle dne + slotu + kategorie
  const visibleProducts = useMemo(() => {
    if (!dayId) return []; // neděle
    return PRODUCTS.filter((p) => {
      const okDay = p.availableDays.includes(dayId);
      const okSlot =
        effectiveSlot === 'closed' ? false : p.slots.includes(effectiveSlot);
      const okCat = category === 'Vše' ? true : p.categories.includes(category);
      return okDay && okSlot && okCat;
    });
  }, [date, effectiveSlot, category]);

  // košík
  const add = (id: string) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const sub = (id: string) =>
    setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] || 0) - 1) }));

  const items = useMemo(
    () =>
      Object.entries(cart)
        .filter(([, qty]) => qty > 0)
        .map(([id, qty]) => {
          const p = PRODUCTS.find((x) => x.id === id)!;
          return { ...p, qty };
        }),
    [cart]
  );

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  function handleSubmit() {
    if (effectiveSlot === 'closed') return alert('V neděli je zavřeno.');
    if (dow === 6 && !slot1StillAllowed(date))
      return alert('Na sobotu přijímáme do pátku 18:00.');
    if (!items.length) return alert('Košík je prázdný.');
    if (!name.trim() || !phone.trim()) return alert('Jméno i telefon jsou povinné.');
    if (!agree) return alert('Potvrďte souhlas se zpracováním údajů.');

    const info = pickupWindow(date, (forcedSlot ?? selectedSlot) as 1 | 2);
    alert(
      [
        `Objednávka přijata (prototyp).`,
        `Pobočka: ${STORES.find((s) => s.id === storeId)?.name}`,
        `Datum vyzvednutí: ${date}`,
        `Slot: ${info.slot ?? ''} – ${info.text}`,
        `Položky: ${items.map((i) => `${i.name}×${i.qty}`).join(', ')}`,
        `Celkem: ${CZK(total)}`,
      ].join('\n')
    );
    // vyčištění
    setCart({});
    setName('');
    setPhone('');
    setAgree(false);
}

const info = pickupWindow(date, (forcedSlot ?? selectedSlot) as 1 | 2);
const slot1Allowed = slot1StillAllowed(date);

// --- konec logiky, odtud JSX ---
return (
  <div style={pageWrap}>
      {/* HLAVIČKA */}
      <div style={{ background: UI.primaryDark, color: '#fff' }}>
        <div style={{ ...container, padding: '18px 16px' }}>
          <h1 style={h1}>Objednat – Pekařství Ludvík &amp; Mistrík</h1>
          <div style={{ fontSize: 13, opacity: 0.85 }}>
            Výběr pobočky, datumu a slotu • 5 produktů na řádku • dotykové ovládání
          </div>
        </div>
      </div>

      <main style={container}>
        {/* Pobočka + datum + slot */}
        <section style={{ ...card, marginBottom: 16 }}>
          <h2 style={sectionTitle}>Pobočka a termín</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 16,
              marginTop: 12,
            }}
          >
            <div>
              <label style={label}>Pobočka</label>
              <select
                style={input}
                value={storeId}
                onChange={(e) => setStoreId(e.target.value)}
              >
                {STORES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.card ? '• karta OK' : ''}
                  </option>
                ))}
              </select>
              <div style={hint}>
                {STORES.find((s) => s.id === storeId)?.address}
              </div>
            </div>

            <div>
              <label style={label}>Datum vyzvednutí</label>
              <input
                type="date"
                style={input}
                value={date}
                onChange={(e) => {
                  setDate(e.target.value);
                  setSelectedSlot(1);
                }}
              />
              {dow === 0 && (
                <div style={{ ...hint, color: '#DC2626' }}>
                  V neděli je zavřeno. Zvolte, prosím, jiný termín.
                </div>
              )}
              {dow === 6 && (
                <div style={hint}>
                  Sobota: výdej 8:00–12:00, příjem objednávek do pátku 18:00 hodin.
                </div>
              )}
            </div>

            <div>
              <label style={label}>Slot</label>
              {dow === 0 ? (
                <input style={input} value="Zavřeno (neděle)" disabled />
              ) : dow === 6 ? (
                <input style={input} value="Sobota – pouze Slot 1 (8–12)" disabled />
              ) : (
                <select
                  style={input}
                  value={String(selectedSlot)}
                  onChange={(e) => setSelectedSlot(e.target.value === '1' ? 1 : 2)}
                >
                  <option value="1" disabled={!slot1Allowed}>
                    Slot 1 (8:00–18:00) {slot1Allowed ? '' : '— po termínu'}
                  </option>
                  <option value="2">Slot 2 (15:00–18:00)</option>
                </select>
              )}
              <div style={hint} aria-live="polite">
                {info.text}
              </div>
            </div>
          </div>
        </section>

        {/* Filtrování kategorií */}
        <section style={{ ...card, marginBottom: 16 }}>
          <h2 style={sectionTitle}>Kategorie</h2>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => setCategory('Vše')}
              style={{
                ...touchBtn,
                background: category === 'Vše' ? UI.primary : UI.card,
                color: category === 'Vše' ? '#fff' : UI.text,
                borderColor: category === 'Vše' ? UI.primary : UI.border,
              }}
            >
              Vše
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                style={{
                  ...touchBtn,
                  background: category === c ? UI.primary : UI.card,
                  color: category === c ? '#fff' : UI.text,
                  borderColor: category === c ? UI.primary : UI.border,
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </section>

        {/* Nabídka – 5 dlaždic na řádku */}
        <section style={{ ...card, marginBottom: 16 }}>
          <h2 style={sectionTitle}>Nabídka k objednání</h2>
          <div style={{ marginTop: 12 }}>
            {dow === 0 ? (
              <div style={hint}>V neděli žádný prodej – zvolte prosím jiné datum.</div>
            ) : visibleProducts.length === 0 ? (
              <div style={hint}>
                Pro zvolený den/slot nejsou dostupné žádné produkty.
              </div>
            ) : (
              <div style={grid5}>
                {visibleProducts.map((p) => {
                  const per100 = pricePer100(p);
                  const qty = cart[p.id] || 0;
                  return (
                    <div
                      key={p.id}
                      style={{
                        border: `1px solid ${UI.border}`,
                        borderRadius: 16,
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        background: '#fff',
                      }}
                    >
                      <div
                        style={{
                          height: 140,
                          background: '#f3f3f3',
                          backgroundImage: p.img ? `url("${p.img}")` : 'none',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                      <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                        <div style={{ fontWeight: 700, lineHeight: 1.2 }}>{p.name}</div>
                        {p.description && (
                          <div style={{ fontSize: 13, color: UI.subtle }}>{p.description}</div>
                        )}
                        <div style={{ fontSize: 14 }}>
                          <strong>{CZK(p.price)}</strong> / {p.unit}
                          {p.weight_g ? (
                            <span style={hint}>
                              {' '}
                              • {per100 !== null ? per100.toFixed(2) : '-'} Kč / 100 g • {p.weight_g} g
                            </span>
                          ) : null}
                        </div>

                        {/* alergeny – VŠECH 14 je připraveno; zobrazí se jen ty, které produkt obsahuje */}
                        {p.allergens.length > 0 && (
                          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {p.allergens.map((a) => {
                              const meta = ALLERGENS.find((x) => x.id === a)!;
                              return (
                                <span
                                  key={a}
                                  title={meta.label}
                                  aria-label={meta.label}
                                  style={{
                                    fontSize: 22,
                                    lineHeight: '22px',
                                  }}
                                >
                                  {meta.icon}
                                </span>
                              );
                            })}
                          </div>
                        )}

                        <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontSize: 12, color: UI.subtle }}>
                            Sloty: {p.slots.join(', ')}
                          </div>
                          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <button style={iconBtn} onClick={() => sub(p.id)} aria-label="Odebrat">
                              −
                            </button>
                            <div style={{ minWidth: 24, textAlign: 'center', fontWeight: 700 }}>{qty}</div>
                            <button style={iconBtn} onClick={() => add(p.id)} aria-label="Přidat">
                              ＋
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Kontakty + Odeslání */}
        <section style={{ ...card, marginBottom: 16 }}>
          <h2 style={sectionTitle}>Kontaktní údaje</h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 16,
              marginTop: 12,
              marginBottom: 12,
            }}
          >
            <div>
              <label style={label}>Jméno a příjmení</label>
              <input style={input} value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label style={label}>Telefon</label>
              <input style={input} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 14 }}>
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              style={{ marginTop: 2 }}
            />
            <span>Souhlasím se zpracováním osobních údajů pro účely vyřízení objednávky.</span>
          </label>

          <div
            style={{
              marginTop: 16,
              paddingTop: 12,
              borderTop: `1px solid ${UI.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <strong>Celkem:</strong> <span style={{ color: UI.primaryDark }}>{CZK(total)}</span>
            </div>
            <button
               onClick={handleSubmit}
              style={ctaBtn}
              disabled={
                effectiveSlot === 'closed' ||
                (dow === 6 && !slot1StillAllowed(date)) ||
                items.length === 0 ||
                !name.trim() ||
                !phone.trim() ||
                !agree
              }
            >
              Odeslat objednávku
            </button>
          </div>
        </section>

        {/* Shrnutí košíku */}
        <section style={{ ...card }}>
          <h2 style={sectionTitle}>Souhrn</h2>
          {items.length === 0 ? (
            <div style={hint}>Košík je prázdný.</div>
          ) : (
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {items.map((i) => (
                <li key={i.id}>
                  {i.name} × {i.qty} — {CZK(i.price * i.qty)}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}
