/**
 * Tipos de datos para Lotes, Campañas y Distribución Agrícola de echtagro
 * Diseñado para mapear directamente con las pestañas de Google Sheets.
 */

export interface Propietario {
  id: string;
  nombre: string;
  porcentaje: number; // 0 a 100
}

export interface Lote {
  id: string;
  nombre: string;
  superficieTotalHa: number;
  propietarios: Propietario[];
  ubicacion?: string;
  observaciones?: string;
}

export interface LoteCampana {
  loteId: string;
  loteNombre: string;
  superficieUtilizadaHa: number;
  cultivo: string;
  propietarios: Propietario[]; // Snapshot independiente para la campaña
}

export interface Campana {
  id: string;
  nombre: string; // ej: "Verano 2026/27", "Invierno 2027"
  tipo: 'Verano' | 'Invierno';
  anioCiclo: string;
  estado: 'activa' | 'cerrada' | 'planificacion';
  lotesParticipantes: LoteCampana[];
  fechaInicio?: string;
  fechaCierre?: string;
  observaciones?: string;
}

export const CULTIVOS_COMUNES = [
  'Soja',
  'Maíz',
  'Trigo',
  'Girasol',
  'Cebada',
  'Sorgo',
  'Algodón',
  'Chía',
  'Sésamo',
  'Barbecho',
  'Otro',
] as const;
