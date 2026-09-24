"use client";
import { useState } from "react";
import type { RespuestaCarga, RespuestaError, TipoCarga } from "@/types/api";

export default function FormularioCarga() {
  const [password, setPassword] = useState("");
  const [tipo, setTipo] = useState<TipoCarga>("reporte");
  const [file, setFile] = useState<File | null>(null);
  const [reporteFecha, setReporteFecha] = useState("");
  const [colegioDefault, setColegioDefault] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setMsg({ ok: false, text: "Selecciona un archivo Excel." });
      return;
    }
    setLoading(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append("password", password);
      fd.append("tipo", tipo);
      fd.append("file", file);
      if (tipo === "reporte" && reporteFecha) fd.append("reporte_fecha", reporteFecha);
      if (tipo === "padron") fd.append("colegio_default", colegioDefault);

      const res = await fetch("/api/cargar", { method: "POST", body: fd });
      const data = (await res.json()) as RespuestaCarga | RespuestaError;
      if (data.ok) {
        setMsg({ ok: true, text: `${data.mensaje} Filas omitidas sin DNI: ${data.omitidas}.` });
      } else {
        setMsg({ ok: false, text: data.error || "Error al cargar." });
      }
    } catch (err: any) {
      setMsg({ ok: false, text: err?.message || "Error de red." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={onSubmit}>
        <label>Clave de acceso</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

        <label>Tipo de archivo</label>
        <select value={tipo} onChange={(e) => setTipo(e.target.value as TipoCarga)}>
          <option value="reporte">Reporte de capacitados (ODPE)</option>
          <option value="padron">Padron de miembros de mesa</option>
        </select>

        {tipo === "reporte" && (
          <>
            <label>Fecha del reporte (opcional)</label>
            <input type="date" value={reporteFecha} onChange={(e) => setReporteFecha(e.target.value)} />
          </>
        )}

        {tipo === "padron" && (
          <>
            <label>Colegio por defecto (si el Excel no trae la columna colegio)</label>
            <input value={colegioDefault} onChange={(e) => setColegioDefault(e.target.value)} />
          </>
        )}

        <label>Archivo Excel (.xlsx)</label>
        <input type="file" accept=".xlsx,.xls" onChange={(e) => setFile(e.target.files?.[0] || null)} />

        <button type="submit" disabled={loading}>
          {loading ? "Cargando..." : "Subir y procesar"}
        </button>
      </form>

      {msg && <div className={`alert ${msg.ok ? "alert-ok" : "alert-err"}`}>{msg.text}</div>}
    </>
  );
}
