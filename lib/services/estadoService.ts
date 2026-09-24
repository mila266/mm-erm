import { SIN_COLEGIO } from "@/lib/config";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { enmascararDni } from "@/lib/normalizadores/dni";
import { calcularAvance, ordenarDetalle, porEstrategia, porMesa } from "@/lib/reportes/agregaciones";
import type { EstadoColegio, FilaEstado } from "@/types/estado";

export async function obtenerEstadoColegio(colegio: string): Promise<EstadoColegio> {
  let q = supabaseAdmin()
    .from("estado_capacitacion")
    .select("dni,nombres,colegio,nro_mesa,cargo,capacitado,estrategias");
  q = colegio === SIN_COLEGIO ? q.is("colegio", null) : q.eq("colegio", colegio);

  const { data, error } = await q;
  if (error) throw new Error(error.message);

  const filas: FilaEstado[] = ordenarDetalle(
    ((data || []) as FilaEstado[]).map((f) => ({
      ...f,
      dni: enmascararDni(f.dni),
      estrategias: f.estrategias || [],
    }))
  );
  const capacitados = filas.filter((f) => f.capacitado).length;

  return {
    colegio,
    resumen: calcularAvance(filas.length, capacitados),
    porMesa: porMesa(filas),
    porEstrategia: porEstrategia(filas),
    filas,
  };
}
