/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { SummaryMetrics } from './components/SummaryMetrics';
import { QuickAccessGrid, MainSectionId } from './components/QuickAccessGrid';
import { BottomNav, NavTabId } from './components/BottomNav';
import { PendingSectionView } from './components/PendingSectionView';
import { RegistrarView } from './components/RegistrarView';
import { ResultadosView } from './components/ResultadosView';
import { AdministrarView } from './components/AdministrarView';
import { LockedOperationModal } from './components/LockedOperationModal';
import { BackendStatusModal } from './components/BackendStatusModal';
import { CampaignSelectorModal } from './components/CampaignSelectorModal';
import { LotesView } from './components/lotes/LotesView';
import { CampanasView } from './components/campanas/CampanasView';
import { Lote } from './types/agri';

export default function App() {
  // Estado de navegación principal (4 tabs)
  const [activeTab, setActiveTab] = useState<NavTabId>('inicio');

  // Estado de subsección seleccionada desde los 6 accesos principales
  const [selectedSubSection, setSelectedSubSection] = useState<MainSectionId | null>(null);

  // Campaña activa: Sin datos ficticios, nula hasta conexión con Google Sheets
  const [activeCampaignName, setActiveCampaignName] = useState<string | null>(null);

  // Lotes disponibles en memoria para vincular entre módulos
  const [lotesRegistrados] = useState<Lote[]>([]);

  // Estados de modales informativos
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [isBackendModalOpen, setIsBackendModalOpen] = useState(false);
  const [lockedModal, setLockedModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
  }>({
    isOpen: false,
    title: '',
    description: '',
  });

  const handleOpenLocked = (title: string, description: string) => {
    setLockedModal({
      isOpen: true,
      title,
      description,
    });
  };

  const handleCloseLocked = () => {
    setLockedModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSelectQuickAccess = (sectionId: MainSectionId) => {
    setSelectedSubSection(sectionId);
  };

  const handleBackToHome = () => {
    setSelectedSubSection(null);
  };

  const handleTabChange = (tab: NavTabId) => {
    setActiveTab(tab);
    // Si cambia de tab, reseteamos la subsección activa para volver a la raíz de ese tab
    setSelectedSubSection(null);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#1E2922] flex flex-col font-sans selection:bg-[#2D6A4F] selection:text-white">
      {/* Encabezado Superior con texto echtagro y Campaña Activa visible */}
      <Header
        activeCampaignName={activeCampaignName}
        onOpenCampaignModal={() => setIsCampaignModalOpen(true)}
      />

      {/* Contenido Principal Mobile First */}
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-4 pb-24 sm:pb-28">
        {/* Vistas específicas de los 6 accesos principales */}
        {selectedSubSection === 'lotes' ? (
          <LotesView
            onBack={handleBackToHome}
            onOpenLockedModal={handleOpenLocked}
          />
        ) : selectedSubSection === 'campanas' ? (
          <CampanasView
            onBack={handleBackToHome}
            onOpenLockedModal={handleOpenLocked}
            disponiblesLotes={lotesRegistrados}
            activeCampaignName={activeCampaignName}
            onSetActiveCampaign={setActiveCampaignName}
          />
        ) : selectedSubSection !== null ? (
          <PendingSectionView
            sectionId={selectedSubSection}
            onBack={handleBackToHome}
            onOpenLockedModal={handleOpenLocked}
          />
        ) : (
          <>
            {/* Tab: INICIO */}
            {activeTab === 'inicio' && (
              <div className="space-y-4 animate-in fade-in duration-150">
                {/* 1. Resumen Principal: UN SOLO indicador grande y destacado */}
                <SummaryMetrics
                  accumulatedExpensesPerHa={null}
                  activeCampaignName={activeCampaignName}
                />

                {/* 2. Accesos Principales: Inmediatamente debajo en 2 columnas para celulares */}
                <QuickAccessGrid onSelectSection={handleSelectQuickAccess} />
              </div>
            )}

            {/* Tab: REGISTRAR */}
            {activeTab === 'registrar' && (
              <RegistrarView onOpenLockedModal={handleOpenLocked} />
            )}

            {/* Tab: RESULTADOS */}
            {activeTab === 'resultados' && (
              <ResultadosView
                onOpenLockedModal={handleOpenLocked}
                onOpenBackendInfo={() => setIsBackendModalOpen(true)}
              />
            )}

            {/* Tab: ADMINISTRAR */}
            {activeTab === 'administrar' && (
              <AdministrarView
                onOpenLockedModal={handleOpenLocked}
                onOpenBackendInfo={() => setIsBackendModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {/* Menú Inferior Fijo en Celulares */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Modal de Operaciones Privadas Bloqueadas */}
      <LockedOperationModal
        isOpen={lockedModal.isOpen}
        onClose={handleCloseLocked}
        operationTitle={lockedModal.title}
        operationDescription={lockedModal.description}
      />

      {/* Modal de Arquitectura de Backend */}
      <BackendStatusModal
        isOpen={isBackendModalOpen}
        onClose={() => setIsBackendModalOpen(false)}
      />

      {/* Modal de Selección de Campaña */}
      <CampaignSelectorModal
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        activeCampaign={activeCampaignName}
        onSelectCampaign={setActiveCampaignName}
        onOpenLockedModal={handleOpenLocked}
      />
    </div>
  );
}
