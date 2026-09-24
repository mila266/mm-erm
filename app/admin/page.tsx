import FormularioCarga from "@/components/admin/FormularioCarga";
import { TITULO_ZONA } from "@/lib/config";

export default function AdminPage() {
  return (
    <main className="container">
      <div className="card">
        <h1>Subir data</h1>
        <p className="muted">
          Ruta privada. {TITULO_ZONA}. La validacion y normalizacion se hacen en el servidor.
          Sube primero el padron y luego el reporte de capacitados.
        </p>
        <FormularioCarga />
      </div>
    </main>
  );
}
