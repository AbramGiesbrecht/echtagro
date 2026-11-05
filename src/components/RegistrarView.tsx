import React from 'react';
import {
  Receipt,
  Tractor,
  Wheat,
  Coins,
  Lock,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface RegistrarViewProps {
  onOpenLockedModal: (title: string, desc: string) => void;
}

export const RegistrarView: React.FC<RegistrarViewProps> = ({
  onOpenLockedModal,
}) => {
  const registerOptions = [
    {
      id: 'gasto',
      title: 'Registrar Gasto o Insumo',
      subtitle: 'Semillas, fitosanitarios, combustible o repuestos',
      icon: Receipt,
      iconColor: 'text-[#B06727]',
      iconBg: 'bg-[#FDF3E7]',
    },
    {
      id: 'labor',
      title: 'Registrar Labor Agrícola',
      subtitle: 'Siembra, pulverización, fertilización o cosecha',
      icon: Tractor,
      iconColor: 'text-[#2D6A4F]',
      iconBg: 'bg-[#EBF4EE]',
    },
    {
      id: 'cosecha',
      title: 'Registrar Cosecha o Venta',
      subtitle: 'Kilos recolectados, camión a silo o liquidación',
      icon: Wheat,
      iconColor: 'text-[#B88714]',
      iconBg: 'bg-[#FEF8E7]',
    },
    {
      id: 'movimiento_caja',
      title: 'Registrar Movimiento de Caja',
      subtitle: 'Cobros, transferencias o pagos a proveedores',
      icon: Coins,
      iconColor: 'text-[#266867]',
      iconBg: 'bg-[#EBF5F5]',
    },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#1E2922]">
            Registrar Operación
          </h1>
          <p className="text-xs text-[#6B7C72]">
            Ingreso rápido de movimientos para el campo
          </p>
        </div>

        <span className="text-[11px] font-semibold text-[#7A6B53] bg-[#F7F3EB] px-2.5 py-1 rounded-lg border border-[#E9DFCE] inline-flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#A87E43]" />
          Bloqueo preventivo
        </span>
      </div>

      {/* Tarjeta de estado seguro */}
      <div className="bg-[#FAF7F2] border border-[#EBE2D5] rounded-2xl p-4 flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-white border border-[#DECDB8] text-[#9E6E2D] flex items-center justify-center shrink-0 mt-0.5">
          <Lock className="w-4 h-4" />
        </div>
        <div className="text-xs">
          <p className="font-bold text-[#2E2416]">
            Formularios de carga bloqueados temporalmente
          </p>
          <p className="text-[#5C4D38] mt-0.5 leading-relaxed">
            Para garantizar que ninguna operación se pierda o guarde en una base temporal, los formularios de registro se activarán una vez desplegado el endpoint de Cloudflare Workers conectado a su Google Sheet.
          </p>
        </div>
      </div>

      {/* Botones de registro grandes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {registerOptions.map((opt) => {
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              onClick={() =>
                onOpenLockedModal(
                  opt.title,
                  `La carga de "${opt.title}" se comunicará directamente con su planilla de Google Sheets a través de Cloudflare Workers.`
                )
              }
              className="group flex items-center justify-between p-4 bg-white border border-[#E2E8E0] hover:border-[#2D6A4F]/40 rounded-2xl shadow-xs transition-all text-left cursor-pointer active:scale-[0.98]"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-12 h-12 rounded-xl ${opt.iconBg} ${opt.iconColor} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}
                >
                  <Icon className="w-6 h-6" />
                </div>
                <div className="min-w-0 pr-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-[#1E2922] group-hover:text-[#2D6A4F] transition-colors truncate">
                      {opt.title}
                    </span>
                  </div>
                  <p className="text-xs text-[#6B7C72] truncate max-w-[210px]">
                    {opt.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[#9CAEA2] group-hover:text-[#2D6A4F] transition-colors shrink-0">
                <Lock className="w-4 h-4 text-[#C29D6E]" />
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-[#F8FAF7] border border-[#E2E8E0] rounded-2xl p-4 flex items-center gap-3 text-xs text-[#55695C]">
        <ShieldCheck className="w-5 h-5 text-[#2D6A4F] shrink-0" />
        <p>
          No se utilizará almacenamiento en caché no volátil para evitar discordancias contables con su equipo de trabajo.
        </p>
      </div>
    </div>
  );
};
