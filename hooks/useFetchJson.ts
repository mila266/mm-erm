"use client";
import { useEffect, useState } from "react";
import type { Respuesta } from "@/types/api";

export function useFetchJson<T>(url: string | null) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setData(null);
    setError("");
    if (!url) return;

    const ctrl = new AbortController();
    setLoading(true);
    fetch(url, { signal: ctrl.signal })
      .then((r) => r.json() as Promise<Respuesta<T>>)
      .then((d) => {
        if (d.ok) setData(d);
        else setError(d.error || "Error");
      })
      .catch((e) => {
        if (e?.name !== "AbortError") setError(e?.message || "Error de red");
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false);
      });
    return () => ctrl.abort();
  }, [url]);

  return { data, loading, error };
}
