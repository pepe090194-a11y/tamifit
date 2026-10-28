'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { 
  Play, 
  Check, 
  Clock, 
  Dumbbell, 
  TrendingUp, 
  MessageSquare, 
  Calendar, 
  ChevronRight, 
  Flame, 
  Volume2, 
  RotateCcw, 
  Camera, 
  Send, 
  X, 
  Award, 
  Sparkles, 
  ArrowLeft, 
  Info, 
  Key, 
  LogOut, 
  UserCheck,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Video,
  PlayCircle,
  ExternalLink,
  Save,
  CheckCircle2
} from 'lucide-react';
import { WorkoutPlan, WorkoutExercise, ExerciseSet, Client, Exercise, ChatMessage, WeeklyFeedback, ClientDailyLog, ClientExerciseLog } from '@/types';
import { VideoPlayer } from '@/components/VideoPlayer';
import { AvatarEditModal } from '@/components/AvatarEditModal';

interface ClientAppViewProps {
  client?: Client | null;
  plan?: WorkoutPlan | null;
  exercises: Exercise[];
  messages: ChatMessage[];
  registeredClients?: Client[];
  trainerAvatar?: string;
  onSendMessage: (text: string) => void;
  onUpdateClientAvatar?: (newAvatarUrl: string) => Promise<void> | void;
  onClose?: () => void;
  onStudentLogin?: (email: string, code: string) => boolean | Promise<boolean>;
  onStudentLogout?: () => void;
  onSaveCheckin?: (weight: number, notes: string) => void;
  onSaveWorkoutLog?: (log: ClientDailyLog) => void;
}

