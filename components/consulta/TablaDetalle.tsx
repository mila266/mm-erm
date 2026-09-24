"use client";
import { useState } from "react";
import type { Estrategia } from "@/types/capacitacion";
import type { FilaEstado } from "@/types/estado";

function fechaCorta(f: string | null): string {
  return f ? `${f.slice(8, 10)}/${f.slice(5, 7)}` : "";
}

function Etiquetas({ estrategias }: { estrategias: Estrategia[] }) {
  if (estrategias.length === 0) return <>-</>;
  return (
    <div className="tags">
      {estrategias.map((e, i) => (
        <span key={i} className="tag">
          {e.nombre}
          {e.fecha && <span className="tag-fecha">{fechaCorta(e.fecha)}</span>}
        </span>
      ))}
    </div>
  );
}

export default function TablaDetalle({ filas }: { filas: FilaEstado[] }) {
  const [soloFaltan, setSoloFaltan] = useState(false);
  const mostradas = soloFaltan ? filas.filter((f) => !f.capacitado) : filas;

  return (
    <div className="card">
      <div className="row" style={{ justifyContent: "space-between" }}>
        <h2 style={{ margin: 0 }}>Detalle ({mostradas.length})</h2>
        <label style={{ margin: 0, fontWeight: 500 }}>
          <input
            type="checkbox"
            checked={soloFaltan}
            onChange={(e) => setSoloFaltan(e.target.checked)}
            style={{ width: "auto", marginRight: 6 }}
          />
          Solo los que faltan
        </label>
      </div>
      <div style={{ overflowX: "auto", marginTop: 12 }}>
        <table>
          <thead>
            <tr>
              <th>Mesa</th><th>Cargo</th><th>DNI</th><th>Nombres</th>
              <th>Estado</th><th>Estrategias</th>
            </tr>
          </thead>
          <tbody>
            {mostradas.map((f, i) => (
              <tr key={i}>
                <td>{f.nro_mesa || "-"}</td>
                <td>{f.cargo || "-"}</td>
                <td>{f.dni}</td>
                <td>{f.nombres}</td>
                <td className={f.capacitado ? "badge-ok" : "badge-no"}>
                  {f.capacitado ? "Capacitado" : "Falta"}
                </td>
                <td><Etiquetas estrategias={f.estrategias} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
