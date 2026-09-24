import { supabaseAdmin } from "@/lib/supabase/admin";
import { sumarAvances } from "@/lib/reportes/agregaciones";
import type { ResumenColegio, ResumenZona } from "@/types/estado";

// Resumen por colegio desde la vista resumen_colegios
export async function obtenerResumenZona(): Promise<ResumenZona> {
  const { data, error } = await supabaseAdmin()
    .from("resumen_colegios")
    .select("colegio,total,capacitados,faltan,avance");
  if (error) throw new Error(error.message);

  const colegios = ((data || []) as ResumenColegio[]).sort(
    (a, b) => b.avance - a.avance || a.colegio.localeCompare(b.colegio)
  );
  return { resumen: sumarAvances(colegios), colegios };
}
