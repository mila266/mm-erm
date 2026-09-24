import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Seguimiento de Capacitacion - Miembros de Mesa",
  description: "Consulta y carga del estado de capacitacion de miembros de mesa (ERM 2026).",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <nav className="topbar">
          <div className="inner">
            <span className="brand">Capacitacion MM</span>
            <Link href="/consulta">Consulta</Link>
            <Link href="/admin">Subir data</Link>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
