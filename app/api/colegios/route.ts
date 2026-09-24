import { NextResponse } from "next/server";
import { obtenerResumenZona } from "@/lib/services/colegiosService";
import type { ResumenZona } from "@/types/estado";
import type { Respuesta } from "@/types/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await obtenerResumenZona();
    return NextResponse.json<Respuesta<ResumenZona>>({ ok: true, ...data });
  } catch (e: any) {
    return NextResponse.json<Respuesta<ResumenZona>>(
      { ok: false, error: e?.message || "Error inesperado." },
      { status: 500 }
    );
  }
}
