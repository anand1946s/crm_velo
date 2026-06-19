import "./globals.css";
import Link from "next/link";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="app-container">
          <aside className="sidebar">
            <h2>VeloWiki</h2>

            <nav>
              <Link href="/">Dashboard</Link>
              <Link href="/persons">Persons</Link>
              <Link href="/projects">Projects</Link>
              <Link href="/admin">Admin</Link>
            </nav>
          </aside>

          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
}
