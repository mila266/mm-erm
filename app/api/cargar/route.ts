import { NextRequest, NextResponse } from "next/server";
import { verificarClave } from "@/lib/auth/verificarClave";
import { parseReporte } from "@/lib/parsers/reporte";
import { parsePadron } from "@/lib/parsers/padron";
import {
  guardarCapacitaciones,
  guardarMiembros,
  unificarCapacitaciones,
  unificarMiembros,
} from "@/lib/services/cargaService";
import type { RespuestaCarga, RespuestaError } from "@/types/api";

export const runtime = "nodejs";
export const maxDuration = 60;

function error(msg: string, status: number) {
  return NextResponse.json<RespuestaError>({ ok: false, error: msg }, { status });
}

function avisoRepetidos(n: number) {
  return n ? ` Se encontraron ${n} DNI repetidos en el archivo y se unificaron.` : "";
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();

    if (!verificarClave(String(form.get("password") || ""))) {
      return error("Clave incorrecta.", 401);
    }

    const tipo = String(form.get("tipo") || "");
    const file = form.get("file") as File | null;
    if (!file) return error("No se envio archivo.", 400);
    const buf = await file.arrayBuffer();

    if (tipo === "reporte") {
      const reporteFecha =
        String(form.get("reporte_fecha") || "") || new Date().toISOString().slice(0, 10);
      const parsed = parseReporte(buf, reporteFecha);
      const { registros, repetidos } = unificarCapacitaciones(parsed.registros);
      if (registros.length === 0) return error("El reporte no tenia filas con DNI validos.", 400);

      await guardarCapacitaciones(registros);
      return NextResponse.json<RespuestaCarga>({
        ok: true,
        tipo,
        guardados: registros.length,
        omitidas: parsed.omitidas,
        repetidos,
        mensaje:
          `Cargados ${registros.length} capacitados (reporte ${reporteFecha}).` + avisoRepetidos(repetidos),
      });
    }

    if (tipo === "padron") {
      const colegio = String(form.get("colegio_default") || "") || undefined;
      const parsed = parsePadron(buf, { colegio });
      const { registros, repetidos } = unificarMiembros(parsed.registros);
      if (registros.length === 0) return error("El padron no tenia filas con DNI validos.", 400);

      await guardarMiembros(registros);
      return NextResponse.json<RespuestaCarga>({
        ok: true,
        tipo,
        guardados: registros.length,
        omitidas: parsed.omitidas,
        repetidos,
        mensaje: `Cargados ${registros.length} miembros al padron.` + avisoRepetidos(repetidos),
      });
    }

    return error("Tipo invalido. Usa 'reporte' o 'padron'.", 400);
  } catch (e: any) {
    return error(e?.message || "Error inesperado.", 500);
  }
}
