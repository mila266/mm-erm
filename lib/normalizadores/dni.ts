export function normDni(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).replace(/\D/g, "");
  if (!s) return null;
  return s.length <= 8 ? s.padStart(8, "0") : s;
}

// "12345678" -> "****5678"
export function enmascararDni(dni: string): string {
  return "****" + dni.slice(-4);
}
