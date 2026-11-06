/**
 * Servicio de conexión con el backend real de echtagro:
 * Frontend (Cloudflare Pages) -> Cloudflare Worker (echtagro-backend) -> Google Apps Script -> Google Sheets
 * 
 * Configuración:
 * - Worker URL: https://echtagro-backend.abrameldagiesbrecht.workers.dev
 * - Endpoint: POST /api/backend
 * - Acciones:
 *   - lotes.listar -> Retorna los lotes reales desde Google Sheets
 *   - lotes.crear  -> Envía { codigo, nombre, hectareas_totales, ubicacion }
 */

import { Lote, Propietario } from '../types/agri';

export const WORKER_BASE_URL = 'https://echtagro-backend.abrameldagiesbrecht.workers.dev';

export interface BackendResponse<T = unknown> {
  success: boolean;
  data?: T;
  lote?: Lote;
  lotes?: Lote[];
  message?: string;
  error?: string;
  rawResponse?: unknown;
}

export interface CrearLotePayload {
  codigo: string;
  nombre: string;
  hectareas_totales: number;
  ubicacion?: string;
  propietarios?: Propietario[];
  observaciones?: string;
}

/**
 * Determina la URL adecuada para la llamada al endpoint /api/backend:
 * - En producción o en Cloudflare Pages: usa el Worker directamente.
 * - En preview local: usa /api/backend mediante el proxy configurado en Vite para evitar bloqueos de CORS.
 */
export const getBackendEndpoint = (): string => {
  if (typeof window !== 'undefined') {
    // Si corre en vista previa local o sandbox con dominio distinto a echtagro.pages.dev
    if (
      window.location.hostname === 'localhost' ||
      window.location.hostname.endsWith('run.app')
    ) {
      return '/api/backend';
    }
  }

  const customUrl = import.meta.env.VITE_BACKEND_URL;
  if (customUrl && customUrl.trim()) {
    const clean = customUrl.trim().replace(/\/+$/, '');
    return clean.endsWith('/api/backend') ? clean : `${clean}/api/backend`;
  }

  return `${WORKER_BASE_URL}/api/backend`;
};

/**
 * Consulta la lista de lotes reales llamando al Worker con la acción 'lotes.listar'.
 */
export async function listarLotes(): Promise<BackendResponse<Lote[]>> {
  const endpoint = getBackendEndpoint();

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        action: 'lotes.listar',
      }),
    });

    const text = await response.text();
    let json: any = null;

    try {
      json = JSON.parse(text);
    } catch {
      return {
        success: false,
        error: `Respuesta no válida del servidor (HTTP ${response.status}): ${text.slice(0, 150)}`,
        rawResponse: text,
      };
    }

    // Verificar si el servidor respondió con ok: true o success: true
    if (response.ok && (json.ok === true || json.success === true)) {
      const rawList: any[] = json.lotes || json.data || (Array.isArray(json) ? json : []);

      const lotesMapeados: Lote[] = rawList.map((item: any, index: number) => {
        const codigo = String(item.codigo || item.id || `L-${index + 1}`);
        const nombre = String(item.nombre || item.codigo || `Lote ${index + 1}`);
        const superficie = Number(item.hectareas_totales ?? item.superficieTotalHa ?? item.superficie ?? 0);
        const ubicacion = String(item.ubicacion || '');
        const observaciones = String(item.observaciones || '');
        const propietarios = Array.isArray(item.propietarios) ? item.propietarios : [];

        return {
          id: codigo,
          codigo,
          nombre,
          superficieTotalHa: isNaN(superficie) ? 0 : superficie,
          ubicacion,
          observaciones,
          propietarios,
        };
      });

      return {
        success: true,
        lotes: lotesMapeados,
        data: lotesMapeados,
        message: json.message || 'Lotes consultados con éxito desde Google Sheets.',
      };
    }

    // El servidor devolvió un error explícito (ej: {"ok": false, "error": "Operación no habilitada"})
    return {
      success: false,
      error: json.error || json.message || `Error del servidor (HTTP ${response.status})`,
      rawResponse: json,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: `Error de red al conectar con Cloudflare Worker: ${errorMsg}`,
    };
  }
}

/**
 * Registra un lote real en Google Sheets a través del Cloudflare Worker mediante 'lotes.crear'.
 * Se envía el objeto lote con codigo, nombre, hectareas_totales y ubicacion.
 */
export async function crearLoteEnBackend(
  payload: CrearLotePayload
): Promise<BackendResponse<Lote>> {
  const endpoint = getBackendEndpoint();

  // Validaciones en cliente
  if (!payload.nombre || payload.nombre.trim().length === 0) {
    return {
      success: false,
      error: 'El nombre del lote es obligatorio.',
    };
  }

  if (!payload.hectareas_totales || payload.hectareas_totales <= 0) {
    return {
      success: false,
      error: 'Las hectáreas totales deben ser mayores a 0.',
    };
  }

  // Generar o limpiar el código si no fue especificado
  const codigoLote = (payload.codigo && payload.codigo.trim())
    ? payload.codigo.trim()
    : payload.nombre.trim().toUpperCase().replace(/\s+/g, '-');

  const requestBody = {
    action: 'lotes.crear',
    lote: {
      codigo: codigoLote,
      nombre: payload.nombre.trim(),
      hectareas_totales: Number(payload.hectareas_totales),
      ubicacion: (payload.ubicacion || '').trim(),
    },
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    const text = await response.text();
    let json: any = null;

    try {
      json = JSON.parse(text);
    } catch {
      return {
        success: false,
        error: `Respuesta no válida del servidor (HTTP ${response.status}): ${text.slice(0, 150)}`,
        rawResponse: text,
      };
    }

    // Comprobar éxito real confirmado por Google Sheets
    if (response.ok && (json.ok === true || json.success === true)) {
      const loteConfirmado: Lote = {
        id: json.lote?.codigo || json.lote?.id || codigoLote,
        codigo: json.lote?.codigo || codigoLote,
        nombre: json.lote?.nombre || payload.nombre.trim(),
        superficieTotalHa: Number(json.lote?.hectareas_totales || payload.hectareas_totales),
        ubicacion: json.lote?.ubicacion || payload.ubicacion || '',
        observaciones: payload.observaciones || '',
        propietarios: payload.propietarios || [],
      };

      return {
        success: true,
        lote: loteConfirmado,
        data: loteConfirmado,
        message: json.message || 'Lote registrado y confirmado en Google Sheets.',
      };
    }

    // Error real retornado por el servidor
    return {
      success: false,
      error: json.error || json.message || `El servidor rechazó el guardado (HTTP ${response.status})`,
      rawResponse: json,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      error: `Error de red al conectar con Cloudflare Worker: ${errorMsg}`,
    };
  }
}
