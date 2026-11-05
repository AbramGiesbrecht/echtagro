import React from 'react';
import { EchtAgroLogo } from './EchtAgroLogo';
import { Sprout, ChevronDown } from 'lucide-react';

interface HeaderProps {
  activeCampaignName: string | null;
  onOpenCampaignModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCampaignName,
  onOpenCampaignModal,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#F8FAF7]/95 backdrop-blur-md border-b border-[#E2E8E0] px-4 py-3 sm:px-6">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Logo echtagro: Solo texto temporal según especificación */}
        <div className="flex items-center">
          <EchtAgroLogo size="md" />
        </div>

        {/* Campaña activa siempre visible arriba */}
        <button
          onClick={onOpenCampaignModal}
          className="group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#D8E2DC] hover:border-[#2D6A4F]/40 shadow-xs text-left transition-all active:scale-[0.98] cursor-pointer"
          title="Ver o seleccionar campaña activa"
        >
          <div className="w-6 h-6 rounded-lg bg-[#EBF4EE] flex items-center justify-center text-[#2D6A4F] shrink-0">
            <Sprout className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col min-w-0 pr-0.5">
            <span className="text-[10px] font-medium text-[#6B7C72] uppercase tracking-wider leading-none">
              Campaña
            </span>
            <span className="text-xs font-semibold text-[#1E2922] truncate max-w-[140px] sm:max-w-[220px] mt-0.5 leading-tight">
              {activeCampaignName || 'Sin campaña activa'}
            </span>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-[#6B7C72] group-hover:text-[#2D6A4F] transition-colors shrink-0" />
        </button>
      </div>
    </header>
  );
};
