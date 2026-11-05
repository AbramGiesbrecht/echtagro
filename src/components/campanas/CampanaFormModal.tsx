import React, { useState, useEffect } from 'react';
import {
  X,
  CalendarDays,
  Sun,
  Snowflake,
  CheckCircle2,
  Lock,
  Layers,
  Sprout,
  Plus,
  AlertCircle
} from 'lucide-react';
import { Campana, Lote, LoteCampana, CULTIVOS_COMUNES } from '../../types/agri';

interface CampanaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCampana?: Campana | null;
  disponiblesLotes: Lote[];
  onOpenLockedModal: (title: string, desc: string) => void;
  onSaveCampana?: (campana: Campana) => void;
}

export const CampanaFormModal: React.FC<CampanaFormModalProps> = ({
  isOpen,
  onClose,
  initialCampana,
  disponiblesLotes,
  onOpenLockedModal,
  onSaveCampana,
}) => {
  const isEditing = Boolean(initialCampana);

  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState<'Verano' | 'Invierno'>('Verano');
  const [anioCiclo, setAnioCiclo] = useState('2026/2027');
  const [esActiva, setEsActiva] = useState(true);
  const [lotesParticipantes, setLotesParticipantes] = useState<LoteCampana[]>([]);

  useEffect(() => {
    if (initialCampana) {
      setNombre(initialCampana.nombre);
      setTipo(initialCampana.tipo);
      setAnioCiclo(initialCampana.anioCiclo);
      setEsActiva(initialCampana.estado === 'activa');
      setLotesParticipantes(initialCampana.lotesParticipantes || []);
    } else {
      setNombre(`Verano ${new Date().getFullYear()}/${new Date().getFullYear() + 1}`);
      setTipo('Verano');
      setAnioCiclo(`${new Date().getFullYear()}/${new Date().getFullYear() + 1}`);
      setEsActiva(true);
      setLotesParticipantes([]);
    }
  }, [initialCampana, isOpen]);

  if (!isOpen) return null;

  // Hectáreas totales calculadas sin duplicar
  const totalHectareasCampana = lotesParticipantes.reduce(
    (acc, curr) => acc + (Number(curr.superficieUtilizadaHa) || 0),
    0
  );

  const handleToggleLote = (lote: Lote) => {
    const exists = lotesParticipantes.some((lp) => lp.loteId === lote.id);
    if (exists) {
      setLotesParticipantes(lotesParticipantes.filter((lp) => lp.loteId !== lote.id));
    } else {
      // Agrega el lote con su superficie completa por defecto y su primer cultivo
      const nuevo: LoteCampana = {
        loteId: lote.id,
        loteNombre: lote.nombre,
        superficieUtilizadaHa: lote.superficieTotalHa,
        cultivo: tipo === 'Verano' ? 'Soja' : 'Trigo',
        // Clona los propietarios actuales para congelar el snapshot de esta campaña
        propietarios: JSON.parse(JSON.stringify(lote.propietarios || [])),
      };
      setLotesParticipantes([...lotesParticipantes, nuevo]);
    }
  };

  const handleUpdateLoteParticipante = (
    loteId: string,
    field: 'superficieUtilizadaHa' | 'cultivo',
    val: string
  ) => {
    setLotesParticipantes(
      lotesParticipantes.map((lp) => {
        if (lp.loteId !== loteId) return lp;
        if (field === 'superficieUtilizadaHa') {
          const num = parseFloat(val);
          return { ...lp, superficieUtilizadaHa: isNaN(num) ? 0 : num };
        }
        return { ...lp, cultivo: val };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onOpenLockedModal(
      isEditing ? 'Edición de Campaña Bloqueada' : 'Creación de Campaña Bloqueada',
      `La campaña "${nombre}" (${totalHectareasCampana} ha, ${lotesParticipantes.length} lotes) está lista. La confirmación definitiva se sincronizará con la pestaña "Campañas" de Google Sheets mediante Cloudflare Workers.`
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl border border-[#E2E8E0] my-6 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Cabecera */}
        <div className="p-4 sm:p-5 border-b border-[#EAEFEA] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0F7ED] text-[#3B7A57] flex items-center justify-center shrink-0">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E2922]">
                {isEditing ? 'Editar Campaña Agrícola' : 'Nueva Campaña Agrícola'}
              </h2>
              <p className="text-xs text-[#6B7C72]">
                Asignación de lotes, cultivos y hectáreas
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#7A8A80] hover:text-[#1E2922] rounded-full hover:bg-[#F0F4F1] transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Tipo de Campaña: Verano o Invierno */}
          <div>
            <label className="block text-xs font-semibold text-[#3A4D41] mb-1.5">
              Tipo de temporada *
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setTipo('Verano');
                  if (!isEditing) setNombre(`Verano ${anioCiclo}`);
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  tipo === 'Verano'
                    ? 'bg-[#FEF8E7] border-[#E9C46A] text-[#B88714] shadow-xs'
                    : 'bg-[#F8FAF7] border-[#D5E0D7] text-[#6B7C72] hover:bg-white'
                }`}
              >
                <Sun className="w-4 h-4" />
                <span>Campaña Verano</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTipo('Invierno');
                  if (!isEditing) setNombre(`Invierno ${anioCiclo.split('/')[0]}`);
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  tipo === 'Invierno'
                    ? 'bg-[#EBF5F5] border-[#A2D2D2] text-[#266867] shadow-xs'
                    : 'bg-[#F8FAF7] border-[#D5E0D7] text-[#6B7C72] hover:bg-white'
                }`}
              >
                <Snowflake className="w-4 h-4" />
                <span>Campaña Invierno</span>
              </button>
            </div>
          </div>

          {/* Nombre y Ciclo */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#3A4D41] mb-1">
                Nombre de la campaña *
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="ej: Verano 2026/27, Maíz Tardío"
                className="w-full h-11 px-3 rounded-xl bg-[#F8FAF7] border border-[#D5E0D7] focus:border-[#2D6A4F] focus:bg-white text-sm text-[#1E2922] outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3A4D41] mb-1">
                Ciclo / Años *
              </label>
              <input
                type="text"
                required
                value={anioCiclo}
                onChange={(e) => setAnioCiclo(e.target.value)}
                placeholder="ej: 2026/2027"
                className="w-full h-11 px-3 rounded-xl bg-[#F8FAF7] border border-[#D5E0D7] focus:border-[#2D6A4F] focus:bg-white text-sm text-[#1E2922] outline-hidden font-mono font-medium"
              />
            </div>
          </div>

          {/* Estado de Campaña: Solo una activa a la vez */}
          <div className="p-3.5 rounded-2xl bg-[#F8FAF7] border border-[#DCE4DD] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#1E2922] block">
                Campaña Activa
              </span>
              <p className="text-[11px] text-[#6B7C72]">
                Solo puede haber una campaña activa a la vez.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={esActiva}
                onChange={(e) => setEsActiva(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D6A4F]"></div>
            </label>
          </div>

          {/* Selección de Lotes Participantes */}
          <div className="pt-2 border-t border-[#EAEFEA] space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#20382B] uppercase tracking-wider">
                  Lotes Participantes ({lotesParticipantes.length})
                </span>
                <p className="text-[11px] text-[#6B7C72]">
                  Selecciona los lotes y define su cultivo y hectáreas
                </p>
              </div>

              <div className="text-xs font-mono font-bold text-[#2D6A4F] bg-[#EBF4EE] px-2.5 py-1 rounded-lg">
                Total: {totalHectareasCampana.toLocaleString()} ha
              </div>
            </div>

            {disponiblesLotes.length === 0 ? (
              <div className="p-4 rounded-xl bg-[#FAFAFA] border border-dashed border-[#D2DCD4] text-center text-xs text-[#6B7C72] space-y-1">
                <p className="font-semibold text-[#20382B]">
                  No hay lotes registrados para seleccionar
                </p>
                <p className="text-[11px]">
                  Primero registra lotes en el módulo Lotes para asociarlos a esta campaña.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {disponiblesLotes.map((lote) => {
                  const seleccionado = lotesParticipantes.find(
                    (lp) => lp.loteId === lote.id
                  );

                  return (
                    <div
                      key={lote.id}
                      className={`p-3 rounded-2xl border transition-all ${
                        seleccionado
                          ? 'bg-white border-[#2D6A4F]/60 shadow-xs'
                          : 'bg-[#F8FAF7] border-[#DCE4DD]'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Boolean(seleccionado)}
                            onChange={() => handleToggleLote(lote)}
                            className="w-4 h-4 rounded text-[#2D6A4F] focus:ring-[#2D6A4F] accent-[#2D6A4F]"
                          />
                          <span className="text-sm font-bold text-[#1E2922]">
                            {lote.nombre}
                          </span>
                        </label>
                        <span className="text-xs text-[#6B7C72] font-mono">
                          Lote total: {lote.superficieTotalHa} ha
                        </span>
                      </div>

                      {/* Configuración de Cultivo y Hectáreas si está seleccionado */}
                      {seleccionado && (
                        <div className="mt-3 pt-2.5 border-t border-[#EAEFEA] grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] font-bold text-[#55695C] uppercase mb-1">
                              Cultivo
                            </label>
                            <select
                              value={seleccionado.cultivo}
                              onChange={(e) =>
                                handleUpdateLoteParticipante(
                                  lote.id,
                                  'cultivo',
                                  e.target.value
                                )
                              }
                              className="w-full h-9 px-2 rounded-lg bg-[#F8FAF7] border border-[#D5E0D7] text-xs font-semibold text-[#1E2922] outline-hidden"
                            >
                              {CULTIVOS_COMUNES.map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-[10px] font-bold text-[#55695C] uppercase mb-1">
                              Hectáreas en campaña
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                step="0.01"
                                max={lote.superficieTotalHa}
                                min="0.1"
                                value={seleccionado.superficieUtilizadaHa}
                                onChange={(e) =>
                                  handleUpdateLoteParticipante(
                                    lote.id,
                                    'superficieUtilizadaHa',
                                    e.target.value
                                  )
                                }
                                className="w-full h-9 pl-2 pr-7 rounded-lg bg-[#F8FAF7] border border-[#D5E0D7] text-xs font-mono font-bold text-[#1E2922] outline-hidden text-right"
                              />
                              <span className="absolute right-2 top-2 text-[10px] text-[#7A8A80]">
                                ha
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Botón de Guardado Bloqueado */}
          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-[0.99]"
            >
              <Lock className="w-4 h-4 text-white/80" />
              <span>
                {isEditing ? 'Guardar Cambios de Campaña' : 'Crear Campaña'} (Bloqueado)
              </span>
            </button>
            <p className="text-[11px] text-center text-[#7A8A80] mt-1.5">
              Escritura inactiva hasta habilitar la conexión con Google Sheets.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
