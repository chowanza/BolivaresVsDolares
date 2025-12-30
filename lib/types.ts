export interface DolarApiRate {
  fuente: string;
  nombre: string;
  compra: number | null;
  venta: number | null;
  promedio: number;
  fechaActualizacion: string;
}

export interface RatesData {
  BCV: number;
  EUR_BCV: number;
  USDT: number;
  CASH: number;
  lastUpdated: string;
  isLoading: boolean;
  error: string | null;
}