import React, { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Layers,
  Edit2,
  Users,
  MapPin,
  Clock,
  ShieldAlert,
  FileSpreadsheet,
  AlertCircle
} from 'lucide-react';
import { Lote } from '../../types/agri';
import { LoteFormModal } from './LoteFormModal';

interface LotesViewProps {
  onBack: () => void;
  onOpenLockedModal: (title: string, desc: string) => void;
}

export const LotesView: React.FC<LotesViewProps> = ({
  onBack,
  onOpenLockedModal,
}) => {
  // Lista de lotes: vacío inicialmente (sin inventar datos ficticios)
  const [lotes, setLotes] = useState<Lote[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingLote, setEditingLote] = useState<Lote | null>(null);

  const handleOpenNew = () => {
    setEditingLote(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (lote: Lote) => {
    setEditingLote(lote);
    setIsFormOpen(true);
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

        <span className="text-[11px] font-semibold text-[#7A6B53] bg-[#F7F3EB] px-2.5 py-1 rounded-lg border border-[#E9DFCE] inline-flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#A87E43]" />
          <span>Google Sheets</span>
        </span>
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
              Superficies catastrales y distribución de propiedad
            </p>
          </div>
        </div>

        {/* Botón Grande para Agregar Lote */}
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs font-bold shadow-xs transition-all active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Lote</span>
        </button>
      </div>

      {/* Resumen de Hectáreas Totales */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8E0] shadow-xs">
          <span className="text-xs font-semibold text-[#4A5D52] block">
            Lotes Registrados
          </span>
          <div className="text-xl font-bold font-mono text-[#1E2922] tabular-nums mt-1">
            {lotes.length}
          </div>
        </div>
        <div className="p-3.5 rounded-2xl bg-white border border-[#E2E8E0] shadow-xs">
          <span className="text-xs font-semibold text-[#4A5D52] block">
            Superficie Total
          </span>
          <div className="text-xl font-bold font-mono text-[#1E2922] tabular-nums mt-1">
            {totalHectareas > 0 ? `${totalHectareas.toLocaleString()} ha` : '— ha'}
          </div>
        </div>
      </div>

      {/* Listado de Lotes o Estado Vacío */}
      {lotes.length === 0 ? (
        <div className="bg-white border border-[#E2E8E0] rounded-2xl p-6 sm:p-8 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-[#F4F7F4] text-[#2D6A4F] flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1E2922]">
              Sin lotes sincronizados
            </h2>
            <p className="text-xs text-[#6B7C72] max-w-md mx-auto mt-1 leading-relaxed">
              No hay lotes cargados todavía. Los lotes se sincronizarán directamente desde la pestaña <span className="font-semibold text-[#2D6A4F]">Lotes</span> de tu planilla de Google Sheets.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
            <button
              onClick={handleOpenNew}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#1B4332] transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Abrir formulario de nuevo lote</span>
            </button>
          </div>

          {/* Aviso sobre salvaguarda contable */}
          <div className="mt-4 pt-3 border-t border-[#EAEFEA] text-[11px] text-[#7A8A80] flex items-center justify-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#B07238]" />
            <span>
              Operaciones de guardado bloqueadas hasta habilitar el Worker de Cloudflare.
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
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-bold text-[#1E2922] truncate">
                      {lote.nombre}
                    </h2>
                    <span className="text-xs font-mono font-bold text-[#2D6A4F] bg-[#EBF4EE] px-2 py-0.5 rounded-md shrink-0">
                      {lote.superficieTotalHa} ha
                    </span>
                  </div>
                  {lote.ubicacion && (
                    <p className="text-xs text-[#6B7C72] flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3.5 h-3.5 text-[#7A8A80] shrink-0" />
                      <span>{lote.ubicacion}</span>
                    </p>
                  )}
                </div>

                {/* Botón Editar Lote */}
                <button
                  onClick={() => handleOpenEdit(lote)}
                  className="p-2 rounded-xl bg-[#F8FAF7] border border-[#D5E0D7] hover:bg-[#EBF4EE] hover:text-[#2D6A4F] text-[#4A5D52] transition-colors shrink-0"
                  title="Editar lote"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>

              {/* Distribución de Propietarios */}
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
            </div>
          ))}
        </div>
      )}

      {/* Modal Formulario de Lote */}
      <LoteFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialLote={editingLote}
        onOpenLockedModal={onOpenLockedModal}
      />
    </div>
  );
};
