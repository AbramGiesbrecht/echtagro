import React from 'react';
import {
  ArrowLeft,
  Clock,
  Lock,
  Layers,
  CalendarDays,
  Receipt,
  Wheat,
  Wallet,
  BarChart3,
  FileSpreadsheet,
  Plus
} from 'lucide-react';
import { MainSectionId } from './QuickAccessGrid';

interface SectionConfig {
  title: string;
  subtitle: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  plannedFields: string[];
  description: string;
}

const sectionConfigs: Record<MainSectionId, SectionConfig> = {
  lotes: {
    title: 'Lotes y Parcelas',
    subtitle: 'Registro de hectáreas, suelos y delimitación catastral',
    icon: Layers,
    iconColor: 'text-[#2D6A4F]',
    iconBg: 'bg-[#EBF4EE]',
    plannedFields: [
      'Nombre o número del lote',
      'Superficie útil (Hectáreas)',
      'Cultivo asignado / barbecho',
      'Ubicación o coordenada georreferenciada',
      'Historial de rotación de cultivos',
    ],
    description:
      'Este módulo permitirá gestionar la cartografía y superficie de cada parcela del establecimiento. Las parcelas se sincronizarán directamente desde la hoja de cálculo "Lotes" de Google Sheets.',
  },
  campanas: {
    title: 'Campañas Agrícolas',
    subtitle: 'Ciclos de producción y temporadas del establecimiento',
    icon: CalendarDays,
    iconColor: 'text-[#3B7A57]',
    iconBg: 'bg-[#F0F7ED]',
    plannedFields: [
      'Nombre del ciclo (ej. Soja 24/25, Maíz Tardío)',
      'Fecha de inicio y finalización estimada',
      'Presupuesto proyectado por hectárea',
      'Meta de rendimiento esperado (qq/ha)',
      'Estado (Planificación / En Curso / Cerrada)',
    ],
    description:
      'Organice las labores y finanzas por ciclo productivo. Al seleccionar la campaña activa en la cabecera, todos los balances de la pantalla principal se filtrarán automáticamente.',
  },
  gastos: {
    title: 'Gastos y Compras',
    subtitle: 'Insumos, semillas, agroquímicos, labores y servicios',
    icon: Receipt,
    iconColor: 'text-[#B06727]',
    iconBg: 'bg-[#FDF3E7]',
    plannedFields: [
      'Fecha del comprobante / remito',
      'Categoría (Semillas, Fitosanitarios, Combustible, Contratistas)',
      'Lote y campaña de aplicación',
      'Importe total y moneda (ARS / USD)',
      'Condición de pago (Contado / Cuenta Corriente)',
    ],
    description:
      'Control riguroso de egresos del campo. Toda compra ingresada se registrará en la pestaña "Gastos" de Google Sheets vía Cloudflare Workers con comprobantes adjuntos.',
  },
  cosechas: {
    title: 'Cosechas y Ventas',
    subtitle: 'Rendimientos de grano, entregas a acopio y liquidaciones',
    icon: Wheat,
    iconColor: 'text-[#B88714]',
    iconBg: 'bg-[#FEF8E7]',
    plannedFields: [
      'Lote de origen y cultivo cosechado',
      'Kilos brutos, tara y neto seco',
      'Rendimiento promedio obtenido (qq/ha)',
      'Destino / Acopiador / Silo propio',
      'Precio pactado y liquidación formal',
    ],
    description:
      'Registro de pesajes y venta de cereales u oleaginosas. Se conectará con la hoja "Cosechas_Ventas" para computar el ingreso real y el rinde por hectárea.',
  },
  caja: {
    title: 'Caja y Finanzas',
    subtitle: 'Disponibilidad monetaria, bancos y cuentas por pagar',
    icon: Wallet,
    iconColor: 'text-[#266867]',
    iconBg: 'bg-[#EBF5F5]',
    plannedFields: [
      'Saldo consolidado en moneda local y dólares',
      'Cuentas corrientes con proveedores de insumos',
      'Cheques emitidos y diferidos',
      'Flujo de fondos estimado a 30/60/90 días',
    ],
    description:
      'Control de tesorería del establecimiento rural. Permite saber la disponibilidad para afrontar pagos de insumos y servicios de cosecha.',
  },
  reportes: {
    title: 'Reportes y Estadísticas',
    subtitle: 'Márgenes brutos, costos por hectárea y análisis comparativo',
    icon: BarChart3,
    iconColor: 'text-[#506A3F]',
    iconBg: 'bg-[#EEF2E6]',
    plannedFields: [
      'Margen bruto por cultivo ($/ha)',
      'Desglose de costos directos e indirectos',
      'Comparativa de rendimientos históricos',
      'Exportación en formato PDF y Google Sheets',
    ],
    description:
      'Generación de balances agronómicos y financieros automáticos basados en las fórmulas oficiales de su hoja de cálculo.',
  },
};

