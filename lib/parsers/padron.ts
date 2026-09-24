import { leerHoja, colIndex, celda } from "@/lib/excel/leerHoja";
import { normDni } from "@/lib/normalizadores/dni";
import { limpiar } from "@/lib/normalizadores/texto";
import { normMesa } from "@/lib/normalizadores/mesa";
import type { RegistroMiembro } from "@/types/miembro";

// Parsea el PADRON de miembros de mesa -> tabla miembros.
// Detecta columnas por nombre aproximado. El colegio por defecto se usa si la fila no lo trae.
export function parsePadron(
  buf: ArrayBuffer,
  defaults: { colegio?: string }
): { registros: RegistroMiembro[]; omitidas: number } {
  const { header, filas } = leerHoja(buf);
  const iDni = colIndex(header, ["DNI"]);
  const iNom = colIndex(header, ["APELLIDOS Y NOMBRES", "NOMBRE", "APELLIDO"]);
  const iCol = colIndex(header, ["COLEGIO", "LOCAL", "INSTITUCION", /(^|[^A-Z])I\.?\s?E\.?([^A-Z]|$)/]);
  const iMesa = colIndex(header, ["MESA"]);
  const iCargo = colIndex(header, ["CARGO"]);

  const registros: RegistroMiembro[] = [];
  let omitidas = 0;
  for (const { texto } of filas) {
    if (texto.every((c) => c === null || c === "")) continue; 
    const dni = normDni(celda(texto, iDni));
    if (!dni) {
      omitidas++;
      continue;
    }
    registros.push({
      dni,
      nombres: limpiar(celda(texto, iNom)),
      colegio: limpiar(celda(texto, iCol)) ?? limpiar(defaults.colegio),
      nro_mesa: normMesa(celda(texto, iMesa)), // 6 digitos: recupera ceros a la izquierda
      cargo: limpiar(celda(texto, iCargo)),
    });
  }
  return { registros, omitidas };
}
