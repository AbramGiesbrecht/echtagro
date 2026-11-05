import React from 'react';
import { Lock, ShieldCheck, X, FileSpreadsheet, Cloud } from 'lucide-react';

interface LockedOperationModalProps {
  isOpen: boolean;
  onClose: () => void;
  operationTitle?: string;
  operationDescription?: string;
}

export const LockedOperationModal: React.FC<LockedOperationModalProps> = ({
  isOpen,
  onClose,
  operationTitle = 'Operación Privada Bloqueada',
  operationDescription = 'Esta función requiere comunicación activa con el backend seguro.',
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs transition-opacity"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-xl border border-[#E2E8E0] space-y-4 animate-in fade-in zoom-in-95 duration-150">
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#7A8A80] hover:text-[#1E2922] rounded-full hover:bg-[#F0F4F1] transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado con Icono de candado */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF8E1] border border-[#FFE082] flex items-center justify-center text-[#B78103] shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1E2922]">
              {operationTitle}
            </h3>
            <p className="text-xs text-[#6B7C72]">
              Seguridad y consistencia contable
            </p>
          </div>
        </div>

        {/* Mensaje detallado */}
        <div className="bg-[#F8FAF7] border border-[#E2E8E0] rounded-2xl p-3.5 space-y-2 text-xs text-[#405246] leading-relaxed">
          <p>{operationDescription}</p>
          <p className="font-medium text-[#20382B]">
            Para preservar la integridad de los datos de su campo:
          </p>
          <ul className="space-y-1.5 pl-1 text-[#55695C]">
            <li className="flex items-start gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0 mt-0.5" />
              <span>No se guardan datos ficticios ni borradores locales en este dispositivo.</span>
            </li>
            <li className="flex items-start gap-2">
              <Cloud className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0 mt-0.5" />
              <span>La sincronización se habilitará cuando Cloudflare Workers esté configurado.</span>
            </li>
            <li className="flex items-start gap-2">
              <FileSpreadsheet className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0 mt-0.5" />
              <span>Todas las transacciones se registrarán directamente en su planilla de Google Sheets.</span>
            </li>
          </ul>
        </div>

        {/* Botón de acción */}
        <button
          onClick={onClose}
          className="w-full h-11 rounded-xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-semibold text-xs tracking-wide transition-colors flex items-center justify-center shadow-xs cursor-pointer active:scale-[0.99]"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};
