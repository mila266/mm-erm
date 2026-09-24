import Link from "next/link";

export default function Home() {
  return (
    <main className="container">
      <div className="card">
        <h1>Seguimiento de capacitacion de miembros de mesa</h1>
        <p className="muted">ERM 2026 · Zona 13 – San Martín de Porres. Cruza el padron de miembros de mesa con el reporte de capacitados de la ODPE.</p>
      </div>
      <div className="card">
        <h2>Consulta publica</h2>
        <p>Revisa el avance por colegio y por mesa, y por que estrategias se capacito cada miembro.</p>
        <Link href="/consulta"><button>Ir a consulta</button></Link>
      </div>
      <div className="card">
        <h2>Subir data (privado)</h2>
        <p>Carga el reporte diario de capacitados o el padron de miembros. Requiere clave.</p>
        <Link href="/admin"><button>Ir a subir data</button></Link>
      </div>
    </main>
  );
}
