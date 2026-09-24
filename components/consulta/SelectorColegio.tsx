import type { ResumenColegio } from "@/types/estado";

interface Props {
  colegios: ResumenColegio[];
  value: string;
  onChange: (colegio: string) => void;
}

export default function SelectorColegio({ colegios, value, onChange }: Props) {
  return (
    <div>
      <label>Colegio</label>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">Elige un colegio para ver el detalle</option>
        {colegios
          .map((c) => c.colegio)
          .sort((a, b) => a.localeCompare(b))
          .map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
      </select>
    </div>
  );
}
