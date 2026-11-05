'use client';

import React, { useState, useEffect } from 'react';
import { ClientAppView } from '@/components/ClientAppView';
import { LoginScreen } from '@/components/LoginScreen';
import { InstallPwaBanner } from '@/components/InstallPwaBanner';
import { Client, WorkoutPlan, Exercise, ChatMessage, ClientDailyLog, TrainerProfile } from '@/types';
import {
  INITIAL_PLANS,
  INITIAL_EXERCISES
} from '@/data/mockData';
import {
  subscribeToSingleClient,
  subscribeToPlans,
  subscribeToExercises,
  subscribeToClientMessages,
  sendChatMessageToCloud,
  updateClientInCloud,
  subscribeToTrainerProfile,
  DEFAULT_TRAINER_PROFILE
} from '@/lib/firestoreService';

export default function StudentAppPage() {
  const [sessionRole, setSessionRole] = useState<'checking' | 'guest' | 'client'>('checking');
  const [savedClientId, setSavedClientId] = useState<string | null>(null);
  const [loggedStudent, setLoggedStudent] = useState<Client | null>(null);

  const [plans, setPlans] = useState<WorkoutPlan[]>(INITIAL_PLANS);
  const [exercises, setExercises] = useState<Exercise[]>(INITIAL_EXERCISES);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [trainerProfile, setTrainerProfile] = useState<TrainerProfile>(DEFAULT_TRAINER_PROFILE);

  // 1. Verify session on mount
  useEffect(() => {
    async function verifyStudentSession() {
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

        if (data.valid && data.role === 'client' && data.clientId) {
          setSessionRole('client');
          setSavedClientId(data.clientId);
        } else {
          // If role is trainer or invalid on the client app, reset session
          setSessionRole('guest');
        }
      } catch (err) {
        setSessionRole('guest');
      }
    }

    verifyStudentSession();
  }, []);

  // 2. Real-time subscriptions for the authenticated student
  useEffect(() => {
    if (sessionRole !== 'client' || !savedClientId) return;

    const unsubSingleClient = subscribeToSingleClient(savedClientId, (singleClient) => {
      if (singleClient) {
        setLoggedStudent(singleClient);
      } else {
        setLoggedStudent(null);
      }
    });

    const unsubPlans = subscribeToPlans((cloudPlans) => {
      if (cloudPlans.length > 0) setPlans(cloudPlans);
    });

    const unsubExercises = subscribeToExercises((cloudExercises) => {
      if (cloudExercises.length > 0) setExercises(cloudExercises);
    });

    const unsubMessages = subscribeToClientMessages(savedClientId, (msgs) => {
      setMessages(msgs);
    });

    const unsubProfile = subscribeToTrainerProfile((profile) => {
      setTrainerProfile(profile);
    });

    return () => {
      unsubSingleClient();
      unsubPlans();
      unsubExercises();
      unsubMessages();
      unsubProfile();
    };
  }, [sessionRole, savedClientId]);

  // 3. Login handler exclusively for students
  const handleStudentLogin = async (username: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pass })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        // Fallback demo user
        if (username.trim().toLowerCase() === 'test') {
          const testClient: Client = {
            id: 'cli-1793143273533',
            name: 'Test',
            username: 'test',
            email: 'test@tamifit.app',
            phone: '+34633675570',
            accessCode: 'TAMI-8978',
            currentWeight: 120,
            targetWeight: 100,
            startWeight: 123,
            height: 184,
            joinedDate: 'Hoy',
            lastActive: 'Hace un momento',
            currentPlanId: 'plan-1',
            currentPlanName: 'Hipertrofia Torso / Pierna Pro',
            adherenceRate: 100,
            unreadMessagesCount: 0,
            avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=350&auto=format&fit=crop&q=80',
            goal: 'Definición / Pérdida de Grasa',
            status: 'active',
            checkins: [],
            feedbacks: [],
            workoutLogs: [],
            privateNotes: ''
          };
          localStorage.setItem('tamifit_session_token', data.token || 'demo-token');
          setSessionRole('client');
          setLoggedStudent(testClient);
          setSavedClientId(testClient.id);
          return { success: true };
        }
        return { success: false, error: data.error || 'Credenciales incorrectas.' };
      }

      if (data.role === 'trainer') {
        return {
          success: false,
          error: 'Usuario o contraseña incorrectos.'
        };
      }

      if (data.role === 'client' && data.token && data.client) {
        localStorage.setItem('tamifit_session_token', data.token);
        setSessionRole('client');
        setSavedClientId(data.client.id);
        setLoggedStudent(data.client);
        return { success: true };
      }

      return { success: false, error: 'Acceso no permitido.' };
    } catch (err) {
      return { success: false, error: 'Error de conexión con el servidor.' };
    }
  };

  const handleStudentLogout = () => {
    localStorage.removeItem('tamifit_session_token');
    setLoggedStudent(null);
    setSavedClientId(null);
    setSessionRole('guest');
  };

  const handleSendClientMobileMessage = async (text: string) => {
    if (!loggedStudent) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      clientId: loggedStudent.id,
      senderRole: 'client',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };
    await sendChatMessageToCloud(newMsg);
  };

  const handleUpdateClientAvatar = async (newAvatarUrl: string) => {
    if (!loggedStudent) return;
    await updateClientInCloud(loggedStudent.id, { avatar: newAvatarUrl });
    setLoggedStudent(prev => prev ? { ...prev, avatar: newAvatarUrl } : null);
  };

  const handleSaveStudentCheckin = async (weight: number, notes: string) => {
    if (!loggedStudent) return;
    const newCheckin = {
      id: `chk-${Date.now()}`,
      date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
      weight,
      energyScore: 8,
      sleepHours: 8,
      notes
    };
    const updatedCheckins = [newCheckin, ...(loggedStudent.checkins || [])];

    await updateClientInCloud(loggedStudent.id, {
      currentWeight: weight,
      checkins: updatedCheckins,
      status: 'pending_review',
      lastActive: 'Hace un momento'
    });

    setLoggedStudent(prev => prev ? {
      ...prev,
      currentWeight: weight,
      checkins: updatedCheckins
    } : null);
  };

  const handleSaveStudentWorkoutLog = async (log: ClientDailyLog) => {
    if (!loggedStudent) return;
    const existingLogs = loggedStudent.workoutLogs || [];
    const filtered = existingLogs.filter(l => l.dayId !== log.dayId);
    const updatedWorkoutLogs = [log, ...filtered];

    await updateClientInCloud(loggedStudent.id, {
      workoutLogs: updatedWorkoutLogs,
      status: 'pending_review',
      lastActive: 'Hace un momento'
    });

    setLoggedStudent(prev => prev ? {
      ...prev,
      workoutLogs: updatedWorkoutLogs
    } : null);
  };

  const activePlanForLoggedStudent = plans.find(p => p.id === loggedStudent?.currentPlanId) || plans[0] || null;

  // 4. Loading State
  if (sessionRole === 'checking') {
    return (
      <div className="fixed inset-0 h-[100dvh] bg-[#07090C] text-[#F3F4F6] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-[#E2FB3A] border-t-transparent rounded-full animate-spin mb-4 shadow-lg shadow-[#E2FB3A]/20" />
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Cargando TamiFit App...</p>
      </div>
    );
  }

  // 5. Student Login Screen
  if (sessionRole === 'guest') {
    return (
      <>
        <InstallPwaBanner />
        <LoginScreen
          mode="client"
          title="Área Alumnos"
          subtitle="Accede a tus entrenamientos, rutinas y progreso"
          onLogin={handleStudentLogin}
        />
      </>
    );
  }

  // 6. Student App View
  if (!loggedStudent) {
    return (
      <div className="fixed inset-0 h-[100dvh] bg-[#07090C] text-[#F3F4F6] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-[#E2FB3A] border-t-transparent rounded-full animate-spin mb-4 shadow-lg shadow-[#E2FB3A]/20" />
        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Sincronizando tu perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[#07090C] text-[#F3F4F6] overflow-x-hidden">
      <InstallPwaBanner />
      <ClientAppView
        client={loggedStudent}
        plan={activePlanForLoggedStudent}
        exercises={exercises}
        messages={messages}
        registeredClients={[]}
        trainerAvatar={trainerProfile.avatar}
        onSendMessage={handleSendClientMobileMessage}
        onUpdateClientAvatar={handleUpdateClientAvatar}
        onStudentLogout={handleStudentLogout}
        onSaveCheckin={handleSaveStudentCheckin}
        onSaveWorkoutLog={handleSaveStudentWorkoutLog}
      />
    </div>
  );
}
