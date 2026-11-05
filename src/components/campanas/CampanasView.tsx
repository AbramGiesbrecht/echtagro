import React, { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  CalendarDays,
  Sun,
  Snowflake,
  RotateCcw,
  Layers,
  Sprout,
  Calculator,
  ShieldAlert,
  Edit2,
  CheckCircle2,
  Lock,
  Clock,
  Sparkles,
  DollarSign
} from 'lucide-react';
import { Campana, Lote } from '../../types/agri';
import { CampanaFormModal } from './CampanaFormModal';

interface CampanasViewProps {
  onBack: () => void;
  onOpenLockedModal: (title: string, desc: string) => void;
  disponiblesLotes: Lote[];
  activeCampaignName: string | null;
  onSetActiveCampaign: (name: string | null) => void;
}

export const CampanasView: React.FC<CampanasViewProps> = ({
  onBack,
  onOpenLockedModal,
  disponiblesLotes,
  activeCampaignName,
  onSetActiveCampaign,
}) => {
  // Sin inventar datos ficticios: las campañas vendrán de Google Sheets
  const [campanas, setCampanas] = useState<Campana[]>([]);
  const [activeSubTab, setActiveSubTab] = useState<'activa' | 'anteriores' | 'gastos_prep'>('activa');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCampana, setEditingCampana] = useState<Campana | null>(null);

  // Campaña actualmente activa
  const campanaActiva = campanas.find((c) => c.estado === 'activa') || null;
  const campanasAnteriores = campanas.filter((c) => c.estado === 'cerrada');

  const handleOpenNew = () => {
    setEditingCampana(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (camp: Campana) => {
    setEditingCampana(camp);
    setIsFormOpen(true);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Barra superior de navegación y estado */}
      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D8E2DC] text-xs font-semibold text-[#2D6A4F] hover:bg-[#F0F4F1] transition-colors shadow-xs cursor-pointer active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Inicio</span>
        </button>

        <span className="text-[11px] font-semibold text-[#7A6B53] bg-[#F7F3EB] px-2.5 py-1 rounded-lg border border-[#E9DFCE] inline-flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#A87E43]" />
          <span>Google Sheets</span>
        </span>
      </div>

      {/* Encabezado del Módulo de Campañas */}
      <div className="bg-white border border-[#E2E8E0] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#F0F7ED] text-[#3B7A57] flex items-center justify-center shrink-0">
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-[#1E2922]">
              Campañas Agrícolas
            </h1>
            <p className="text-xs text-[#6B7C72]">
              Ciclos productivos, cultivos asignados y distribución
            </p>
          </div>
        </div>

        {/* Botón Nueva Campaña */}
        <button
          onClick={handleOpenNew}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs font-bold shadow-xs transition-all active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Campaña</span>
        </button>
      </div>

      {/* Pestañas internas del módulo */}
      <div className="flex items-center gap-1 p-1 bg-white border border-[#E2E8E0] rounded-2xl shadow-xs">
        <button
          onClick={() => setActiveSubTab('activa')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'activa'
              ? 'bg-[#2D6A4F] text-white shadow-xs'
              : 'text-[#6B7C72] hover:text-[#1E2922]'
          }`}
        >
          Campaña Activa
        </button>
        <button
          onClick={() => setActiveSubTab('anteriores')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'anteriores'
              ? 'bg-[#2D6A4F] text-white shadow-xs'
              : 'text-[#6B7C72] hover:text-[#1E2922]'
          }`}
        >
          Campañas Anteriores
        </button>
        <button
          onClick={() => setActiveSubTab('gastos_prep')}
          className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
            activeSubTab === 'gastos_prep'
              ? 'bg-[#2D6A4F] text-white shadow-xs'
              : 'text-[#6B7C72] hover:text-[#1E2922]'
          }`}
        >
          Prep. Gastos
        </button>
      </div>

      {/* VISTA 1: CAMPAÑA ACTIVA */}
      {activeSubTab === 'activa' && (
        <div className="space-y-3">
          {!campanaActiva ? (
            <div className="bg-white border border-[#E2E8E0] rounded-2xl p-6 sm:p-8 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-[#F0F7ED] text-[#3B7A57] flex items-center justify-center mx-auto">
                <CalendarDays className="w-6 h-6 stroke-[1.8]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[#1E2922]">
                  Sin campaña activa seleccionada
                </h2>
                <p className="text-xs text-[#6B7C72] max-w-md mx-auto mt-1 leading-relaxed">
                  Las campañas se mantendrán sincronizadas en la hoja <span className="font-semibold text-[#2D6A4F]">Campañas</span> de Google Sheets. Solo puede haber una campaña activa a la vez para consolidar el indicador de USD/ha.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2">
                <button
                  onClick={handleOpenNew}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#2D6A4F] text-white text-xs font-bold hover:bg-[#1B4332] transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear primera campaña</span>
                </button>
              </div>

              <div className="mt-4 pt-3 border-t border-[#EAEFEA] text-[11px] text-[#7A8A80] flex items-center justify-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-[#B07238]" />
                <span>
                  Las campañas conservarán sus propias hectáreas y cultivos congelados.
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-[#E2E8E0] rounded-2xl p-5 shadow-xs space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D6A4F] bg-[#EBF4EE] px-2 py-0.5 rounded-md">
                      Campaña Activa
                    </span>
                    <span className="text-xs font-medium text-[#6B7C72]">
                      Ciclo {campanaActiva.anioCiclo}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-[#1E2922] mt-1">
                    {campanaActiva.nombre}
                  </h2>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(campanaActiva)}
                    className="p-2 rounded-xl bg-[#F8FAF7] border border-[#D5E0D7] hover:bg-[#EBF4EE] text-[#4A5D52] transition-colors"
                    title="Editar campaña"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lotes Participantes en esta campaña */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-[#3A4D41] uppercase tracking-wider block">
                  Lotes y Cultivos Asignados ({campanaActiva.lotesParticipantes.length})
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {campanaActiva.lotesParticipantes.map((lp, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-[#F8FAF7] border border-[#DCE4DD] flex items-center justify-between"
                    >
                      <div>
                        <span className="text-sm font-bold text-[#1E2922] block">
                          {lp.loteNombre}
                        </span>
                        <span className="text-xs text-[#2D6A4F] font-semibold">
                          Cultivo: {lp.cultivo}
                        </span>
                      </div>
                      <span className="text-sm font-mono font-bold text-[#1E2922]">
                        {lp.superficieUtilizadaHa} ha
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Botón para cerrar campaña */}
              <div className="pt-2 border-t border-[#EAEFEA] flex justify-end">
                <button
                  onClick={() =>
                    onOpenLockedModal(
                      'Cierre de Campaña Bloqueado',
                      'El cierre formal de campaña para transferirla al historial requiere conexión activa con Google Sheets.'
                    )
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF0E6] border border-[#E9D5C3] text-xs font-semibold text-[#8C5824] hover:bg-[#F5E5D3] transition-colors cursor-pointer"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>Cerrar campaña actual</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* VISTA 2: CAMPAÑAS ANTERIORES / HISTORIAL */}
      {activeSubTab === 'anteriores' && (
        <div className="space-y-3">
          {campanasAnteriores.length === 0 ? (
            <div className="bg-white border border-[#E2E8E0] rounded-2xl p-6 text-center space-y-2 shadow-xs">
              <CalendarDays className="w-10 h-10 text-[#7A8A80] mx-auto stroke-[1.8]" />
              <h2 className="text-sm font-bold text-[#1E2922]">
                Sin campañas anteriores archivadas
              </h2>
              <p className="text-xs text-[#6B7C72] max-w-sm mx-auto">
                Cuando una campaña finalice, se archivará aquí conservando sus hectáreas y cultivos congelados para consultas históricas.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {campanasAnteriores.map((camp) => (
                <div
                  key={camp.id}
                  className="bg-white border border-[#E2E8E0] rounded-2xl p-4 shadow-xs flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#1E2922]">
                        {camp.nombre}
                      </span>
                      <span className="text-[10px] font-semibold text-[#6B7C72] bg-[#F0F4F1] px-2 py-0.5 rounded-md">
                        Cerrada
                      </span>
                    </div>
                    <p className="text-xs text-[#6B7C72] mt-0.5">
                      {camp.lotesParticipantes.length} lotes · Ciclo {camp.anioCiclo}
                    </p>
                  </div>

                  {/* Botón Reabrir Campaña */}
                  <button
                    onClick={() =>
                      onOpenLockedModal(
                        'Reapertura de Campaña Bloqueada',
                        `La reapertura de la campaña "${camp.nombre}" para realizar correcciones históricas se sincronizará con Google Sheets una vez habilitado el backend.`
                      )
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D5E0D7] hover:bg-[#F4F7F4] text-xs font-semibold text-[#2D6A4F] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reabrir</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VISTA 3: PREPARACIÓN PARA LOS GASTOS Y DISTRIBUCIÓN MULTILOTE */}
      {activeSubTab === 'gastos_prep' && (
        <div className="bg-white border border-[#E2E8E0] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF3E7] text-[#B06727] flex items-center justify-center shrink-0">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-[#1E2922]">
                Preparación: Distribución de Gastos por Lote
              </h2>
              <p className="text-xs text-[#6B7C72]">
                Asignación por hectárea sin duplicar importes
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#F8FAF7] border border-[#DCE4DD] text-xs space-y-2 text-[#405246] leading-relaxed">
            <p className="font-bold text-[#1B4332]">
              Fórmula de imputación rigurosa:
            </p>
            <div className="p-3 rounded-lg bg-white border border-[#D2DCD4] font-mono text-[11px] text-[#1E2922]">
              Costo Unitario (USD/ha) = Importe Total del Gasto (USD) ÷ Sumatoria de Hectáreas de los Lotes Imputados
            </div>
            <ul className="space-y-1 list-disc list-inside text-[#55695C] text-[11px]">
              <li>
                <strong>Cero duplicación:</strong> Si un comprobante de semillas o agroquímicos de $5,000 USD se aplica a dos lotes de 50 ha (100 ha totales), cada lote recibe exactamente $2,500 USD ($50 USD/ha).
              </li>
              <li>
                <strong>Hectáreas de campaña:</strong> Se computan las hectáreas trabajadas de cada lote en esa campaña, evitando contar dos veces la misma superficie.
              </li>
              <li>
                <strong>Conversión de moneda:</strong> Importes en Bs se convertirán a USD usando el tipo de cambio oficial del día de cada movimiento.
              </li>
            </ul>
          </div>

          <div className="pt-1 flex items-center justify-between text-xs text-[#7A8A80]">
            <span>Módulo preparado para vincular con la pestaña de Gastos</span>
            <span className="font-semibold text-[#2D6A4F]">Fase 2 de Backend</span>
          </div>
        </div>
      )}

      {/* Modal Formulario de Campaña */}
      <CampanaFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        initialCampana={editingCampana}
        disponiblesLotes={disponiblesLotes}
        onOpenLockedModal={onOpenLockedModal}
      />
    </div>
  );
};
