import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Plus,
  Layers,
  Edit2,
  Users,
  MapPin,
  RefreshCw,
  Cloud,
  AlertTriangle,
  Loader2,
  FileSpreadsheet,
  Tag
} from 'lucide-react';
import { Lote } from '../../types/agri';
import { LoteFormModal } from './LoteFormModal';
import { listarLotes, WORKER_BASE_URL } from '../../services/backend';

interface LotesViewProps {
  onBack: () => void;
  onOpenLockedModal: (title: string, desc: string) => void;
}

export const LotesView: React.FC<LotesViewProps> = ({
  onBack,
  onOpenLockedModal,
}) => {
  // Lista de lotes reales consultados desde Google Sheets
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLote, setEditingLote] = useState<Lote | null>(null);

  // Consulta real al Cloudflare Worker mediante la acción lotes.listar
  const cargarLotes = useCallback(async () => {
    setIsLoading(true);
    setFetchError(null);

    try {
      const resp = await listarLotes();
      if (resp.success && resp.lotes) {
        setLotes(resp.lotes);
      } else {
        setFetchError(
          resp.error ||
            resp.message ||
            'El servidor respondió con un error al consultar los lotes.'
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setFetchError(`Error de red al conectar con Cloudflare Worker: ${msg}`);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    cargarLotes();
  }, [cargarLotes]);

  const handleOpenNew = () => {
    setEditingLote(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (lote: Lote) => {
    setEditingLote(lote);
    setIsFormOpen(true);
  };

  // Callback al confirmar creación real: actualiza la lista y recarga desde el backend
  const handleLoteCreado = (nuevoLote: Lote) => {
    setLotes((prev) => [nuevoLote, ...prev.filter((l) => l.codigo !== nuevoLote.codigo)]);
    // Reconsultar para sincronizar el estado exacto de Google Sheets
    cargarLotes();
  };

  // Cálculo de hectáreas totales registradas
  const totalHectareas = lotes.reduce(
    (acc, lote) => acc + (lote.superficieTotalHa || 0),
    0
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Barra superior de navegación y estado */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D8E2DC] text-xs font-semibold text-[#2D6A4F] hover:bg-[#F0F4F1] transition-colors shadow-xs cursor-pointer active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Inicio</span>
        </button>

        {/* Estado del Cloudflare Worker real */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-semibold text-[#1B4332] bg-[#EBF4EE] px-2.5 py-1 rounded-lg border border-[#B8DFC8] inline-flex items-center gap-1.5">
            <Cloud className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span className="hidden sm:inline">Worker activo</span>
            <span className="sm:hidden">Worker</span>
          </span>

          <button
            onClick={cargarLotes}
            disabled={isLoading}
            className="p-1.5 rounded-lg bg-white border border-[#D8E2DC] text-[#4A5D52] hover:text-[#1E2922] hover:bg-[#F4F7F4] transition-colors disabled:opacity-40 cursor-pointer"
            title="Recargar lotes reales desde Google Sheets"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#2D6A4F]' : ''}`}
            />
          </button>
        </div>
      </div>

      {/* Encabezado del Módulo de Lotes */}
      <div className="bg-white border border-[#E2E8E0] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EBF4EE] text-[#2D6A4F] flex items-center justify-center shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1E2922]">
              Lotes y Parcelas
            </h1>
            <p className="text-xs text-[#6B7C72]">
              Conectado a Google Sheets mediante Cloudflare Worker
            </p>
          </div>
        </div>

        {/* Botón para Abrir Formulario Real */}
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs font-bold shadow-xs transition-all active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Lote</span>
        </button>
      </div>

      {/* Banner de Respuesta del Servidor (Errores reales) */}
      {fetchError && (
        <div className="p-3.5 rounded-2xl bg-[#FBE9E7] border border-[#FFCDD2] text-[#C62828] text-xs flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#D32F2F]" />
            <div>
              <p className="font-bold">Respuesta del backend (Worker / Apps Script):</p>
              <p className="mt-0.5 text-[11px] text-[#B71C1C] font-mono leading-relaxed">
                {fetchError}
              </p>
              <p className="mt-1 text-[10px] text-[#7A8A80]">
                Acción solicitada: <code className="bg-white px-1 py-0.5 rounded border border-[#FFCDD2]">POST /api/backend (lotes.listar)</code>
              </p>
            </div>
          </div>
          <button
            onClick={cargarLotes}
            className="px-2.5 py-1 rounded-lg bg-white border border-[#FFCDD2] text-xs font-bold text-[#C62828] hover:bg-[#FFEBEE] transition-colors shrink-0 cursor-pointer"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Resumen de Hectáreas Totales Reales */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8E0] shadow-xs">
          <span className="text-xs font-semibold text-[#4A5D52] block">
            Lotes Registrados
          </span>
          <div className="text-xl font-bold font-mono text-[#1E2922] tabular-nums mt-1">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-[#2D6A4F] mt-1" />
            ) : (
              lotes.length
            )}
          </div>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8E0] shadow-xs">
          <span className="text-xs font-semibold text-[#4A5D52] block">
            Superficie Total
          </span>
          <div className="text-xl font-bold font-mono text-[#1E2922] tabular-nums mt-1">
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-[#2D6A4F] mt-1" />
            ) : totalHectareas > 0 ? (
              `${totalHectareas.toLocaleString()} ha`
            ) : (
              '— ha'
            )}
          </div>
        </div>
      </div>

      {/* Listado de Lotes o Estado Vacío */}
      {isLoading ? (
        <div className="bg-white border border-[#E2E8E0] rounded-2xl p-8 text-center space-y-3 shadow-xs">
          <Loader2 className="w-8 h-8 animate-spin text-[#2D6A4F] mx-auto" />
          <p className="text-xs font-medium text-[#4A5D52]">
            Consultando lotes reales en Google Sheets vía Worker...
          </p>
        </div>
      ) : lotes.length === 0 ? (
        <div className="bg-white border border-[#E2E8E0] rounded-2xl p-6 sm:p-8 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#F4F7F4] text-[#2D6A4F] flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1E2922]">
              Sin lotes registrados
            </h2>
            <p className="text-xs text-[#6B7C72] max-w-md mx-auto mt-1 leading-relaxed">
              No hay lotes en la planilla de Google Sheets o el backend aún no ha habilitado la acción <code className="bg-[#EBF4EE] px-1 py-0.5 rounded text-[#1B4332]">lotes.listar</code>. Al registrar un nuevo lote, se emitirá <code className="bg-[#EBF4EE] px-1 py-0.5 rounded text-[#1B4332]">lotes.crear</code> al endpoint.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <button
              onClick={handleOpenNew}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#1B4332] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar primer lote</span>
            </button>
          </div>

          <div className="mt-4 pt-3 border-t border-[#EAEFEA] text-[11px] text-[#7A8A80] flex items-center justify-center gap-1.5">
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#2D6A4F]" />
            <span>
              Google Sheets (Database) &larr; Cloudflare Worker ({WORKER_BASE_URL})
            </span>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {lotes.map((lote) => (
            <div
              key={lote.id}
              className="bg-white border border-[#E2E8E0] rounded-2xl p-4 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-[#1E2922] truncate">
                      {lote.nombre}
                    </h2>
                    {lote.codigo && (
                      <span className="text-[10px] font-mono text-[#52796F] bg-[#F0F4F1] px-1.5 py-0.5 rounded border border-[#DCE4DD] flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5" />
                        {lote.codigo}
                      </span>
                    )}
                    <span className="text-xs font-mono font-bold text-[#2D6A4F] bg-[#EBF4EE] px-2 py-0.5 rounded-md shrink-0">
                      {lote.superficieTotalHa} ha
                    </span>
                  </div>
                  {lote.ubicacion && (
                    <p className="text-xs text-[#6B7C72] flex items-center gap-1 mt-1 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#7A8A80] shrink-0" />
                      <span>{lote.ubicacion}</span>
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleOpenEdit(lote)}
                  className="p-2 rounded-xl bg-[#F8FAF7] border border-[#D5E0D7] hover:bg-[#EBF4EE] hover:text-[#2D6A4F] text-[#4A5D52] transition-colors shrink-0"
                  title="Editar lote"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              {/* Propietarios si existen */}
              {lote.propietarios && lote.propietarios.length > 0 && (
                <div className="pt-2 border-t border-[#EAEFEA] space-y-1.5">
                  <span className="text-[11px] font-semibold text-[#55695C] uppercase tracking-wider flex items-center gap-1">
                    <Users className="w-3 h-3 text-[#2D6A4F]" />
                    <span>Propietarios ({lote.propietarios.length})</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {lote.propietarios.map((prop, idx) => (
                      <div
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-[#F8FAF7] border border-[#E2E8E0] text-xs text-[#3A4D41] flex items-center gap-1.5"
                      >
                        <span className="font-medium truncate max-w-[140px]">
                          {prop.nombre || `Propietario ${idx + 1}`}
                        </span>
                        <span className="font-mono font-bold text-[#2D6A4F]">
                          {prop.porcentaje}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Modal Formulario de Lote Real */}
      <LoteFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialLote={editingLote}
        onOpenLockedModal={onOpenLockedModal}
        onLoteCreado={handleLoteCreado}
      />
    </div>
  );
};
