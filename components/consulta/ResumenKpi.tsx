import { COLORES } from "@/lib/config";
import type { Avance } from "@/types/estado";

export default function ResumenKpi({ resumen }: { resumen: Avance }) {
  return (
    <div className="grid-kpi">
      <div className="kpi">
        <div className="n">{resumen.total}</div>
        <div className="l">Miembros de mesa</div>
      </div>
      <div className="kpi">
        <div className="n" style={{ color: COLORES.ok }}>{resumen.capacitados}</div>
        <div className="l">Capacitados</div>
      </div>
      <div className="kpi">
        <div className="n" style={{ color: COLORES.warn }}>{resumen.faltan}</div>
        <div className="l">No capacitados</div>
      </div>
      <div className="kpi">
        <div className="n">{resumen.avance}%</div>
        <div className="l">Avance</div>
      </div>
    </div>
  );
}
