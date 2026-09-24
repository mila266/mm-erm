import * as XLSX from "xlsx";

function armar(y: number, m: number, d: number): string | null {

  const dt = new Date(Date.UTC(y, m - 1, d));
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d) return null;
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

export function parseFecha(v: unknown): string | null {
  if (v === null || v === undefined || v === "") return null;

  if (typeof v === "number") {
    const p = XLSX.SSF.parse_date_code(v);
    return p ? armar(p.y, p.m, p.d) : null;
  }
  if (v instanceof Date) {
    return isNaN(v.getTime()) ? null : armar(v.getFullYear(), v.getMonth() + 1, v.getDate());
  }

  const s = String(v).trim();
  let m = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/); // D-M-YYYY
  if (m) return armar(+m[3], +m[2], +m[1]);
  m = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/); // YYYY-MM-DD
  if (m) return armar(+m[1], +m[2], +m[3]);
  return null;
}
