"use client";
import type { EstadoColegio } from "@/types/estado";
import { useFetchJson } from "./useFetchJson";

export function useEstadoColegio(colegio: string) {
  return useFetchJson<EstadoColegio>(
    colegio ? `/api/estado?colegio=${encodeURIComponent(colegio)}` : null
  );
}
