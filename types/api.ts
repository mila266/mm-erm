export type TipoCarga = "reporte" | "padron";

export interface RespuestaError {
  ok: false;
  error: string;
}

export interface RespuestaCarga {
  ok: true;
  tipo: TipoCarga;
  guardados: number;
  omitidas: number;   
  repetidos: number; 
  mensaje: string;
}

export type RespuestaOk<T> = { ok: true } & T;
export type Respuesta<T> = RespuestaOk<T> | RespuestaError;
