'use client';

import React, { useState } from 'react';
import { Search, Plus, Menu, Camera, LogOut } from 'lucide-react';
import { TrainerProfile } from '@/types';
import { AvatarEditModal } from './AvatarEditModal';

interface HeaderProps {
  activeTab: string;
  onQuickNewClient: () => void;
  onQuickNewRoutine: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onToggleSidebar?: () => void;
  trainerProfile?: TrainerProfile;
  onUpdateTrainerAvatar?: (newUrl: string) => Promise<void> | void;
  onLogout?: () => void;
}

const TAB_TITLES: Record<string, { title: string; subtitle: string }> = {
  dashboard: {
    title: 'Panel de Control General',
    subtitle: 'Resumen del estado físico y adherencia de tus atletas'
  },
  clients: {
    title: 'Gestión de Alumnos',
    subtitle: 'Seguimiento individual, fichas antropométricas y planes activos'
  },
  builder: {
    title: 'Creador de Rutinas & Tablas',
    subtitle: 'Diseña entrenamientos por bloques, series, RIR y descansos'
  },
  exercises: {
    title: 'Banco Multimedia de Ejercicios',
    subtitle: 'Biblioteca de técnicas biomecánicas con fotos y vídeos'
  },
  chat: {
    title: 'Bandeja de Mensajes & Feedback',
    subtitle: 'Comunicación en directo y dudas de entrenamiento'
  },
  checkins: {
    title: 'Revisiones Semanales (Check-ins)',
    subtitle: 'Fotos de progreso físico, pesajes y reportes de esfuerzo'
  }
};

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onQuickNewClient,
  onQuickNewRoutine,
  searchQuery,
  setSearchQuery,
  onToggleSidebar,
  trainerProfile,
  onUpdateTrainerAvatar,
  onLogout
}) => {
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const currentInfo = TAB_TITLES[activeTab] || {
    title: 'Tamifit Pro Coach',
    subtitle: 'Plataforma de Alto Rendimiento'
  };

  return (
    <>
    <header className="h-16 sm:h-20 bg-[#0E1014]/90 backdrop-blur-md border-b border-[#222732] px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Title & subtitle + Hamburger on tablet/mobile */}
      <div className="flex items-center gap-3 min-w-0 flex-1 mr-2 sm:mr-4">
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl bg-[#151820] border border-[#262C38] text-gray-300 hover:text-white hover:border-[#E2FB3A] transition-colors shrink-0 cursor-pointer"
            aria-label="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="min-w-0">
          <h1 className="text-sm sm:text-base lg:text-xl font-extrabold text-white tracking-tight truncate">
            {currentInfo.title}
          </h1>
          <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5 hidden sm:block truncate">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Center/Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Global Search Bar */}
        <div className="relative w-28 xs:w-36 sm:w-44 md:w-52 lg:w-60">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar..."
            className="w-full bg-[#151820] text-xs text-white placeholder-gray-500 pl-8 sm:pl-9 pr-3 py-2 sm:py-2.5 rounded-xl border border-[#262C38] focus:outline-none focus:border-[#E2FB3A] transition-all"
          />
        </div>

        {/* Action Button */}
        {activeTab === 'clients' ? (
          <button
            type="button"
            onClick={onQuickNewClient}
            className="flex items-center gap-1.5 sm:gap-2 bg-[#E2FB3A] hover:bg-[#d6f22c] text-black font-bold text-xs px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all shadow-md shadow-[#E2FB3A]/20 active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Nuevo Alumno</span>
            <span className="sm:hidden">Nuevo</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onQuickNewRoutine}
            className="flex items-center gap-1.5 sm:gap-2 bg-[#E2FB3A] hover:bg-[#d6f22c] text-black font-bold text-xs px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all shadow-md shadow-[#E2FB3A]/20 active:scale-95 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span className="hidden sm:inline">Crear Rutina</span>
            <span className="sm:hidden">Rutina</span>
          </button>
        )}

        {/* Trainer Profile Avatar with direct click to change */}
        {trainerProfile && (
          <div className="pl-1 sm:pl-2 border-l border-[#222732] flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setIsAvatarModalOpen(true)}
              className="relative group p-0.5 rounded-full hover:ring-2 hover:ring-[#E2FB3A]/50 transition-all cursor-pointer"
              title="Cambiar foto de perfil de entrenadora"
            >
              <img
                src={trainerProfile.avatar}
                alt={trainerProfile.name || 'Entrenadora'}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover border border-[#E2FB3A]/60"
              />
              <div className="absolute -bottom-0.5 -right-0.5 bg-[#E2FB3A] text-black p-0.5 rounded-full shadow-md">
                <Camera className="w-2.5 h-2.5 stroke-[2.5]" />
              </div>
            </button>

            {onLogout && (
              <button
                type="button"
                onClick={onLogout}
                title="Cerrar sesión de entrenadora"
                className="p-1.5 sm:p-2 rounded-xl bg-[#151820] border border-[#262C38] text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-colors shrink-0 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>
    </header>

    <AvatarEditModal
      isOpen={isAvatarModalOpen}
      onClose={() => setIsAvatarModalOpen(false)}
      currentAvatar={trainerProfile?.avatar || ''}
      title="Foto de Perfil de la Entrenadora"
      subtitle="Actualiza tu foto de perfil visible en el panel y para tus alumnos"
      onSave={async (newUrl) => {
        if (onUpdateTrainerAvatar) {
          await onUpdateTrainerAvatar(newUrl);
        }
      }}
    />
    </>
  );
};
