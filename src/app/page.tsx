export default function Home() {
  return (
    <main style={{ padding: "24px", fontFamily: "sans-serif" }}>
      <h1>Pekařství Ludvík & Mistrík</h1>
      <p>Vítejte v objednávkovém systému Morambor!</p>
      <ul>
        <li><a href="/order">📦 Objednat</a></li>
        <li><a href="/admin">🔑 Administrace</a></li>
      </ul>
    </main>
  );
}
