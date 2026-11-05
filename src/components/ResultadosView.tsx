import React from 'react';
import {
  BarChart2,
  Scale,
  TrendingUp,
  TrendingDown,
  ClockAlert,
  FileSpreadsheet,
  Lock,
  ArrowUpRight
} from 'lucide-react';

interface ResultadosViewProps {
  onOpenLockedModal: (title: string, desc: string) => void;
  onOpenBackendInfo: () => void;
}

export const ResultadosView: React.FC<ResultadosViewProps> = ({
  onOpenLockedModal,
  onOpenBackendInfo,
}) => {
  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-[#1E2922]">
            Resultados Económicos
          </h1>
          <p className="text-xs text-[#6B7C72]">
            Márgenes y balance consolidado del ciclo
          </p>
        </div>

        <span className="text-[11px] font-semibold text-[#7A6B53] bg-[#F7F3EB] px-2.5 py-1 rounded-lg border border-[#E9DFCE] inline-flex items-center gap-1.5">
          <Lock className="w-3.5 h-3.5 text-[#A87E43]" />
          Datos pendientes
        </span>
      </div>

      {/* Métricas Consolidadas - Estado Vacío */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white border border-[#E2E8E0] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#4A5D52]">Resultado</span>
            <Scale className="w-4 h-4 text-[#2D6A4F]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#1E2922] tabular-nums">
            —
          </div>
          <p className="text-[11px] text-[#7A8A80] mt-0.5">Sin datos</p>
        </div>

        <div className="bg-white border border-[#E2E8E0] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#4A5D52]">Ingresos</span>
            <TrendingUp className="w-4 h-4 text-[#1E7E34]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#1E2922] tabular-nums">
            —
          </div>
          <p className="text-[11px] text-[#7A8A80] mt-0.5">Sin ventas</p>
        </div>

        <div className="bg-white border border-[#E2E8E0] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#4A5D52]">Gastos</span>
            <TrendingDown className="w-4 h-4 text-[#C62828]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#1E2922] tabular-nums">
            —
          </div>
          <p className="text-[11px] text-[#7A8A80] mt-0.5">Sin egresos</p>
        </div>

        <div className="bg-white border border-[#E2E8E0] rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#4A5D52]">Deudas</span>
            <ClockAlert className="w-4 h-4 text-[#B78103]" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-[#1E2922] tabular-nums">
            —
          </div>
          <p className="text-[11px] text-[#7A8A80] mt-0.5">Sin deudas</p>
        </div>
      </div>

      {/* Panel Explicativo de Integridad de Datos */}
      <div className="bg-white border border-[#E2E8E0] rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#EBF4EE] text-[#2D6A4F] flex items-center justify-center shrink-0">
            <BarChart2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#1E2922]">
              Cálculo de márgenes en tiempo real
            </h2>
            <p className="text-xs text-[#6B7C72]">
              Sincronización directa con fórmulas oficiales
            </p>
          </div>
        </div>

        <p className="text-xs text-[#405246] leading-relaxed">
          Esta vista consolidará automáticamente los márgenes brutos por cultivo, costo por hectárea y resultado neto de cada campaña. Para garantizar rigurosidad agrícola, no se proyectan números ficticios hasta que la planilla de Google Sheets esté conectada.
        </p>

        <div className="pt-2 flex flex-wrap gap-2">
          <button
            onClick={onOpenBackendInfo}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F4F7F4] hover:bg-[#EBF1EB] text-xs font-semibold text-[#2D6A4F] transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Ver arquitectura de sincronización
          </button>
          <button
            onClick={() =>
              onOpenLockedModal(
                'Exportación Bloqueada',
                'La descarga de reportes contables se activará una vez que los datos reales de la campaña estén sincronizados.'
              )
            }
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#D8E2DC] text-xs font-semibold text-[#4A5D52] hover:bg-[#F8FAF7] transition-colors cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4" />
            Exportar reporte (Bloqueado)
          </button>
        </div>
      </div>
    </div>
  );
};
