"use client";
import { Bar, BarChart, CartesianGrid, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { COLORES } from "@/lib/config";
import type { ResumenMesa } from "@/types/estado";

export default function GraficoMesas({ mesas }: { mesas: ResumenMesa[] }) {
  const data = mesas.map((m) => ({
    ...m,
    etiqueta: `${m.avance}% (${m.capacitados}/${m.total})`,
  }));

  return (
    <div className="card">
      <h2>Ranking de mesas por % de capacitados</h2>
      <ResponsiveContainer width="100%" height={Math.max(200, data.length * 34)}>
        <BarChart data={data} layout="vertical" margin={{ left: 10, right: 90 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} unit="%" />
          <YAxis type="category" dataKey="nro_mesa" width={90} tick={{ fontSize: 12 }}
            tickFormatter={(m: string) => `Mesa ${m}`} />
          <Tooltip formatter={(_v: number, _n: string, item: any) => [item.payload.etiqueta, "Capacitados"]}
            labelFormatter={(m: string) => `Mesa ${m}`} />
          <Bar dataKey="avance" fill={COLORES.ok} name="Capacitados">
            <LabelList dataKey="etiqueta" position="right" style={{ fontSize: 12, fill: "#1a1d24" }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
