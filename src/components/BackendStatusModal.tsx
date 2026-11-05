import React from 'react';
import { Cloud, FileSpreadsheet, Server, ShieldCheck, X, AlertTriangle } from 'lucide-react';

interface BackendStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BackendStatusModal: React.FC<BackendStatusModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-xl border border-[#E2E8E0] space-y-5 animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#7A8A80] hover:text-[#1E2922] rounded-full hover:bg-[#F0F4F1] transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#EBF4EE] text-[#2D6A4F] flex items-center justify-center shrink-0">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#1E2922]">
              Arquitectura de Conexión echtagro
            </h3>
            <p className="text-xs text-[#6B7C72]">
              Estado de integración de servicios
            </p>
          </div>
        </div>

        {/* Lista de Servicios */}
        <div className="space-y-2.5">
          {/* Cloudflare Workers */}
          <div className="p-3.5 rounded-2xl bg-[#F8FAF7] border border-[#E2E8E0] flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#F4EDE2] text-[#B07238] flex items-center justify-center shrink-0 mt-0.5">
              <Cloud className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1E2922]">Cloudflare Workers</span>
                <span className="text-[10px] font-semibold text-[#8C5824] bg-[#FAF0E6] px-2 py-0.5 rounded-md">
                  En espera
                </span>
              </div>
              <p className="text-[#55695C] mt-1">
                Servirá como pasarela API segura para enrutar peticiones sin exponer credenciales en el cliente móvil.
              </p>
            </div>
          </div>

          {/* Google Sheets */}
          <div className="p-3.5 rounded-2xl bg-[#F8FAF7] border border-[#E2E8E0] flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E6F4EA] text-[#1E7E34] flex items-center justify-center shrink-0 mt-0.5">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1E2922]">Google Sheets / Apps Script</span>
                <span className="text-[10px] font-semibold text-[#1E7E34] bg-[#EBF5EE] px-2 py-0.5 rounded-md">
                  Planilla Principal
                </span>
              </div>
              <p className="text-[#55695C] mt-1">
                Almacén contable y agronómico de lotes, gastos, cosechas y caja. Se conectará sin alterar la estructura preexistente.
              </p>
            </div>
          </div>

          {/* Almacenamiento Local Desactivado */}
          <div className="p-3.5 rounded-2xl bg-[#F8FAF7] border border-[#E2E8E0] flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#EBF4EE] text-[#2D6A4F] flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1E2922]">Almacenamiento Local (Dispositivo)</span>
                <span className="text-[10px] font-semibold text-[#2D6A4F] bg-[#EBF4EE] px-2 py-0.5 rounded-md">
                  Desactivado
                </span>
              </div>
              <p className="text-[#55695C] mt-1">
                No se utiliza localStorage ni IndexedDB. Todas las consultas provendrán en tiempo real desde la nube.
              </p>
            </div>
          </div>
        </div>

        {/* Advertencia de Seguridad */}
        <div className="p-3 rounded-xl bg-[#FFF9E6] border border-[#FFE8A3] flex items-start gap-2.5 text-xs text-[#7A5B00]">
          <AlertTriangle className="w-4 h-4 text-[#C68D00] shrink-0 mt-0.5" />
          <p>
            Las operaciones de escritura y consulta privada permanecerán bloqueadas hasta completar el despliegue del Worker.
          </p>
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
