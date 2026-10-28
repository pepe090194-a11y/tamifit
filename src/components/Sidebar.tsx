'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  Users, 
  Dumbbell, 
  PlayCircle, 
  MessageSquare, 
  ClipboardCheck, 
  LogOut,
  X,
  Camera
} from 'lucide-react';
import { TrainerProfile } from '@/types';
import { AvatarEditModal } from '@/components/AvatarEditModal';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadCount: number;
  pendingReviewsCount: number;
  totalClients: number;
  trainerProfile?: TrainerProfile;
  onUpdateTrainerAvatar?: (newAvatarUrl: string) => Promise<void> | void;
  isOpen?: boolean;
  onClose?: () => void;
  onLogout?: () => void;
  onClearUnreadMessages?: () => void;
  onClearPendingReviews?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  unreadCount,
  pendingReviewsCount,
  totalClients,
  trainerProfile,
  onUpdateTrainerAvatar,
  isOpen = false,
  onClose,
  onLogout,
  onClearUnreadMessages,
  onClearPendingReviews
}) => {
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const navItems = [
    {
      id: 'dashboard',
      label: 'Panel Principal',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'clients',
      label: 'Alumnos & Clientes',
      icon: Users,
      badge: totalClients.toString()
    },
    {
      id: 'builder',
      label: 'Creador de Rutinas',
      icon: Dumbbell,
      badge: 'Editor'
    },
    {
      id: 'exercises',
      label: 'Banco de Ejercicios',
      icon: PlayCircle,
      badge: 'Vídeos'
    },
    {
      id: 'chat',
      label: 'Mensajes & Chat',
      icon: MessageSquare,
      badge: unreadCount > 0 ? `${unreadCount} nuevos` : null,
      badgeColor: 'bg-[#E2FB3A] text-black font-bold'
    },
    {
      id: 'checkins',
      label: 'Revisiones Semanales',
      icon: ClipboardCheck,
      badge: pendingReviewsCount > 0 ? `${pendingReviewsCount} pendientes` : null,
      badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
    }
  ];

  return (
    <>
      {/* Mobile/Tablet Backdrop Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 lg:hidden transition-opacity animate-fadeIn"
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 lg:w-64 xl:w-72 bg-[#0E1014] border-r border-[#222732] flex flex-col h-[100dvh] max-h-[100dvh] select-none shrink-0 lg:static transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Logo Header */}
        <div className="p-4 sm:p-5 border-b border-[#222732] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative h-9 w-32 overflow-hidden flex items-center">
              <Image
                src="/tamifit-logo.png"
                alt="tamifit."
                width={130}
                height={36}
                className="object-contain"
                priority
              />
            </div>
            <span className="text-[9px] uppercase tracking-widest font-black px-2 py-0.5 rounded-full bg-[#E2FB3A]/10 text-[#E2FB3A] border border-[#E2FB3A]/20">
              PRO
            </span>
          </div>

          {/* Close button on mobile/tablet */}
          <button
            type="button"
            onClick={onClose}
            className="lg:hidden p-1.5 text-gray-400 hover:text-white rounded-lg bg-[#161A23] border border-[#273042] cursor-pointer"
            aria-label="Cerrar menú"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 sm:px-4 py-4 space-y-1.5 overflow-y-auto">
          <p className="text-[10px] uppercase font-bold text-gray-500 px-3 pb-1 tracking-wider">
            Gestión de Entrenamiento
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id === 'chat') onClearUnreadMessages?.();
                  if (item.id === 'checkins') onClearPendingReviews?.();
                  onClose?.();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                  isActive
                    ? 'bg-[#E2FB3A] text-black font-extrabold shadow-md shadow-[#E2FB3A]/20'
                    : 'text-gray-300 hover:text-white hover:bg-[#171A21]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-gray-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-black/20 text-black'
                        : item.badgeColor || 'bg-[#222732] text-gray-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {onLogout && (
            <div className="pt-2 mt-2 border-t border-[#1C202B]">
              <button
                type="button"
                onClick={() => {
                  onLogout();
                  onClose?.();
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Cerrar Sesión</span>
                </div>
                <span className="text-[10px] bg-rose-500/15 text-rose-300 font-semibold px-2 py-0.5 rounded-md">
                  Salir
                </span>
              </button>
            </div>
          )}
        </nav>

      {/* Trainer Info Card at Bottom */}
      <div className="p-3 sm:p-4 border-t border-[#222732] bg-[#0A0C0F]/95 pb-[max(1rem,calc(env(safe-area-inset-bottom,0px)+0.75rem))] space-y-2.5">
        <div className="flex items-center justify-between p-2 rounded-xl bg-[#14171E] border border-[#232936]">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setIsAvatarModalOpen(true)}
              className="relative group cursor-pointer shrink-0"
              title="Cambiar foto de perfil de entrenadora"
            >
              {trainerProfile?.avatar ? (
                <img
                  src={trainerProfile.avatar}
                  alt={trainerProfile.name || 'Entrenadora'}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#E2FB3A]"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#E2FB3A] to-lime-200 text-black flex items-center justify-center font-black text-sm">
                  TF
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-4 h-4 text-[#E2FB3A]" />
              </div>
              {/* Always visible camera badge */}
              <div className="absolute -bottom-0.5 -right-0.5 bg-[#E2FB3A] text-black p-0.5 rounded-full shadow-md">
                <Camera className="w-2.5 h-2.5 stroke-[2.5]" />
              </div>
            </button>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                {trainerProfile?.name || 'Tami Fit Coach'}
              </div>
              <p className="text-[11px] text-gray-400 truncate">{trainerProfile?.title || 'Head Coach & Nutrición'}</p>
              <button
                type="button"
                onClick={() => setIsAvatarModalOpen(true)}
                className="text-[10px] text-[#E2FB3A] hover:underline flex items-center gap-1 font-bold mt-0.5 cursor-pointer"
              >
                <Camera className="w-2.5 h-2.5" />
                <span>Cambiar mi foto</span>
              </button>
            </div>
          </div>
        </div>

        {onLogout && (
          <button 
            type="button"
            onClick={() => {
              onLogout();
              onClose?.();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        )}
      </div>
    </aside>

    {/* Avatar Edit Modal for Trainer */}
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
