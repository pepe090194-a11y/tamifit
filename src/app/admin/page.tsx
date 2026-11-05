'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Header } from '@/components/Header';
import { TrainerDashboard } from '@/components/TrainerDashboard';
import { ClientsManager } from '@/components/ClientsManager';
import { WorkoutBuilder } from '@/components/WorkoutBuilder';
import { ExerciseLibrary } from '@/components/ExerciseLibrary';
import { TrainerChat } from '@/components/TrainerChat';
import { CheckinsView } from '@/components/CheckinsView';
import { LoginScreen } from '@/components/LoginScreen';
import { LayoutDashboard, Users, Dumbbell, MessageSquare, Menu } from 'lucide-react';

import {
  INITIAL_PLANS,
  INITIAL_EXERCISES
} from '@/data/mockData';
import { Client, WorkoutPlan, Exercise, ChatMessage, WeeklyFeedback, ClientDailyLog, TrainerProfile } from '@/types';
import {
  subscribeToClients,
  saveClientToCloud,
  updateClientInCloud,
  deleteClientFromCloud,
  subscribeToPlans,
  savePlanToCloud,
  deletePlanFromCloud,
  subscribeToExercises,
  saveExerciseToCloud,
  deleteExerciseFromCloud,
  subscribeToAllMessages,
  sendChatMessageToCloud,
  markClientMessagesAsRead,
  subscribeToTrainerProfile,
  updateTrainerProfileInCloud,
  DEFAULT_TRAINER_PROFILE
} from '@/lib/firestoreService';