interface PendingSectionViewProps {
  sectionId: MainSectionId;
  onBack: () => void;
  onOpenLockedModal: (title: string, desc: string) => void;
}

export const PendingSectionView: React.FC<PendingSectionViewProps> = ({
  sectionId,
  onBack,
  onOpenLockedModal,
}) => {
  const config = sectionConfigs[sectionId];
  const Icon = config.icon;

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Botón Volver */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-[#D8E2DC] text-xs font-semibold text-[#2D6A4F] hover:bg-[#F0F4F1] transition-colors shadow-xs cursor-pointer active:scale-[0.98]"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Inicio
        </button>

        <span className="text-[11px] font-semibold text-[#7A6B53] bg-[#F7F3EB] px-2.5 py-1 rounded-lg border border-[#E9DFCE] inline-flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-[#A87E43]" />
          Pendiente de backend
        </span>
      </div>

      {/* Encabezado del Módulo */}
      <div className="bg-white border border-[#E2E8E0] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`w-14 h-14 rounded-2xl ${config.iconBg} ${config.iconColor} flex items-center justify-center shrink-0`}
          >
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-[#1E2922]">
              {config.title}
            </h1>
            <p className="text-xs text-[#6B7C72] mt-0.5">
              {config.subtitle}
            </p>
          </div>
        </div>

        {/* Botón de acción rápida (Bloqueado preventivamente) */}
        <button
          onClick={() =>
            onOpenLockedModal(
              `Operación bloqueada en ${config.title}`,
              `La carga de nuevos registros en el módulo "${config.title}" estará habilitada una vez vinculado el backend en Cloudflare Workers.`
            )
          }
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#2D6A4F] hover:bg-[#1B4332] text-white text-xs font-semibold shadow-xs transition-all active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Añadir Registro</span>
          <Lock className="w-3.5 h-3.5 ml-1 text-white/80" />
        </button>
      </div>

      {/* Tarjeta de Estado Pendiente */}
      <div className="bg-[#FAF7F2] border border-[#EBE2D5] rounded-2xl p-5 space-y-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-white border border-[#DECDB8] text-[#9E6E2D] flex items-center justify-center shrink-0 mt-0.5">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#2E2416]">
              Módulo listo para conexión con Google Sheets
            </h2>
            <p className="text-xs text-[#5C4D38] mt-1 leading-relaxed">
              {config.description}
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-[#E6DBCB]">
          <h3 className="text-xs font-bold text-[#3B3020] uppercase tracking-wider mb-2.5">
            Estructura de datos prevista para este módulo:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {config.plannedFields.map((field, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E5DAC8] text-xs text-[#403525]"
              >
                <div className="w-5 h-5 rounded-md bg-[#F4EDE2] text-[#8C5824] flex items-center justify-center text-[10px] font-bold shrink-0">
                  {idx + 1}
                </div>
                <span className="font-medium truncate">{field}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Aviso de seguridad contable */}
      <div className="bg-[#F8FAF7] border border-[#E2E8E0] rounded-2xl p-4 flex items-center gap-3 text-xs text-[#55695C]">
        <FileSpreadsheet className="w-5 h-5 text-[#2D6A4F] shrink-0" />
        <p>
          Ninguna información se almacena localmente en el navegador. La integración final preservará íntegramente las fórmulas y formatos de su Google Sheet.
        </p>
      </div>
    </div>
  );
};
