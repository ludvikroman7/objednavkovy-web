// src/app/layout.tsx
export const metadata = { title: "Pekařství – objednávky" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#FAF4EE" }}>
        {children}
      </body>
    </html>
  );
}
