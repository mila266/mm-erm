import { createHash, timingSafeEqual } from "crypto";

export function verificarClave(clave: string): boolean {
  const esperada = process.env.ADMIN_PASSWORD;
  if (!esperada) return false;
  const a = createHash("sha256").update(clave).digest();
  const b = createHash("sha256").update(esperada).digest();
  return timingSafeEqual(a, b);
}
