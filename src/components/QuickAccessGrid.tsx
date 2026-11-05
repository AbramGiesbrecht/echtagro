import React from 'react';
import {
  Layers,
  CalendarDays,
  Receipt,
  Wheat,
  Wallet,
  BarChart3,
} from 'lucide-react';

export type MainSectionId =
  | 'lotes'
  | 'campanas'
  | 'gastos'
  | 'cosechas'
  | 'caja'
  | 'reportes';

interface QuickAccessGridProps {
  onSelectSection: (sectionId: MainSectionId) => void;
}

interface AccessItem {
  id: MainSectionId;
  title: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
}

const accessItems: AccessItem[] = [
  {
    id: 'lotes',
    title: 'Lotes',
    icon: Layers,
    iconBg: 'bg-[#EBF4EE]',
    iconColor: 'text-[#2D6A4F]',
  },
  {
    id: 'campanas',
    title: 'Campañas',
    icon: CalendarDays,
    iconBg: 'bg-[#F0F7ED]',
    iconColor: 'text-[#3B7A57]',
  },
  {
    id: 'gastos',
    title: 'Gastos y compras',
    icon: Receipt,
    iconBg: 'bg-[#FDF3E7]',
    iconColor: 'text-[#B06727]',
  },
  {
    id: 'cosechas',
    title: 'Cosechas y ventas',
    icon: Wheat,
    iconBg: 'bg-[#FEF8E7]',
    iconColor: 'text-[#B88714]',
  },
  {
    id: 'caja',
    title: 'Caja',
    icon: Wallet,
    iconBg: 'bg-[#EBF5F5]',
    iconColor: 'text-[#266867]',
  },
  {
    id: 'reportes',
    title: 'Reportes',
    icon: BarChart3,
    iconBg: 'bg-[#EEF2E6]',
    iconColor: 'text-[#506A3F]',
  },
];

export const QuickAccessGrid: React.FC<QuickAccessGridProps> = ({
  onSelectSection,
}) => {
  return (
    <section className="w-full">
      {/* 6 accesos principales organizados en 2 columnas para celulares */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {accessItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onSelectSection(item.id)}
              className="group flex flex-col items-center justify-center p-4 sm:p-5 bg-white border border-[#E2E8E0] hover:border-[#2D6A4F]/40 rounded-2xl shadow-xs transition-all duration-150 text-center active:scale-[0.98] cursor-pointer min-h-[110px] focus-visible:outline-2 focus-visible:outline-[#2D6A4F]"
            >
              {/* Contenedor de Icono grande y reconocible */}
              <div
                className={`w-14 h-14 rounded-2xl ${item.iconBg} ${item.iconColor} flex items-center justify-center mb-2.5 transition-transform group-hover:scale-105`}
              >
                <IconComponent className="w-7 h-7 stroke-[2]" />
              </div>

              {/* Título conciso del acceso */}
              <span className="text-sm font-semibold text-[#1E2922] group-hover:text-[#2D6A4F] transition-colors line-clamp-2 leading-tight">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
