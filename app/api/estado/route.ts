import { NextRequest, NextResponse } from "next/server";
import { obtenerEstadoColegio } from "@/lib/services/estadoService";
import type { EstadoColegio } from "@/types/estado";
import type { Respuesta } from "@/types/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Detalle de UN colegio: GET /api/estado?colegio=X
export async function GET(req: NextRequest) {
  const colegio = req.nextUrl.searchParams.get("colegio");
  if (!colegio) {
    return NextResponse.json<Respuesta<EstadoColegio>>(
      { ok: false, error: "Falta el parametro 'colegio'." },
      { status: 400 }
    );
  }
  try {
    const data = await obtenerEstadoColegio(colegio);
    return NextResponse.json<Respuesta<EstadoColegio>>({ ok: true, ...data });
  } catch (e: any) {
    return NextResponse.json<Respuesta<EstadoColegio>>(
      { ok: false, error: e?.message || "Error inesperado." },
      { status: 500 }
    );
  }
}