export default function AdminPage() {
  const [sessionRole, setSessionRole] = useState<'checking' | 'guest' | 'trainer'>('checking');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Application Data States
  const [clients, setClients] = useState<Client[]>([]);
  const [plans, setPlans] = useState<WorkoutPlan[]>(INITIAL_PLANS);
  const [exercises, setExercises] = useState<Exercise[]>(INITIAL_EXERCISES);
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({});
  const [trainerProfile, setTrainerProfile] = useState<TrainerProfile>(DEFAULT_TRAINER_PROFILE);

  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [activeChatClientId, setActiveChatClientId] = useState<string>('');
  const [selectedPlanIdForBuilder, setSelectedPlanIdForBuilder] = useState<string | null>(null);

  const [dismissedChatBadge, setDismissedChatBadge] = useState(false);
  const [dismissedReviewsBadge, setDismissedReviewsBadge] = useState(false);

  // 1. Verify session on mount
  useEffect(() => {
    async function verifyTrainerSession() {
      if (typeof window === 'undefined') return;
      const token = localStorage.getItem('tamifit_session_token');
      if (!token) {
        setSessionRole('guest');
        return;
      }

      try {
        const res = await fetch('/api/auth/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token })
        });
        const data = await res.json();

        if (data.valid && data.role === 'trainer') {
          setSessionRole('trainer');
        } else {
          setSessionRole('guest');
        }
      } catch (err) {
        setSessionRole('guest');
      }
    }

    verifyTrainerSession();
  }, []);

  // 2. Real-time subscriptions for Trainer
  useEffect(() => {
    if (sessionRole !== 'trainer') return;

    const unsubClients = subscribeToClients((cloudClients) => {
      const uniqueMap = new Map<string, Client>();
      cloudClients.forEach(c => {
        const key = c.id || (c.username || c.email || c.name || '').trim().toLowerCase();
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, c);
        }
      });

      const finalClients = Array.from(uniqueMap.values());
      setClients(finalClients);
      setSelectedClient((prev) => {
        if (!prev) return finalClients[0] || null;
        const updated = finalClients.find(c => c.id === prev.id);
        return updated || finalClients[0] || null;
      });
      if (finalClients.length > 0 && !activeChatClientId) {
        setActiveChatClientId(finalClients[0].id);
      }
    });

    const unsubPlans = subscribeToPlans((cloudPlans) => {
      if (cloudPlans.length > 0) setPlans(cloudPlans);
    });

    const unsubExercises = subscribeToExercises((cloudExercises) => {
      if (cloudExercises.length > 0) setExercises(cloudExercises);
    });

    const unsubMsgs = subscribeToAllMessages((allMsgs) => {
      setMessages(allMsgs);
    });

    const unsubProfile = subscribeToTrainerProfile((profile) => {
      setTrainerProfile(profile);
    });

    return () => {
      unsubClients();
      unsubPlans();
      unsubExercises();
      unsubMsgs();
      unsubProfile();
    };
  }, [sessionRole, activeChatClientId]);

  // 3. Login Handler for Trainer
  const handleTrainerLogin = async (username: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pass })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return { success: false, error: 'Usuario o contraseña incorrectos.' };
      }

      if (data.role !== 'trainer') {
        return {
          success: false,
          error: 'Usuario o contraseña incorrectos.'
        };
      }

      localStorage.setItem('tamifit_session_token', data.token);
      setSessionRole('trainer');
      return { success: true };
    } catch (err) {
      return { success: false, error: 'Error al conectar con el servidor de autenticación.' };
    }
  };

  const handleTrainerLogout = () => {
    localStorage.removeItem('tamifit_session_token');
    setSessionRole('guest');
  };

  // Handlers for managing clients and workout plans
  const handleAddNewClient = async (newClientData: Partial<Client>) => {
    const generatedCode = newClientData.accessCode || `TAMI-${Math.floor(1000 + Math.random() * 9000)}`;
    const finalUser = newClientData.username || (newClientData.name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const newClient: Client = {
      id: `cli-${Date.now()}`,
      name: newClientData.name || 'Nuevo Alumno',
      username: finalUser,
      email: newClientData.email || `${finalUser}@tamifit.app`,
      phone: newClientData.phone || '+34 600 000 000',
      avatar: newClientData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      accessCode: generatedCode,
      goal: newClientData.goal || 'Hipertrofia',
      status: 'active',
      startWeight: newClientData.startWeight || 75,
      currentWeight: newClientData.currentWeight || 75,
      targetWeight: newClientData.targetWeight || 78,
      height: newClientData.height || 175,
      adherenceRate: 100,
      currentPlanId: newClientData.currentPlanId || plans[0]?.id,
      currentPlanName: newClientData.currentPlanName || plans[0]?.title,
      unreadMessagesCount: 0,
      joinedDate: 'Hoy',
      lastActive: 'Hace un momento',
      privateNotes: newClientData.privateNotes || '',
      checkins: []
    };

    await saveClientToCloud(newClient);
    setSelectedClient(newClient);
    setActiveChatClientId(newClient.id);
  };

  const handleDeleteClient = async (clientId: string) => {
    await deleteClientFromCloud(clientId);
    if (selectedClient?.id === clientId) {
      const remaining = clients.filter(c => c.id !== clientId);
      setSelectedClient(remaining[0] || null);
      if (remaining.length > 0) {
        setActiveChatClientId(remaining[0].id);
      }
    }
  };

  const handleUpdateClientNotes = async (clientId: string, notes: string) => {
    await updateClientInCloud(clientId, { privateNotes: notes });
    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient({ ...selectedClient, privateNotes: notes });
    }
  };

  const handleUpdateClientWorkoutLogs = async (clientId: string, logs: ClientDailyLog[]) => {
    await updateClientInCloud(clientId, { workoutLogs: logs });
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, workoutLogs: logs } : c));
    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient({ ...selectedClient, workoutLogs: logs });
    }
  };

  const handleUpdateClientAvatar = async (clientId: string, newAvatarUrl: string) => {
    await updateClientInCloud(clientId, { avatar: newAvatarUrl });
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, avatar: newAvatarUrl } : c));
    if (selectedClient?.id === clientId) {
      setSelectedClient(prev => prev ? { ...prev, avatar: newAvatarUrl } : null);
    }
  };

  const handleAssignPlanToClient = async (clientId: string, planId: string, planTitle: string) => {
    await updateClientInCloud(clientId, { currentPlanId: planId, currentPlanName: planTitle });
    setClients(prev => prev.map(c => c.id === clientId ? { ...c, currentPlanId: planId, currentPlanName: planTitle } : c));
    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient(prev => prev ? { ...prev, currentPlanId: planId, currentPlanName: planTitle } : null);
    }
  };

  const handleSavePlan = async (updatedPlan: WorkoutPlan) => {
    await savePlanToCloud(updatedPlan);
  };

  const handleDeletePlan = async (planId: string) => {
    await deletePlanFromCloud(planId);
    setPlans(prev => prev.filter(p => p.id !== planId));
  };

  const handleCreateCustomPlan = async (clientId: string, clientName: string) => {
    const newPlanId = `plan-${Date.now()}`;
    const newPlan: WorkoutPlan = {
      id: newPlanId,
      title: `Plan Personalizado • ${clientName}`,
      description: `Rutina personalizada para ${clientName}`,
      level: 'Intermedio',
      durationWeeks: 8,
      createdAt: new Date().toISOString().split('T')[0],
      days: [
        {
          id: `day-${Date.now()}-1`,
          title: 'Día 1: Torso / Fuerza',
          subtitle: 'Sesión principal',
          targetMuscleGroup: 'Cuerpo Completo',
          estimatedTimeMinutes: 60,
          exercises: []
        }
      ]
    };

    await savePlanToCloud(newPlan);
    await handleAssignPlanToClient(clientId, newPlanId, newPlan.title);
    setSelectedPlanIdForBuilder(newPlanId);
    setActiveTab('builder');
    setSelectedClient(null);
  };

  const handleAddNewExercise = async (newEx: Exercise) => {
    await saveExerciseToCloud(newEx);
  };

  const handleUpdateExercise = async (updatedEx: Exercise) => {
    await saveExerciseToCloud(updatedEx);
  };

  const handleDeleteExercise = async (exerciseId: string) => {
    await deleteExerciseFromCloud(exerciseId);
  };

  const handleSendTrainerMessage = async (clientId: string, text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      clientId,
      senderRole: 'trainer',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: true
    };

    await sendChatMessageToCloud(newMsg);
  };

  const handleClearUnreadMessages = async (clientId?: string) => {
    setDismissedChatBadge(true);
    const targetId = clientId || activeChatClientId || selectedClient?.id || clients[0]?.id;
    if (targetId) {
      await markClientMessagesAsRead(targetId);
      setMessages(prev => {
        const thread = prev[targetId] || [];
        return {
          ...prev,
          [targetId]: thread.map(m => ({ ...m, isRead: true }))
        };
      });
      setClients(prev => prev.map(c => c.id === targetId ? { ...c, unreadMessagesCount: 0 } : c));
    }
  };

  const handleClearPendingReviews = () => {
    setDismissedReviewsBadge(true);
  };

  const handleSendWeeklyFeedback = async (
    clientId: string,
    checkinId?: string,
    feedback?: string,
    videoUrl?: string,
    title?: string
  ) => {
    const clientToUpdate = clients.find(c => c.id === clientId);
    if (!clientToUpdate) return;

    const dateStr = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
    const feedbackTitle = title?.trim() || `Revisión Semanal • ${dateStr}`;

    const newFeedbackItem: WeeklyFeedback = {
      id: `fb-${Date.now()}`,
      title: feedbackTitle,
      date: dateStr,
      videoUrl: videoUrl?.trim() || undefined,
      content: feedback?.trim() || 'Revisión y ajustes técnicos semanales.',
      coachName: 'Tamara (Coach)',
      isNew: true
    };

    let updatedCheckins = clientToUpdate.checkins || [];
    if (checkinId) {
      updatedCheckins = updatedCheckins.map(chk => {
        if (chk.id === checkinId) {
          return {
            ...chk,
            trainerFeedback: feedback?.trim() || 'Revisión técnica completada por el coach.',
            trainerVideoUrl: videoUrl?.trim() || undefined,
            feedbackDate: dateStr
          };
        }
        return chk;
      });
    }

    const updatedFeedbacks = [newFeedbackItem, ...(clientToUpdate.feedbacks || [])];

    await updateClientInCloud(clientId, {
      checkins: updatedCheckins,
      feedbacks: updatedFeedbacks,
      status: 'active'
    });

    if (selectedClient && selectedClient.id === clientId) {
      setSelectedClient({
        ...selectedClient,
        checkins: updatedCheckins,
        feedbacks: updatedFeedbacks,
        status: 'active'
      });
    }

    setClients(prev => prev.map(c => c.id === clientId ? {
      ...c,
      checkins: updatedCheckins,
      feedbacks: updatedFeedbacks,
      status: 'active'
    } : c));
  };

  const handleUpdateTrainerAvatar = async (newAvatarUrl: string) => {
    await updateTrainerProfileInCloud({ avatar: newAvatarUrl });
    setTrainerProfile(prev => ({ ...prev, avatar: newAvatarUrl }));
  };

  const handleOpenChatWith = (clientId: string) => {
    setActiveChatClientId(clientId);
    const target = clients.find(c => c.id === clientId);
    if (target) setSelectedClient(target);
    setActiveTab('chat');
  };

  // Metrics
  const totalUnreadMessages = Object.values(messages).reduce(
    (acc, thread) => acc + (thread || []).filter(m => !m.isRead && m.senderRole === 'client').length,
    0
  );

  const pendingReviewsCount = clients.filter(c => 
    c.status === 'pending_review' || (c.checkins && c.checkins.some(chk => !chk.trainerFeedback))
  ).length;

  // 4. Loading Screen
  if (sessionRole === 'checking') {
    return (
      <div className="fixed inset-0 h-[100dvh] bg-[#07090C] text-[#F3F4F6] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-[#E2FB3A] border-t-transparent rounded-full animate-spin mb-4 shadow-lg shadow-[#E2FB3A]/20" />
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Verificando panel administrador...</p>
      </div>
    );
  }

  // 5. Trainer Login Screen
  if (sessionRole === 'guest') {
    return (
      <LoginScreen
        mode="trainer"
        title="Panel Entrenador"
        subtitle="Acceso exclusivo de administración y gestión TamiFit"
        onLogin={handleTrainerLogin}
      />
    );
  }

  // 6. Complete Trainer Dashboard
  return (
    <div className="flex h-screen bg-[#090A0C] text-[#F3F4F6] overflow-hidden select-none font-sans">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'chat') handleClearUnreadMessages();
          if (tab === 'checkins') handleClearPendingReviews();
        }}
        unreadCount={dismissedChatBadge ? 0 : totalUnreadMessages}
        pendingReviewsCount={dismissedReviewsBadge ? 0 : pendingReviewsCount}
        totalClients={clients.length}
        trainerProfile={trainerProfile}
        onUpdateTrainerAvatar={handleUpdateTrainerAvatar}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleTrainerLogout}
        onClearUnreadMessages={handleClearUnreadMessages}
        onClearPendingReviews={handleClearPendingReviews}
      />

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header
          activeTab={activeTab}
          onQuickNewClient={() => {
            setActiveTab('clients');
            handleAddNewClient({});
          }}
          onQuickNewRoutine={() => {
            setSelectedPlanIdForBuilder(null);
            setActiveTab('builder');
          }}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          trainerProfile={trainerProfile}
          onUpdateTrainerAvatar={handleUpdateTrainerAvatar}
          onLogout={handleTrainerLogout}
        />

        <main className="flex-1 overflow-y-auto p-3 sm:p-5 lg:p-7 xl:p-8 bg-[#090A0C] pb-24 lg:pb-8">
          {activeTab === 'dashboard' && (
            <TrainerDashboard
              clients={clients}
              plans={plans}
              onSelectClient={(c) => {
                setSelectedClient(c);
                setActiveTab('clients');
              }}
              onNavigate={(tab) => setActiveTab(tab)}
              trainerProfile={trainerProfile}
              onUpdateTrainerAvatar={handleUpdateTrainerAvatar}
            />
          )}

          {activeTab === 'clients' && (
            <ClientsManager
              clients={clients}
              plans={plans}
              selectedClient={selectedClient}
              onSelectClient={(c) => setSelectedClient(c)}
              onOpenChatWith={handleOpenChatWith}
              onAddNewClient={handleAddNewClient}
              onUpdateClientNotes={handleUpdateClientNotes}
              onDeleteClient={handleDeleteClient}
              onUpdateClientWorkoutLogs={handleUpdateClientWorkoutLogs}
              onUpdateClientAvatar={handleUpdateClientAvatar}
              onAssignPlanToClient={handleAssignPlanToClient}
              onEditPlan={(planId) => {
                setSelectedPlanIdForBuilder(planId);
                setActiveTab('builder');
                setSelectedClient(null);
              }}
              onCreateCustomPlan={handleCreateCustomPlan}
            />
          )}

          {activeTab === 'builder' && (
            <WorkoutBuilder
              plans={plans}
              exercises={exercises}
              clients={clients}
              onSavePlan={handleSavePlan}
              onAssignPlanToClient={handleAssignPlanToClient}
              selectedPlanId={selectedPlanIdForBuilder}
              onDeletePlan={handleDeletePlan}
            />
          )}

          {activeTab === 'exercises' && (
            <ExerciseLibrary
              exercises={exercises}
              onAddNewExercise={handleAddNewExercise}
              onUpdateExercise={handleUpdateExercise}
              onDeleteExercise={handleDeleteExercise}
            />
          )}

          {activeTab === 'chat' && (
            <TrainerChat
              clients={clients}
              activeClientId={activeChatClientId || selectedClient?.id || ''}
              setActiveClientId={(id) => {
                setActiveChatClientId(id);
                handleClearUnreadMessages(id);
              }}
              messages={messages}
              onSendMessage={handleSendTrainerMessage}
              onMarkAsRead={handleClearUnreadMessages}
            />
          )}

          {activeTab === 'checkins' && (
            <CheckinsView
              clients={clients}
              onSendFeedback={handleSendWeeklyFeedback}
              onClearPendingReviews={handleClearPendingReviews}
            />
          )}
        </main>

        {/* Mobile Bottom Navigation Bar for Trainer */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0E1014]/95 backdrop-blur-md border-t border-[#222732] flex items-center justify-around h-[calc(3.75rem+env(safe-area-inset-bottom,0px))] pb-[env(safe-area-inset-bottom,0px)] px-1 select-none shadow-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 min-h-[44px] py-1 text-[10px] font-bold transition-colors cursor-pointer ${
              activeTab === 'dashboard' ? 'text-[#E2FB3A]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Panel</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('clients')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 min-h-[44px] py-1 text-[10px] font-bold transition-colors cursor-pointer relative ${
              activeTab === 'clients' ? 'text-[#E2FB3A]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Alumnos</span>
            {clients.length > 0 && (
              <span className="absolute top-1 right-2 sm:right-3 text-[9px] px-1 rounded-full bg-[#1F2533] text-gray-300 font-bold border border-[#2D374B]">
                {clients.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('builder')}
            className={`flex-1 flex flex-col items-center justify-center gap-1 min-h-[44px] py-1 text-[10px] font-bold transition-colors cursor-pointer ${
              activeTab === 'builder' ? 'text-[#E2FB3A]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-4 h-4" />
            <span>Rutinas</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('chat');
              handleClearUnreadMessages();
            }}
            className={`flex-1 flex flex-col items-center justify-center gap-1 min-h-[44px] py-1 text-[10px] font-bold transition-colors cursor-pointer relative ${
              activeTab === 'chat' ? 'text-[#E2FB3A]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat</span>
            {!dismissedChatBadge && totalUnreadMessages > 0 && (
              <span className="absolute top-1 right-2 sm:right-3 w-4 h-4 rounded-full bg-[#E2FB3A] text-black text-[9px] font-extrabold flex items-center justify-center shadow-sm">
                {totalUnreadMessages}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className={`flex-1 flex flex-col items-center justify-center gap-1 min-h-[44px] py-1 text-[10px] font-bold transition-colors cursor-pointer relative ${
              isSidebarOpen ? 'text-[#E2FB3A]' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Menu className="w-4 h-4" />
            <span>Menú</span>
            {!dismissedReviewsBadge && pendingReviewsCount > 0 && (
              <span className="absolute top-1.5 right-3 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            )}
          </button>
        </nav>
      </div>
    </div>
  );
}
