import React from 'react';
import { Cloud, FileSpreadsheet, Server, ShieldCheck, X, CheckCircle2, Code } from 'lucide-react';
import { WORKER_BASE_URL } from '../services/backend';

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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-xl border border-[#E2E8E0] space-y-4 my-6 animate-in fade-in zoom-in-95 duration-150">
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
              Conexión Backend echtagro
            </h3>
            <p className="text-xs text-[#6B7C72]">
              Cloudflare Worker &rarr; Google Apps Script &rarr; Sheets
            </p>
          </div>
        </div>

        {/* Estado actual de la variable */}
        <div className="p-3.5 rounded-2xl border text-xs flex items-center justify-between bg-[#E8F5E9] border-[#C8E6C9] text-[#2E7D32]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2D6A4F]" />
            <div>
              <p className="font-bold">Cloudflare Worker Conectado</p>
              <p className="text-[11px] opacity-90 truncate max-w-[280px]">
                {WORKER_BASE_URL}/api/backend
              </p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-white border border-current">
            Activo
          </span>
        </div>

        {/* Componentes de la Arquitectura */}
        <div className="space-y-2.5">
          {/* Cloudflare Worker */}
          <div className="p-3 rounded-2xl bg-[#F8FAF7] border border-[#E2E8E0] flex items-start gap-3 text-xs">
            <div className="w-8 h-8 rounded-xl bg-[#F4EDE2] text-[#B07238] flex items-center justify-center shrink-0 mt-0.5">
              <Cloud className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-[#1E2922] block">
                1. Cloudflare Worker (echtagro-backend)
              </span>
              <p className="text-[#55695C] mt-0.5 text-[11px] leading-relaxed">
                Atiende <code className="bg-[#EAEFEA] px-1 rounded text-[#1E2922]">POST /api/backend</code>. Agrega internamente el secreto <code className="bg-[#EAEFEA] px-1 rounded text-[#1E2922]">GAS_API_KEY</code> sin exponerlo al cliente y gestiona las acciones <code className="bg-[#EAEFEA] px-1 rounded text-[#1E2922]">lotes.listar</code> y <code className="bg-[#EAEFEA] px-1 rounded text-[#1E2922]">lotes.crear</code>.
              </p>
            </div>
          </div>

          {/* Google Apps Script */}
          <div className="p-3 rounded-2xl bg-[#F8FAF7] border border-[#E2E8E0] flex items-start gap-3 text-xs">
            <div className="w-8 h-8 rounded-xl bg-[#E6F4EA] text-[#1E7E34] flex items-center justify-center shrink-0 mt-0.5">
              <Code className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-[#1E2922] block">
                2. Google Apps Script (Web App)
              </span>
              <p className="text-[#55695C] mt-0.5 text-[11px] leading-relaxed">
                Valida la petición autenticada, interactúa con la pestaña &ldquo;Lotes&rdquo; y responde en formato JSON con la confirmación de la fila insertada o el motivo del rechazo.
              </p>
            </div>
          </div>

          {/* Google Sheets */}
          <div className="p-3 rounded-2xl bg-[#F8FAF7] border border-[#E2E8E0] flex items-start gap-3 text-xs">
            <div className="w-8 h-8 rounded-xl bg-[#EBF4EE] text-[#2D6A4F] flex items-center justify-center shrink-0 mt-0.5">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="font-bold text-[#1E2922] block">
                3. Google Sheets (Base de Datos Real)
              </span>
              <p className="text-[#55695C] mt-0.5 text-[11px] leading-relaxed">
                Campos registrados: <code className="bg-[#EAEFEA] px-1 rounded text-[#1E2922]">codigo</code>, <code className="bg-[#EAEFEA] px-1 rounded text-[#1E2922]">nombre</code>, <code className="bg-[#EAEFEA] px-1 rounded text-[#1E2922]">hectareas_totales</code> y <code className="bg-[#EAEFEA] px-1 rounded text-[#1E2922]">ubicacion</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Políticas de Seguridad activas */}
        <div className="p-3 rounded-xl bg-[#F8FAF7] border border-[#E2E8E0] flex items-center gap-2.5 text-xs text-[#55695C]">
          <ShieldCheck className="w-4 h-4 text-[#2D6A4F] shrink-0" />
          <p className="text-[11px]">
            No se almacenan datos ficticios ni se utiliza almacenamiento local (localStorage / IndexedDB).
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
