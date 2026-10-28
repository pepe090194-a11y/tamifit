'use client';

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  MessageSquare, 
  Dumbbell, 
  TrendingUp, 
  Scale, 
  Ruler, 
  Calendar, 
  CheckCircle, 
  Clock, 
  ArrowRight,
  Eye,
  FileText,
  Camera,
  X,
  Sparkles,
  Key,
  Copy,
  Check,
  Trash2,
  Share2,
  RefreshCw,
  Info,
  CheckCircle2,
  ChevronRight,
  Edit3
} from 'lucide-react';
import { Client, WorkoutPlan, ClientDailyLog, ClientExerciseLog } from '@/types';
import { AvatarEditModal } from '@/components/AvatarEditModal';

interface ClientsManagerProps {
  clients: Client[];
  plans: WorkoutPlan[];
  selectedClient: Client | null;
  onSelectClient: (client: Client | null) => void;
  onOpenChatWith: (clientId: string) => void;
  onAddNewClient: (newClient: Partial<Client>) => void;
  onUpdateClientNotes: (clientId: string, notes: string) => void;
  onDeleteClient?: (clientId: string) => void;
  onUpdateClientWorkoutLogs?: (clientId: string, logs: ClientDailyLog[]) => void;
  onUpdateClientAvatar?: (clientId: string, newAvatarUrl: string) => Promise<void> | void;
  onAssignPlanToClient?: (clientId: string, planId: string, planTitle: string) => void;
  onEditPlan?: (planId: string) => void;
  onCreateCustomPlan?: (clientId: string, clientName: string) => void;
}

