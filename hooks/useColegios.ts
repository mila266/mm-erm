"use client";
import type { ResumenZona } from "@/types/estado";
import { useFetchJson } from "./useFetchJson";

export function useColegios() {
  return useFetchJson<ResumenZona>("/api/colegios");
}
