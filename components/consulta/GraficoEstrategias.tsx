"use client";
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { COLORES } from "@/lib/config";
import type { ConteoEstrategia } from "@/types/estado";

export default function GraficoEstrategias({ datos }: { datos: ConteoEstrategia[] }) {
  return (
    <div className="card">
      <h2>Participaciones por estrategia</h2>
      <p className="muted" style={{ marginTop: -8 }}>
        Un miembro puede tener varias estrategias, por eso la suma puede ser mayor que el total de capacitados.
      </p>
      {datos.length === 0 ? (
        <p className="muted">Aun no hay capacitados en este colegio.</p>
      ) : (
        <ResponsiveContainer width="100%" height={Math.max(180, datos.length * 40)}>
          <BarChart data={datos} layout="vertical" margin={{ left: 10, right: 40 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
            <XAxis type="number" allowDecimals={false} />
            <YAxis type="category" dataKey="estrategia" width={200} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="participaciones" fill={COLORES.accent} name="Participaciones">
              <LabelList dataKey="participaciones" position="right" style={{ fontSize: 12 }} />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
