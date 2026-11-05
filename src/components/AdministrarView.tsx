import React from 'react';
import {
  Sliders,
  CalendarDays,
  Layers,
  Cloud,
  FileSpreadsheet,
  Lock,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Info
} from 'lucide-react';
import { EchtAgroLogo } from './EchtAgroLogo';

interface AdministrarViewProps {
  onOpenLockedModal: (title: string, desc: string) => void;
  onOpenBackendInfo: () => void;
}

export const AdministrarView: React.FC<AdministrarViewProps> = ({
  onOpenLockedModal,
  onOpenBackendInfo,
}) => {
  const adminSections = [
    {
      id: 'campanas',
      title: 'Gestión de Campañas',
      subtitle: 'Crear, cerrar o pausar ciclos de cultivo',
      icon: CalendarDays,
      status: 'Bloqueado',
    },
    {
      id: 'lotes',
      title: 'Catálogo de Lotes',
      subtitle: 'Definición de polígonos, superficies y nombres',
      icon: Layers,
      status: 'Bloqueado',
    },
    {
      id: 'backend',
      title: 'Conexión Cloudflare & Google Sheets',
      subtitle: 'Estado del Worker y sincronización de datos',
      icon: Cloud,
      status: 'En espera',
      onClick: onOpenBackendInfo,
    },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#1E2922]">
            Administración del Campo
          </h1>
          <p className="text-xs text-[#6B7C72]">
            Parámetros del establecimiento y configuración
          </p>
        </div>

        <div className="w-8 h-8 rounded-xl bg-white border border-[#E2E8E0] flex items-center justify-center text-[#2D6A4F]">
          <Sliders className="w-4 h-4" />
        </div>
      </div>

      {/* Lista de configuraciones */}
      <div className="space-y-2.5">
        {adminSections.map((sec) => {
          const Icon = sec.icon;
          return (
            <button
              key={sec.id}
              onClick={() => {
                if (sec.onClick) {
                  sec.onClick();
                } else {
                  onOpenLockedModal(
                    sec.title,
                    `La configuración de "${sec.title}" requiere backend activo con Google Sheets.`
                  );
                }
              }}
              className="w-full group flex items-center justify-between p-4 bg-white border border-[#E2E8E0] hover:border-[#2D6A4F]/40 rounded-2xl shadow-xs transition-all text-left cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-[#F4F7F4] text-[#2D6A4F] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 pr-1">
                  <span className="text-sm font-semibold text-[#1E2922] group-hover:text-[#2D6A4F] transition-colors block truncate">
                    {sec.title}
                  </span>
                  <p className="text-xs text-[#6B7C72] truncate max-w-[220px]">
                    {sec.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[10px] font-semibold text-[#7A6B53] bg-[#F7F3EB] px-2 py-0.5 rounded-md border border-[#E9DFCE]">
                  {sec.status}
                </span>
                <ChevronRight className="w-4 h-4 text-[#9CAEA2] group-hover:text-[#2D6A4F] transition-colors" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Estado del Sistema */}
      <div className="bg-[#FAF7F2] border border-[#EBE2D5] rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2.5 text-xs font-bold text-[#3B3020]">
          <ShieldCheck className="w-4 h-4 text-[#2D6A4F]" />
          <span>Fase actual del proyecto</span>
        </div>
        <p className="text-xs text-[#5C4D38] leading-relaxed">
          Interfaz visual Mobile First completada. El sistema no guarda datos ficticios ni utiliza localStorage. La siguiente fase activará el Worker de Cloudflare para vincular su Google Sheet sin exponer contraseñas.
        </p>
      </div>

      {/* Logotipo y Versión */}
      <div className="pt-2 flex flex-col items-center justify-center text-center space-y-1 text-xs text-[#7A8A80]">
        <EchtAgroLogo size="sm" />
        <p className="text-[11px] text-[#8E9F94] mt-1">
          echtagro · Plataforma de gestión rural profesional
        </p>
      </div>
    </div>
  );
};
