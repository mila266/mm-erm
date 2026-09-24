// Genera plantillas/plantilla_capacitaciones.xlsx (mismo formato que el reporte de la ODPE).
// Uso: npx tsx scripts/generarPlantillaCapacitaciones.ts
import * as XLSX from "xlsx";

const ENCABEZADOS = ["DNI", "APELLIDOS Y NOMBRES", "ESTRATEGIA", "UBIGEO"];
const FILAS_VACIAS = 1500;

// --- Hoja 1: CAPACITADOS (la que lee la app) ---
const capacitados = XLSX.utils.aoa_to_sheet([ENCABEZADOS]);
for (let r = 1; r <= FILAS_VACIAS; r++) {
  // DNI como texto (conserva el cero inicial)
  capacitados[XLSX.utils.encode_cell({ r, c: 0 })] = { t: "s", v: "", z: "@" };
}
capacitados["!ref"] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: FILAS_VACIAS, c: ENCABEZADOS.length - 1 } });
capacitados["!cols"] = [{ wch: 12 }, { wch: 40 }, { wch: 50 }, { wch: 38 }];
capacitados["!autofilter"] = { ref: "A1:D1" };

// --- Hoja 2: INSTRUCCIONES (la app la ignora) ---
const instrucciones = XLSX.utils.aoa_to_sheet([
  ["PLANTILLA DE CAPACITADOS – ZONA 13 SAN MARTIN DE PORRES"],
  [],
  ["Como llenarla"],
  ["1. Llena SOLO la hoja CAPACITADOS (debe ser la primera hoja). Una fila por miembro de mesa capacitado."],
  ["2. No cambies los encabezados de la fila 1. UBIGEO es opcional."],
  ["3. DNI: 8 digitos. Debe ser el mismo DNI del padron (asi se cruzan)."],
  ["4. ESTRATEGIA: nombre de la estrategia y su fecha entre parentesis: Virtual (23-09-2026)"],
  ["5. Si tuvo varias estrategias, separalas con /  en la misma celda:"],
  ["      Personalizada (19-09-2026) / Reunión (22-09-2026)"],
  ["6. Las jornadas van SIN fecha (el sistema pone 20-09-2026 a la 1ra y 27-09-2026 a la 2da)."],
  ["7. Pon TODAS las estrategias de la persona: al subir, reemplazan a las que ya tenia guardadas."],
  ["8. Sube el archivo en /admin, tipo 'Reporte de capacitados (ODPE)'."],
  ["   Tambien puedes subir directamente el reporte de la ODPE, sin copiarlo aqui."],
  [],
  ["Ejemplos de ESTRATEGIA validos"],
  ["Virtual (23-09-2026)"],
  ["Personalizada (19-09-2026)"],
  ["Reunión (22-09-2026)"],
  ["1ra Jornada de Capacitación"],
  ["2da Jornada de Capacitación"],
  ["Virtual (13-09-2026) / Reunión (20-09-2026)"],
  ["Personalizada (19-09-2026) / 1ra Jornada de Capacitación"],
  [],
  ["Ejemplo de filas (datos ficticios, NO copiar a CAPACITADOS)"],
  ENCABEZADOS,
  ["10000001", "APELLIDO EJEMPLO 1", "Virtual (23-09-2026)", "LIMA - LIMA - SAN MARTIN DE PORRES"],
  ["10000002", "APELLIDO EJEMPLO 2", "Personalizada (19-09-2026) / Reunión (22-09-2026)", "LIMA - LIMA - SAN MARTIN DE PORRES"],
  ["10000003", "APELLIDO EJEMPLO 3", "1ra Jornada de Capacitación / 2da Jornada de Capacitación", ""],
]);
instrucciones["!cols"] = [{ wch: 14 }, { wch: 24 }, { wch: 58 }, { wch: 38 }];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, capacitados, "CAPACITADOS");
XLSX.utils.book_append_sheet(wb, instrucciones, "INSTRUCCIONES");
XLSX.writeFile(wb, "plantillas/plantilla_capacitaciones.xlsx");
console.log("OK: plantillas/plantilla_capacitaciones.xlsx");
