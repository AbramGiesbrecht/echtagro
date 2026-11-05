import React from 'react';
import { DollarSign, Layers } from 'lucide-react';

interface SummaryMetricsProps {
  // Importe calculado en USD/ha correspondiente a la campaña activa.
  // Regla: Si todavía no existen datos conectados, mostrar "— USD/ha", sin importes ficticios.
  accumulatedExpensesPerHa?: number | null;
  activeCampaignName?: string | null;
}

export const SummaryMetrics: React.FC<SummaryMetricsProps> = ({
  accumulatedExpensesPerHa = null,
  activeCampaignName = null,
}) => {
  const displayValue =
    accumulatedExpensesPerHa !== null
      ? `${accumulatedExpensesPerHa.toLocaleString('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} USD/ha`
      : '— USD/ha';

  return (
    <section className="w-full">
      {/* Indicador Único y Destacado: Gastos acumulados por hectárea */}
      <div className="bg-white border border-[#DCE4DD] rounded-2xl p-5 sm:p-6 shadow-xs relative overflow-hidden">
        {/* Fondo sutil y discreto */}
        <div className="flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EBF4EE] text-[#2D6A4F] text-xs font-semibold mb-2">
            <DollarSign className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Gastos acumulados por hectárea</span>
          </div>

          {/* Importe en USD/ha */}
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1B4332] font-mono tabular-nums my-1">
            {displayValue}
          </div>

          {/* Subtítulo de campaña activa a la fecha */}
          <div className="flex items-center gap-1.5 text-xs text-[#6B7C72] mt-1">
            <Layers className="w-3.5 h-3.5 text-[#52796F]" />
            <span>
              {activeCampaignName
                ? `Campaña: ${activeCampaignName}`
                : 'Campaña activa a la fecha'}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
