import * as XLSX from "xlsx";
import { normTexto } from "@/lib/normalizadores/texto";

export interface Hoja {
  header: string[];
  filas: { texto: (string | null)[]; crudo: unknown[] }[];
}


export function leerHoja(buf: ArrayBuffer): Hoja {
  const wb = XLSX.read(buf, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[0]];
  if (!ws) throw new Error("El archivo no tiene hojas.");

  const texto = XLSX.utils.sheet_to_json<(string | null)[]>(ws, { header: 1, raw: false, defval: null, blankrows: true });
  const crudo = XLSX.utils.sheet_to_json<unknown[]>(ws, { header: 1, raw: true, defval: null, blankrows: true });

  const hIdx = texto.findIndex((r) => (r || []).some((c) => c && normTexto(String(c)).includes("DNI")));
  if (hIdx < 0) throw new Error("No se encontro la fila de encabezado (con la columna DNI).");

  const header = (texto[hIdx] || []).map((c) => (c ? String(c).trim() : ""));
  const filas = [];
  for (let i = hIdx + 1; i < texto.length; i++) {
    filas.push({ texto: texto[i] || [], crudo: crudo[i] || [] });
  }
  return { header, filas };
}

export type Termino = string | RegExp;

export function colIndex(header: string[], terminos: Termino[]): number {
  const hs = header.map((h) => normTexto(h));
  for (const t of terminos) {
    const i = hs.findIndex((h) => h && (typeof t === "string" ? h.includes(normTexto(t)) : t.test(h)));
    if (i >= 0) return i;
  }
  return -1;
}

export function celda(fila: (string | null)[], i: number): string | null {
  if (i < 0) return null;
  const v = fila[i];
  return v === null || v === undefined ? null : String(v);
}
