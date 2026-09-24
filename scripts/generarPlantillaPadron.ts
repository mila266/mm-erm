// Genera plantillas/plantilla_padron_miembros.xlsx
// Uso: npx tsx scripts/generarPlantillaPadron.ts
import * as XLSX from "xlsx";

const ENCABEZADOS = ["DNI", "APELLIDOS Y NOMBRES", "COLEGIO", "N° MESA", "CARGO"];
const FILAS_VACIAS = 1500;
const COLS_TEXTO = [0, 3]; // DNI y N° MESA como texto (conservan ceros a la izquierda)

const CARGOS = [
  "Presidente",
  "Secretario",
  "Tercer Miembro",
  "Primer Suplente",
  "Segundo Suplente",
  "Tercer Suplente",
  "Cuarto Suplente",
  "Quinto Suplente",
  "Sexto Suplente",
];

// --- Hoja 1: MIEMBROS (la que lee la app) ---
const miembros = XLSX.utils.aoa_to_sheet([ENCABEZADOS]);
for (let r = 1; r <= FILAS_VACIAS; r++) {
  for (const c of COLS_TEXTO) {
    miembros[XLSX.utils.encode_cell({ r, c })] = { t: "s", v: "", z: "@" };
  }
}
miembros["!ref"] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: FILAS_VACIAS, c: ENCABEZADOS.length - 1 } });
miembros["!cols"] = [{ wch: 12 }, { wch: 40 }, { wch: 32 }, { wch: 10 }, { wch: 18 }];
miembros["!autofilter"] = { ref: "A1:E1" };

// --- Hoja 2: INSTRUCCIONES (la app la ignora) ---
const ejemplo = CARGOS.map((cargo, i) => [
  String(10000001 + i).padStart(8, "0"),
  `APELLIDO EJEMPLO ${i + 1}`,
  "IE 2025 JOSE OLAYA",
  "045123",
  cargo,
]);
const instrucciones = XLSX.utils.aoa_to_sheet([
  ["PLANTILLA DE PADRON DE MIEMBROS DE MESA – ZONA 13 SAN MARTIN DE PORRES"],
  [],
  ["Como llenarla"],
  ["1. Llena SOLO la hoja MIEMBROS (debe ser la primera hoja). Una fila por miembro de mesa."],
  ["2. No cambies los encabezados de la fila 1."],
  ["3. DNI: 8 digitos. Si pierde el cero inicial, el sistema lo completa (9954602 -> 09954602)."],
  ["4. N° MESA: 6 digitos (ej. 045123). Si pierde el cero inicial, el sistema lo completa."],
  ["5. COLEGIO: escribe el nombre EXACTAMENTE igual en todas las filas del mismo colegio (asi se agrupan en los reportes)."],
  ["6. CARGO: usa uno de la lista de abajo. Cada mesa tiene 9 miembros."],
  ["7. Un DNI solo puede aparecer una vez."],
  ["8. Sube el archivo en /admin, tipo 'Padron de miembros de mesa'."],
  ["9. Si vuelves a subirlo, se actualizan los datos por DNI; una celda vacia NO borra lo ya guardado."],
  [],
  ["Cargos validos"],
  ...CARGOS.map((c) => [c]),
  [],
  ["Ejemplo de una mesa completa (datos ficticios, NO copiar a MIEMBROS)"],
  ENCABEZADOS,
  ...ejemplo,
]);
instrucciones["!cols"] = [{ wch: 14 }, { wch: 28 }, { wch: 24 }, { wch: 10 }, { wch: 18 }];

const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, miembros, "MIEMBROS");
XLSX.utils.book_append_sheet(wb, instrucciones, "INSTRUCCIONES");
XLSX.writeFile(wb, "plantillas/plantilla_padron_miembros.xlsx");
console.log("OK: plantillas/plantilla_padron_miembros.xlsx");
