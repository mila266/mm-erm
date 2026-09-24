import type { Estrategia } from "./capacitacion";

export interface FilaEstado {
  dni: string;
  nombres: string | null;
  colegio: string | null;
  nro_mesa: string | null;
  cargo: string | null;
  capacitado: boolean;
  estrategias: Estrategia[];
}

export interface Avance {
  total: number;
  capacitados: number;
  faltan: number;
  avance: number; // porcentaje 0-100
}

export interface ResumenColegio extends Avance {
  colegio: string;
}

export interface ResumenMesa extends Avance {
  nro_mesa: string;
}

export interface ConteoEstrategia {
  estrategia: string;
  participaciones: number;
}

// Respuesta de GET /api/colegios
export interface ResumenZona {
  resumen: Avance;
  colegios: ResumenColegio[];
}

// Respuesta de GET /api/estado?colegio=X
export interface EstadoColegio {
  colegio: string;
  resumen: Avance;
  porMesa: ResumenMesa[];
  porEstrategia: ConteoEstrategia[];
  filas: FilaEstado[];
}
