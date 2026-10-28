import { Client, Exercise, WorkoutPlan, ChatMessage } from '@/types';

export const INITIAL_EXERCISES: Exercise[] = [
  {
    id: 'ex-peso-muerto-rumano',
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
    id: 'ex-prensa-inclinada',
    name: 'Prensa Inclinada',
    muscleGroup: 'Cuádriceps',
    secondaryMuscles: ['Glúteos', 'Isquios'],
    equipment: 'Máquina',
    difficulty: 'Intermedio',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=S09u07tUKkw',
    instructions: [
      'Ajusta el respaldo a una inclinación cómoda.',
      'Coloca los pies a la anchura de los hombros en el centro de la plataforma.',
      'Desbloquea los seguros y desciende controlando el peso hasta formar unos 90 grados en las rodillas.',
      'Empuja con toda la planta del pie sin bloquear las rodillas arriba.'
    ],
    coachNotes: 'Controla la bajada y nunca despegues la zona lumbar ni los glúteos del asiento.'
  },
  {
    id: 'ex-press-pecho-convergente',
    name: 'Press Pecho Convergente',
    muscleGroup: 'Pecho',
    secondaryMuscles: ['Deltoides Anterior', 'Tríceps'],
    equipment: 'Máquina',
    difficulty: 'Principiante',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=JDnKz8G6GQo',
    instructions: [
      'Regula la altura del asiento para que los agarres queden a la altura media del pecho.',
      'Junta las escápulas y apóyalas firmemente en el respaldo.',
      'Empuja las palancas hacia adelante acompañando la trayectoria convergente.',
      'Regresa de forma lenta sintiendo el estiramiento en el pectoral.'
    ],
    coachNotes: 'Aprieta el pecho 1 segundo en la máxima contracción.'
  },
  {
    id: 'ex-jalon-pecho-agarre-abierto',
    name: 'Jalón al Pecho Agarre Abierto',
    muscleGroup: 'Espalda',
    secondaryMuscles: ['Bíceps', 'Braquial Anterior'],
    equipment: 'Poleas / Cables',
    difficulty: 'Principiante',
    thumbnailUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=55X8yLezpwc',
    instructions: [
      'Toma la barra ancha con agarre prono algo más ancho que los hombros.',
      'Ajusta las almohadillas para fijar los muslos sin que se levanten.',
      'Inicia la tracción bajando los hombros y llevando los codos hacia abajo y atrás.',
      'Lleva la barra a la parte superior del pecho y regresa controlando.'
    ],
    coachNotes: 'No te balances hacia atrás; mantén el torso estable con el pecho inflado.'
  },
  {
    id: 'ex-curl-femoral-sentado',
    name: 'Curl Femoral Sentado',
    muscleGroup: 'Isquios',
    secondaryMuscles: ['Gemelos'],
    equipment: 'Máquina',
    difficulty: 'Principiante',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=VtY0Xux8mjQ',
    instructions: [
      'Ajusta el respaldo para que la articulación de la rodilla coincida con el eje de la máquina.',
      'Fija la almohadilla superior bien apretada sobre los muslos.',
      'Coloca el rodillo inferior justo detrás de los tobillos.',
      'Flexiona las rodillas tirando con fuerza hacia abajo y regresa lento en 2-3 segundos.'
    ],
    coachNotes: 'Pausa de 1 segundo en máxima flexión para maximizar el reclutamiento de los isquiotibiales.'
  },
  {
    id: 'ex-remo-gironda-agarre-medio',
    name: 'Remo Gironda Agarre Medio',
    muscleGroup: 'Espalda',
    secondaryMuscles: ['Bíceps', 'Deltoides Posterior'],
    equipment: 'Poleas / Cables',
    difficulty: 'Intermedio',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=-2QGI_0X-kc',
    instructions: [
      'Siéntate con las rodillas ligeramente flexionadas y los pies firmes en los apoyos.',
      'Mantén el pecho erguido y los hombros deprimidos.',
      'Tira del agarre medio hacia la parte baja del abdomen apretando las escápulas.',
      'Extiende los brazos permitiendo que las escápulas se abran sin perder la postura lumbar.'
    ],
    coachNotes: 'Evita redondear la espalda baja en la fase excéntrica.'
  },
  {
    id: 'ex-elevaciones-laterales',
    name: 'Elevaciones Laterales',
    muscleGroup: 'Hombros',
    secondaryMuscles: ['Trapecios'],
    equipment: 'Mancuernas',
    difficulty: 'Principiante',
    thumbnailUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=6vimL2xxTZQ',
    instructions: [
      'De pie con una ligera inclinación del torso hacia adelante.',
      'Sostén las mancuernas a los lados con los codos con una microflexión fija.',
      'Eleva los brazos en el plano escapular (30 grados hacia adelante) hasta la altura de los hombros.',
      'Desciende de manera suave resistiendo la gravedad.'
    ],
    coachNotes: 'Imagina que lanzas las mancuernas hacia las paredes laterales, no hacia el techo.'
  },
  {
    id: 'ex-pallof-press',
    name: 'Pallof Press',
    muscleGroup: 'Core / Abdomen',
    secondaryMuscles: ['Oblicuos', 'Glúteos'],
    equipment: 'Poleas / Cables',
    difficulty: 'Intermedio',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/shorts/CpEltc6kgnM',
    instructions: [
      'Colócate de lado a la polea regulada a la altura del pecho.',
      'Sostén el maneral con ambas manos pegado al centro del pecho.',
      'Separa los pies a la anchura de los hombros con el abdomen firme.',
      'Extiende los brazos hacia adelante en línea recta resistiendo el giro del torso.',
      'Mantén 2 segundos extendido y regresa al pecho.'
    ],
    coachNotes: 'Ejercicio anti-rotación: el cuerpo no debe rotar absolutamente nada.'
  },
  {
    id: 'ex-prensa-horizontal',
    name: 'Prensa Horizontal',
    muscleGroup: 'Cuádriceps',
    secondaryMuscles: ['Glúteos', 'Aductores'],
    equipment: 'Máquina',
    difficulty: 'Intermedio',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=ErhjrY0POP8',
    instructions: [
      'Siéntate con la espalda y cadera bien apoyadas en el respaldo.',
      'Coloca los pies en la plataforma según la colocación indicada por el entrenador.',
      'Empuja la plataforma de forma controlada y desciende sin que la pelvis se despegue.'
    ],
    coachNotes: 'LOS PIES ABIERTOS Y LA PUNTA DE LOS PIES HACIA FUERA Y SUBIDOS ARRIBA, COMO LO HACE ÉL AL FINAL DEL VÍDEO'
  },
  {
    id: 'ex-press-hombro-maquina',
    name: 'Press Hombro Máquina',
    muscleGroup: 'Hombros',
    secondaryMuscles: ['Tríceps', 'Deltoides Anterior'],
    equipment: 'Máquina',
    difficulty: 'Principiante',
    thumbnailUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=a6TKsf2xonE',
    instructions: [
      'Ajusta la altura del asiento para que los agarres comiencen a la altura de la mandíbula o clavícula.',
      'Apoya la espalda firmemente en el respaldo.',
      'Empuja hacia arriba con fuerza sin bloquear bruscamente los codos.',
      'Baja de forma controlada sintiendo el trabajo en los deltoides.'
    ],
    coachNotes: 'Mantén los codos en un plano ligeramente adelantado al torso para proteger el hombro.'
  },
  {
    id: 'ex-remo-pecho-apoyado',
    name: 'Remo Pecho Apoyado',
    muscleGroup: 'Espalda',
    secondaryMuscles: ['Bíceps', 'Deltoides Posterior'],
    equipment: 'Máquina',
    difficulty: 'Intermedio',
    thumbnailUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=XUIJBJ1y_To',
    instructions: [
      'Ajusta la almohadilla frontal para que apoye sobre el esternón.',
      'Toma los agarres con las muñecas alineadas.',
      'Tira llevando los codos hacia atrás y apretando la parte media de la espalda.',
      'Mantén el pecho firmemente apoyado sin despegarlo en ningún momento.'
    ],
    coachNotes: 'El apoyo en el pecho descarga la zona lumbar y permite un aislamiento dorsal perfecto.'
  },
  {
    id: 'ex-extension-de-cuadriceps',
    name: 'Extensión de Cuádriceps',
    muscleGroup: 'Cuádriceps',
    secondaryMuscles: ['Recto Femoral'],
    equipment: 'Máquina',
    difficulty: 'Principiante',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=tM8XBRvgukg',
    instructions: [
      'Alinea el eje de rotación de la máquina con tus rodillas.',
      'Coloca la almohadilla inferior sobre la parte baja de las tibias (sobre los tobillos).',
      'Extiende las piernas hacia arriba contrayendo los cuádriceps de forma firme.',
      'Aguanta 1 segundo arriba y baja de forma suave.'
    ],
    coachNotes: 'No dejes caer el peso al bajar; la fase excéntrica es crucial para la hipertrofia.'
  },
  {
    id: 'ex-jalon-pecho-agarre-neutro',
    name: 'Jalón al Pecho Agarre Neutro',
    muscleGroup: 'Espalda',
    secondaryMuscles: ['Bíceps', 'Braquiorradial'],
    equipment: 'Poleas / Cables',
    difficulty: 'Principiante',
    thumbnailUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=OPL63nPDXjM',
    instructions: [
      'Coloca el agarre neutro en la polea alta.',
      'Fija las rodillas bajo las almohadillas.',
      'Tira desde los codos hacia abajo hasta llevar las manos a la altura de las clavículas.',
      'Siente el estiramiento completo en la fase de retorno.'
    ],
    coachNotes: 'El agarre neutro protege las muñecas y permite un gran rango de movimiento.'
  },
  {
    id: 'ex-curl-biceps-en-polea',
    name: 'Curl Bíceps en Polea',
    muscleGroup: 'Bíceps',
    secondaryMuscles: ['Braquial Anterior', 'Antebrazos'],
    equipment: 'Poleas / Cables',
    difficulty: 'Principiante',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=9vDLrSTf83I',
    instructions: [
      'De pie frente a la polea baja con barra recta o barra EZ.',
      'Pega los codos a tus costados manteniéndolos estables.',
      'Flexiona los brazos subiendo la barra hacia los hombros sin mover el torso.',
      'Baja extendiendo el codo completamente de manera controlada.'
    ],
    coachNotes: 'La tensión continua del cable estimula el bíceps tanto en la contracción como en el estiramiento.'
  },
  {
    id: 'ex-crunch-abdominal',
    name: 'Crunch Abdominal',
    muscleGroup: 'Core / Abdomen',
    secondaryMuscles: ['Recto Abdominal'],
    equipment: 'Peso Corporal / Calistenia',
    difficulty: 'Principiante',
    thumbnailUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/shorts/SaRY9Np4TzI',
    instructions: [
      'Túmbate bocarriba con las rodillas flexionadas y plantas de los pies apoyadas.',
      'Coloca las manos en el pecho o tras las orejas sin tirar del cuello.',
      'Contrae el abdomen elevando las escápulas del suelo, acercando las costillas hacia la pelvis.',
      'Baja despacio manteniendo la tensión.'
    ],
    coachNotes: 'Expulsa todo el aire en la subida para contraer al 100% el recto abdominal.'
  },
  {
    id: 'ex-prensa-unilateral',
    name: 'Prensa Unilateral',
    muscleGroup: 'Cuádriceps',
    secondaryMuscles: ['Glúteos', 'Isquios'],
    equipment: 'Máquina',
    difficulty: 'Intermedio',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/shorts/eR2YIFMhCP4',
    instructions: [
      'Coloca un solo pie centrado en la plataforma de la prensa.',
      'La otra pierna descansa fuera de la plataforma en posición segura.',
      'Desciende de forma controlada hasta unos 90 grados en la rodilla activa.',
      'Empuja con el talón y medio pie sin bloquear la rodilla.'
    ],
    coachNotes: 'Excelente para eliminar descompensaciones de fuerza entre ambas piernas.'
  },
  {
    id: 'ex-curl-femoral-tumbado',
    name: 'Curl Femoral Máquina Tumbado',
    muscleGroup: 'Isquios',
    secondaryMuscles: ['Glúteos', 'Gemelos'],
    equipment: 'Máquina',
    difficulty: 'Principiante',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=c0q1foS9eUk',
    instructions: [
      'Túmbate boca abajo con los tobillos colocados bajo el rodillo acolchado.',
      'Sujeta los agarres de la máquina y mantén las caderas pegadas al banco.',
      'Flexiona las piernas llevando los talones hacia los glúteos.',
      'Desciende en 2-3 segundos sintiendo el estiramiento en la parte posterior del muslo.'
    ],
    coachNotes: 'Evita levantar la pelvis del banco al doblar las rodillas.'
  },
  {
    id: 'ex-press-inclinado-multipower',
    name: 'Press Inclinado Multipower',
    muscleGroup: 'Pecho',
    secondaryMuscles: ['Deltoides Anterior', 'Tríceps'],
    equipment: 'Máquina',
    difficulty: 'Intermedio',
    thumbnailUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=WNkxMv_7weU',
    instructions: [
      'Coloca un banco inclinado a unos 30-45 grados centrado bajo la barra de la multipower.',
      'Toma la barra con agarre prono algo más ancho que los hombros.',
      'Baja la barra de forma controlada hacia la parte superior del pecho.',
      'Empuja verticalmente hasta casi extender los brazos manteniendo la tensión en el pecho.'
    ],
    coachNotes: 'Excelente estabilidad guiada para enfatizar el haz clavicular del pectoral.'
  },
  {
    id: 'ex-remo-agarre-estrecho',
    name: 'Remo Agarre Estrecho',
    muscleGroup: 'Espalda',
    secondaryMuscles: ['Bíceps', 'Braquial Anterior'],
    equipment: 'Poleas / Cables',
    difficulty: 'Intermedio',
    thumbnailUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=2FdLOmhFSyc',
    instructions: [
      'Usa un agarre estrecho (como un maneral en V o similar).',
      'Mantén la espalda erguida con las escápulas activas.',
      'Tira hacia el abdomen llevando los codos pegados al cuerpo.',
      'Extiende los brazos lentamente dejando que la espalda se estire.'
    ],
    coachNotes: 'Concéntrate en tirar desde los codos y no con las manos.'
  },
  {
    id: 'ex-abduccion-maquina',
    name: 'Abducción en Máquina',
    muscleGroup: 'Glúteos',
    secondaryMuscles: ['Glúteo Medio', 'Tensor de la Fascia Lata'],
    equipment: 'Máquina',
    difficulty: 'Principiante',
    thumbnailUrl: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=4CaBBmSWbwM',
    instructions: [
      'Siéntate con la espalda bien apoyada en el respaldo.',
      'Coloca la parte externa de las rodillas contra los apoyos acolchados.',
      'Separa las piernas hacia afuera con fuerza apretando los glúteos.',
      'Regresa de forma controlada sin dejar que las placas se toquen.'
    ],
    coachNotes: 'Aguanta 1 segundo en la máxima apertura para potenciar el glúteo medio.'
  },
  {
    id: 'ex-aduccion-maquina',
    name: 'Aducción en Máquina',
    muscleGroup: 'Pierna',
    secondaryMuscles: ['Grácil', 'Pectíneo'],
    equipment: 'Máquina',
    difficulty: 'Principiante',
    thumbnailUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=FQdh1gVcHyQ',
    instructions: [
      'Siéntate con la parte interna de las rodillas contra los apoyos acolchados.',
      'Comienza con las piernas abiertas a un rango cómodo.',
      'Cierra las piernas hacia el centro apretando firmemente los aductores.',
      'Abre de nuevo de manera pausada y controlada.'
    ],
    coachNotes: 'Movimiento fluido y controlado, sin rebotes.'
  },
  {
    id: 'ex-extension-triceps-polea-alta',
    name: 'Extensión Tríceps Polea Alta',
    muscleGroup: 'Tríceps',
    secondaryMuscles: ['Antebrazos'],
    equipment: 'Poleas / Cables',
    difficulty: 'Principiante',
    thumbnailUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80',
    videoUrl: 'https://www.youtube.com/watch?v=xJgxMkZnkG8',
    instructions: [
      'De pie frente a la polea alta con barra recta o cuerda.',
      'Pega los codos a tus costados y mantén el tronco estable con ligera inclinación.',
      'Extiende los codos empujando las manos hacia abajo hasta bloquear el tríceps.',
      'Sube controlando hasta que los antebrazos superen la horizontal.'
    ],
    coachNotes: 'Los codos son bisagras inmóviles: no dejes que viajen adelante y atrás.'
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
