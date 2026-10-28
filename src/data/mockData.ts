import { Client, Exercise, WorkoutPlan, ChatMessage } from '@/types';

export const INITIAL_EXERCISES: Exercise[] = [
  {
    id: 'ex-1',
    name: 'Press de Banca Plano con Barra',
    muscleGroup: 'Pecho',
    secondaryMuscles: ['Tríceps', 'Deltoides Anterior'],
    equipment: 'Barra',
    difficulty: 'Intermedio',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    instructions: [
      'Túmbate en el banco con los ojos alineados debajo de la barra.',
      'Junta y deprime las escápulas (retracción escapular firme).',
      'Desciende la barra de forma controlada hacia la parte media del esternón (2-3 segundos de bajada).',
      'Empuja con fuerza explosiva sin despegar los glúteos ni perder la tensión en la espalda.'
    ],
    coachNotes: 'Evita abrir los codos a 90 grados; mantenlos a unos 60-70 grados respecto al torso para proteger tus manguitos rotadores.'
  },
  {
    id: 'ex-2',
    name: 'Sentadilla Trasera con Barra Alta',
    muscleGroup: 'Cuádriceps',
    secondaryMuscles: ['Glúteos', 'Core', 'Erectores Espinales'],
    equipment: 'Barra',
    difficulty: 'Avanzado',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=bEv6CCg2BC8',
    instructions: [
      'Apoya la barra sobre los trapecios superiores con las manos cerradas.',
      'Inhala diafragmáticamente y crea presión intraabdominal (Valsalva).',
      'Rompe caderas y rodillas simultáneamente manteniendo el pecho erguido.',
      'Baja hasta que el pliegue de la cadera supere la rodilla (paralela o profunda).'
    ],
    coachNotes: 'Empuja el suelo como si quisieras separarlo con los pies. Mantén las rodillas alineadas con la punta de tus pies.'
  },
  {
    id: 'ex-3',
    name: 'Jalón al Pecho Agarre Neutro',
    muscleGroup: 'Espalda',
    secondaryMuscles: ['Bíceps', 'Braquiorradial', 'Deltoides Posterior'],
    equipment: 'Poleas / Cables',
    difficulty: 'Principiante',
    thumbnailUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=CAwf7n6Luuc',
    instructions: [
      'Ajusta las almohadillas para que fijen tus muslos firmemente.',
      'Agarre neutro con los brazos extendidos y el pecho elevado.',
      'Inicia la tracción tirando desde los codos hacia abajo y atrás.',
      'Toca suavemente la parte superior del pectoral y aguanta 1 segundo la contracción.'
    ],
    coachNotes: 'No te inclines en exceso hacia atrás; mantén un ángulo constante de unos 15 grados.'
  },
  {
    id: 'ex-4',
    name: 'Elevaciones Laterales con Mancuerna',
    muscleGroup: 'Hombros',
    secondaryMuscles: ['Trapecio Superior'],
    equipment: 'Mancuernas',
    difficulty: 'Principiante',
    thumbnailUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=3VcKaXpzqRo',
    instructions: [
      'De pie o sentado, torso ligeramente inclinado hacia adelante 10 grados.',
      'Sube los brazos por el plano escapular (ligeramente por delante del torso).',
      'Eleva hasta la altura de los hombros guiando con los codos.',
      'Baja controlando en 2 segundos completos.'
    ],
    coachNotes: 'No uses inercia del torso. Si te balanceas, baja el peso. Queremos aislamiento puro del deltoides lateral.'
  },
  {
    id: 'ex-5',
    name: 'Peso Muerto Rumano con Mancuernas',
    muscleGroup: 'Isquios',
    secondaryMuscles: ['Glúteos', 'Erectores Espinales', 'Antebrazos'],
    equipment: 'Mancuernas',
    difficulty: 'Intermedio',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=X0nuFk-d8lU',
    instructions: [
      'Pies a anchura de caderas, rodillas con micro-flexión fija durante todo el ejercicio.',
      'Lleva la cadera hacia la pared trasera mientras las mancuernas rozan los muslos.',
      'Detén el descenso cuando sientas el estiramiento máximo en los isquiotibiales (espalda neutra).',
      'Extiende la cadera hacia adelante apretando glúteos al subir.'
    ],
    coachNotes: 'Imagina que empujas una puerta con el trasero. No dobles las rodillas más de la cuenta ni arquees la espalda baja.'
  },
  {
    id: 'ex-6',
    name: 'Curl de Bíceps en Banco Inclinado',
    muscleGroup: 'Bíceps',
    secondaryMuscles: ['Braquial Anterior'],
    equipment: 'Mancuernas',
    difficulty: 'Principiante',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=soxrZlIl35U',
    instructions: [
      'Ajusta el banco a unos 60-70 grados y apoya la espalda completamente.',
      'Deja caer los brazos estirados en posición de máximo alargamiento de la cabeza larga.',
      'Flexiona los codos manteniendo la posición de los hombros hacia atrás.',
      'Aprieta en la cima 1 segundo y desciende en 3 segundos lentos.'
    ],
    coachNotes: 'Máximo estiramiento abajo sin soltar la tensión activa en el tendón.'
  },
  {
    id: 'ex-7',
    name: 'Extensiones de Tríceps en Polea Alta',
    muscleGroup: 'Tríceps',
    secondaryMuscles: ['Antebrazos'],
    equipment: 'Poleas / Cables',
    difficulty: 'Principiante',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=2-LAMcpzODU',
    instructions: [
      'Coge la cuerda de la polea y da un paso atrás flexionando ligeramente el tronco.',
      'Pega los codos a tus costados manteniéndolos estables como bisagras.',
      'Extiende los codos y separa los extremos de la cuerda al final del recorrido.',
      'Vuelve sintiendo el estiramiento hasta pasar los 90 grados de flexión de codo.'
    ],
    coachNotes: 'Mantén los hombros bloqueados hacia abajo, no dejes que los codos viajen hacia adelante y atrás.'
  },
  {
    id: 'ex-8',
    name: 'Hip Thrust con Barra en Banco',
    muscleGroup: 'Glúteos',
    secondaryMuscles: ['Isquios', 'Core'],
    equipment: 'Barra',
    difficulty: 'Intermedio',
    thumbnailUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=SEdqd1n01V4',
    instructions: [
      'Apoya la parte inferior de las escápulas en el borde del banco acolchado.',
      'Coloca la barra acolchada justo sobre el pliegue de la cadera.',
      'Pies firmes con tibias verticales al llegar a la máxima extensión.',
      'Empuja con los talones, mete la pelvis en retroversión y aprieta los glúteos arriba 2 segundos.'
    ],
    coachNotes: 'La mirada siempre al frente (a tus rodillas), nunca hacia el techo para no hiperextender las lumbares.'
  }
];

