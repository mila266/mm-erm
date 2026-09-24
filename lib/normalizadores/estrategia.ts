import { FECHAS_JORNADA } from "@/lib/config";
import type { Estrategia } from "@/types/capacitacion";
import { parseFecha } from "./fecha";
import { limpiar, normTexto } from "./texto";

function separar(s: string): string[] {
  const partes: string[] = [];
  let actual = "";
  let nivel = 0;
  for (const ch of s) {
    if (ch === "(") nivel++;
    if (ch === ")") nivel = Math.max(0, nivel - 1);
    if (nivel === 0 && (ch === "/" || ch === "\n" || ch === "\r")) {
      partes.push(actual);
      actual = "";
    } else {
      actual += ch;
    }
  }
  partes.push(actual);
  return partes.map((p) => p.trim()).filter(Boolean);
}

function claveJornada(nombre: string): keyof typeof FECHAS_JORNADA | null {
  const n = normTexto(nombre);
  if (!n.includes("JORNADA")) return null;
  if (/\b(1|1RA|1ERA|1RO|PRIMERA|PRIMER)\b|1°|1º/.test(n)) return "1RA JORNADA";
  if (/\b(2|2DA|2DO|SEGUNDA|SEGUNDO)\b|2°|2º/.test(n)) return "2DA JORNADA";
  return null;
}

export function claveEstrategia(nombre: string): string {
  return claveJornada(nombre) ?? normTexto(nombre);
}

// "Personalizada (19-09-2026) / 1ra Jornada de Capacitación" ->
// [{ nombre: "Personalizada", fecha: "2026-09-19" }, { nombre: "1ra Jornada de Capacitación", fecha: "2026-09-20" }]
export function parseEstrategias(v: unknown): Estrategia[] {
  const texto = limpiarSaltos(v);
  if (!texto) return [];

  const out: Estrategia[] = [];
  for (const parte of separar(texto)) {
    const m = parte.match(/^(.*?)\s*(?:\(([^)]*)\))?\s*$/);
    let fecha = parseFecha(m?.[2]?.trim());

    const nombre = limpiar(fecha ? m?.[1] : parte);
    if (!nombre) continue;
    if (!fecha) {
      const j = claveJornada(nombre);
      if (j) fecha = FECHAS_JORNADA[j];
    }
    out.push({ nombre, fecha });
  }
  return unirEstrategias(out);
}

export function unirEstrategias(...listas: Estrategia[][]): Estrategia[] {
  const vistas = new Map<string, Estrategia>();
  for (const e of listas.flat()) {
    const k = `${claveEstrategia(e.nombre)}|${e.fecha ?? ""}`;
    if (!vistas.has(k)) vistas.set(k, e);
  }
  return Array.from(vistas.values()).sort((a, b) =>
    (a.fecha ?? "9999").localeCompare(b.fecha ?? "9999")
  );
}


function limpiarSaltos(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s || null;
}
