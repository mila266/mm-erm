import type { ResumenMesa } from "@/types/estado";

interface Props {
  mesas: ResumenMesa[];
  value: string;
  onChange: (mesa: string) => void;
}

export default function SelectorMesa({ mesas, value, onChange }: Props) {
  return (
    <div>
      <label>Mesa</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Todas las mesas</option>
        {mesas
          .map((m) => m.nro_mesa)
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
          .map((m) => (
            <option key={m} value={m}>Mesa {m}</option>
          ))}
      </select>
    </div>
  );
}
