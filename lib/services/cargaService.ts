import { TAMANO_LOTE } from "@/lib/config";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { unirEstrategias } from "@/lib/normalizadores/estrategia";
import type { RegistroCapacitacion } from "@/types/capacitacion";
import type { RegistroMiembro } from "@/types/miembro";

function enLotes<T>(filas: T[]): T[][] {
  const lotes: T[][] = [];
  for (let i = 0; i < filas.length; i += TAMANO_LOTE) lotes.push(filas.slice(i, i + TAMANO_LOTE));
  return lotes;
}

export function unificarCapacitaciones(regs: RegistroCapacitacion[]) {
  const mapa = new Map<string, RegistroCapacitacion>();
  for (const r of regs) {
    const prev = mapa.get(r.dni);
    if (!prev) {
      mapa.set(r.dni, r);
      continue;
    }
    mapa.set(r.dni, {
      ...prev,
      nombres: prev.nombres ?? r.nombres,
      ubigeo: prev.ubigeo ?? r.ubigeo,
      estrategias: unirEstrategias(prev.estrategias, r.estrategias),
      estrategia_raw: [prev.estrategia_raw, r.estrategia_raw].filter(Boolean).join(" / ") || null,
    });
  }
  return { registros: Array.from(mapa.values()), repetidos: regs.length - mapa.size };
}

export function unificarMiembros(regs: RegistroMiembro[]) {
  const mapa = new Map<string, RegistroMiembro>();
  for (const r of regs) {
    const prev = mapa.get(r.dni);
    mapa.set(
      r.dni,
      prev
        ? {
            dni: r.dni,
            nombres: r.nombres ?? prev.nombres,
            colegio: r.colegio ?? prev.colegio,
            nro_mesa: r.nro_mesa ?? prev.nro_mesa,
            cargo: r.cargo ?? prev.cargo,
          }
        : r
    );
  }
  return { registros: Array.from(mapa.values()), repetidos: regs.length - mapa.size };
}

export async function guardarCapacitaciones(regs: RegistroCapacitacion[]) {
  const sb = supabaseAdmin();
  for (const lote of enLotes(regs)) {
    const { error } = await sb.from("capacitaciones").upsert(lote, { onConflict: "dni" });
    if (error) throw new Error(`Error al guardar capacitaciones: ${error.message}`);
  }
}

export async function guardarMiembros(regs: RegistroMiembro[]) {
  const sb = supabaseAdmin();
  for (const lote of enLotes(regs)) {
    const { error } = await sb.rpc("upsert_miembros", { filas: lote });
    if (error) throw new Error(`Error al guardar miembros: ${error.message}`);
  }
}
