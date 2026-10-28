'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Dumbbell, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Flame, 
  ArrowUpRight, 
  Play, 
  MessageSquare,
  AlertCircle,
  Plus,
  Cloud,
  Camera
} from 'lucide-react';
import { Client, WorkoutPlan, TrainerProfile } from '@/types';
import { AvatarEditModal } from './AvatarEditModal';

interface TrainerDashboardProps {
  clients: Client[];
  plans: WorkoutPlan[];
  onSelectClient: (client: Client) => void;
  onNavigate: (tab: string) => void;
  trainerProfile?: TrainerProfile;
  onUpdateTrainerAvatar?: (newUrl: string) => Promise<void> | void;
}

export const TrainerDashboard: React.FC<TrainerDashboardProps> = ({
  clients,
  plans,
  onSelectClient,
  onNavigate,
  trainerProfile,
  onUpdateTrainerAvatar
}) => {
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const activeClients = clients.filter(c => c.status === 'active');
  const pendingReviews = clients.filter(c => 
    c.status === 'pending_review' || (c.checkins && c.checkins.some(chk => !chk.trainerFeedback))
  );

  const averageAdherence = clients.length > 0 
    ? (clients.reduce((acc, c) => acc + (c.adherenceRate || 100), 0) / clients.length).toFixed(1)
    : '100';

  const clientWithPendingCheckin = clients.find(c => c.checkins && c.checkins.length > 0 && !c.checkins[0]?.trainerFeedback) 
    || clients.find(c => c.checkins && c.checkins.length > 0);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#141822] via-[#1A202E] to-[#12151D] border border-[#262D3D] p-6 lg:p-8">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#E2FB3A]/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4 sm:gap-5">
            {trainerProfile && (
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setIsAvatarModalOpen(true)}
                  className="relative block rounded-full focus:outline-none cursor-pointer group"
                  title="Toca para cambiar tu foto de entrenadora"
                >
                  <img
                    src={trainerProfile.avatar}
                    alt={trainerProfile.name || 'Entrenadora'}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-[#E2FB3A] shadow-xl shadow-[#E2FB3A]/20"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-5 h-5 text-[#E2FB3A]" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-[#E2FB3A] text-black p-1.5 rounded-full shadow-lg">
                    <Camera className="w-3.5 h-3.5 stroke-[2.5]" />
                  </div>
                </button>
              </div>
            )}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E2FB3A]/10 border border-[#E2FB3A]/20 text-[#E2FB3A] text-xs font-semibold mb-2">
                <Cloud className="w-3.5 h-3.5" />
                <span>Base de Datos Cloud Conectada</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">
                {clients.length === 0 ? (
                  <>Bienvenida a tu panel de <span className="text-[#E2FB3A]">TamiFit</span></>
                ) : (
                  <>Panel activo con <span className="text-[#E2FB3A]">{activeClients.length} alumno{activeClients.length !== 1 ? 's' : ''}</span></>
                )}
              </h2>
              <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                <p className="text-sm text-gray-400 max-w-2xl">
                  {clients.length === 0 
                    ? 'Tu base de datos está lista para el lanzamiento. Da de alta a tus alumnos desde la sección Alumnos y comparte sus claves de acceso.'
                    : `La adherencia media de tus alumnos está en el ${averageAdherence}%. Tienes ${pendingReviews.length} revisión${pendingReviews.length !== 1 ? 'es' : ''} pendiente${pendingReviews.length !== 1 ? 's' : ''}.`}
                </p>
                {trainerProfile && (
                  <button
                    type="button"
                    onClick={() => setIsAvatarModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#E2FB3A] bg-[#E2FB3A]/10 hover:bg-[#E2FB3A]/20 px-3 py-1.5 rounded-xl border border-[#E2FB3A]/30 font-bold transition-all cursor-pointer shrink-0"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Cambiar mi foto</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap shrink-0">
            <button
              onClick={() => onNavigate('clients')}
              className="bg-[#E2FB3A] hover:bg-[#ccee24] text-black font-extrabold text-xs px-5 py-3 rounded-xl transition-all shadow-lg shadow-[#E2FB3A]/20 flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Nuevo Alumno</span>
            </button>
            <button
              onClick={() => onNavigate('builder')}
              className="bg-[#202532] hover:bg-[#282F3E] text-white font-bold text-xs px-4 py-3 rounded-xl border border-[#2D3547] transition-all flex items-center gap-2 cursor-pointer"
            >
              <Dumbbell className="w-4 h-4 text-[#E2FB3A]" />
              <span>Rutinas ({plans.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Avatar Edit Modal for Trainer */}
      <AvatarEditModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        currentAvatar={trainerProfile?.avatar || ''}
        title="Foto de Perfil de la Entrenadora"
        subtitle="Actualiza tu foto visible en el panel y en la app de tus alumnos"
        onSave={async (newUrl) => {
          if (onUpdateTrainerAvatar) {
            await onUpdateTrainerAvatar(newUrl);
          }
        }}
      />

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#12151D] border border-[#232938] hover:border-[#323B50] transition-all">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium uppercase tracking-wider">Alumnos Activos</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{activeClients.length}</span>
            <span className="text-xs text-gray-500 font-semibold">
              de {clients.length} totales
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Guardados en la nube</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#12151D] border border-[#232938] hover:border-[#323B50] transition-all">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium uppercase tracking-wider">Rutinas Maestras</span>
            <div className="w-8 h-8 rounded-lg bg-[#E2FB3A]/10 text-[#E2FB3A] flex items-center justify-center">
              <Dumbbell className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{plans.length}</span>
            <span className="text-xs text-emerald-400 font-semibold">Listas para asignar</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Plantillas editables</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#12151D] border border-[#232938] hover:border-[#323B50] transition-all">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium uppercase tracking-wider">Adherencia Media</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{averageAdherence}%</span>
            <span className="text-xs text-emerald-400 font-semibold">Óptima</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Cumplimiento de objetivos</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#12151D] border border-[#232938] hover:border-[#323B50] transition-all">
          <div className="flex items-center justify-between text-gray-400">
            <span className="text-xs font-medium uppercase tracking-wider">Revisiones Pendientes</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{pendingReviews.length}</span>
            <span className="text-xs text-amber-300 font-semibold">
              {pendingReviews.length > 0 ? 'Requieren feedback' : 'Al día'}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Fotos y pesajes semanales</p>
        </div>
      </div>

      {/* Main 2-column Layout: Feed & Quick Trainees */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
        {/* Left 2 cols: Live Activity & Trainees */}
        <div className="xl:col-span-2 space-y-6">
          {/* Today Activity Feed */}
          <div className="bg-[#12151D] rounded-2xl border border-[#232938] p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#E2FB3A]" />
                  Actividad en Directo de Alumnos
                </h3>
                <p className="text-xs text-gray-400">Registros y entrenamientos en tiempo real</p>
              </div>
              {clients.length > 0 && (
                <span 
                  onClick={() => onNavigate('clients')}
                  className="text-xs text-[#E2FB3A] font-semibold hover:underline cursor-pointer"
                >
                  Ver todos
                </span>
              )}
            </div>

            {clients.length === 0 ? (
              <div className="p-8 rounded-xl bg-[#171B24] border border-[#242A39] text-center">
                <Users className="w-10 h-10 text-gray-600 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-white">No hay actividad reciente</h4>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  Cuando des de alta a tus alumnos y ellos entren a la app con su clave, verás aquí sus sesiones terminadas en directo.
                </p>
                <button
                  onClick={() => onNavigate('clients')}
                  className="mt-4 bg-[#E2FB3A] text-black font-extrabold text-xs px-4 py-2 rounded-xl inline-flex items-center gap-1.5 shadow-md shadow-[#E2FB3A]/20"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Dar de alta alumno</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3.5">
                {clients.slice(0, 3).map((client) => (
                  <div 
                    key={client.id}
                    onClick={() => {
                      onSelectClient(client);
                      onNavigate('clients');
                    }}
                    className="p-4 rounded-xl bg-[#171B24] border border-[#242A39] flex items-center justify-between hover:border-[#363F55] cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={client.avatar}
                        alt={client.name}
                        className="w-10 h-10 rounded-full object-cover border border-[#E2FB3A]/50"
                      />
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          <span>{client.name}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-medium">
                            {client.status === 'active' ? 'Activo' : client.status}
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {client.goal} • {client.currentPlanName || 'Plan asignado'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-gray-400 block">{client.lastActive}</span>
                      <span className="text-xs font-bold text-[#E2FB3A]">{client.currentWeight} kg</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Trainees Adherence Table */}
          <div className="bg-[#12151D] rounded-2xl border border-[#232938] p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-bold text-white">Seguimiento de Alumnos</h3>
                <p className="text-xs text-gray-400">Objetivos, peso actual y cumplimiento</p>
              </div>
              <button
                onClick={() => onNavigate('clients')}
                className="text-xs font-semibold text-[#E2FB3A] hover:underline"
              >
                Ver listado completo
              </button>
            </div>

            {clients.length === 0 ? (
              <p className="text-xs text-gray-500 italic text-center py-6">
                Sin alumnos en seguimiento.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#232938] text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      <th className="pb-3">Alumno</th>
                      <th className="pb-3">Objetivo</th>
                      <th className="pb-3">Peso</th>
                      <th className="pb-3">Meta</th>
                      <th className="pb-3">Adherencia</th>
                      <th className="pb-3 text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1D222E] text-xs">
                    {clients.slice(0, 5).map((client) => (
                      <tr key={client.id} className="hover:bg-[#151922] transition-colors">
                        <td className="py-3.5 flex items-center gap-3 font-semibold text-white">
                          <img
                            src={client.avatar}
                            alt={client.name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <span>{client.name}</span>
                        </td>
                        <td className="py-3.5 text-gray-400">{client.goal}</td>
                        <td className="py-3.5 font-bold text-white">{client.currentWeight} kg</td>
                        <td className="py-3.5 text-[#E2FB3A] font-semibold">{client.targetWeight} kg</td>
                        <td className="py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-[#222836] rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-[#E2FB3A] h-full rounded-full"
                                style={{ width: `${client.adherenceRate}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-bold text-gray-300">
                              {client.adherenceRate}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => {
                              onSelectClient(client);
                              onNavigate('clients');
                            }}
                            className="text-xs font-semibold text-[#E2FB3A] hover:underline"
                          >
                            Ver Ficha
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Check-in preview & routines */}
        <div className="space-y-6">
          {/* Quick Check-in Preview Card */}
          <div className="bg-[#12151D] rounded-2xl border border-[#232938] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-400" />
                Revisiones Semanales
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 font-semibold">
                {pendingReviews.length} Pendiente{pendingReviews.length !== 1 ? 's' : ''}
              </span>
            </div>

            {clientWithPendingCheckin && clientWithPendingCheckin.checkins && clientWithPendingCheckin.checkins.length > 0 ? (
              <div className="p-3.5 rounded-xl bg-[#171B24] border border-[#242A39]">
                <div className="flex items-center gap-3">
                  <img
                    src={clientWithPendingCheckin.avatar}
                    alt={clientWithPendingCheckin.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white">{clientWithPendingCheckin.name}</h4>
                    <p className="text-[10px] text-gray-400">Objetivo: {clientWithPendingCheckin.goal}</p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2 rounded-lg bg-[#111319]">
                    <span className="text-[10px] text-gray-500 block">Peso Registrado</span>
                    <span className="font-extrabold text-[#E2FB3A]">
                      {clientWithPendingCheckin.checkins[0]?.weight} kg
                    </span>
                  </div>
                  <div className="p-2 rounded-lg bg-[#111319]">
                    <span className="text-[10px] text-gray-500 block">Fecha</span>
                    <span className="font-extrabold text-gray-300">
                      {clientWithPendingCheckin.checkins[0]?.date}
                    </span>
                  </div>
                </div>

                {clientWithPendingCheckin.checkins[0]?.notes && (
                  <p className="text-[11px] text-gray-300 mt-3 italic bg-[#101217] p-2.5 rounded-lg border border-[#1E2330]">
                    "{clientWithPendingCheckin.checkins[0]?.notes}"
                  </p>
                )}

                <button
                  onClick={() => {
                    onSelectClient(clientWithPendingCheckin);
                    onNavigate('checkins');
                  }}
                  className="mt-3.5 w-full bg-[#E2FB3A] hover:bg-[#ccee24] text-black font-extrabold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-[#E2FB3A]/10"
                >
                  Revisar & Dar Feedback
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-[#171B24] text-center border border-[#242A39]">
                <p className="text-xs text-gray-400">
                  No hay revisiones pendientes. Cuando tus alumnos envíen su pesaje y fotos semanales aparecerán aquí.
                </p>
              </div>
            )}
          </div>

          {/* Quick Plan Templates */}
          <div className="bg-[#12151D] rounded-2xl border border-[#232938] p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-[#E2FB3A]" />
                Tus Rutinas Maestras
              </h3>
              <button
                onClick={() => onNavigate('builder')}
                className="text-xs text-[#E2FB3A] hover:underline"
              >
                + Crear
              </button>
            </div>

            <div className="space-y-3">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => onNavigate('builder')}
                  className="p-3.5 rounded-xl bg-[#171B24] border border-[#242A39] hover:border-[#E2FB3A]/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white group-hover:text-[#E2FB3A] transition-colors">
                      {plan.title}
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#202532] text-gray-300">
                      {plan.days.length} Días
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">
                    {plan.description}
                  </p>
                  <div className="mt-2.5 flex items-center gap-2 text-[10px] text-gray-400">
                    <span className="text-[#E2FB3A] font-semibold">{plan.level}</span>
                    <span>•</span>
                    <span>{plan.durationWeeks} semanas</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
