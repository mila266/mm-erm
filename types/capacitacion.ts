export interface Estrategia {
  nombre: string;
  fecha: string | null; // YYYY-MM-DD
}

export interface RegistroCapacitacion {
  dni: string;
  nombres: string | null;
  estrategias: Estrategia[];
  estrategia_raw: string | null;
  ubigeo: string | null;
  reporte_fecha: string;
}
