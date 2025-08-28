// src/app/page.tsx
export default function Home() {
  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ marginTop: 0 }}>Pekařství – úvod</h1>
      <p>Tahle stránka je jen dočasný rozcestník pro ověření buildu.</p>
      <ul>
        <li><a href="/order">Objednat (zákaznická část)</a></li>
        <li><a href="/admin">Administrace</a></li>
      </ul>
    </main>
  );
}
