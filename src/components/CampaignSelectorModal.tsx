import React from 'react';
import { CalendarDays, Sprout, X, Plus, AlertCircle } from 'lucide-react';

interface CampaignSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeCampaign: string | null;
  onSelectCampaign: (name: string | null) => void;
  onOpenLockedModal: (title: string, desc: string) => void;
}

export const CampaignSelectorModal: React.FC<CampaignSelectorModalProps> = ({
  isOpen,
  onClose,
  activeCampaign,
  onSelectCampaign,
  onOpenLockedModal,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-[#E2E8E0] space-y-4 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#7A8A80] hover:text-[#1E2922] rounded-full hover:bg-[#F0F4F1] transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EBF4EE] text-[#2D6A4F] flex items-center justify-center shrink-0">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1E2922]">
              Campaña Agrícola
            </h3>
            <p className="text-xs text-[#6B7C72]">
              Ciclo productivo en curso
            </p>
          </div>
        </div>

        {/* Estado actual */}
        <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#E2E8E0] space-y-2">
          <span className="text-[11px] font-semibold text-[#55695C] uppercase tracking-wider">
            Campaña actualmente activa
          </span>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-[#1E2922]">
              {activeCampaign || 'Ninguna campaña activa'}
            </span>
            {activeCampaign && (
              <span className="text-[10px] font-bold text-[#2D6A4F] bg-[#EBF4EE] px-2 py-0.5 rounded-md">
                Activa
              </span>
            )}
          </div>
        </div>

        {/* Estado Vacío de Campañas - Sin inventar campañas ficticias */}
        <div className="p-4 rounded-2xl bg-[#FAFAFA] border border-dashed border-[#D2DCD4] text-center space-y-2">
          <div className="w-10 h-10 rounded-full bg-[#EBF4EE] text-[#2D6A4F] flex items-center justify-center mx-auto">
            <Sprout className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#20382B]">
              Sin campañas sincronizadas
            </p>
            <p className="text-[11px] text-[#6B7C72] mt-0.5">
              Las campañas se cargarán automáticamente desde la hoja de cálculo vinculada en Google Sheets.
            </p>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenLockedModal(
                'Creación de Campaña Bloqueada',
                'La creación manual de campañas agrícolas requiere conexión verificada con el backend de Google Sheets.'
              );
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D5E0D7] text-xs font-semibold text-[#2D6A4F] hover:bg-[#F0F4F1] transition-colors mt-2"
          >
            <Plus className="w-3.5 h-3.5" />
            Nueva campaña (Bloqueado)
          </button>
        </div>

        <button
          onClick={onClose}
          className="w-full h-11 rounded-xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-semibold text-xs tracking-wide transition-colors cursor-pointer"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
