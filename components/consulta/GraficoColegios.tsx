"use client";
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { COLORES } from "@/lib/config";
import type { ResumenColegio } from "@/types/estado";

interface Props {
  colegios: ResumenColegio[];
  onSelect: (colegio: string) => void;
}

export default function GraficoColegios({ colegios, onSelect }: Props) {
  const data = colegios.map((c) => ({
    ...c,
    pctCap: c.avance,
    pctFalta: 100 - c.avance,
  }));

  return (
    <div className="card">
      <h2>Avance por colegio</h2>
      <p className="muted" style={{ marginTop: -8 }}>Haz clic en un colegio para ver su detalle.</p>
      <ResponsiveContainer width="100%" height={Math.max(220, data.length * 42)}>
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" domain={[0, 100]} unit="%" />
          <YAxis type="category" dataKey="colegio" width={180} tick={{ fontSize: 12 }} />
          <Tooltip
            formatter={(v: number, name: string, item: any) => {
              const c = item.payload as ResumenColegio;
              const n = name === "Capacitados" ? c.capacitados : c.faltan;
              return [`${v}% (${n} de ${c.total})`, name];
            }}
          />
          <Legend />
          <Bar dataKey="pctCap" stackId="a" fill={COLORES.ok} name="Capacitados" cursor="pointer"
            onClick={(d: any) => onSelect(d.colegio)} />
          <Bar dataKey="pctFalta" stackId="a" fill={COLORES.warn} name="No capacitados" cursor="pointer"
            onClick={(d: any) => onSelect(d.colegio)} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
