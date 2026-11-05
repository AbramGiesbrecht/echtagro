import React from 'react';
import { Home, CirclePlus, BarChart2, Sliders } from 'lucide-react';

export type NavTabId = 'inicio' | 'registrar' | 'resultados' | 'administrar';

interface BottomNavProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
}

interface TabItem {
  id: NavTabId;
  label: string;
  icon: React.ElementType;
}

const tabs: TabItem[] = [
  { id: 'inicio', label: 'Inicio', icon: Home },
  { id: 'registrar', label: 'Registrar', icon: CirclePlus },
  { id: 'resultados', label: 'Resultados', icon: BarChart2 },
  { id: 'administrar', label: 'Administrar', icon: Sliders },
];

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
}) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8E0] shadow-sm pb-safe"
      aria-label="Navegación principal inferior"
    >
      <div className="max-w-md md:max-w-xl mx-auto px-2">
        <div className="grid grid-cols-4 items-center h-16">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isSpecialAction = tab.id === 'registrar';

            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex flex-col items-center justify-center h-full min-h-[48px] py-1 transition-colors relative group focus-visible:outline-hidden ${
                  isActive
                    ? 'text-[#2D6A4F]'
                    : 'text-[#6B7C72] hover:text-[#1E2922]'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                {/* Indicador visual activo superior discreto */}
                {isActive && (
                  <span className="absolute top-0 w-8 h-0.5 bg-[#2D6A4F] rounded-full" />
                )}

                <div
                  className={`relative flex items-center justify-center transition-transform ${
                    isSpecialAction && !isActive
                      ? 'group-hover:scale-105'
                      : ''
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform ${
                      isActive ? 'stroke-[2.4px] scale-105' : 'stroke-[1.8px]'
                    }`}
                  />
                </div>

                <span
                  className={`text-[11px] mt-1 tracking-tight transition-all truncate max-w-[70px] ${
                    isActive ? 'font-bold text-[#1B4332]' : 'font-medium'
                  }`}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
