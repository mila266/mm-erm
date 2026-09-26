"use client";
import { useMemo, useState } from "react";
import { TITULO_ZONA } from "@/lib/config";
import { calcularAvance, porEstrategia } from "@/lib/reportes/agregaciones";
import { useColegios } from "@/hooks/useColegios";
import { useEstadoColegio } from "@/hooks/useEstadoColegio";
import ResumenKpi from "@/components/consulta/ResumenKpi";
import GraficoColegios from "@/components/consulta/GraficoColegios";
import SelectorColegio from "@/components/consulta/SelectorColegio";
import SelectorMesa from "@/components/consulta/SelectorMesa";
import GraficoMesas from "@/components/consulta/GraficoMesas";
import GraficoEstrategias from "@/components/consulta/GraficoEstrategias";
import TablaDetalle from "@/components/consulta/TablaDetalle";

function irAlDetalle() {
  setTimeout(() => document.getElementById("detalle")?.scrollIntoView({ behavior: "smooth" }), 50);
}

export default function ConsultaPage() {
  const zona = useColegios();
  const [colegio, setColegio] = useState("");
  const [mesa, setMesa] = useState("");
  const detalle = useEstadoColegio(colegio);

  function elegirColegio(c: string) {
    setColegio(c);
    setMesa(""); // al cambiar de colegio se vuelve a "Todas las mesas"
    if (c) irAlDetalle();
  }

  function elegirMesa(m: string) {
    setMesa(m);
    if (m) irAlDetalle();
  }

  // Resultados de la mesa elegida (se filtra en el navegador, sin volver a consultar la base).
  const vistaMesa = useMemo(() => {
    if (!detalle.data || !mesa) return null;
    const filas = detalle.data.filas.filter((f) => (f.nro_mesa || "Sin mesa") === mesa);
    return {
      resumen: calcularAvance(filas.length, filas.filter((f) => f.capacitado).length),
      porEstrategia: porEstrategia(filas),
      filas,
    };
  }, [detalle.data, mesa]);

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
            <GraficoColegios colegios={zona.data.colegios} onSelect={elegirColegio} />
          ) : (
            <div className="card muted">Aun no hay miembros cargados en el padron.</div>
          )}

          <div className="card" id="detalle">
            <div className="row">
              <SelectorColegio colegios={zona.data.colegios} value={colegio} onChange={elegirColegio} />
              {detalle.data && (
                <SelectorMesa mesas={detalle.data.porMesa} value={mesa} onChange={elegirMesa} />
              )}
            </div>
            {!colegio && <p className="muted">Elige un colegio para ver el detalle.</p>}
            {detalle.loading && <p className="muted">Cargando detalle...</p>}
            {detalle.error && <div className="alert alert-err">{detalle.error}</div>}
          </div>

          {detalle.data && !vistaMesa && (
            <>
              <ResumenKpi resumen={detalle.data.resumen} />
              <div style={{ height: 16 }} />
              <GraficoMesas mesas={detalle.data.porMesa} onSelect={elegirMesa} />
              <GraficoEstrategias datos={detalle.data.porEstrategia} />
              <TablaDetalle filas={detalle.data.filas} />
            </>
          )}

          {vistaMesa && (
            <>
              <h2>Mesa {mesa}</h2>
              <ResumenKpi resumen={vistaMesa.resumen} />
              <div style={{ height: 16 }} />
              <GraficoEstrategias datos={vistaMesa.porEstrategia} />
              <TablaDetalle filas={vistaMesa.filas} />
            </>
          )}
        </>
      )}
    </main>
  );
}
