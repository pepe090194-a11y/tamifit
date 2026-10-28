'use client';

import React, { useState } from 'react';
import { 
  PlayCircle, 
  Search, 
  Plus, 
  Dumbbell, 
  Filter, 
  X, 
  Check, 
  Sparkles, 
  AlertCircle,
  Video,
  ExternalLink,
  Edit2,
  Trash2,
  Image as ImageIcon
} from 'lucide-react';

const YouTubeIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4 text-red-500' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);
import { Exercise, MuscleGroup, Equipment } from '@/types';
import { VideoPlayer, getYouTubeThumbnail, getYouTubeVideoId } from '@/components/VideoPlayer';

interface ExerciseLibraryProps {
  exercises: Exercise[];
  onAddNewExercise: (newEx: Exercise) => void;
  onUpdateExercise?: (updatedEx: Exercise) => void;
  onDeleteExercise?: (exerciseId: string) => void;
}

export const ExerciseLibrary: React.FC<ExerciseLibraryProps> = ({
  exercises,
  onAddNewExercise,
  onUpdateExercise,
  onDeleteExercise
}) => {
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState<string>('Todos');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('Todos');
  
  // Inspection / Preview Modal
  const [inspectedExercise, setInspectedExercise] = useState<Exercise | null>(null);

  // Edit / Create Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingExerciseId, setEditingExerciseId] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formMuscle, setFormMuscle] = useState<MuscleGroup>('Pecho');
  const [formEquipment, setFormEquipment] = useState<Equipment>('Barra');
  const [formDifficulty, setFormDifficulty] = useState<Exercise['difficulty']>('Intermedio');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formInstructions, setFormInstructions] = useState('');
  const [formCoachNotes, setFormCoachNotes] = useState('');

  // Delete confirmation
  const [exerciseToDelete, setExerciseToDelete] = useState<Exercise | null>(null);

  const muscleGroups: string[] = [
    'Todos', 
    'Pecho', 
    'Espalda', 
    'Cuádriceps', 
    'Isquios', 
    'Glúteos', 
    'Hombros', 
    'Bíceps', 
    'Tríceps',
    'Core / Abdomen',
    'Full Body'
  ];

  const filteredExercises = exercises.filter((ex) => {
    const matchesSearch = ex.name.toLowerCase().includes(search.toLowerCase());
    const matchesMuscle = selectedMuscle === 'Todos' || ex.muscleGroup === selectedMuscle;
    const matchesEquipment = selectedEquipment === 'Todos' || ex.equipment === selectedEquipment;
    return matchesSearch && matchesMuscle && matchesEquipment;
  });

  const openCreateModal = () => {
    setEditingExerciseId(null);
    setFormName('');
    setFormMuscle('Pecho');
    setFormEquipment('Barra');
    setFormDifficulty('Intermedio');
    setFormImageUrl('');
    setFormVideoUrl('');
    setFormInstructions('');
    setFormCoachNotes('');
    setIsFormModalOpen(true);
  };

  const openEditModal = (ex: Exercise) => {
    setEditingExerciseId(ex.id);
    setFormName(ex.name);
    setFormMuscle(ex.muscleGroup);
    setFormEquipment(ex.equipment);
    setFormDifficulty(ex.difficulty);
    setFormImageUrl(ex.thumbnailUrl || '');
    setFormVideoUrl(ex.videoUrl || '');
    setFormInstructions(Array.isArray(ex.instructions) ? ex.instructions.join('\n') : '');
    setFormCoachNotes(ex.coachNotes || '');
    setIsFormModalOpen(true);
    setInspectedExercise(null);
  };

  const handleAutoFillYouTubeThumb = () => {
    const ytThumb = getYouTubeThumbnail(formVideoUrl);
    if (ytThumb) {
      setFormImageUrl(ytThumb);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    let finalThumbnail = formImageUrl.trim();
    if (!finalThumbnail && formVideoUrl) {
      const ytThumb = getYouTubeThumbnail(formVideoUrl);
      if (ytThumb) finalThumbnail = ytThumb;
    }
    if (!finalThumbnail) {
      finalThumbnail = 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80';
    }

    const instructionsList = formInstructions
      .split('\n')
      .map(s => s.trim())
      .filter(Boolean);

    const exerciseData: Exercise = {
      id: editingExerciseId || `ex-${Date.now()}`,
      name: formName.trim(),
      muscleGroup: formMuscle,
      equipment: formEquipment,
      difficulty: formDifficulty,
      thumbnailUrl: finalThumbnail,
      videoUrl: formVideoUrl.trim(),
      instructions: instructionsList.length > 0 ? instructionsList : ['Mantén la postura controlada durante todo el movimiento.'],
      coachNotes: formCoachNotes.trim()
    };

    if (editingExerciseId && onUpdateExercise) {
      onUpdateExercise(exerciseData);
    } else {
      onAddNewExercise(exerciseData);
    }

    setIsFormModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Bar: Search, Filters & Add CTA */}
      <div className="p-6 rounded-2xl bg-[#12151D] border border-[#232938] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <PlayCircle className="w-5 h-5 text-[#E2FB3A]" />
            Biblioteca de Ejercicios & Vídeos ({filteredExercises.length} ejercicios)
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Compatible con enlaces de YouTube. Tus alumnos pueden reproducirlos directamente en su app móvil al entrenar.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="bg-[#E2FB3A] hover:bg-[#ccee24] text-black font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-[#E2FB3A]/20 flex items-center gap-2 self-start md:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Añadir Nuevo Ejercicio</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="space-y-3">
        {/* Search & Equipment */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar ejercicio por nombre (ej: banca, sentadilla, jalón)..."
              className="w-full bg-[#12151D] text-xs text-white placeholder-gray-500 pl-9 pr-4 py-2.5 rounded-xl border border-[#232938] focus:outline-none focus:border-[#E2FB3A]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              className="bg-[#12151D] text-xs text-white px-3 py-2.5 rounded-xl border border-[#232938] focus:outline-none focus:border-[#E2FB3A] cursor-pointer"
            >
              <option value="Todos">Todo el Equipamiento</option>
              <option value="Barra">Barra</option>
              <option value="Mancuernas">Mancuernas</option>
              <option value="Poleas / Cables">Poleas / Cables</option>
              <option value="Máquina">Máquina</option>
              <option value="Peso Corporal / Calistenia">Peso Corporal</option>
              <option value="Bandas de Resistencia">Bandas de Resistencia</option>
              <option value="Kettlebell">Kettlebell</option>
            </select>
          </div>
        </div>

        {/* Muscle group pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {muscleGroups.map((muscle) => (
            <button
              key={muscle}
              type="button"
              onClick={() => setSelectedMuscle(muscle)}
              className={`px-3.5 py-1.5 rounded-xl font-semibold shrink-0 transition-all cursor-pointer ${
                selectedMuscle === muscle
                  ? 'bg-[#E2FB3A] text-black shadow-sm'
                  : 'bg-[#12151D] text-gray-400 hover:text-white border border-[#232938]'
              }`}
            >
              {muscle}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredExercises.map((exercise) => (
          <div
            key={exercise.id}
            className="group rounded-2xl bg-[#12151D] border border-[#232938] hover:border-[#E2FB3A]/50 transition-all overflow-hidden flex flex-col relative"
          >
            {/* Thumbnail with overlay badge */}
            <div 
              onClick={() => setInspectedExercise(exercise)}
              className="relative aspect-video w-full overflow-hidden bg-black cursor-pointer"
            >
              <img
                src={exercise.thumbnailUrl || getYouTubeThumbnail(exercise.videoUrl) || 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&auto=format&fit=crop&q=80'}
                alt={exercise.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <span className="absolute bottom-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/70 text-[#E2FB3A] backdrop-blur-sm border border-[#E2FB3A]/20">
                {exercise.muscleGroup}
              </span>

              {exercise.videoUrl && (
                <span className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-black/70 text-white backdrop-blur-sm border border-white/20 flex items-center gap-1">
                  {getYouTubeVideoId(exercise.videoUrl) ? <YouTubeIcon className="w-3 h-3 text-red-500" /> : <Video className="w-3 h-3 text-[#E2FB3A]" />}
                  <span>Vídeo</span>
                </span>
              )}

              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                <div className="w-10 h-10 rounded-full bg-[#E2FB3A] text-black flex items-center justify-center shadow-lg">
                  <PlayCircle className="w-6 h-6 fill-black text-[#E2FB3A]" />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 
                    onClick={() => setInspectedExercise(exercise)}
                    className="text-xs font-bold text-white group-hover:text-[#E2FB3A] transition-colors line-clamp-1 cursor-pointer"
                  >
                    {exercise.name}
                  </h3>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(exercise);
                    }}
                    title="Editar ejercicio"
                    className="p-1 text-gray-400 hover:text-[#E2FB3A] hover:bg-[#1A202C] rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 mt-1">
                  {exercise.equipment} • {exercise.difficulty}
                </p>
              </div>

              {exercise.coachNotes && (
                <div className="mt-3 text-[10px] text-gray-400 bg-[#171B24] p-2 rounded-lg border border-[#232938] line-clamp-2 italic">
                  💡 {exercise.coachNotes}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Inspected Exercise Technique / Video Demo */}
      {inspectedExercise && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#141822] border border-[#283042] rounded-2xl w-full max-w-2xl max-h-[90dvh] overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-5 shadow-2xl">
            {/* Header with Edit Button */}
            <div className="flex items-center justify-between pb-3 border-b border-[#242B3C]">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#E2FB3A]">
                  {inspectedExercise.muscleGroup} • {inspectedExercise.equipment}
                </span>
                <h3 className="text-base font-extrabold text-white mt-0.5">
                  {inspectedExercise.name}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openEditModal(inspectedExercise)}
                  className="px-3 py-1.5 rounded-xl bg-[#202738] hover:bg-[#283248] text-xs font-bold text-white border border-[#2C384E] flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Edit2 className="w-3.5 h-3.5 text-[#E2FB3A]" />
                  <span>Editar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInspectedExercise(null)}
                  className="text-gray-400 hover:text-white cursor-pointer p-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Video Player (supports YouTube and direct videos) */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-black border border-[#2A3142]">
              <VideoPlayer
                url={inspectedExercise.videoUrl}
                poster={inspectedExercise.thumbnailUrl}
                title={inspectedExercise.name}
                autoPlay={true}
              />
            </div>

            {/* Instructions */}
            {inspectedExercise.instructions && inspectedExercise.instructions.length > 0 && (
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Instrucciones Técnicas de Ejecución
                </h4>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  {inspectedExercise.instructions.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#1F2533] text-[#E2FB3A] flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Coach notes */}
            {inspectedExercise.coachNotes && (
              <div className="p-3.5 rounded-xl bg-[#E2FB3A]/10 border border-[#E2FB3A]/25">
                <span className="text-[11px] font-bold text-[#E2FB3A] block mb-1">
                  Pauta Biomecánica & Clave del Coach:
                </span>
                <p className="text-xs text-gray-200">{inspectedExercise.coachNotes}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal: Edit or Create Exercise Form */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="bg-[#141822] border border-[#283042] rounded-2xl w-full max-w-xl max-h-[90dvh] overflow-y-auto p-4 sm:p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#242B3C]">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                {editingExerciseId ? <Edit2 className="w-4 h-4 text-[#E2FB3A]" /> : <Plus className="w-4 h-4 text-[#E2FB3A]" />}
                <span>{editingExerciseId ? 'Editar Ejercicio' : 'Añadir Nuevo Ejercicio'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4">
              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                  Nombre del Ejercicio *
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="Ej: Press de Banca Plano con Barra"
                  className="w-full bg-[#181D2A] text-xs text-white px-3 py-2.5 rounded-xl border border-[#2B3448] focus:outline-none focus:border-[#E2FB3A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                    Grupo Muscular
                  </label>
                  <select
                    value={formMuscle}
                    onChange={(e) => setFormMuscle(e.target.value as MuscleGroup)}
                    className="w-full bg-[#181D2A] text-xs text-white px-3 py-2 rounded-xl border border-[#2B3448] focus:outline-none cursor-pointer"
                  >
                    <option value="Pecho">Pecho</option>
                    <option value="Espalda">Espalda</option>
                    <option value="Cuádriceps">Cuádriceps</option>
                    <option value="Isquios">Isquios</option>
                    <option value="Glúteos">Glúteos</option>
                    <option value="Hombros">Hombros</option>
                    <option value="Bíceps">Bíceps</option>
                    <option value="Tríceps">Tríceps</option>
                    <option value="Core / Abdomen">Core / Abdomen</option>
                    <option value="Full Body">Full Body</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                    Equipamiento
                  </label>
                  <select
                    value={formEquipment}
                    onChange={(e) => setFormEquipment(e.target.value as Equipment)}
                    className="w-full bg-[#181D2A] text-xs text-white px-3 py-2 rounded-xl border border-[#2B3448] focus:outline-none cursor-pointer"
                  >
                    <option value="Barra">Barra</option>
                    <option value="Mancuernas">Mancuernas</option>
                    <option value="Poleas / Cables">Poleas / Cables</option>
                    <option value="Máquina">Máquina</option>
                    <option value="Peso Corporal / Calistenia">Peso Corporal</option>
                    <option value="Bandas de Resistencia">Bandas de Resistencia</option>
                    <option value="Kettlebell">Kettlebell</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                    Dificultad
                  </label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value as Exercise['difficulty'])}
                    className="w-full bg-[#181D2A] text-xs text-white px-3 py-2 rounded-xl border border-[#2B3448] focus:outline-none cursor-pointer"
                  >
                    <option value="Principiante">Principiante</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                  </select>
                </div>
              </div>

              {/* YouTube / Video URL */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-[#E2FB3A] flex items-center gap-1.5">
                    <YouTubeIcon className="w-3.5 h-3.5 text-red-500" />
                    <span>Enlace de Vídeo o YouTube</span>
                  </label>
                  {getYouTubeVideoId(formVideoUrl) && (
                    <button
                      type="button"
                      onClick={handleAutoFillYouTubeThumb}
                      className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 cursor-pointer"
                    >
                      <ImageIcon className="w-3 h-3 text-[#E2FB3A]" />
                      <span>Usar miniatura del vídeo</span>
                    </button>
                  )}
                </div>
                <input
                  type="url"
                  value={formVideoUrl}
                  onChange={(e) => setFormVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... o https://youtu.be/..."
                  className="w-full bg-[#181D2A] text-xs text-white px-3 py-2 rounded-xl border border-[#2B3448] focus:outline-none focus:border-[#E2FB3A]"
                />
                <p className="text-[10px] text-gray-500">
                  Pega cualquier URL de YouTube (vídeo normal, shorts o enlace compartido) o archivo de vídeo mp4.
                </p>

                {/* Instant Video Preview inside Edit Form */}
                {formVideoUrl && (
                  <div className="mt-2 aspect-video rounded-xl overflow-hidden bg-black border border-[#263042]">
                    <VideoPlayer
                      url={formVideoUrl}
                      poster={formImageUrl}
                      title="Vista previa del vídeo"
                      autoPlay={false}
                    />
                  </div>
                )}
              </div>

              {/* Thumbnail URL */}
              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                  Foto de Portada / Miniatura (URL)
                </label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#181D2A] text-xs text-white px-3 py-2 rounded-xl border border-[#2B3448] focus:outline-none focus:border-[#E2FB3A]"
                />
              </div>

              {/* Coach Notes */}
              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                  Pautas y Consejos de la Entrenadora
                </label>
                <textarea
                  rows={2}
                  value={formCoachNotes}
                  onChange={(e) => setFormCoachNotes(e.target.value)}
                  placeholder="Ej: Mantén los codos a 60 grados para proteger el manguito rotador..."
                  className="w-full bg-[#181D2A] text-xs text-white p-3 rounded-xl border border-[#2B3448] focus:outline-none focus:border-[#E2FB3A]"
                />
              </div>

              {/* Instructions */}
              <div>
                <label className="text-[11px] font-semibold text-gray-300 block mb-1">
                  Instrucciones Paso a Paso (un paso por línea)
                </label>
                <textarea
                  rows={3}
                  value={formInstructions}
                  onChange={(e) => setFormInstructions(e.target.value)}
                  placeholder="1. Coloca los pies a la anchura de caderas&#10;2. Retrae las escápulas&#10;3. Empuja con fuerza controlada"
                  className="w-full bg-[#181D2A] text-xs text-white p-3 rounded-xl border border-[#2B3448] focus:outline-none focus:border-[#E2FB3A]"
                />
              </div>

              <div className="pt-3 flex items-center justify-between border-t border-[#242B3C]">
                {editingExerciseId && onDeleteExercise ? (
                  <button
                    type="button"
                    onClick={() => {
                      const ex = exercises.find(e => e.id === editingExerciseId);
                      if (ex) {
                        setExerciseToDelete(ex);
                        setIsFormModalOpen(false);
                      }
                    }}
                    className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Eliminar ejercicio</span>
                  </button>
                ) : <span />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFormModalOpen(false)}
                    className="px-3.5 py-2 text-xs font-semibold text-gray-400 hover:text-white cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-[#E2FB3A] hover:bg-[#ccee24] text-black font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-[#E2FB3A]/20 cursor-pointer"
                  >
                    Guardar en la Nube
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal: Delete Exercise */}
      {exerciseToDelete && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141822] border border-rose-500/30 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-white">¿Eliminar {exerciseToDelete.name}?</h3>
              <p className="text-xs text-gray-400">
                Se eliminará permanentemente de tu biblioteca de ejercicios.
              </p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setExerciseToDelete(null)}
                className="flex-1 bg-[#1E2432] text-gray-300 font-semibold text-xs py-2.5 rounded-xl hover:text-white cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  if (onDeleteExercise) {
                    onDeleteExercise(exerciseToDelete.id);
                  }
                  setExerciseToDelete(null);
                }}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs py-2.5 rounded-xl shadow-lg shadow-rose-600/30 cursor-pointer"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
