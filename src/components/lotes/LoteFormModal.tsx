import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Percent,
  Layers,
  MapPin,
  HelpCircle,
} from 'lucide-react';
import { Lote, Propietario } from '../../types/agri';

interface LoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLote?: Lote | null;
  onOpenLockedModal: (title: string, desc: string) => void;
}

export const LoteFormModal: React.FC<LoteFormModalProps> = ({
  isOpen,
  onClose,
  initialLote,
  onOpenLockedModal,
}) => {
  const isEditing = Boolean(initialLote);

  const [nombre, setNombre] = useState('');
  const [superficieHa, setSuperficieHa] = useState<string>('');
  const [ubicacion, setUbicacion] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [propietarios, setPropietarios] = useState<Propietario[]>([
    { id: '1', nombre: '', porcentaje: 100 },
  ]);

  useEffect(() => {
    if (initialLote) {
      setNombre(initialLote.nombre);
      setSuperficieHa(initialLote.superficieTotalHa.toString());
      setUbicacion(initialLote.ubicacion || '');
      setObservaciones(initialLote.observaciones || '');
      setPropietarios(
        initialLote.propietarios.length > 0
          ? initialLote.propietarios
          : [{ id: '1', nombre: '', porcentaje: 100 }]
      );
    } else {
      setNombre('');
      setSuperficieHa('');
      setUbicacion('');
      setObservaciones('');
      setPropietarios([{ id: '1', nombre: '', porcentaje: 100 }]);
    }
  }, [initialLote, isOpen]);

  if (!isOpen) return null;

  // Cálculo de la suma total de porcentajes
  const totalPorcentaje = propietarios.reduce(
    (acc, curr) => acc + (Number(curr.porcentaje) || 0),
    0
  );
  // Redondeo a 2 decimales para evitar problemas de precisión flotante
  const totalRedondeado = Math.round(totalPorcentaje * 100) / 100;
  const esValido100 = Math.abs(totalRedondeado - 100) < 0.01;

  const handleAddPropietario = () => {
    const restante = Math.max(0, 100 - totalRedondeado);
    setPropietarios([
      ...propietarios,
      {
        id: Date.now().toString(),
        nombre: '',
        porcentaje: restante,
      },
    ]);
  };

  const handleRemovePropietario = (index: number) => {
    if (propietarios.length <= 1) return;
    const nuevo = propietarios.filter((_, i) => i !== index);
    setPropietarios(nuevo);
  };

  const handleUpdatePropietario = (
    index: number,
    field: 'nombre' | 'porcentaje',
    val: string
  ) => {
    const updated = [...propietarios];
    if (field === 'porcentaje') {
      const num = parseFloat(val);
      updated[index].porcentaje = isNaN(num) ? 0 : num;
    } else {
      updated[index].nombre = val;
    }
    setPropietarios(updated);
  };

  // Atajos rápidos de porcentajes de propiedad
  const aplicarDistribucionRapida = (tipo: '100' | '50-50' | '60-40' | '70-30') => {
    if (tipo === '100') {
      setPropietarios([
        {
          id: '1',
          nombre: propietarios[0]?.nombre || '',
          porcentaje: 100,
        },
      ]);
    } else if (tipo === '50-50') {
      setPropietarios([
        { id: '1', nombre: propietarios[0]?.nombre || '', porcentaje: 50 },
        { id: '2', nombre: propietarios[1]?.nombre || '', porcentaje: 50 },
      ]);
    } else if (tipo === '60-40') {
      setPropietarios([
        { id: '1', nombre: propietarios[0]?.nombre || '', porcentaje: 60 },
        { id: '2', nombre: propietarios[1]?.nombre || '', porcentaje: 40 },
      ]);
    } else if (tipo === '70-30') {
      setPropietarios([
        { id: '1', nombre: propietarios[0]?.nombre || '', porcentaje: 70 },
        { id: '2', nombre: propietarios[1]?.nombre || '', porcentaje: 30 },
      ]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!esValido100) {
      return;
    }
    onOpenLockedModal(
      isEditing ? 'Edición de Lote Bloqueada' : 'Guardado de Lote Bloqueado',
      `Los datos del lote "${nombre || 'Sin nombre'}" (${superficieHa || '0'} ha) están validados correctamente en el formulario. La escritura persistente se realizará directamente en la hoja "Lotes" de Google Sheets cuando el Worker de Cloudflare esté activo.`
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs overflow-y-auto"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-xl border border-[#E2E8E0] my-6 flex flex-col max-h-[92vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Cabecera del formulario */}
        <div className="p-4 sm:p-5 border-b border-[#EAEFEA] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#EBF4EE] text-[#2D6A4F] flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#1E2922]">
                {isEditing ? 'Editar Lote' : 'Agregar Nuevo Lote'}
              </h2>
              <p className="text-xs text-[#6B7C72]">
                Datos catastrales y distribución de propiedad
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

        {/* Cuerpo del formulario con scroll interno seguro */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Nombre y Superficie */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#3A4D41] mb-1">
                Nombre o número del lote *
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="ej: Lote 1, Bajo Norte, La Loma"
                className="w-full h-11 px-3 rounded-xl bg-[#F8FAF7] border border-[#D5E0D7] focus:border-[#2D6A4F] focus:bg-white text-sm text-[#1E2922] transition-colors outline-hidden font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3A4D41] mb-1">
                Superficie total (Hectáreas) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  required
                  value={superficieHa}
                  onChange={(e) => setSuperficieHa(e.target.value)}
                  placeholder="ej: 50.00"
                  className="w-full h-11 pl-3 pr-10 rounded-xl bg-[#F8FAF7] border border-[#D5E0D7] focus:border-[#2D6A4F] focus:bg-white text-sm text-[#1E2922] transition-colors outline-hidden font-mono font-medium"
                />
                <span className="absolute right-3 top-3 text-xs font-bold text-[#7A8A80] pointer-events-none">
                  ha
                </span>
              </div>
            </div>
          </div>

          {/* Ubicación / Referencia */}
          <div>
            <label className="block text-xs font-semibold text-[#3A4D41] mb-1">
              Ubicación o referencia (opcional)
            </label>
            <div className="relative">
              <input
                type="text"
                value={ubicacion}
                onChange={(e) => setUbicacion(e.target.value)}
                placeholder="ej: Parcela 4B - Ruta 9 Km 210"
                className="w-full h-10 pl-9 pr-3 rounded-xl bg-[#F8FAF7] border border-[#D5E0D7] focus:border-[#2D6A4F] focus:bg-white text-xs text-[#1E2922] transition-colors outline-hidden"
              />
              <MapPin className="w-4 h-4 text-[#7A8A80] absolute left-3 top-3 pointer-events-none" />
            </div>
          </div>

          {/* Sección de Propietarios y Porcentajes */}
          <div className="pt-2 border-t border-[#EAEFEA] space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#20382B] uppercase tracking-wider">
                  Propietarios y Porcentajes
                </span>
                <p className="text-[11px] text-[#6B7C72]">
                  La suma total debe ser exactamente 100%
                </p>
              </div>

              {/* Botón Añadir Propietario */}
              <button
                type="button"
                onClick={handleAddPropietario}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EBF4EE] hover:bg-[#D8ECD8] text-[#2D6A4F] text-xs font-semibold transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar</span>
              </button>
            </div>

            {/* Atajos Rápidos */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] font-medium text-[#7A8A80] mr-1">Atajos:</span>
              <button
                type="button"
                onClick={() => aplicarDistribucionRapida('100')}
                className="px-2 py-0.5 rounded-md bg-[#F0F4F1] hover:bg-[#E5ECE7] text-[11px] font-semibold text-[#3A4D41] transition-colors"
              >
                100% único
              </button>
              <button
                type="button"
                onClick={() => aplicarDistribucionRapida('50-50')}
                className="px-2 py-0.5 rounded-md bg-[#F0F4F1] hover:bg-[#E5ECE7] text-[11px] font-semibold text-[#3A4D41] transition-colors"
              >
                50 / 50
              </button>
              <button
                type="button"
                onClick={() => aplicarDistribucionRapida('60-40')}
                className="px-2 py-0.5 rounded-md bg-[#F0F4F1] hover:bg-[#E5ECE7] text-[11px] font-semibold text-[#3A4D41] transition-colors"
              >
                60 / 40
              </button>
              <button
                type="button"
                onClick={() => aplicarDistribucionRapida('70-30')}
                className="px-2 py-0.5 rounded-md bg-[#F0F4F1] hover:bg-[#E5ECE7] text-[11px] font-semibold text-[#3A4D41] transition-colors"
              >
                70 / 30
              </button>
            </div>

            {/* Lista de Filas de Propietarios */}
            <div className="space-y-2">
              {propietarios.map((prop, idx) => (
                <div
                  key={prop.id || idx}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-[#F8FAF7] border border-[#DCE4DD]"
                >
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      required
                      value={prop.nombre}
                      onChange={(e) =>
                        handleUpdatePropietario(idx, 'nombre', e.target.value)
                      }
                      placeholder={`Nombre del propietario ${idx + 1}`}
                      className="w-full h-9 px-2.5 rounded-lg bg-white border border-[#D2DCD4] text-xs text-[#1E2922] outline-hidden focus:border-[#2D6A4F] font-medium"
                    />
                  </div>

                  <div className="w-24 shrink-0 relative">
                    <input
                      type="number"
                      step="0.01"
                      min="0.01"
                      max="100"
                      required
                      value={prop.porcentaje}
                      onChange={(e) =>
                        handleUpdatePropietario(idx, 'porcentaje', e.target.value)
                      }
                      className="w-full h-9 pl-2 pr-6 rounded-lg bg-white border border-[#D2DCD4] text-xs font-mono font-bold text-[#1E2922] outline-hidden focus:border-[#2D6A4F] text-right"
                    />
                    <span className="absolute right-2 top-2.5 text-xs text-[#7A8A80] pointer-events-none">
                      %
                    </span>
                  </div>

                  {propietarios.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePropietario(idx)}
                      className="p-2 text-[#9E6E6E] hover:text-[#C62828] hover:bg-[#FBE9E7] rounded-lg transition-colors shrink-0"
                      title="Eliminar propietario"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Validación estricta de suma = 100% */}
            <div
              className={`p-3 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                esValido100
                  ? 'bg-[#EBF4EE] border-[#B8DFC8] text-[#1B4332]'
                  : 'bg-[#FFF8E1] border-[#FFE082] text-[#8C5824]'
              }`}
            >
              <div className="flex items-center gap-2">
                {esValido100 ? (
                  <CheckCircle2 className="w-4 h-4 text-[#2D6A4F] shrink-0" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-[#B78103] shrink-0" />
                )}
                <span className="font-semibold">
                  {esValido100
                    ? 'Distribución válida de propiedad'
                    : 'La suma debe ser exactamente 100%'}
                </span>
              </div>
              <span className="font-mono font-bold tabular-nums text-sm">
                {totalRedondeado}%
              </span>
            </div>
          </div>

          {/* Observaciones opcionales */}
          <div>
            <label className="block text-xs font-semibold text-[#3A4D41] mb-1">
              Observaciones (opcional)
            </label>
            <textarea
              rows={2}
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Detalles sobre tipo de suelo, acceso o notas de campo..."
              className="w-full p-2.5 rounded-xl bg-[#F8FAF7] border border-[#D5E0D7] focus:border-[#2D6A4F] focus:bg-white text-xs text-[#1E2922] outline-hidden resize-none"
            />
          </div>

          {/* Pie del modal con botón de guardado bloqueado */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!esValido100}
              className={`w-full h-11 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-[0.99] ${
                esValido100
                  ? 'bg-[#2D6A4F] hover:bg-[#1B4332] text-white'
                  : 'bg-[#D2DCD4] text-[#7A8A80] cursor-not-allowed'
              }`}
            >
              <Lock className="w-4 h-4 text-white/80" />
              <span>
                {isEditing ? 'Guardar Cambios en Lote' : 'Registrar Lote'} (Bloqueado)
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
