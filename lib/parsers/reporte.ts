import { leerHoja, colIndex, celda } from "@/lib/excel/leerHoja";
import { normDni } from "@/lib/normalizadores/dni";
import { parseEstrategias } from "@/lib/normalizadores/estrategia";
import { limpiar } from "@/lib/normalizadores/texto";
import type { RegistroCapacitacion } from "@/types/capacitacion";

// Parsea el REPORTE de capacitados de la ODPE -> tabla capacitaciones.
export function parseReporte(
  buf: ArrayBuffer,
  reporteFecha: string
): { registros: RegistroCapacitacion[]; omitidas: number } {
  const { header, filas } = leerHoja(buf);
  const iDni = colIndex(header, ["DNI"]);
  const iNom = colIndex(header, ["APELLIDOS Y NOMBRES", "NOMBRE", "APELLIDO"]);
  const iEst = colIndex(header, ["ESTRATEGIA"]);
  const iUbi = colIndex(header, ["UBIGEO"]);
  if (iEst < 0) throw new Error("El reporte no tiene la columna ESTRATEGIA.");

  const registros: RegistroCapacitacion[] = [];
  let omitidas = 0;
  for (const { texto } of filas) {
    if (texto.every((c) => c === null || c === "")) continue; // fila vacia
    const dni = normDni(celda(texto, iDni));
    if (!dni) {
      omitidas++;
      continue;
    }
    const raw = celda(texto, iEst);
    registros.push({
      dni,
      nombres: limpiar(celda(texto, iNom)),
      estrategias: parseEstrategias(raw),
      estrategia_raw: raw ? raw.trim() : null,
      ubigeo: limpiar(celda(texto, iUbi)),
      reporte_fecha: reporteFecha,
    });
  }
  return { registros, omitidas };
}
