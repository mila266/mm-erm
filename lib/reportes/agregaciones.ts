import { ORDEN_CARGOS } from "@/lib/config";
import { claveEstrategia } from "@/lib/normalizadores/estrategia";
import { normTexto } from "@/lib/normalizadores/texto";
import type { Avance, ConteoEstrategia, FilaEstado, ResumenMesa } from "@/types/estado";

export function calcularAvance(total: number, capacitados: number): Avance {
  return {
    total,
    capacitados,
    faltan: total - capacitados,
    avance: total ? Math.round((capacitados / total) * 100) : 0,
  };
}

export function sumarAvances(items: Avance[]): Avance {
  const total = items.reduce((s, x) => s + x.total, 0);
  const capacitados = items.reduce((s, x) => s + x.capacitados, 0);
  return calcularAvance(total, capacitados);
}

// Avance por mesa, de mayor a menor %. Cada miembro cuenta una vez.
export function porMesa(filas: FilaEstado[]): ResumenMesa[] {
  const mapa = new Map<string, { total: number; capacitados: number }>();
  for (const f of filas) {
    const mesa = f.nro_mesa || "Sin mesa";
    const m = mapa.get(mesa) ?? { total: 0, capacitados: 0 };
    m.total++;
    if (f.capacitado) m.capacitados++;
    mapa.set(mesa, m);
  }
  return Array.from(mapa, ([nro_mesa, v]) => ({ nro_mesa, ...calcularAvance(v.total, v.capacitados) }))
    .sort((a, b) => b.avance - a.avance || a.nro_mesa.localeCompare(b.nro_mesa));
}

export function porEstrategia(filas: FilaEstado[]): ConteoEstrategia[] {
  const mapa = new Map<string, ConteoEstrategia>();
  for (const f of filas) {
    // Una misma estrategia en dos fechas cuenta una vez por miembro.
    const claves = new Set<string>();
    for (const e of f.estrategias) {
      const k = claveEstrategia(e.nombre);
      if (claves.has(k)) continue;
      claves.add(k);
      const c = mapa.get(k) ?? { estrategia: e.nombre, participaciones: 0 };
      c.participaciones++;
      mapa.set(k, c);
    }
  }
  return Array.from(mapa.values()).sort((a, b) => b.participaciones - a.participaciones);
}

function rangoCargo(cargo: string | null): number {
  if (!cargo) return ORDEN_CARGOS.length + 1;
  const n = normTexto(cargo);
  // Gana la coincidencia mas larga: "TERCER SUPLENTE" antes que "TERCER".
  let mejor = -1;
  ORDEN_CARGOS.forEach((c, i) => {
    if (n.includes(c) && (mejor < 0 || c.length > ORDEN_CARGOS[mejor].length)) mejor = i;
  });
  return mejor < 0 ? ORDEN_CARGOS.length : mejor;
}

// Orden del detalle: por mesa y luego por cargo (Presidente, Secretario, Tercer miembro, Suplentes).
export function ordenarDetalle(filas: FilaEstado[]): FilaEstado[] {
  return [...filas].sort(
    (a, b) =>
      (a.nro_mesa ?? "").localeCompare(b.nro_mesa ?? "", undefined, { numeric: true }) ||
      rangoCargo(a.cargo) - rangoCargo(b.cargo) ||
      (a.cargo ?? "").localeCompare(b.cargo ?? "") ||
      (a.nombres ?? "").localeCompare(b.nombres ?? "")
  );
}
