import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Layers,
  MapPin,
  Tag,
  Info,
  FileSpreadsheet
} from 'lucide-react';
import { Lote, Propietario } from '../../types/agri';
import { crearLoteEnBackend, WORKER_BASE_URL } from '../../services/backend';

interface LoteFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialLote?: Lote | null;
  onOpenLockedModal: (title: string, desc: string) => void;
  onLoteCreado?: (nuevoLote: Lote) => void;
}

export const LoteFormModal: React.FC<LoteFormModalProps> = ({
  isOpen,
  onClose,
  initialLote,
  onOpenLockedModal,
  onLoteCreado,
}) => {
  const isEditing = Boolean(initialLote);

  const [codigo, setCodigo] = useState('');
  const [nombre, setNombre] = useState('');
  const [superficieHa, setSuperficieHa] = useState<string>('');
  const [ubicacion, setUbicacion] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [propietarios, setPropietarios] = useState<Propietario[]>([
    { id: '1', nombre: '', porcentaje: 100 },
  ]);

  // Estados de comunicación con el backend real
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (initialLote) {
      setCodigo(initialLote.codigo || initialLote.id || '');
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
      setCodigo('');
      setNombre('');
      setSuperficieHa('');
      setUbicacion('');
      setObservaciones('');
      setPropietarios([{ id: '1', nombre: '', porcentaje: 100 }]);
    }
    setSubmissionError(null);
    setSubmissionSuccess(null);
    setIsSubmitting(false);
  }, [initialLote, isOpen]);

  if (!isOpen) return null;

  // Cálculo de la suma total de porcentajes
  const totalPorcentaje = propietarios.reduce(
    (acc, curr) => acc + (Number(curr.porcentaje) || 0),
    0
  );
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
    setPropietarios(propietarios.filter((_, i) => i !== index));
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

  // Manejador del guardado real
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!esValido100 || isSubmitting) return;

    setSubmissionError(null);
    setSubmissionSuccess(null);

    if (isEditing) {
      onOpenLockedModal(
        'Edición de Lotes',
        'La edición de registros en Google Sheets se conectará con la acción de actualización correspondiente del backend.'
      );
      return;
    }

    setIsSubmitting(true);

    // Si el usuario no especificó un código manual, se deriva limpiamente del nombre
    const codigoFinal = codigo.trim() || nombre.trim().toUpperCase().replace(/\s+/g, '-');

    try {
      const resp = await crearLoteEnBackend({
        codigo: codigoFinal,
        nombre: nombre.trim(),
        hectareas_totales: parseFloat(superficieHa),
        ubicacion: ubicacion.trim(),
        propietarios,
        observaciones: observaciones.trim(),
      });

      if (resp.success && resp.lote) {
        setSubmissionSuccess(
          resp.message || '¡Lote registrado y confirmado en Google Sheets!'
        );
        onLoteCreado?.(resp.lote);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        // Mostrar el error real del servidor sin simular guardados
        setSubmissionError(
          resp.error ||
            resp.message ||
            'El servidor o Google Sheets rechazaron la creación del lote.'
        );
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSubmissionError(`Error al conectar con Cloudflare Worker: ${msg}`);
    } finally {
      setIsSubmitting(false);
    }
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
                Conectado con Cloudflare Worker & Google Sheets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-[#7A8A80] hover:text-[#1E2922] rounded-full hover:bg-[#F0F4F1] transition-colors disabled:opacity-50"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mensajes de Estado del Servidor */}
        {submissionError && (
          <div className="mx-4 sm:mx-5 mt-4 p-3.5 rounded-2xl bg-[#FBE9E7] border border-[#FFCDD2] text-[#C62828] text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-[#D32F2F]" />
            <div className="flex-1">
              <p className="font-bold">Respuesta del servidor:</p>
              <p className="mt-0.5 text-[11px] leading-relaxed text-[#B71C1C]">
                {submissionError}
              </p>
            </div>
          </div>
        )}

        {submissionSuccess && (
          <div className="mx-4 sm:mx-5 mt-4 p-3.5 rounded-2xl bg-[#E8F5E9] border border-[#C8E6C9] text-[#2E7D32] text-xs flex items-center gap-2.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2D6A4F]" />
            <span className="font-bold">{submissionSuccess}</span>
          </div>
        )}

        {/* Cuerpo del formulario */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          {/* Código y Nombre */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#3A4D41] mb-1">
                Nombre o identificador *
              </label>
              <input
                type="text"
                required
                value={nombre}
                onChange={(e) => {
                  setNombre(e.target.value);
                  if (!codigo) {
                    setCodigo(e.target.value.trim().toUpperCase().replace(/\s+/g, '-'));
                  }
                }}
                placeholder="ej: Bajo Norte, La Loma"
                disabled={isSubmitting}
                className="w-full h-11 px-3 rounded-xl bg-[#F8FAF7] border border-[#D5E0D7] focus:border-[#2D6A4F] focus:bg-white text-sm text-[#1E2922] transition-colors outline-hidden font-medium disabled:opacity-60"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3A4D41] mb-1">
                Código del lote (enviado a Sheets)
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  placeholder="ej: L-01, LT-NORTE"
                  disabled={isSubmitting}
                  className="w-full h-11 pl-8 pr-3 rounded-xl bg-[#F8FAF7] border border-[#D5E0D7] focus:border-[#2D6A4F] focus:bg-white text-xs font-mono text-[#1E2922] transition-colors outline-hidden disabled:opacity-60"
                />
                <Tag className="w-3.5 h-3.5 text-[#7A8A80] absolute left-2.5 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Superficie y Ubicación */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  disabled={isSubmitting}
                  className="w-full h-11 pl-3 pr-10 rounded-xl bg-[#F8FAF7] border border-[#D5E0D7] focus:border-[#2D6A4F] focus:bg-white text-sm text-[#1E2922] transition-colors outline-hidden font-mono font-medium disabled:opacity-60"
                />
                <span className="absolute right-3 top-3 text-xs font-bold text-[#7A8A80] pointer-events-none">
                  ha
                </span>
              </div>
            </div>

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
                  disabled={isSubmitting}
                  className="w-full h-11 pl-8 pr-3 rounded-xl bg-[#F8FAF7] border border-[#D5E0D7] focus:border-[#2D6A4F] focus:bg-white text-xs text-[#1E2922] transition-colors outline-hidden disabled:opacity-60"
                />
                <MapPin className="w-3.5 h-3.5 text-[#7A8A80] absolute left-2.5 top-3.5 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Propietarios y Porcentajes */}
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

              <button
                type="button"
                onClick={handleAddPropietario}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EBF4EE] hover:bg-[#D8ECD8] text-[#2D6A4F] text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
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
                disabled={isSubmitting}
                className="px-2 py-0.5 rounded-md bg-[#F0F4F1] hover:bg-[#E5ECE7] text-[11px] font-semibold text-[#3A4D41] transition-colors disabled:opacity-50"
              >
                100% único
              </button>
              <button
                type="button"
                onClick={() => aplicarDistribucionRapida('50-50')}
                disabled={isSubmitting}
                className="px-2 py-0.5 rounded-md bg-[#F0F4F1] hover:bg-[#E5ECE7] text-[11px] font-semibold text-[#3A4D41] transition-colors disabled:opacity-50"
              >
                50 / 50
              </button>
              <button
                type="button"
                onClick={() => aplicarDistribucionRapida('60-40')}
                disabled={isSubmitting}
                className="px-2 py-0.5 rounded-md bg-[#F0F4F1] hover:bg-[#E5ECE7] text-[11px] font-semibold text-[#3A4D41] transition-colors disabled:opacity-50"
              >
                60 / 40
              </button>
              <button
                type="button"
                onClick={() => aplicarDistribucionRapida('70-30')}
                disabled={isSubmitting}
                className="px-2 py-0.5 rounded-md bg-[#F0F4F1] hover:bg-[#E5ECE7] text-[11px] font-semibold text-[#3A4D41] transition-colors disabled:opacity-50"
              >
                70 / 30
              </button>
            </div>

            {/* Lista de Propietarios */}
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
                      disabled={isSubmitting}
                      onChange={(e) =>
                        handleUpdatePropietario(idx, 'nombre', e.target.value)
                      }
                      placeholder={`Nombre del propietario ${idx + 1}`}
                      className="w-full h-9 px-2.5 rounded-lg bg-white border border-[#D2DCD4] text-xs text-[#1E2922] outline-hidden focus:border-[#2D6A4F] font-medium disabled:opacity-60"
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
                      disabled={isSubmitting}
                      onChange={(e) =>
                        handleUpdatePropietario(idx, 'porcentaje', e.target.value)
                      }
                      className="w-full h-9 pl-2 pr-6 rounded-lg bg-white border border-[#D2DCD4] text-xs font-mono font-bold text-[#1E2922] outline-hidden focus:border-[#2D6A4F] text-right disabled:opacity-60"
                    />
                    <span className="absolute right-2 top-2.5 text-xs text-[#7A8A80] pointer-events-none">
                      %
                    </span>
                  </div>

                  {propietarios.length > 1 && (
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleRemovePropietario(idx)}
                      className="p-2 text-[#9E6E6E] hover:text-[#C62828] hover:bg-[#FBE9E7] rounded-lg transition-colors shrink-0 disabled:opacity-40"
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

          {/* Observaciones */}
          <div>
            <label className="block text-xs font-semibold text-[#3A4D41] mb-1">
              Observaciones (opcional)
            </label>
            <textarea
              rows={2}
              value={observaciones}
              disabled={isSubmitting}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Detalles sobre tipo de suelo, acceso o notas de campo..."
              className="w-full p-2.5 rounded-xl bg-[#F8FAF7] border border-[#D5E0D7] focus:border-[#2D6A4F] focus:bg-white text-xs text-[#1E2922] outline-hidden resize-none disabled:opacity-60"
            />
          </div>

          {/* Nota técnica sobre soporte actual de campos en Google Sheets */}
          <div className="p-3 rounded-xl bg-[#F4F7F4] border border-[#DCE4DD] text-xs text-[#405246] flex items-start gap-2">
            <Info className="w-4 h-4 text-[#2D6A4F] shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Sincronización con Google Sheets:</strong> El backend registra actualmente <code className="bg-white px-1 py-0.5 rounded border border-[#D5E0D7] text-[#1E2922]">codigo</code>, <code className="bg-white px-1 py-0.5 rounded border border-[#D5E0D7] text-[#1E2922]">nombre</code>, <code className="bg-white px-1 py-0.5 rounded border border-[#D5E0D7] text-[#1E2922]">hectareas_totales</code> y <code className="bg-white px-1 py-0.5 rounded border border-[#D5E0D7] text-[#1E2922]">ubicacion</code>. Los propietarios y observaciones se conservan en esta interfaz para su futura incorporación en columnas adicionales de la planilla.
            </p>
          </div>

          {/* Botón de Guardado Real (Sin bloqueo artificial) */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={!esValido100 || isSubmitting}
              className={`w-full h-11 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-[0.99] ${
                !esValido100 || isSubmitting
                  ? 'bg-[#D2DCD4] text-[#7A8A80] cursor-not-allowed'
                  : 'bg-[#2D6A4F] hover:bg-[#1B4332] text-white'
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Guardando en Google Sheets...</span>
                </>
              ) : (
                <>
                  <FileSpreadsheet className="w-4 h-4 text-white/90" />
                  <span>
                    {isEditing ? 'Guardar Cambios en Lote' : 'Guardar Lote en Google Sheets'}
                  </span>
                </>
              )}
            </button>
            <p className="text-[10px] text-center text-[#7A8A80] mt-1.5 truncate">
              Endpoint: POST {WORKER_BASE_URL}/api/backend (acción lotes.crear)
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};