export const ClientAppView: React.FC<ClientAppViewProps> = ({
  client,
  plan,
  exercises,
  messages,
  registeredClients = [],
  trainerAvatar,
  onSendMessage,
  onUpdateClientAvatar,
  onClose,
  onStudentLogin,
  onStudentLogout,
  onSaveCheckin,
  onSaveWorkoutLog
}) => {
  const [mobileTab, setMobileTab] = useState<'workout' | 'progress' | 'feedback' | 'chat'>('workout');
  const [selectedFeedbackId, setSelectedFeedbackId] = useState<string | null>(null);
  const [isWorkoutActive, setIsWorkoutActive] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState<Record<string, boolean>>({});
  const [actualValues, setActualValues] = useState<Record<string, { weight?: string; notes?: string }>>({});

  // Rest Timer State ("Magic Crono")
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null);
  const [timerMax, setTimerMax] = useState<number>(90);
  const [timerActive, setTimerActive] = useState(false);

  // Video Demo Popup inside mobile app
  const [activeVideoExercise, setActiveVideoExercise] = useState<Exercise | null>(null);

  // Finish Workout Modal
  const [isWorkoutFinished, setIsWorkoutFinished] = useState(false);

  // Mobile Chat State
  const [chatInput, setChatInput] = useState('');

  // Mobile Check-in Form
  const [newCheckinWeight, setNewCheckinWeight] = useState('');
  const [newCheckinNotes, setNewCheckinNotes] = useState('');
  const [checkinSuccess, setCheckinSuccess] = useState(false);
  const [workoutSaveSuccess, setWorkoutSaveSuccess] = useState(false);

  // In-app login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginCode, setLoginCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const currentDay = plan?.days?.[activeDayIndex] || plan?.days?.[0] || null;

  // Load existing workout logs for the active day if available
  useEffect(() => {
    if (!currentDay || !client?.workoutLogs) return;
    const existingLog = client.workoutLogs.find(l => l.dayId === currentDay.id);
    if (existingLog && existingLog.exercises) {
      const loadedValues: Record<string, { weight?: string; notes?: string }> = {};
      const loadedCompleted: Record<string, boolean> = {};
      existingLog.exercises.forEach(ex => {
        loadedValues[ex.exerciseId] = { weight: ex.weight || '', notes: ex.notes || '' };
        if (ex.completed) loadedCompleted[ex.exerciseId] = true;
      });
      setActualValues(loadedValues);
      setCompletedSets(loadedCompleted);
    }
  }, [currentDay?.id, client?.workoutLogs]);

  // Consolidate feedbacks from client.feedbacks and any checkins that have trainerFeedback
  const feedbackList: WeeklyFeedback[] = [
    ...(client?.feedbacks || []),
    ...(client?.checkins || [])
      .filter(chk => (chk.trainerFeedback || chk.trainerVideoUrl) && !(client?.feedbacks || []).some(f => f.id === `chk-fb-${chk.id}`))
      .map(chk => ({
        id: `chk-fb-${chk.id}`,
        title: `Revisión Semanal • ${chk.date}`,
        date: chk.feedbackDate || chk.date,
        videoUrl: chk.trainerVideoUrl,
        content: chk.trainerFeedback || 'Tu coach ha revisado tu progreso de esta semana.',
        coachName: 'Tamara (Coach)',
        isNew: false
      }))
  ];

  const activeFeedback = feedbackList.find(f => f.id === selectedFeedbackId) || feedbackList[0] || null;
  const hasUnreadFeedback = feedbackList.some(f => f.isNew);

  // Rest Timer effect
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timerSeconds !== null && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timerSeconds]);

  // Handle checking an exercise
  const handleToggleExercise = (exId: string, restSecs: number = 90) => {
    const nextState = !completedSets[exId];
    setCompletedSets(prev => ({ ...prev, [exId]: nextState }));

    if (nextState) {
      setTimerMax(restSecs || 90);
      setTimerSeconds(restSecs || 90);
      setTimerActive(true);
    }
  };

  const handleUpdateClientField = (exerciseId: string, field: 'weight' | 'notes', val: string) => {
    setActualValues(prev => ({
      ...prev,
      [exerciseId]: {
        ...prev[exerciseId],
        [field]: val
      }
    }));
  };

  const handleSaveWorkoutLog = () => {
    if (!currentDay || !onSaveWorkoutLog) return;
    const exLogs: ClientExerciseLog[] = currentDay.exercises.map(ex => {
      const isDone = !!completedSets[ex.id];
      const w = actualValues[ex.id]?.weight ?? (ex.clientWeight || '');
      const n = actualValues[ex.id]?.notes ?? (ex.clientNotes || '');
      return {
        exerciseId: ex.id,
        exerciseName: ex.exerciseName,
        muscleGroup: ex.muscleGroup,
        thumbnailUrl: ex.thumbnailUrl,
        plannedSets: ex.setsCount || ex.sets?.length || 3,
        plannedReps: ex.reps || ex.sets?.[0]?.reps || '10-12',
        plannedRir: ex.rir || '3-2-2',
        plannedRest: ex.restSeconds || 90,
        weight: w,
        notes: n,
        completed: isDone
      };
    });

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short' 
    }) + `, ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const log: ClientDailyLog = {
      id: `log-${currentDay.id}-${Date.now()}`,
      dayId: currentDay.id,
      dayTitle: currentDay.title,
      planTitle: plan?.title || 'Rutina Asignada',
      date: dateFormatted,
      timestamp: Date.now(),
      exercises: exLogs,
      completedAt: Object.values(completedSets).some(Boolean) ? dateFormatted : ''
    };

    onSaveWorkoutLog(JSON.parse(JSON.stringify(log)));
    setWorkoutSaveSuccess(true);
    setTimeout(() => setWorkoutSaveSuccess(false), 4000);
  };

  // Legacy set check
  const handleToggleSet = (exId: string, setIdx: number, restSecs: number) => {
    const key = `${exId}-${setIdx}`;
    const nextState = !completedSets[key];
    setCompletedSets(prev => ({ ...prev, [key]: nextState }));

    if (nextState) {
      setTimerMax(restSecs || 90);
      setTimerSeconds(restSecs || 90);
      setTimerActive(true);
    }
  };

  const handleFinishWorkout = () => {
    setIsWorkoutActive(false);
    setIsWorkoutFinished(true);
    setTimerActive(false);
    handleSaveWorkoutLog();
  };

  const handleSendMobileChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    onSendMessage(chatInput.trim());
    setChatInput('');
  };

  const handleSaveCheckinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCheckinWeight) return;
    const w = parseFloat(newCheckinWeight);
    if (onSaveCheckin && !isNaN(w)) {
      onSaveCheckin(w, newCheckinNotes);
    }
    setCheckinSuccess(true);
    setTimeout(() => {
      setCheckinSuccess(false);
      setNewCheckinWeight('');
      setNewCheckinNotes('');
    }, 3000);
  };

  const handleLoginFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail.trim() || !loginCode.trim()) {
      setLoginError('Por favor introduce tu email y tu clave de acceso.');
      return;
    }
    setIsLoading(true);
    try {
      if (onStudentLogin) {
        const ok = await onStudentLogin(loginEmail.trim(), loginCode.trim());
        if (!ok) {
          setLoginError('Email o clave de acceso no válidos. Consulta con tu entrenadora.');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-lg md:max-w-2xl mx-auto min-h-[100dvh] bg-[#0A0D12] text-[#F3F4F6] flex flex-col relative select-none animate-fadeIn pb-[calc(5rem+env(safe-area-inset-bottom,0px))] border-x border-[#1C202B]/60 shadow-2xl overflow-x-hidden">
      {/* Top Bar inside App */}
      <div className="px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top,0px))] bg-[#10141C]/95 border-b border-[#1E2430] flex items-center justify-between z-30 sticky top-0 backdrop-blur-md">
            <div className="flex items-center gap-2.5 min-w-0 flex-1 pr-2">
              {client ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsAvatarModalOpen(true)}
                    className="relative group shrink-0 cursor-pointer"
                    title="Toca para cambiar tu foto de perfil"
                  >
                    <img
                      src={client.avatar}
                      alt={client.name}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#E2FB3A]"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera className="w-3.5 h-3.5 text-[#E2FB3A]" />
                    </div>
                    {/* Always visible camera badge */}
                    <div className="absolute -bottom-0.5 -right-0.5 bg-[#E2FB3A] text-black p-0.5 rounded-full shadow-md">
                      <Camera className="w-2.5 h-2.5 stroke-[2.5]" />
                    </div>
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-xs font-black text-white leading-tight truncate">{client.name}</h3>
                      <button
                        type="button"
                        onClick={() => setIsAvatarModalOpen(true)}
                        className="text-[9px] text-[#E2FB3A] bg-[#E2FB3A]/10 hover:bg-[#E2FB3A]/20 px-1.5 py-0.5 rounded font-bold border border-[#E2FB3A]/30 flex items-center gap-1 cursor-pointer shrink-0"
                        title="Cambiar foto de perfil"
                      >
                        <Camera className="w-2.5 h-2.5" />
                        <span>Foto</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 truncate">{client.goal}</p>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="relative h-6 w-24">
                    <Image
                      src="/tamifit-logo.png"
                      alt="tamifit."
                      fill
                      className="object-contain object-left"
                      priority
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {client && onStudentLogout && (
                <button
                  type="button"
                  onClick={onStudentLogout}
                  title="Cerrar sesión"
                  className="px-2.5 py-1.5 text-xs text-gray-400 hover:text-white rounded-lg bg-[#181D26] border border-[#252D3C] flex items-center gap-1.5 cursor-pointer transition-colors min-h-[36px]"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-400" />
                  <span className="text-[10px] font-semibold">Salir</span>
                </button>
              )}
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-white rounded-lg bg-[#181D26] cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* SCREEN: PANTALLA DE INICIO DE SESIÓN (LOGIN SCREEN) */}
          {!client ? (
            <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-center bg-gradient-to-b from-[#0A0D12] via-[#0F131C] to-[#0A0D12]">
              <div className="text-center space-y-2 mb-6">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-[#E2FB3A]/20 to-[#E2FB3A]/5 border border-[#E2FB3A]/30 text-[#E2FB3A] flex items-center justify-center mx-auto shadow-xl shadow-[#E2FB3A]/10">
                  <Dumbbell className="w-8 h-8 stroke-[2.5]" />
                </div>
                <h2 className="text-xl font-black text-white tracking-tight">
                  Iniciar Sesión
                </h2>
                <p className="text-xs text-gray-400 max-w-[260px] mx-auto leading-relaxed">
                  Introduce tu usuario y la clave asignada por tu entrenadora para acceder a tu perfil.
                </p>
              </div>

              <form onSubmit={handleLoginFormSubmit} className="space-y-4 text-left">
                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1.5 flex items-center gap-1.5">
                    <UserCheck className="w-3.5 h-3.5 text-[#E2FB3A]" />
                    <span>Usuario</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      autoCapitalize="none"
                      autoCorrect="off"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="Tu usuario"
                      className="w-full bg-[#151A24] text-xs text-white px-3.5 py-3 rounded-xl border border-[#273245] focus:outline-none focus:border-[#E2FB3A] transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-300 block mb-1.5 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#E2FB3A]" />
                    <span>Clave de Acceso</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginCode}
                      onChange={(e) => setLoginCode(e.target.value)}
                      placeholder="ej: TAMI-1234"
                      className="w-full bg-[#151A24] font-mono text-xs text-[#E2FB3A] font-bold px-3.5 py-3 pr-10 rounded-xl border border-[#273245] focus:outline-none focus:border-[#E2FB3A] transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {loginError && (
                  <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                    <span>{loginError}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#E2FB3A] hover:bg-[#d5f028] disabled:opacity-50 text-black font-black text-xs py-3.5 rounded-xl shadow-lg shadow-[#E2FB3A]/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Key className="w-4 h-4" />
                  <span>{isLoading ? 'Verificando...' : 'Entrar a mi Perfil'}</span>
                </button>
              </form>

              {/* Quick Helper for Trainer to test credentials */}
              <div className="mt-6 pt-5 border-t border-[#1C2330] space-y-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block text-center">
                  💡 Accesos para probar:
                </span>
                {registeredClients.length > 0 ? (
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {registeredClients.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          setLoginEmail(c.email);
                          setLoginCode(c.accessCode || '');
                        }}
                        className="w-full text-left p-2 rounded-xl bg-[#131722] hover:bg-[#1A202E] border border-[#232A39] transition-colors flex items-center justify-between cursor-pointer"
                      >
                        <div className="min-w-0 pr-2">
                          <p className="text-xs font-bold text-white truncate">{c.name}</p>
                          <p className="text-[10px] text-gray-400 truncate">{c.email}</p>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-[#E2FB3A] bg-[#0B0D13] px-2 py-0.5 rounded border border-[#2E374A] shrink-0">
                          {c.accessCode || 'TAMI-1001'}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-3 rounded-xl bg-[#131722] border border-[#232B3B] space-y-1.5">
                    <p className="text-[11px] text-gray-400">
                      Aún no hay alumnos dados de alta. Puedes crear nuevos alumnos desde el Panel del Entrenador.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* SCREEN: PERFIL Y RUTINA DEL ALUMNO UNA VEZ LOGUEADO */
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              
              {/* TAB 1: WORKOUT TAB */}
              {mobileTab === 'workout' && (
                <div className="space-y-4">
                  {/* Plan banner */}
                  {plan ? (
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-[#171C26] to-[#12161E] border border-[#262E3E]">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#E2FB3A]">
                          Semana 4 de {plan.durationWeeks}
                        </span>
                        <span className="text-[10px] text-gray-400">{plan.level}</span>
                      </div>
                      <h4 className="text-sm font-black text-white mt-1">{plan.title}</h4>

                      {/* Day Selector */}
                      <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
                        {plan.days.map((day, idx) => (
                          <button
                            key={day.id}
                            type="button"
                            onClick={() => {
                              setActiveDayIndex(idx);
                              setIsWorkoutActive(false);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-[11px] font-bold shrink-0 transition-all cursor-pointer ${
                              activeDayIndex === idx
                                ? 'bg-[#E2FB3A] text-black shadow-md'
                                : 'bg-[#1D2330] text-gray-400 hover:text-white'
                            }`}
                          >
                            Día {idx + 1}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center rounded-2xl bg-[#141822] border border-[#242C3C]">
                      <Dumbbell className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                      <h4 className="text-xs font-bold text-white">Sin rutina asignada</h4>
                      <p className="text-[11px] text-gray-400 mt-1">
                        Tu coach te asignará un plan de entrenamiento muy pronto.
                      </p>
                    </div>
                  )}

                  {currentDay && (
                    <>
                      {/* Active Day Card */}
                      <div className="p-4 rounded-2xl bg-[#121620] border border-[#222836] flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-extrabold text-white">{currentDay.title}</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {currentDay.exercises.length} ejercicios • ~{currentDay.estimatedTimeMinutes} min
                          </p>
                        </div>

                        {!isWorkoutActive ? (
                          <button
                            type="button"
                            onClick={() => setIsWorkoutActive(true)}
                            className="bg-[#E2FB3A] text-black font-extrabold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-[#E2FB3A]/20 cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 fill-black" />
                            <span>Empezar</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={handleFinishWorkout}
                            className="bg-emerald-500 text-black font-extrabold text-xs px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer"
                          >
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Terminar</span>
                          </button>
                        )}
                      </div>

                      {/* Floating Magic Rest Timer */}
                      {timerActive && timerSeconds !== null && (
                        <div className="p-3 rounded-2xl bg-[#E2FB3A] text-black flex items-center justify-between shadow-xl animate-bounce-subtle">
                          <div className="flex items-center gap-2.5">
                            <Clock className="w-5 h-5 animate-spin" />
                            <div>
                              <span className="text-[9px] font-black uppercase tracking-wider block">Descanso Activo</span>
                              <span className="text-lg font-black font-mono leading-none">{formatTime(timerSeconds)}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setTimerSeconds(prev => (prev || 0) + 30)}
                              className="px-2 py-1 text-[10px] font-black bg-black/10 rounded-lg hover:bg-black/20"
                            >
                              +30s
                            </button>
                            <button
                              type="button"
                              onClick={() => setTimerActive(false)}
                              className="p-1 hover:bg-black/10 rounded-lg cursor-pointer"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Exercises List (Una sola fila/tarjeta por ejercicio) */}
                      <div className="space-y-3.5">
                        {currentDay.exercises.map((item, exIdx) => {
                          const isExChecked = !!completedSets[item.id];
                          const currentWeight = actualValues[item.id]?.weight ?? (item.clientWeight || '');
                          const currentNotes = actualValues[item.id]?.notes ?? (item.clientNotes || '');
                          const setsCountVal = item.setsCount !== undefined ? item.setsCount : (item.sets?.length || 3);
                          const repsVal = item.reps !== undefined ? item.reps : (item.sets?.[0]?.reps || '10-12');
                          const rirVal = item.rir !== undefined ? item.rir : '3-2-2';
                          const restVal = item.restSeconds !== undefined ? item.restSeconds : (item.sets?.[0]?.restSeconds || 90);

                          return (
                            <div
                              key={item.id}
                              className={`p-3.5 sm:p-4 rounded-2xl transition-all border ${
                                isExChecked
                                  ? 'bg-[#101918] border-emerald-500/30 shadow-lg shadow-emerald-950/20'
                                  : 'bg-[#131722] border-[#222836]'
                              }`}
                            >
                              {/* Header del Ejercicio */}
                              <div className="flex items-center justify-between gap-2 sm:gap-3">
                                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                                  <img
                                    src={item.thumbnailUrl}
                                    alt={item.exerciseName}
                                    className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl object-cover border border-[#2B3549] shrink-0"
                                  />
                                  <div className="min-w-0 flex-1">
                                    <span className="text-[10px] font-bold text-[#E2FB3A] uppercase tracking-wider block truncate">
                                      #{exIdx + 1} • {item.muscleGroup}
                                    </span>
                                    <h5 className="text-xs sm:text-sm font-bold text-white leading-tight truncate">
                                      {item.exerciseName}
                                    </h5>
                                    {item.notes && (
                                      <p className="text-[10px] sm:text-[11px] text-gray-400 mt-0.5 italic flex items-center gap-1 truncate">
                                        <Info className="w-3 h-3 text-[#E2FB3A] shrink-0" />
                                        <span className="truncate">{item.notes}</span>
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const fullEx = exercises.find(e => e.id === item.exerciseId);
                                      if (fullEx) setActiveVideoExercise(fullEx);
                                    }}
                                    className="p-2 sm:p-2.5 rounded-xl bg-[#1B2130] text-gray-300 hover:text-[#E2FB3A] cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                                    title="Ver técnica en vídeo"
                                  >
                                    <Play className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleToggleExercise(item.id, restVal)}
                                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                                      isExChecked
                                        ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                                        : 'bg-[#232B3A] text-gray-400 hover:text-white'
                                    }`}
                                    title={isExChecked ? 'Completado' : 'Marcar como completado'}
                                  >
                                    <Check className="w-4 h-4 stroke-[3]" />
                                  </button>
                                </div>
                              </div>

                              {/* Pautas fijadas por el Entrenador (Solo Lectura para el Cliente) */}
                              <div className="mt-3 grid grid-cols-4 gap-1.5 sm:gap-2 p-2 sm:p-2.5 rounded-xl bg-[#0F131C] border border-[#1E2535] text-center">
                                <div>
                                  <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">Series</span>
                                  <span className="text-xs sm:text-sm font-black text-white">{setsCountVal}</span>
                                </div>
                                <div>
                                  <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">Reps</span>
                                  <span className="text-xs sm:text-sm font-black text-white">{repsVal}</span>
                                </div>
                                <div>
                                  <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">RIR</span>
                                  <span className="text-xs sm:text-sm font-black text-[#E2FB3A] font-mono">{rirVal}</span>
                                </div>
                                <div>
                                  <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold block">Descanso</span>
                                  <span className="text-xs sm:text-sm font-black text-gray-300">{restVal}s</span>
                                </div>
                              </div>

                              {/* Datos que añade el Cliente en directo: Peso y Notas */}
                              <div className="mt-2.5 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                <div>
                                  <label className="text-[10px] font-bold text-gray-400 block mb-1">
                                    Carga / Peso usado:
                                  </label>
                                  <input
                                    type="text"
                                    value={currentWeight}
                                    onChange={(e) => handleUpdateClientField(item.id, 'weight', e.target.value)}
                                    placeholder="Ej: 22.5 kg"
                                    className="w-full bg-[#181D2A] text-base sm:text-xs font-semibold text-emerald-400 placeholder-gray-600 px-3 py-2 rounded-xl border border-[#232938] focus:outline-none focus:border-emerald-500"
                                  />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-gray-400 block mb-1">
                                    Tus notas / comentarios:
                                  </label>
                                  <input
                                    type="text"
                                    value={currentNotes}
                                    onChange={(e) => handleUpdateClientField(item.id, 'notes', e.target.value)}
                                    placeholder="Sensaciones, RIR percibido..."
                                    className="w-full bg-[#181D2A] text-base sm:text-xs text-white placeholder-gray-600 px-3 py-2 rounded-xl border border-[#232938] focus:outline-none focus:border-[#E2FB3A]"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Botón para guardar Cargas y Notas en el Panel del Entrenador */}
                      <div className="pt-2 space-y-2">
                        <button
                          type="button"
                          onClick={handleSaveWorkoutLog}
                          className="w-full bg-[#E2FB3A] hover:bg-[#d6f028] text-black font-extrabold text-xs py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#E2FB3A]/20 transition-all cursor-pointer"
                        >
                          <Save className="w-4 h-4 stroke-[2.5]" />
                          <span>Guardar Cargas y Notas de Hoy</span>
                        </button>

                        {workoutSaveSuccess && (
                          <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-bold text-center flex items-center justify-center gap-2 animate-fadeIn">
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>¡Cargas y notas guardadas! Tu entrenadora ya puede verlas en su panel de control.</span>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* TAB 2: PROGRESS & CHECK-IN */}
              {mobileTab === 'progress' && (
                <div className="space-y-4">
                  {/* Mi Perfil & Foto */}
                  <div className="p-3.5 rounded-2xl bg-[#121620] border border-[#222836] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <button
                        type="button"
                        onClick={() => setIsAvatarModalOpen(true)}
                        className="relative shrink-0 cursor-pointer group"
                        title="Cambiar foto de perfil"
                      >
                        <img
                          src={client.avatar}
                          alt={client.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-[#E2FB3A]"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-[#E2FB3A] text-black p-1 rounded-full shadow-md">
                          <Camera className="w-2.5 h-2.5 stroke-[2.5]" />
                        </div>
                      </button>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold text-white truncate">{client.name}</h4>
                        <p className="text-[10px] text-gray-400 truncate">Alumno TamiFit • {client.goal}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAvatarModalOpen(true)}
                      className="px-3 py-1.5 rounded-xl bg-[#181D28] hover:bg-[#252E40] text-[#E2FB3A] border border-[#2A3448] text-[11px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      <span>Cambiar Foto</span>
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-gradient-to-r from-[#171C26] to-[#12161E] border border-[#262E3E]">
                    <span className="text-[10px] font-black uppercase text-[#E2FB3A]">Evolución Antropométrica</span>
                    <div className="flex items-baseline justify-between mt-2">
                      <div>
                        <span className="text-2xl font-black text-white">{client.currentWeight}</span>
                        <span className="text-xs text-gray-400 ml-1">kg</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-emerald-400 font-bold">Meta: {client.targetWeight} kg</span>
                        <span className="text-[10px] text-gray-500 block">Inicio: {client.startWeight} kg</span>
                      </div>
                    </div>
                  </div>

                  {/* Form Check-in Semanal */}
                  <div className="p-4 rounded-2xl bg-[#121620] border border-[#222836] space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-[#E2FB3A]" />
                        Nuevo Check-in Semanal
                      </h4>
                      <span className="text-[9px] text-gray-400">En ayunas</span>
                    </div>

                    {checkinSuccess && (
                      <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs text-center font-bold">
                        ¡Check-in guardado en la nube! Tu entrenadora lo valorará.
                      </div>
                    )}

                    <form onSubmit={handleSaveCheckinSubmit} className="space-y-3">
                      <div>
                        <label className="text-[10px] text-gray-400 block mb-1">
                          Peso de hoy (kg) *
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          required
                          value={newCheckinWeight}
                          onChange={(e) => setNewCheckinWeight(e.target.value)}
                          placeholder="ej: 78.2"
                          className="w-full bg-[#1A1F2C] text-base sm:text-xs text-white px-3 py-2 rounded-xl border border-[#2B3549] focus:outline-none focus:border-[#E2FB3A]"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-gray-400 block mb-1">
                          Sensaciones & Fatiga
                        </label>
                        <textarea
                          rows={2}
                          value={newCheckinNotes}
                          onChange={(e) => setNewCheckinNotes(e.target.value)}
                          placeholder="¿Cómo te sentiste esta semana? Cargas, energía..."
                          className="w-full bg-[#1A1F2C] text-base sm:text-xs text-white px-3 py-2 rounded-xl border border-[#2B3549] focus:outline-none focus:border-[#E2FB3A]"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#E2FB3A] hover:bg-[#ccee24] text-black font-black text-xs sm:text-sm py-3 rounded-xl transition-all shadow-md shadow-[#E2FB3A]/20 cursor-pointer min-h-[44px]"
                      >
                        Subir Check-in Semanal
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 3: FEEDBACK SEMANAL EN VÍDEO Y TEXTO (SOLO LECTURA PARA EL ALUMNO) */}
              {mobileTab === 'feedback' && (
                <div className="space-y-4 pb-4">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black text-white flex items-center gap-2">
                        <Video className="w-4 h-4 text-[#E2FB3A]" />
                        Feedback de tu Coach
                      </h3>
                      <p className="text-[10px] text-gray-400">
                        Vídeos y pautas publicados exclusivamente por tu entrenadora
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#171C28] text-gray-400 border border-[#273042]">
                        Canal Coach
                      </span>
                      {hasUnreadFeedback && (
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-[#E2FB3A] text-black animate-pulse">
                          NUEVO
                        </span>
                      )}
                    </div>
                  </div>

                  {feedbackList.length > 0 && activeFeedback ? (
                    <div className="space-y-3">
                      {/* Main Active Feedback Card */}
                      <div className="bg-[#121620] border border-[#222836] rounded-2xl p-3.5 space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[9px] font-black uppercase text-[#E2FB3A] tracking-wider block">
                              {activeFeedback.coachName || 'Tamara • Coach'}
                            </span>
                            <h4 className="text-xs font-bold text-white mt-0.5">
                              {activeFeedback.title}
                            </h4>
                          </div>
                          <span className="text-[10px] text-gray-400 px-2 py-0.5 rounded-md bg-[#181D29] border border-[#262D3D] shrink-0">
                            {activeFeedback.date}
                          </span>
                        </div>

                        {/* Embedded Video Player */}
                        {activeFeedback.videoUrl ? (
                          <div className="space-y-1.5">
                            <div className="aspect-video bg-black rounded-xl overflow-hidden border border-[#262E40] relative shadow-md">
                              <VideoPlayer
                                url={activeFeedback.videoUrl}
                                title={activeFeedback.title}
                                autoPlay={false}
                              />
                            </div>
                            <div className="flex items-center justify-between px-1 text-[10px] text-gray-400">
                              <span className="flex items-center gap-1 text-[#E2FB3A]">
                                <PlayCircle className="w-3 h-3" /> Vídeo análisis de tu coach
                              </span>
                              {activeFeedback.videoUrl.startsWith('http') && (
                                <a
                                  href={activeFeedback.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="hover:text-white flex items-center gap-0.5 underline text-gray-400"
                                >
                                  Abrir enlace <ExternalLink className="w-2.5 h-2.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="p-3 rounded-xl bg-[#161B26] border border-[#252E3E] text-center text-xs text-gray-400">
                            Esta revisión no incluye enlace de vídeo
                          </div>
                        )}

                        {/* Coach Notes & Text Content */}
                        <div className="p-3 rounded-xl bg-[#171C28] border border-[#242C3C] space-y-1.5">
                          <span className="text-[10px] uppercase font-bold text-[#E2FB3A] block">
                            Pautas & Observaciones Técnicas:
                          </span>
                          <p className="text-xs text-gray-200 whitespace-pre-line leading-relaxed">
                            {activeFeedback.content}
                          </p>
                        </div>
                      </div>

                      {/* Previous Feedback History */}
                      {feedbackList.length > 1 && (
                        <div className="space-y-2 pt-1">
                          <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                            Historial de Devoluciones de tu Coach
                          </span>
                          <div className="space-y-1.5">
                            {feedbackList.map((fb) => {
                              const isSelected = fb.id === activeFeedback.id;
                              return (
                                <button
                                  key={fb.id}
                                  type="button"
                                  onClick={() => setSelectedFeedbackId(fb.id)}
                                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                                    isSelected
                                      ? 'bg-[#181D29] border-[#E2FB3A]/50 text-white shadow-sm'
                                      : 'bg-[#121620] border-[#222836] text-gray-400 hover:text-white'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                                      fb.videoUrl ? 'bg-[#E2FB3A]/20 text-[#E2FB3A]' : 'bg-[#1D2330] text-gray-400'
                                    }`}>
                                      <Video className="w-3.5 h-3.5" />
                                    </div>
                                    <div>
                                      <span className="text-xs font-semibold block text-white">{fb.title}</span>
                                      <span className="text-[10px] text-gray-500">{fb.date}</span>
                                    </div>
                                  </div>
                                  {isSelected && (
                                    <span className="text-[10px] font-bold text-[#E2FB3A]">Viendo</span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Empty State (Read-only for student) */
                    <div className="p-6 rounded-2xl bg-[#121620] border border-dashed border-[#262E40] text-center space-y-3">
                      <div className="w-12 h-12 rounded-full bg-[#E2FB3A]/10 text-[#E2FB3A] border border-[#E2FB3A]/30 flex items-center justify-center mx-auto">
                        <Video className="w-6 h-6" />
                      </div>

                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-white">Canal de Feedback de tu Entrenadora</h4>
                        <p className="text-[11px] text-gray-400 max-w-[270px] mx-auto leading-relaxed">
                          Este espacio es exclusivo de tu entrenadora. Ella publicará aquí tus vídeos personalizados y observaciones técnicas tras revisar tu evolución.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-[#161B26] border border-[#232B3C] text-[10px] text-gray-400">
                        <span className="text-[#E2FB3A] font-bold block mb-0.5">ℹ️ Espacio de consulta</span>
                        No necesitas subir nada aquí. Tu coach subirá el contenido desde su panel de control y te llegará automáticamente.
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CHAT */}
              {mobileTab === 'chat' && (
                <div className="h-full flex flex-col justify-between space-y-3">
                  <div className="space-y-2.5 overflow-y-auto max-h-[480px] p-1">
                    {messages.length === 0 ? (
                      <p className="text-xs text-gray-500 italic text-center pt-8">
                        No hay mensajes todavía. Escribe a tu coach si tienes alguna duda técnica.
                      </p>
                    ) : (
                      messages.map((m) => {
                        const isClient = m.senderRole === 'client';
                        return (
                          <div
                            key={m.id}
                            className={`flex flex-col ${isClient ? 'items-end' : 'items-start'}`}
                          >
                            <div className={`flex items-end gap-1.5 max-w-[85%] ${isClient ? 'flex-row-reverse' : 'flex-row'}`}>
                              {!isClient && (
                                <img
                                  src={trainerAvatar || 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=300&auto=format&fit=crop&q=80'}
                                  alt="Coach"
                                  className="w-5 h-5 rounded-full object-cover border border-[#E2FB3A] shrink-0 mb-0.5"
                                />
                              )}
                              <div
                                className={`p-2.5 rounded-xl text-[11px] ${
                                  isClient
                                      ? 'bg-[#E2FB3A] text-black font-semibold rounded-tr-none'
                                      : 'bg-[#1C212E] text-white rounded-tl-none border border-[#2A3244]'
                                }`}
                              >
                                {m.text}
                              </div>
                            </div>
                            <span className={`text-[9px] text-gray-500 mt-0.5 px-1 ${!isClient ? 'pl-7' : ''}`}>{m.timestamp}</span>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <form onSubmit={handleSendMobileChat} className="flex items-center gap-2 pt-2 border-t border-[#1E232E]">
                    <input
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Mensaje a tu coach..."
                      className="flex-1 bg-[#161A24] text-base sm:text-xs text-white px-3.5 py-2.5 rounded-xl border border-[#262D3D] focus:outline-none focus:border-[#E2FB3A]"
                    />
                    <button
                      type="submit"
                      className="bg-[#E2FB3A] hover:bg-[#d5f028] text-black font-bold p-2.5 min-w-[42px] min-h-[42px] flex items-center justify-center rounded-xl shadow-md cursor-pointer transition-colors shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* Video Modal inside Mobile Shell */}
          {activeVideoExercise && (
            <div className="absolute inset-0 bg-black/85 z-50 p-4 flex flex-col justify-center animate-fadeIn">
              <div className="bg-[#141822] border border-[#272F3F] rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white">{activeVideoExercise.name}</h4>
                  <button type="button" onClick={() => setActiveVideoExercise(null)} className="text-gray-400 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="aspect-video bg-black rounded-xl overflow-hidden relative">
                  <VideoPlayer
                    url={activeVideoExercise.videoUrl}
                    poster={activeVideoExercise.thumbnailUrl}
                    title={activeVideoExercise.name}
                    autoPlay={true}
                  />
                </div>

                {activeVideoExercise.coachNotes && (
                  <p className="text-[10px] text-[#E2FB3A] bg-[#101217] p-2 rounded-lg border border-[#1E232E]">
                    Coach: {activeVideoExercise.coachNotes}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Celebration Screen */}
          {isWorkoutFinished && (
            <div className="absolute inset-0 bg-black/90 z-50 p-6 flex flex-col items-center justify-center text-center space-y-4 animate-scaleUp">
              <div className="w-16 h-16 rounded-full bg-[#E2FB3A] text-black flex items-center justify-center shadow-lg shadow-[#E2FB3A]/30">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-white">¡Entrenamiento Finalizado! 🔥</h3>
              <p className="text-xs text-gray-300">
                Has completado las series del día. Datos guardados y notificados a tu coach.
              </p>
              <button
                type="button"
                onClick={() => setIsWorkoutFinished(false)}
                className="bg-[#E2FB3A] hover:bg-[#ccee24] text-black font-black text-xs px-6 py-2.5 rounded-xl shadow-md cursor-pointer"
              >
                Volver al Menú
              </button>
            </div>
          )}

          {/* Bottom Mobile Navigation Bar with iOS Safe Area */}
          {client && (
            <div className="fixed bottom-0 left-0 right-0 max-w-lg md:max-w-2xl mx-auto bg-[#0E121A]/95 backdrop-blur-md border-t border-[#1C202B] px-1 sm:px-3 flex items-center justify-around select-none z-40 shadow-2xl h-[calc(3.75rem+env(safe-area-inset-bottom,0px))] pb-[env(safe-area-inset-bottom,0px)]">
              <button
                type="button"
                onClick={() => setMobileTab('workout')}
                className={`flex-1 flex flex-col items-center justify-center gap-1 min-h-[44px] py-1 text-[10px] font-bold transition-colors cursor-pointer ${
                  mobileTab === 'workout' ? 'text-[#E2FB3A]' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Dumbbell className="w-4 h-4" />
                <span>Entrenar</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileTab('progress')}
                className={`flex-1 flex flex-col items-center justify-center gap-1 min-h-[44px] py-1 text-[10px] font-bold transition-colors cursor-pointer ${
                  mobileTab === 'progress' ? 'text-[#E2FB3A]' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>Progreso</span>
              </button>

              <button
                type="button"
                onClick={() => setMobileTab('feedback')}
                className={`flex-1 flex flex-col items-center justify-center gap-1 min-h-[44px] py-1 text-[10px] font-bold transition-colors cursor-pointer relative ${
                  mobileTab === 'feedback' ? 'text-[#E2FB3A]' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <Video className="w-4 h-4" />
                <span>Feedback</span>
                {hasUnreadFeedback && (
                  <span className="absolute top-1.5 right-1/4 w-2 h-2 rounded-full bg-[#E2FB3A] ring-2 ring-[#0E1015]" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setMobileTab('chat')}
                className={`flex-1 flex flex-col items-center justify-center gap-1 min-h-[44px] py-1 text-[10px] font-bold transition-colors cursor-pointer ${
                  mobileTab === 'chat' ? 'text-[#E2FB3A]' : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <MessageSquare className="w-4 h-4" />
                <span>Chat Coach</span>
              </button>
            </div>
          )}
          {/* Modal for editing student avatar */}
          {client && (
            <AvatarEditModal
              isOpen={isAvatarModalOpen}
              onClose={() => setIsAvatarModalOpen(false)}
              currentAvatar={client.avatar}
              title="Cambiar Mi Foto de Perfil"
              subtitle="Tu foto se actualizará en tiempo real en tu app y en el panel de tu coach"
              onSave={async (newUrl) => {
                if (onUpdateClientAvatar) {
                  await onUpdateClientAvatar(newUrl);
                }
              }}
            />
          )}
    </div>
  );
};