export const INITIAL_PLANS: WorkoutPlan[] = [
  {
    id: 'plan-1',
    title: 'Hipertrofia Torso / Pierna Pro',
    description: 'Especialización en masa muscular limpia con progresión de cargas en rango RIR 1-2.',
    level: 'Intermedio',
    durationWeeks: 8,
    createdAt: '2026-03-01',
    days: [
      {
        id: 'day-1',
        title: 'Día 1: Torso Hipertrofia & Fuerza',
        subtitle: 'Enfoque empuje pesado + tracciones densas',
        targetMuscleGroup: 'Pectoral, Espalda, Hombros',
        estimatedTimeMinutes: 65,
        exercises: [
          {
            id: 'we-1',
            exerciseId: 'ex-1',
            exerciseName: 'Press de Banca Plano con Barra',
            muscleGroup: 'Pecho',
            thumbnailUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80',
            notes: 'Aplica 2-3 series de aproximación antes de la primera serie efectiva.',
            sets: [
              { setNumber: 1, reps: '6-8', targetWeight: '80 kg', rir: 2, restSeconds: 150 },
              { setNumber: 2, reps: '6-8', targetWeight: '80 kg', rir: 1, restSeconds: 150 },
              { setNumber: 3, reps: '8-10', targetWeight: '75 kg', rir: 1, restSeconds: 120 },
              { setNumber: 4, reps: '10-12', targetWeight: '70 kg', rir: 0, restSeconds: 120 }
            ]
          },
          {
            id: 'we-2',
            exerciseId: 'ex-3',
            exerciseName: 'Jalón al Pecho Agarre Neutro',
            muscleGroup: 'Espalda',
            thumbnailUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&auto=format&fit=crop&q=80',
            notes: 'Pausa isométrica de 1 segundo en el punto de máxima contracción.',
            sets: [
              { setNumber: 1, reps: '8-10', targetWeight: '65 kg', rir: 2, restSeconds: 90 },
              { setNumber: 2, reps: '8-10', targetWeight: '65 kg', rir: 1, restSeconds: 90 },
              { setNumber: 3, reps: '10-12', targetWeight: '60 kg', rir: 1, restSeconds: 90 }
            ]
          },
          {
            id: 'we-3',
            exerciseId: 'ex-4',
            exerciseName: 'Elevaciones Laterales con Mancuerna',
            muscleGroup: 'Hombros',
            thumbnailUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80',
            notes: 'Drop set en la última serie quitando el 30% del peso inmediatamente al fallo.',
            sets: [
              { setNumber: 1, reps: '12-15', targetWeight: '12 kg', rir: 1, restSeconds: 75 },
              { setNumber: 2, reps: '12-15', targetWeight: '12 kg', rir: 1, restSeconds: 75 },
              { setNumber: 3, reps: '15+', targetWeight: '10 kg', rir: 0, restSeconds: 60 }
            ]
          },
          {
            id: 'we-4',
            exerciseId: 'ex-6',
            exerciseName: 'Curl de Bíceps en Banco Inclinado',
            muscleGroup: 'Bíceps',
            thumbnailUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
            sets: [
              { setNumber: 1, reps: '10-12', targetWeight: '14 kg', rir: 1, restSeconds: 75 },
              { setNumber: 2, reps: '10-12', targetWeight: '14 kg', rir: 1, restSeconds: 75 }
            ]
          },
          {
            id: 'we-5',
            exerciseId: 'ex-7',
            exerciseName: 'Extensiones de Tríceps en Polea Alta',
            muscleGroup: 'Tríceps',
            thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
            sets: [
              { setNumber: 1, reps: '12-15', targetWeight: '25 kg', rir: 1, restSeconds: 60 },
              { setNumber: 2, reps: '12-15', targetWeight: '25 kg', rir: 0, restSeconds: 60 }
            ]
          }
        ]
      },
      {
        id: 'day-2',
        title: 'Día 2: Pierna Dominante Cuádriceps',
        subtitle: 'Sentadilla pesada + estímulo de glúteos e isquios',
        targetMuscleGroup: 'Cuádriceps, Isquios, Glúteos',
        estimatedTimeMinutes: 70,
        exercises: [
          {
            id: 'we-6',
            exerciseId: 'ex-2',
            exerciseName: 'Sentadilla Trasera con Barra Alta',
            muscleGroup: 'Cuádriceps',
            thumbnailUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
            notes: 'Profundidad estricta. Rodilleras opcionales.',
            sets: [
              { setNumber: 1, reps: '5', targetWeight: '105 kg', rir: 2, restSeconds: 180 },
              { setNumber: 2, reps: '5', targetWeight: '105 kg', rir: 2, restSeconds: 180 },
              { setNumber: 3, reps: '8', targetWeight: '95 kg', rir: 1, restSeconds: 150 }
            ]
          },
          {
            id: 'we-7',
            exerciseId: 'ex-5',
            exerciseName: 'Peso Muerto Rumano con Mancuernas',
            muscleGroup: 'Isquios',
            thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
            sets: [
              { setNumber: 1, reps: '8-10', targetWeight: '32 kg/manc', rir: 2, restSeconds: 120 },
              { setNumber: 2, reps: '8-10', targetWeight: '32 kg/manc', rir: 1, restSeconds: 120 },
              { setNumber: 3, reps: '10-12', targetWeight: '30 kg/manc', rir: 1, restSeconds: 120 }
            ]
          },
          {
            id: 'we-8',
            exerciseId: 'ex-8',
            exerciseName: 'Hip Thrust con Barra en Banco',
            muscleGroup: 'Glúteos',
            thumbnailUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&auto=format&fit=crop&q=80',
            sets: [
              { setNumber: 1, reps: '10-12', targetWeight: '120 kg', rir: 1, restSeconds: 120 },
              { setNumber: 2, reps: '10-12', targetWeight: '120 kg', rir: 1, restSeconds: 120 },
              { setNumber: 3, reps: '12-15', targetWeight: '110 kg', rir: 0, restSeconds: 120 }
            ]
          }
        ]
      }
    ]
  }
];

export const INITIAL_CLIENTS: Client[] = [];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {};
