import { limpiar } from "./texto";

export function normMesa(v: unknown): string | null {
  const s = limpiar(v);
  if (!s) return null;
  return /^\d{1,6}$/.test(s) ? s.padStart(6, "0") : s;
}
