export type MuscleGroup = 
  | 'Pecho' 
  | 'Espalda' 
  | 'Pierna' 
  | 'Cuádriceps' 
  | 'Isquios' 
  | 'Glúteos' 
  | 'Hombros' 
  | 'Bíceps' 
  | 'Tríceps' 
  | 'Core / Abdomen'
  | 'Full Body';

export type Equipment = 
  | 'Barra' 
  | 'Mancuernas' 
  | 'Poleas / Cables' 
  | 'Máquina' 
  | 'Peso Corporal / Calistenia' 
  | 'Bandas de Resistencia' 
  | 'Kettlebell';

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  secondaryMuscles?: string[];
  equipment: Equipment;
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  thumbnailUrl: string;
  videoUrl?: string;
  instructions: string[];
  coachNotes?: string;
}

export interface ExerciseSet {
  setNumber: number;
  reps: string;
  targetWeight?: string;
  rir?: number; // Reps In Reserve (ej: RIR 1-2)
  restSeconds: number;
  completed?: boolean;
  actualReps?: string;
  actualWeight?: string;
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  thumbnailUrl: string;
  muscleGroup: MuscleGroup;
  videoUrl?: string;
  setsCount?: string | number; // Series asignadas por el entrenador (ej: 3 o 4)
  reps?: string; // Repeticiones fijadas por el entrenador (ej: "10-12")
  rir?: string; // RIR libre fijado por el entrenador (ej: "3-2-2" o "1-2")
  restSeconds?: number; // Descanso en segundos (ej: 90)
  clientWeight?: string; // Peso/Carga registrada por el cliente (ej: "75 kg")
  clientNotes?: string; // Notas/comentarios registrados por el cliente
  completed?: boolean; // Estado de completado por el cliente
  sets: ExerciseSet[];
  notes?: string;
}

export interface WorkoutDay {
  id: string;
  title: string;
  subtitle?: string;
  targetMuscleGroup: string;
  estimatedTimeMinutes: number;
  exercises: WorkoutExercise[];
}

export interface WorkoutPlan {
  id: string;
  title: string;
  description: string;
  assignedClientId?: string;
  durationWeeks: number;
  level: 'Principiante' | 'Intermedio' | 'Avanzado';
  days: WorkoutDay[];
  createdAt: string;
}

export interface ClientExerciseLog {
  exerciseId: string;
  exerciseName: string;
  muscleGroup?: string;
  thumbnailUrl?: string;
  plannedSets?: string | number;
  plannedReps?: string;
  plannedRir?: string;
  plannedRest?: number;
  weight: string; // Carga / Peso registrado por el alumno (ej. "25 kg")
  notes: string; // Comentarios o sensaciones registradas por el alumno
  completed: boolean;
}

export interface ClientDailyLog {
  id: string;
  date: string; // Fecha en la que se realizó o actualizó
  timestamp?: number;
  dayId: string;
  dayTitle: string;
  planTitle?: string;
  exercises: ClientExerciseLog[];
  completedAt?: string;
}

export interface WeeklyFeedback {
  id: string;
  title: string;
  date: string;
  videoUrl?: string; // Vídeo de YouTube, Loom o archivo MP4
  content: string; // Explicación técnica y pautas
  coachName?: string;
  isNew?: boolean;
}

export interface ClientCheckin {
  id: string;
  date: string;
  weight: number;
  waistCm?: number;
  chestCm?: number;
  photos?: {
    front?: string;
    side?: string;
    back?: string;
  };
  energyScore: number; // 1-10
  sleepHours: number;
  notes: string;
  trainerFeedback?: string;
  trainerVideoUrl?: string; // Enlace de vídeo/YouTube añadido por el coach
  feedbackDate?: string;
}

export interface Client {
  id: string;
  name: string;
  username?: string; // Nombre de usuario para iniciar sesión
  email: string;
  phone: string;
  avatar: string;
  accessCode?: string; // Clave / Contraseña de acceso generada para el alumno
  goal: 'Hipertrofia' | 'Definición / Pérdida de Grasa' | 'Fuerza Máxima' | 'Recomposición Corporal' | 'Salud y Movilidad';
  status: 'active' | 'pending_review' | 'paused';
  currentWeight: number; // kg
  startWeight: number; // kg
  targetWeight: number; // kg
  height: number; // cm
  adherenceRate: number; // %
  currentPlanId?: string;
  currentPlanName?: string;
  unreadMessagesCount: number;
  joinedDate: string;
  lastActive: string;
  privateNotes: string;
  checkins: ClientCheckin[];
  feedbacks?: WeeklyFeedback[]; // Historial de devoluciones con vídeo y texto
  workoutLogs?: ClientDailyLog[]; // Historial de cargas y notas de cada ejercicio registradas por el alumno
}

export interface ChatMessage {
  id: string;
  clientId: string;
  senderRole: 'trainer' | 'client';
  text: string;
  timestamp: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio' | 'plan';
  isRead: boolean;
}

export interface TrainerProfile {
  name: string;
  role: string;
  avatar: string;
  title?: string;
}
