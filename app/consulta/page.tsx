"use client";
import { useState } from "react";
import { TITULO_ZONA } from "@/lib/config";
import { useColegios } from "@/hooks/useColegios";
import { useEstadoColegio } from "@/hooks/useEstadoColegio";
import ResumenKpi from "@/components/consulta/ResumenKpi";
import GraficoColegios from "@/components/consulta/GraficoColegios";
import SelectorColegio from "@/components/consulta/SelectorColegio";
import GraficoMesas from "@/components/consulta/GraficoMesas";
import GraficoEstrategias from "@/components/consulta/GraficoEstrategias";
import TablaDetalle from "@/components/consulta/TablaDetalle";

export default function ConsultaPage() {
  const zona = useColegios();
  const [colegio, setColegio] = useState("");
  const detalle = useEstadoColegio(colegio);

  function elegir(c: string) {
    setColegio(c);
    if (c) setTimeout(() => document.getElementById("detalle")?.scrollIntoView({ behavior: "smooth" }), 50);
  }

  return (
    <main className="container">
      <div className="card">
        <h1>Seguimiento de capacitacion</h1>
        <p className="muted">{TITULO_ZONA}</p>
        {zona.loading && <p className="muted">Cargando...</p>}
        {zona.error && <div className="alert alert-err">{zona.error}</div>}
      </div>

      {zona.data && (
        <>
          <ResumenKpi resumen={zona.data.resumen} />
          <div style={{ height: 16 }} />
          {zona.data.colegios.length > 0 ? (
            <GraficoColegios colegios={zona.data.colegios} onSelect={elegir} />
          ) : (
            <div className="card muted">Aun no hay miembros cargados en el padron.</div>
          )}

          <div className="card" id="detalle">
            <SelectorColegio colegios={zona.data.colegios} value={colegio} onChange={elegir} />
            {!colegio && <p className="muted">Elige un colegio para ver el detalle.</p>}
            {detalle.loading && <p className="muted">Cargando detalle...</p>}
            {detalle.error && <div className="alert alert-err">{detalle.error}</div>}
          </div>

          {detalle.data && (
            <>
              <ResumenKpi resumen={detalle.data.resumen} />
              <div style={{ height: 16 }} />
              <GraficoMesas mesas={detalle.data.porMesa} />
              <GraficoEstrategias datos={detalle.data.porEstrategia} />
              <TablaDetalle filas={detalle.data.filas} />
            </>
          )}
        </>
      )}
    </main>
  );
}