export const ClientsManager: React.FC<ClientsManagerProps> = ({
  clients,
  plans,
  selectedClient,
  onSelectClient,
  onOpenChatWith,
  onAddNewClient,
  onUpdateClientNotes,
  onDeleteClient,
  onUpdateClientWorkoutLogs,
  onUpdateClientAvatar,
  onAssignPlanToClient,
  onEditPlan,
  onCreateCustomPlan
}) => {
  const [filter, setFilter] = useState<'all' | 'active' | 'pending_review' | 'paused'>('all');
  const [search, setSearch] = useState('');
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [planAssignedSuccess, setPlanAssignedSuccess] = useState(false);
  
  // New Client Form State
  const [newName, setNewName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [usernameManuallyEdited, setUsernameManuallyEdited] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newGoal, setNewGoal] = useState<Client['goal']>('Hipertrofia');
  const [newWeight, setNewWeight] = useState('75');
  const [newTargetWeight, setNewTargetWeight] = useState('78');
  const [newHeight, setNewHeight] = useState('175');
  const [newNotes, setNewNotes] = useState('');
  const [newAccessCode, setNewAccessCode] = useState(() => `TAMI-${Math.floor(1000 + Math.random() * 9000)}`);
  const [selectedPlanId, setSelectedPlanId] = useState<string>(plans[0]?.id || '');

  // Credentials dialog for newly created student
  const [createdStudentDetails, setCreatedStudentDetails] = useState<{
    name: string;
    username: string;
    email: string;
    accessCode: string;
    phone: string;
  } | null>(null);

  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  // Selected client local note edit
  const [editingNotes, setEditingNotes] = useState(selectedClient?.privateNotes || '');
  const [clientDetailTab, setClientDetailTab] = useState<'overview' | 'workout_logs' | 'checkins'>('workout_logs');
  const [selectedLogIndex, setSelectedLogIndex] = useState<number>(0);

  React.useEffect(() => {
    if (selectedClient) {
      setEditingNotes(selectedClient.privateNotes || '');
      setSelectedLogIndex(0);
    }
  }, [selectedClient]);

  React.useEffect(() => {
    if (plans.length > 0 && !selectedPlanId) {
      setSelectedPlanId(plans[0].id);
    }
  }, [plans, selectedPlanId]);

  const generateNewKey = () => {
    setNewAccessCode(`TAMI-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const uniqueClients = React.useMemo(() => {
    const seen = new Set<string>();
    return clients.filter(c => {
      const isTrainerDoc = 
        c.id === 'trainer-profile' || 
        c.id === 'system-settings' ||
        c.id === 'trainer-profile-meta' ||
        (c as any).role === 'trainer' ||
        c.name.trim().toLowerCase() === 'tamifit' ||
        c.name.trim().toLowerCase() === 'tami fit';
      if (isTrainerDoc) return false;
      const key = (c.id || c.username || c.email || c.name || '').trim().toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [clients]);

  const filteredClients = uniqueClients.filter(c => {
    const matchesFilter = filter === 'all' || c.status === filter;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.email.toLowerCase().includes(search.toLowerCase()) ||
                          (c.username && c.username.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName) return;

    const cleanSuggestedUser = newName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, '');
    const finalUsername = (newUsername.trim().toLowerCase() || cleanSuggestedUser || `alumno${Date.now().toString().slice(-4)}`);
    const email = newEmail || `${finalUsername}@tamifit.app`;
    const chosenPlan = plans.find(p => p.id === selectedPlanId) || plans[0];

    const newClientData: Partial<Client> = {
      name: newName,
      username: finalUsername,
      email: email,
      phone: newPhone || '+34 600 000 000',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`,
      accessCode: newAccessCode,
      goal: newGoal,
      status: 'active',
      startWeight: parseFloat(newWeight) || 75,
      currentWeight: parseFloat(newWeight) || 75,
      targetWeight: parseFloat(newTargetWeight) || 78,
      height: parseFloat(newHeight) || 175,
      adherenceRate: 100,
      currentPlanId: chosenPlan?.id,
      currentPlanName: chosenPlan?.title,
      unreadMessagesCount: 0,
      joinedDate: 'Hoy',
      lastActive: 'Hace un momento',
      privateNotes: newNotes,
      checkins: []
    };

    onAddNewClient(newClientData);

    // Save info to display credential modal
    setCreatedStudentDetails({
      name: newName,
      username: finalUsername,
      email: email,
      accessCode: newAccessCode,
      phone: newPhone
    });

    setIsNewClientModalOpen(false);
    // Reset form
    setNewName('');
    setNewUsername('');
    setUsernameManuallyEdited(false);
    setNewEmail('');
    setNewPhone('');
    setNewNotes('');
    setNewAccessCode(`TAMI-${Math.floor(1000 + Math.random() * 9000)}`);
  };

  const getWhatsAppMessage = (student: { name: string; username?: string; email: string; accessCode: string }) => {
    const userDisplay = student.username || student.name.toLowerCase().replace(/\s+/g, '');
    return `¡Hola ${student.name}! 💪 Ya tienes activado tu acceso personal en TamiFit:\n\n🔗 Acceso: ${window.location.origin}\n👤 Usuario: ${userDisplay}\n🔑 Contraseña: ${student.accessCode}\n\nEntra para ver tu rutina asignada y empezar a registrar tus entrenamientos. ¡A por todas!`;
  };

  const handleCopyInvite = (student: { name: string; username?: string; email: string; accessCode: string }) => {
    const text = getWhatsAppMessage(student);
    navigator.clipboard.writeText(text);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2500);
  };

  const handleCopyKeyOnly = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleOpenWhatsApp = (student: { name: string; username?: string; email: string; accessCode: string; phone: string }) => {
    const cleanPhone = student.phone.replace(/[^0-9]/g, '');
    const text = encodeURIComponent(getWhatsAppMessage(student));
    const url = cleanPhone ? `https://wa.me/${cleanPhone}?text=${text}` : `https://wa.me/?text=${text}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6 w-full max-w-[1750px] mx-auto pb-12">
      {/* Top Controls: Search + Filter Tabs + New Client Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Filters */}
        <div className="flex items-center gap-1.5 p-1 bg-[#12151D] border border-[#232938] rounded-xl self-start sm:self-auto flex-wrap">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'all' ? 'bg-[#E2FB3A] text-black shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            Todos ({uniqueClients.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'active' ? 'bg-[#E2FB3A] text-black shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            Activos ({uniqueClients.filter(c => c.status === 'active').length})
          </button>
          <button
            onClick={() => setFilter('pending_review')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'pending_review' ? 'bg-[#E2FB3A] text-black shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            Revisión Pendiente ({uniqueClients.filter(c => c.status === 'pending_review').length})
          </button>
          <button
            onClick={() => setFilter('paused')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              filter === 'paused' ? 'bg-[#E2FB3A] text-black shadow-sm' : 'text-gray-400 hover:text-white'
            }`}
          >
            Pausados ({uniqueClients.filter(c => c.status === 'paused').length})
          </button>
        </div>

        {/* Search & Add Client */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-72">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, usuario o email..."
              className="w-full bg-[#12151D] text-xs text-white placeholder-gray-500 pl-8 pr-3 py-2 rounded-xl border border-[#232938] focus:outline-none focus:border-[#E2FB3A]"
            />
          </div>
          <button
            onClick={() => setIsNewClientModalOpen(true)}
            className="bg-[#E2FB3A] hover:bg-[#ccee24] text-black font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-[#E2FB3A]/20 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Añadir Alumno</span>
          </button>
        </div>
      </div>

      {/* Main Content Area: Left Client List, Right Client Detail Profile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Client Cards List */}
        <div className="lg:col-span-5 xl:col-span-4 space-y-3 lg:max-h-[calc(100vh-210px)] lg:overflow-y-auto lg:pr-1.5 scrollbar-thin">
          {filteredClients.length === 0 ? (
            <div className="bg-[#12151D] rounded-2xl border border-[#232938] p-8 text-center">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white">
                {clients.length === 0 ? 'No hay alumnos registrados' : 'No se encontraron alumnos'}
              </h3>
              <p className="text-xs text-gray-400 mt-1 max-w-xs mx-auto">
                {clients.length === 0
                  ? 'Da de alta a tus alumnos desde aquí. Sus datos se guardarán de forma permanente en la nube y podrás darles su clave para acceder.'
                  : 'Prueba a cambiar los filtros o el texto de búsqueda.'}
              </p>
              {clients.length === 0 && (
                <button
                  onClick={() => setIsNewClientModalOpen(true)}
                  className="mt-4 bg-[#E2FB3A] text-black font-extrabold text-xs px-4 py-2.5 rounded-xl inline-flex items-center gap-2 shadow-lg shadow-[#E2FB3A]/20"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Dar de alta al primer alumno</span>
                </button>
              )}
            </div>
          ) : (
            filteredClients.map((client) => {
              const isSelected = selectedClient?.id === client.id;
              return (
                <div
                  key={client.id}
                  onClick={() => onSelectClient(client)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-[#181D27] border-[#E2FB3A] shadow-lg shadow-[#E2FB3A]/10'
                      : 'bg-[#12151D] border-[#232938] hover:border-[#333C50]'
                  }`}
                >
                  {client.unreadMessagesCount > 0 && (
                    <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E2FB3A] text-black">
                      {client.unreadMessagesCount} msg
                    </span>
                  )}

                  <div className="flex items-start gap-3.5">
                    <div className="relative">
                      <img
                        src={client.avatar}
                        alt={client.name}
                        className="w-12 h-12 rounded-full object-cover border border-[#2B3344]"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#12151D] ${
                          client.status === 'active'
                            ? 'bg-emerald-500'
                            : client.status === 'pending_review'
                            ? 'bg-amber-400'
                            : 'bg-gray-500'
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-white truncate">{client.name}</h4>
                        <span className="text-[10px] text-gray-500">{client.lastActive}</span>
                      </div>
                      <p className="text-[11px] text-gray-400 truncate">{client.goal}</p>
                      
                      {/* Key badge if set */}
                      {client.accessCode && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-[#E2FB3A]">
                          <Key className="w-3 h-3" />
                          <span>Clave: {client.accessCode}</span>
                        </div>
                      )}

                      <div className="mt-2.5 flex items-center gap-3 text-[11px]">
                        <span className="text-gray-300 font-semibold">{client.currentWeight} kg</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-400">Meta: {client.targetWeight} kg</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-[#E2FB3A] font-medium">{client.adherenceRate}% adh.</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Client Detail Profile */}
        <div className="lg:col-span-7 xl:col-span-8">
          {selectedClient ? (
            <div className="bg-[#12151D] rounded-2xl border border-[#232938] p-4 sm:p-6 space-y-5 sm:space-y-6">
              {/* Back to clients list on tablet/mobile */}
              <button
                type="button"
                onClick={() => onSelectClient(null)}
                className="lg:hidden flex items-center gap-1.5 text-xs text-gray-400 hover:text-white py-1 px-2.5 rounded-lg bg-[#161A23] border border-[#232938] w-fit cursor-pointer mb-2"
              >
                <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                <span>Volver a la lista de alumnos</span>
              </button>

              {/* Header Profile with Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#232938]">
                <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                  <button
                    type="button"
                    onClick={() => setIsAvatarModalOpen(true)}
                    className="relative group shrink-0 cursor-pointer"
                    title="Cambiar foto de este alumno"
                  >
                    <img
                      src={selectedClient.avatar}
                      alt={selectedClient.name}
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-[#E2FB3A]/40"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-5 h-5 text-[#E2FB3A]" />
                    </div>
                    {/* Always visible camera badge */}
                    <div className="absolute -bottom-1 -right-1 bg-[#E2FB3A] text-black p-1 rounded-full shadow-md">
                      <Camera className="w-3 h-3 stroke-[2.5]" />
                    </div>
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm sm:text-base font-extrabold text-white truncate">{selectedClient.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold shrink-0">
                        {selectedClient.status === 'active' ? 'Activo' : selectedClient.status}
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsAvatarModalOpen(true)}
                        className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-[#E2FB3A] bg-[#E2FB3A]/10 hover:bg-[#E2FB3A]/20 px-2 py-0.5 rounded-md border border-[#E2FB3A]/30 transition-colors cursor-pointer"
                        title="Cambiar foto de este alumno"
                      >
                        <Camera className="w-3 h-3" />
                        <span>Cambiar foto</span>
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5 truncate">{selectedClient.email} • {selectedClient.phone}</p>
                    <p className="text-[11px] text-[#E2FB3A] font-semibold mt-1">
                      Objetivo: {selectedClient.goal}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onOpenChatWith(selectedClient.id)}
                    className="flex items-center gap-1.5 bg-[#202532] hover:bg-[#282F3E] text-white text-xs font-bold px-3 py-2 rounded-xl border border-[#2D3547] transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#E2FB3A]" />
                    <span>Chat</span>
                  </button>
                  {onDeleteClient && (
                    <button
                      onClick={() => setClientToDelete(selectedClient)}
                      title="Eliminar alumno permanentemente"
                      className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Sub-tabs de la Ficha del Alumno */}
              <div className="flex items-center gap-2 border-b border-[#232938] pb-3 overflow-x-auto scrollbar-none">
                <button
                  type="button"
                  onClick={() => setClientDetailTab('overview')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    clientDetailTab === 'overview'
                      ? 'bg-[#E2FB3A] text-black shadow-md shadow-[#E2FB3A]/20'
                      : 'bg-[#181D28] text-gray-400 hover:text-white'
                  }`}
                >
                  <Key className="w-3.5 h-3.5" />
                  <span>Ficha & Claves</span>
                </button>

                <button
                  type="button"
                  onClick={() => setClientDetailTab('workout_logs')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer relative ${
                    clientDetailTab === 'workout_logs'
                      ? 'bg-[#E2FB3A] text-black shadow-md shadow-[#E2FB3A]/20'
                      : 'bg-[#181D28] text-gray-400 hover:text-white'
                  }`}
                >
                  <Dumbbell className="w-3.5 h-3.5" />
                  <span>Cargas y Registro de Entrenos</span>
                  {selectedClient.workoutLogs && selectedClient.workoutLogs.length > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      clientDetailTab === 'workout_logs' ? 'bg-black text-[#E2FB3A]' : 'bg-[#E2FB3A] text-black'
                    }`}>
                      {selectedClient.workoutLogs.length}
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setClientDetailTab('checkins')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer relative ${
                    clientDetailTab === 'checkins'
                      ? 'bg-[#E2FB3A] text-black shadow-md shadow-[#E2FB3A]/20'
                      : 'bg-[#181D28] text-gray-400 hover:text-white'
                  }`}
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Revisiones ({selectedClient.checkins?.length || 0})</span>
                </button>
              </div>

              {/* TAB 1: OVERVIEW & CREDENTIALS */}
              {clientDetailTab === 'overview' && (
                <div className="space-y-6">
                  {/* Student Cloud Access Credentials Card */}
                  <div className="p-4 rounded-xl bg-[#171B24] border border-[#262E3E] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-white">
                        <Key className="w-4 h-4 text-[#E2FB3A]" />
                        <span>Clave de Acceso para el Alumno</span>
                      </div>
                      <p className="text-[11px] text-gray-400">
                        Usuario: <span className="text-[#E2FB3A] font-mono font-bold">{selectedClient.username || selectedClient.name.toLowerCase().replace(/\s+/g, '')}</span> • Clave de acceso:
                      </p>
                      <div className="pt-1 flex items-center gap-2">
                        <span className="font-mono font-extrabold text-sm px-2.5 py-1 rounded bg-[#0E1015] border border-[#2E374A] text-[#E2FB3A]">
                          {selectedClient.accessCode || 'TAMI-1001'}
                        </span>
                        <button
                          onClick={() => handleCopyKeyOnly(selectedClient.accessCode || 'TAMI-1001')}
                          className="text-xs text-gray-300 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-[#202634]"
                        >
                          {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey ? 'Copiada' : 'Copiar clave'}</span>
                        </button>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        onClick={() => handleCopyInvite({
                          name: selectedClient.name,
                          username: selectedClient.username,
                          email: selectedClient.email,
                          accessCode: selectedClient.accessCode || 'TAMI-1001'
                        })}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#202735] hover:bg-[#283143] text-xs font-bold text-white border border-[#2C364A] transition-all"
                      >
                        {copiedInvite ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-[#E2FB3A]" />}
                        <span>{copiedInvite ? '¡Copiado!' : 'Copiar invitación'}</span>
                      </button>
                      <button
                        onClick={() => handleOpenWhatsApp({
                          name: selectedClient.name,
                          username: selectedClient.username,
                          email: selectedClient.email,
                          accessCode: selectedClient.accessCode || 'TAMI-1001',
                          phone: selectedClient.phone
                        })}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>

                  {/* Bio Stats Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#171B24] border border-[#242A39]">
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">Peso Actual</span>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-xl font-black text-white">{selectedClient.currentWeight}</span>
                        <span className="text-xs text-gray-400">kg</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 mt-1 block">
                        {selectedClient.currentWeight > selectedClient.startWeight ? '+' : ''}
                        {(selectedClient.currentWeight - selectedClient.startWeight).toFixed(1)} kg desde inicio
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#171B24] border border-[#242A39]">
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">Objetivo</span>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-xl font-black text-[#E2FB3A]">{selectedClient.targetWeight}</span>
                        <span className="text-xs text-gray-400">kg</span>
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        Faltan {Math.abs(selectedClient.targetWeight - selectedClient.currentWeight).toFixed(1)} kg
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#171B24] border border-[#242A39]">
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">Estatura</span>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-xl font-black text-white">{selectedClient.height}</span>
                        <span className="text-xs text-gray-400">cm</span>
                      </div>
                      <span className="text-[10px] text-gray-400 mt-1 block">
                        IMC ~{((selectedClient.currentWeight / ((selectedClient.height / 100) ** 2))).toFixed(1)}
                      </span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#171B24] border border-[#242A39]">
                      <span className="text-[10px] text-gray-400 uppercase font-semibold block">Adherencia</span>
                      <div className="mt-1 flex items-baseline gap-1">
                        <span className="text-xl font-black text-[#E2FB3A]">{selectedClient.adherenceRate}%</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 mt-1 block">Excelente</span>
                    </div>
                  </div>

                  {/* Active Assigned Routine */}
                  <div className="p-4 rounded-xl bg-[#171B24] border border-[#242A39] flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#E2FB3A]/10 text-[#E2FB3A] flex items-center justify-center shrink-0">
                        <Dumbbell className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Plan Activo del Alumno</span>
                          {planAssignedSuccess && (
                            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                              ✓ Cambiado con éxito
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <select
                            value={selectedClient.currentPlanId || (plans[0]?.id || '')}
                            onChange={(e) => {
                              const chosen = plans.find(p => p.id === e.target.value);
                              if (chosen) {
                                onAssignPlanToClient?.(selectedClient.id, chosen.id, chosen.title);
                                setPlanAssignedSuccess(true);
                                setTimeout(() => setPlanAssignedSuccess(false), 3000);
                              }
                            }}
                            className="bg-[#1C212E] border border-[#2D364A] text-xs font-bold text-white px-3 py-1.5 rounded-lg focus:outline-none focus:border-[#E2FB3A] cursor-pointer"
                          >
                            {plans.map(p => (
                              <option key={p.id} value={p.id} className="bg-[#1C212E] text-white">
                                {p.title} ({p.days?.length || 0} días)
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap self-start md:self-auto">
                      <button
                        type="button"
                        onClick={() => {
                          const targetPlanId = selectedClient.currentPlanId || plans[0]?.id;
                          if (targetPlanId) {
                            onEditPlan?.(targetPlanId);
                          }
                        }}
                        className="bg-[#E2FB3A] hover:bg-[#ccee24] text-black font-extrabold text-xs px-3.5 py-2 rounded-xl transition-all shadow-md shadow-[#E2FB3A]/20 flex items-center gap-1.5 cursor-pointer"
                        title="Modificar los ejercicios, series, cargas o días de esta rutina en el Creador"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Modificar Rutina</span>
                      </button>

                      {onCreateCustomPlan && (
                        <button
                          type="button"
                          onClick={() => onCreateCustomPlan(selectedClient.id, selectedClient.name)}
                          className="bg-[#1C212E] hover:bg-[#252C3D] text-gray-200 hover:text-white border border-[#2F394E] font-bold text-xs px-3 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                          title="Crear un plan exclusivo y personalizado para este alumno"
                        >
                          <Plus className="w-3.5 h-3.5 text-[#E2FB3A]" />
                          <span>Nuevo Plan Exclusivo</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Private Coach Notes */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-[#E2FB3A]" />
                        Notas Privadas del Entrenador (Guardadas en la nube)
                      </h4>
                      <button
                        onClick={() => onUpdateClientNotes(selectedClient.id, editingNotes)}
                        className="text-xs font-bold text-[#E2FB3A] hover:underline"
                      >
                        Guardar Notas
                      </button>
                    </div>
                    <textarea
                      rows={3}
                      value={editingNotes}
                      onChange={(e) => setEditingNotes(e.target.value)}
                      placeholder="Anota observaciones biomecánicas, lesiones pasadas, preferencias..."
                      className="w-full bg-[#171B24] text-xs text-white p-3 rounded-xl border border-[#242A39] focus:outline-none focus:border-[#E2FB3A]"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: CARGAS Y REGISTRO DE ENTRENOS (Feedback Hub) */}
              {clientDetailTab === 'workout_logs' && (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-gradient-to-r from-[#171B24] to-[#12161E] border border-[#262E3E]">
                    <div>
                      <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                        <Dumbbell className="w-4 h-4 text-[#E2FB3A]" />
                        <span>Registro de Cargas y Notas del Alumno</span>
                      </h4>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Pesos registrados y sensaciones de cada ejercicio para preparar tu feedback.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          const targetPlanId = selectedClient.currentPlanId || plans[0]?.id;
                          if (targetPlanId) {
                            onEditPlan?.(targetPlanId);
                          }
                        }}
                        className="bg-[#1C212E] hover:bg-[#252C3D] text-[#E2FB3A] border border-[#2E374C] font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Modificar los ejercicios y días de la rutina activa"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Modificar Rutina</span>
                      </button>

                      <button
                        onClick={() => onOpenChatWith(selectedClient.id)}
                        className="bg-[#E2FB3A] hover:bg-[#d6f028] text-black font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-[#E2FB3A]/20 transition-all cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Dar Feedback en Chat</span>
                      </button>
                    </div>
                  </div>

                  {selectedClient.workoutLogs && selectedClient.workoutLogs.length > 0 ? (
                    <div className="space-y-4">
                      {/* Selector de sesiones registradas */}
                      {selectedClient.workoutLogs.length > 1 && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                          {selectedClient.workoutLogs.map((log, idx) => (
                            <button
                              key={log.id || idx}
                              onClick={() => setSelectedLogIndex(idx)}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer ${
                                selectedLogIndex === idx
                                  ? 'bg-[#E2FB3A] text-black shadow-md'
                                  : 'bg-[#181D28] text-gray-400 hover:text-white'
                              }`}
                            >
                              {log.dayTitle} • {log.date}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Detalle de la sesión seleccionada */}
                      {(() => {
                        const currentLog = selectedClient.workoutLogs[selectedLogIndex] || selectedClient.workoutLogs[0];
                        if (!currentLog) return null;

                        return (
                          <div className="space-y-3">
                            <div className="p-3.5 rounded-xl bg-[#151922] border border-[#232B3B] flex items-center justify-between text-xs">
                              <div>
                                <span className="text-[10px] uppercase font-bold text-[#E2FB3A] tracking-wider block">
                                  Sesión Realizada
                                </span>
                                <span className="font-extrabold text-white text-sm">{currentLog.dayTitle}</span>
                                <span className="text-gray-400 text-xs ml-2">({currentLog.planTitle || 'Rutina'})</span>
                              </div>
                              <div className="text-right">
                                <span className="text-[10px] text-gray-500 block">Registrado</span>
                                <span className="font-semibold text-gray-300">{currentLog.date}</span>
                              </div>
                            </div>

                              {/* Tabla de Ejercicios, Cargas y Notas (Ensanchada para mayor legibilidad) */}
                              <div className="rounded-xl bg-[#12151D] border border-[#232938] overflow-hidden">
                                <div className="overflow-x-auto">
                                  <table className="w-full text-xs text-left">
                                    <thead>
                                      <tr className="bg-[#161A23] border-b border-[#232938] text-[10px] uppercase font-bold text-gray-400">
                                        <th className="py-3 px-4 w-12 text-center">#</th>
                                        <th className="py-3 px-4 min-w-[200px]">Ejercicio</th>
                                        <th className="py-3 px-4 text-center min-w-[200px]">Pauta Fijada por Coach</th>
                                        <th className="py-3 px-4 text-center text-[#E2FB3A] font-extrabold min-w-[130px]">Carga Alumno</th>
                                        <th className="py-3 px-4 text-emerald-400 min-w-[260px]">Notas & Sensaciones del Alumno</th>
                                        <th className="py-3 px-4 text-center w-24">Estado</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#1B202B]">
                                      {currentLog.exercises.map((ex, exIdx) => (
                                        <tr key={ex.exerciseId || exIdx} className="hover:bg-[#161A22] transition-colors">
                                          <td className="py-3.5 px-4 text-center font-bold text-gray-500">
                                            {exIdx + 1}
                                          </td>
                                          <td className="py-3.5 px-4">
                                            <div className="flex items-center gap-3">
                                              {ex.thumbnailUrl && (
                                                <img
                                                  src={ex.thumbnailUrl}
                                                  alt={ex.exerciseName}
                                                  className="w-10 h-10 rounded-xl object-cover border border-[#273042] shrink-0"
                                                />
                                              )}
                                              <div>
                                                <span className="font-bold text-white text-xs block leading-tight">
                                                  {ex.exerciseName}
                                                </span>
                                                {ex.muscleGroup && (
                                                  <span className="text-[10px] text-gray-400 font-medium">
                                                    {ex.muscleGroup}
                                                  </span>
                                                )}
                                              </div>
                                            </div>
                                          </td>

                                          {/* Pauta Entrenador */}
                                          <td className="py-3.5 px-4 text-center">
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#181D28] border border-[#242C3C] text-[11px]">
                                              <span className="font-bold text-white">{ex.plannedSets} series</span>
                                              <span className="text-gray-500">x</span>
                                              <span className="text-gray-300">{ex.plannedReps} reps</span>
                                              <span className="text-gray-500">•</span>
                                              <span className="text-[#E2FB3A] font-mono font-bold">RIR {ex.plannedRir}</span>
                                            </div>
                                          </td>

                                          {/* Carga del Alumno */}
                                          <td className="py-3.5 px-4 text-center">
                                            {ex.weight && ex.weight.trim() ? (
                                              <span className="inline-block font-mono font-black text-xs px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shadow-sm">
                                                {ex.weight}
                                              </span>
                                            ) : (
                                              <span className="text-[10px] text-gray-500 italic bg-[#171B24] px-2.5 py-1 rounded-lg border border-[#232938]">
                                                Sin peso
                                              </span>
                                            )}
                                          </td>

                                          {/* Notas del Alumno */}
                                          <td className="py-3.5 px-4">
                                            {ex.notes && ex.notes.trim() ? (
                                              <div className="p-3 rounded-xl bg-[#181D29] border border-[#262E3E] text-xs text-gray-200 flex items-start gap-2 shadow-sm">
                                                <MessageSquare className="w-3.5 h-3.5 text-[#E2FB3A] shrink-0 mt-0.5" />
                                                <span className="leading-relaxed font-medium">{ex.notes}</span>
                                              </div>
                                            ) : (
                                              <span className="text-[10px] text-gray-500 italic">
                                                Sin comentarios
                                              </span>
                                            )}
                                          </td>

                                          {/* Estado */}
                                          <td className="py-3.5 px-4 text-center">
                                            {ex.completed ? (
                                              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                                                <Check className="w-3 h-3 stroke-[2.5]" />
                                                <span>Hecho</span>
                                              </span>
                                            ) : (
                                              <span className="text-[10px] text-gray-500">Pendiente</span>
                                            )}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                          </div>
                        );
                      })()}
                    </div>
                  ) : (
                    <div className="p-8 text-center rounded-2xl bg-[#141822] border border-[#242C3C] space-y-3">
                      <Dumbbell className="w-10 h-10 text-gray-600 mx-auto" />
                      <h4 className="text-xs font-bold text-white">Sin registros de entrenamiento guardados aún</h4>
                      <p className="text-[11px] text-gray-400 max-w-sm mx-auto">
                        En cuanto el alumno rellene sus cargas y notas en su aplicación y pulse <span className="text-[#E2FB3A]">"Guardar Cargas"</span> o termine la sesión, aparecerán aquí en tiempo real para que puedas analizarlas y darle feedback.
                      </p>
                      {onUpdateClientWorkoutLogs && (
                        <button
                          type="button"
                          onClick={() => {
                            const samplePlan = plans.find(p => p.id === selectedClient.currentPlanId) || plans[0];
                            const sampleDay = samplePlan?.days[0];
                            if (!sampleDay) return;
                            const sampleLog: ClientDailyLog = {
                              id: `log-${Date.now()}`,
                              dayId: sampleDay.id,
                              dayTitle: sampleDay.title,
                              planTitle: samplePlan.title,
                              date: 'Hoy, ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                              completedAt: 'Hoy',
                              exercises: sampleDay.exercises.map((ex, idx) => ({
                                exerciseId: ex.id,
                                exerciseName: ex.exerciseName,
                                muscleGroup: ex.muscleGroup,
                                thumbnailUrl: ex.thumbnailUrl,
                                plannedSets: ex.setsCount || 3,
                                plannedReps: ex.reps || '10-12',
                                plannedRir: ex.rir || '3-2-2',
                                plannedRest: ex.restSeconds || 90,
                                weight: idx === 0 ? '70 kg' : idx === 1 ? '55 kg' : '12.5 kg',
                                notes: idx === 0 ? 'Sensación muy sólida, sin molestias en el hombro.' : 'Pude completar todas las repeticiones con buena técnica.',
                                completed: true
                              }))
                            };
                            onUpdateClientWorkoutLogs(selectedClient.id, [sampleLog]);
                          }}
                          className="mt-2 text-xs font-bold text-[#E2FB3A] hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Rellenar cargas de prueba para este alumno</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: CHECKINS */}
              {clientDetailTab === 'checkins' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[#171B24] border border-[#262E3E]">
                    <div className="flex items-center gap-2">
                      <Scale className="w-4 h-4 text-[#E2FB3A]" />
                      <h4 className="text-xs font-bold text-white">Historial de Revisiones Semanales</h4>
                    </div>
                    <span className="text-[10px] text-gray-400">{selectedClient.checkins?.length || 0} revisiones</span>
                  </div>

                  {selectedClient.checkins && selectedClient.checkins.length > 0 ? (
                    <div className="space-y-3">
                      {selectedClient.checkins.map((chk, cIdx) => (
                        <div key={chk.id || cIdx} className="p-4 rounded-xl bg-[#141822] border border-[#242C3C] space-y-2.5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5 text-[#E2FB3A]" />
                              <span className="text-xs font-bold text-white">{chk.date}</span>
                            </div>
                            <span className="text-xs font-mono font-bold text-emerald-400">{chk.weight} kg</span>
                          </div>
                          {chk.notes && (
                            <p className="text-xs text-gray-300 bg-[#10131A] p-2.5 rounded-lg border border-[#1E2432]">
                              "{chk.notes}"
                            </p>
                          )}
                          {chk.trainerFeedback && (
                            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                              <span className="font-bold block text-[10px] uppercase text-emerald-400 mb-0.5">Feedback Enviado:</span>
                              {chk.trainerFeedback}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 text-center rounded-xl bg-[#141822] border border-[#242C3C]">
                      <p className="text-xs text-gray-400">Este alumno aún no ha enviado ningún check-in semanal.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#12151D] rounded-2xl border border-[#232938] p-12 text-center">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-white">Selecciona un alumno</h3>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Haz clic en cualquier atleta de la lista para ver su clave de acceso, sus métricas y sus notas almacenadas en la nube.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add New Trainee */}
      {isNewClientModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141822] border border-[#283042] rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#242B3C]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-[#E2FB3A]" />
                Registrar Nuevo Alumno en la Nube
              </h3>
              <button
                onClick={() => setIsNewClientModalOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewName(val);
                    if (!usernameManuallyEdited) {
                      setNewUsername(val.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, ''));
                    }
                  }}
                  placeholder="Ej: Marcos García"
                  className="w-full bg-[#181D2A] text-xs text-white px-3 py-2 rounded-xl border border-[#2B3448] focus:outline-none focus:border-[#E2FB3A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-[#E2FB3A] block mb-1">
                    Usuario para Login *
                  </label>
                  <input
                    type="text"
                    required
                    value={newUsername}
                    onChange={(e) => {
                      setUsernameManuallyEdited(true);
                      setNewUsername(e.target.value.toLowerCase().replace(/[^a-z0-9._-]/g, ''));
                    }}
                    placeholder="marcos"
                    className="w-full bg-[#181D2A] text-xs font-mono font-bold text-white px-3 py-2 rounded-xl border border-[#2B3448] focus:outline-none focus:border-[#E2FB3A]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                    Teléfono (Para WhatsApp)
                  </label>
                  <input
                    type="tel"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    placeholder="+34 600..."
                    className="w-full bg-[#181D2A] text-xs text-white px-3 py-2 rounded-xl border border-[#2B3448] focus:outline-none focus:border-[#E2FB3A]"
                  />
                </div>
              </div>

              {/* Access Key generation */}
              <div>
                <label className="text-[11px] font-semibold text-[#E2FB3A] block mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5" />
                    Clave de Acceso para el Alumno
                  </span>
                  <button
                    type="button"
                    onClick={generateNewKey}
                    className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Generar otra
                  </button>
                </label>
                <input
                  type="text"
                  required
                  value={newAccessCode}
                  onChange={(e) => setNewAccessCode(e.target.value)}
                  className="w-full bg-[#181D2A] text-xs font-mono font-bold text-[#E2FB3A] px-3 py-2 rounded-xl border border-[#2B3448] focus:outline-none focus:border-[#E2FB3A]"
                />
                <p className="text-[10px] text-gray-500 mt-1">
                  Esta es la contraseña que le darás para que pueda entrar y ver su perfil.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                  Objetivo Principal
                </label>
                <select
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value as any)}
                  className="w-full bg-[#181D2A] text-xs text-white px-3 py-2 rounded-xl border border-[#2B3448] focus:outline-none focus:border-[#E2FB3A]"
                >
                  <option value="Hipertrofia">Hipertrofia (Ganar Masa Muscular)</option>
                  <option value="Definición / Pérdida de Grasa">Definición / Pérdida de Grasa</option>
                  <option value="Fuerza Máxima">Fuerza Máxima (Powerbuilding)</option>
                  <option value="Recomposición Corporal">Recomposición Corporal</option>
                  <option value="Salud y Movilidad">Salud y Rendimiento General</option>
                </select>
              </div>

              {plans.length > 0 && (
                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                    Rutina Asignada Inicial
                  </label>
                  <select
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                    className="w-full bg-[#181D2A] text-xs text-white px-3 py-2 rounded-xl border border-[#2B3448] focus:outline-none focus:border-[#E2FB3A]"
                  >
                    {plans.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.days.length} días)
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-3 gap-2.5">
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Peso Inicio (kg)</label>
                  <input
                    type="number"
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-full bg-[#181D2A] text-xs text-white px-2.5 py-2 rounded-xl border border-[#2B3448]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Peso Meta (kg)</label>
                  <input
                    type="number"
                    value={newTargetWeight}
                    onChange={(e) => setNewTargetWeight(e.target.value)}
                    className="w-full bg-[#181D2A] text-xs text-white px-2.5 py-2 rounded-xl border border-[#2B3448]"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">Altura (cm)</label>
                  <input
                    type="number"
                    value={newHeight}
                    onChange={(e) => setNewHeight(e.target.value)}
                    className="w-full bg-[#181D2A] text-xs text-white px-2.5 py-2 rounded-xl border border-[#2B3448]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-[#242B3C]">
                <button
                  type="button"
                  onClick={() => setIsNewClientModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-gray-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#E2FB3A] hover:bg-[#ccee24] text-black font-extrabold text-xs px-4 py-2 rounded-xl shadow-md shadow-[#E2FB3A]/20"
                >
                  Guardar en la Nube
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Student Created & Ready to Send Credentials */}
      {createdStudentDetails && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#141822] border border-[#283042] rounded-2xl w-full max-w-md p-6 space-y-5 shadow-2xl">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              <h3 className="text-base font-black text-white">¡Alumno Registrado con Éxito!</h3>
              <p className="text-xs text-gray-400">
                El perfil está guardado en la nube permanente. Dale las claves a tu alumno para que empiece.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0E1015] border border-[#2A3346] space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Alumno:</span>
                <span className="font-bold text-white">{createdStudentDetails.name}</span>
              </div>
              <div className="flex justify-between text-xs items-center">
                <span className="text-[#E2FB3A] font-semibold">Usuario de acceso:</span>
                <span className="font-mono font-bold text-[#E2FB3A] bg-[#181D2A] px-2 py-0.5 rounded border border-[#323D52]">
                  {createdStudentDetails.username}
                </span>
              </div>
              <div className="flex justify-between text-xs items-center pt-1 border-t border-[#222838]">
                <span className="text-[#E2FB3A] font-semibold flex items-center gap-1">
                  <Key className="w-3.5 h-3.5" /> Clave de acceso:
                </span>
                <span className="font-mono font-extrabold text-sm text-[#E2FB3A] bg-[#181D2A] px-2 py-0.5 rounded border border-[#323D52]">
                  {createdStudentDetails.accessCode}
                </span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => handleOpenWhatsApp(createdStudentDetails)}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enviar datos por WhatsApp</span>
              </button>

              <button
                onClick={() => handleCopyInvite(createdStudentDetails)}
                className="w-full bg-[#1E2432] hover:bg-[#283042] text-white font-bold text-xs py-2.5 rounded-xl border border-[#2D364A] flex items-center justify-center gap-2 transition-all"
              >
                {copiedInvite ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-[#E2FB3A]" />}
                <span>{copiedInvite ? '¡Mensaje Copiado al Portapapeles!' : 'Copiar texto para enviar'}</span>
              </button>

              <button
                onClick={() => setCreatedStudentDetails(null)}
                className="w-full text-xs font-semibold text-gray-400 hover:text-white pt-2"
              >
                Cerrar y continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete Client */}
      {clientToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141822] border border-rose-500/30 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-white">¿Eliminar a {clientToDelete.name}?</h3>
              <p className="text-xs text-gray-400">
                Esta acción eliminará el alumno de la nube de forma permanente, incluyendo su acceso y su historial.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => setClientToDelete(null)}
                className="flex-1 bg-[#1E2432] text-gray-300 font-semibold text-xs py-2.5 rounded-xl hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  if (onDeleteClient) {
                    onDeleteClient(clientToDelete.id);
                  }
                  setClientToDelete(null);
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-lg shadow-rose-600/30"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Modal for editing selected client avatar */}
      {selectedClient && (
        <AvatarEditModal
          isOpen={isAvatarModalOpen}
          onClose={() => setIsAvatarModalOpen(false)}
          currentAvatar={selectedClient.avatar}
          title={`Foto de Perfil de ${selectedClient.name}`}
          subtitle="La foto se actualizará en tiempo real en la ficha del alumno y en su app móvil"
          onSave={async (newUrl) => {
            if (onUpdateClientAvatar) {
              await onUpdateClientAvatar(selectedClient.id, newUrl);
            }
          }}
        />
      )}
    </div>
  );
};
