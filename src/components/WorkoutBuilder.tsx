'use client';

import React, { useState } from 'react';
import { 
  Dumbbell, 
  Plus, 
  Trash2, 
  Clock, 
  Flame, 
  Copy, 
  ChevronRight, 
  Save, 
  UserCheck, 
  Layers,
  Sparkles,
  Info,
  Check,
  Search,
  X
} from 'lucide-react';
import { WorkoutPlan, WorkoutDay, WorkoutExercise, Exercise, Client } from '@/types';

interface WorkoutBuilderProps {
  plans: WorkoutPlan[];
  exercises: Exercise[];
  clients: Client[];
  onSavePlan: (plan: WorkoutPlan) => void;
  onAssignPlanToClient?: (clientId: string, planId: string, planTitle: string) => void;
  selectedPlanId?: string | null;
  onDeletePlan?: (planId: string) => void;
}

export const WorkoutBuilder: React.FC<WorkoutBuilderProps> = ({
  plans,
  exercises,
  clients,
  onSavePlan,
  onAssignPlanToClient,
  selectedPlanId,
  onDeletePlan
}) => {
  const [activePlan, setActivePlan] = useState<WorkoutPlan>(plans[0]);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0);
  const [isExercisePickerOpen, setIsExercisePickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerMuscle, setPickerMuscle] = useState<string>('Todos');
  const [assignedSuccess, setAssignedSuccess] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  React.useEffect(() => {
    if (selectedPlanId) {
      const match = plans.find(p => p.id === selectedPlanId);
      if (match) {
        setActivePlan(match);
        setActiveDayIndex(0);
        return;
      }
    }
    if (plans.length > 0) {
      const match = plans.find(p => p.id === activePlan?.id);
      if (match) {
        setActivePlan(match);
      } else if (!activePlan) {
        setActivePlan(plans[0]);
      }
    }
  }, [plans, selectedPlanId]);

  const currentDay = activePlan?.days?.[activeDayIndex] || activePlan?.days?.[0];

  // Update exercise field (Series, Reps, RIR, Rest, Notes)
  const handleUpdateExerciseField = (
    exerciseIndex: number,
    field: 'setsCount' | 'reps' | 'rir' | 'restSeconds' | 'notes',
    val: any
  ) => {
    const updatedPlan = { ...activePlan };
    const targetExercise = updatedPlan.days[activeDayIndex].exercises[exerciseIndex];
    (targetExercise as any)[field] = val;

    // Sync sets array for compatibility
    if (field === 'setsCount') {
      const numSets = parseInt(val) || 3;
      const currentSets = targetExercise.sets || [];
      if (currentSets.length < numSets) {
        for (let i = currentSets.length + 1; i <= numSets; i++) {
          currentSets.push({
            setNumber: i,
            reps: targetExercise.reps || '10-12',
            rir: 1,
            restSeconds: targetExercise.restSeconds || 90
          });
        }
      } else if (currentSets.length > numSets && numSets > 0) {
        currentSets.splice(numSets);
      }
      targetExercise.sets = currentSets;
    }

    setActivePlan(updatedPlan);
  };

  // Add exercise from bank to current day
  const handleAddExerciseToDay = (selectedEx: Exercise) => {
    const updatedPlan = { ...activePlan };
    const newWorkoutEx: WorkoutExercise = {
      id: `we-${Date.now()}`,
      exerciseId: selectedEx.id,
      exerciseName: selectedEx.name,
      thumbnailUrl: selectedEx.thumbnailUrl,
      muscleGroup: selectedEx.muscleGroup,
      videoUrl: selectedEx.videoUrl,
      setsCount: 3,
      reps: '10-12',
      rir: '3-2-2',
      restSeconds: 90,
      clientWeight: '',
      clientNotes: '',
      notes: selectedEx.coachNotes || 'Controlar fase excéntrica',
      sets: [
        { setNumber: 1, reps: '10-12', targetWeight: '', rir: 2, restSeconds: 90 },
        { setNumber: 2, reps: '10-12', targetWeight: '', rir: 2, restSeconds: 90 },
        { setNumber: 3, reps: '10-12', targetWeight: '', rir: 2, restSeconds: 90 }
      ]
    };

    updatedPlan.days[activeDayIndex].exercises.push(newWorkoutEx);
    setActivePlan(updatedPlan);
    setIsExercisePickerOpen(false);
  };

  // Remove exercise from day
  const handleRemoveExercise = (exerciseIndex: number) => {
    const updatedPlan = { ...activePlan };
    updatedPlan.days[activeDayIndex].exercises.splice(exerciseIndex, 1);
    setActivePlan(updatedPlan);
  };

  // Add new Day to Routine
  const handleAddNewDay = () => {
    const updatedPlan = { ...activePlan };
    const newDayNum = updatedPlan.days.length + 1;
    updatedPlan.days.push({
      id: `day-${Date.now()}`,
      title: `Día ${newDayNum}: Especialización`,
      subtitle: 'Sesión complementaria',
      targetMuscleGroup: 'Cuerpo Completo',
      estimatedTimeMinutes: 60,
      exercises: []
    });
    setActivePlan(updatedPlan);
    setActiveDayIndex(updatedPlan.days.length - 1);
    onSavePlan(updatedPlan);
  };

  // Remove Day from Routine
  const handleRemoveDay = (dayIndexToRemove: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    if (activePlan.days.length <= 1) {
      alert('La rutina debe tener al menos un día de entrenamiento.');
      return;
    }

    const dayToDelete = activePlan.days[dayIndexToRemove];
    const dayTitle = dayToDelete?.title || `Día ${dayIndexToRemove + 1}`;

    if (!window.confirm(`¿Estás seguro de que deseas eliminar "${dayTitle}" de la rutina?`)) {
      return;
    }

    const updatedPlan = {
      ...activePlan,
      days: activePlan.days.filter((_, idx) => idx !== dayIndexToRemove)
    };

    let nextIndex = activeDayIndex;
    if (dayIndexToRemove === activeDayIndex) {
      nextIndex = Math.max(0, dayIndexToRemove - 1);
    } else if (dayIndexToRemove < activeDayIndex) {
      nextIndex = activeDayIndex - 1;
    }
    if (nextIndex >= updatedPlan.days.length) {
      nextIndex = Math.max(0, updatedPlan.days.length - 1);
    }

    setActivePlan(updatedPlan);
    setActiveDayIndex(nextIndex);
    onSavePlan(updatedPlan);
  };

  const handleSaveCurrentPlan = () => {
    onSavePlan(activePlan);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  // Create brand new workout plan
  const handleCreateNewPlan = () => {
    const newPlanId = `plan-${Date.now()}`;
    const newPlan: WorkoutPlan = {
      id: newPlanId,
      title: `Nueva Rutina ${plans.length + 1}`,
      description: 'Objetivo y notas generales de la rutina...',
      level: 'Intermedio',
      durationWeeks: 8,
      createdAt: new Date().toISOString().split('T')[0],
      days: [
        {
          id: `day-${Date.now()}-1`,
          title: 'Día 1: Torso / Hipertrofia',
          subtitle: 'Sesión principal',
          targetMuscleGroup: 'Cuerpo Completo',
          estimatedTimeMinutes: 60,
          exercises: []
        }
      ]
    };
    onSavePlan(newPlan);
    setActivePlan(newPlan);
    setActiveDayIndex(0);
  };

  // Duplicate current active plan
  const handleDuplicateCurrentPlan = () => {
    if (!activePlan) return;
    const dupPlanId = `plan-${Date.now()}`;
    const dupPlan: WorkoutPlan = {
      ...JSON.parse(JSON.stringify(activePlan)),
      id: dupPlanId,
      title: `${activePlan.title} (Copia)`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    onSavePlan(dupPlan);
    setActivePlan(dupPlan);
    setActiveDayIndex(0);
  };

  // Delete current plan
  const handleDeleteCurrentPlan = () => {
    if (plans.length <= 1) {
      alert('Debe existir al menos una rutina en el sistema.');
      return;
    }
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la rutina "${activePlan.title}"?`)) {
      return;
    }
    const targetToDelete = activePlan.id;
    const remaining = plans.filter(p => p.id !== targetToDelete);
    if (remaining.length > 0) {
      setActivePlan(remaining[0]);
      setActiveDayIndex(0);
    }
    onDeletePlan?.(targetToDelete);
  };

  // Assign plan to client in cloud
  const handleAssignToClient = (clientId: string) => {
    const targetClient = clients.find(c => c.id === clientId);
    if (targetClient && activePlan) {
      targetClient.currentPlanId = activePlan.id;
      targetClient.currentPlanName = activePlan.title;
      onAssignPlanToClient?.(clientId, activePlan.id, activePlan.title);
      setAssignedSuccess(true);
      setTimeout(() => setAssignedSuccess(false), 3500);
    }
  };

  const filteredPickerExercises = exercises.filter(ex => {
    const matchesSearch = ex.name.toLowerCase().includes(pickerSearch.toLowerCase()) || 
                          ex.muscleGroup.toLowerCase().includes(pickerSearch.toLowerCase());
    const matchesMuscle = pickerMuscle === 'Todos' || ex.muscleGroup === pickerMuscle;
    return matchesSearch && matchesMuscle;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header Plan bar */}
      <div className="p-6 rounded-2xl bg-[#12151D] border border-[#232938] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase font-bold text-gray-500">Plantilla activa:</span>
            <select
              value={activePlan?.id || ''}
              onChange={(e) => {
                const target = plans.find(p => p.id === e.target.value);
                if (target) {
                  setActivePlan(target);
                  setActiveDayIndex(0);
                }
              }}
              className="bg-[#171B24] border border-[#2A3346] text-xs font-bold text-[#E2FB3A] px-2.5 py-1 rounded-lg focus:outline-none cursor-pointer"
            >
              {plans.map(p => (
                <option key={p.id} value={p.id} className="bg-[#171B24] text-white">
                  {p.title} ({p.days?.length || 0} días)
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={handleCreateNewPlan}
              className="bg-[#1E2433] hover:bg-[#283145] text-xs text-gray-200 hover:text-white font-bold px-2.5 py-1 rounded-lg border border-[#2F394E] flex items-center gap-1 transition-all cursor-pointer"
              title="Crear una nueva rutina desde cero"
            >
              <Plus className="w-3.5 h-3.5 text-[#E2FB3A]" />
              <span>Nueva Rutina</span>
            </button>

            <button
              type="button"
              onClick={handleDuplicateCurrentPlan}
              className="bg-[#1E2433] hover:bg-[#283145] text-xs text-gray-200 hover:text-white font-bold px-2.5 py-1 rounded-lg border border-[#2F394E] flex items-center gap-1 transition-all cursor-pointer"
              title="Duplicar esta rutina para personalizarla"
            >
              <Copy className="w-3.5 h-3.5 text-gray-400" />
              <span>Duplicar</span>
            </button>

            {plans.length > 1 && onDeletePlan && (
              <button
                type="button"
                onClick={handleDeleteCurrentPlan}
                className="text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 p-1.5 rounded-lg border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                title="Eliminar esta rutina"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={activePlan.title}
              onChange={(e) => setActivePlan({ ...activePlan, title: e.target.value })}
              className="text-lg md:text-xl font-black text-white bg-transparent border-b border-transparent hover:border-[#384358] focus:border-[#E2FB3A] focus:outline-none transition-all px-1 py-0.5"
            />
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#E2FB3A]/10 text-[#E2FB3A] border border-[#E2FB3A]/20">
              {activePlan.level}
            </span>
          </div>
          <input
            type="text"
            value={activePlan.description}
            onChange={(e) => setActivePlan({ ...activePlan, description: e.target.value })}
            placeholder="Descripción del objetivo de la rutina..."
            className="text-xs text-gray-400 bg-transparent w-full mt-1 border-b border-transparent hover:border-[#384358] focus:border-[#E2FB3A] focus:outline-none px-1"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {/* Quick Assign Dropdown */}
          <div className="flex items-center gap-2 bg-[#171B24] border border-[#283144] px-3 py-2 rounded-xl text-xs">
            <UserCheck className="w-4 h-4 text-[#E2FB3A]" />
            <select
              onChange={(e) => handleAssignToClient(e.target.value)}
              defaultValue=""
              className="bg-transparent text-white font-medium text-xs focus:outline-none cursor-pointer"
            >
              <option value="" disabled className="bg-[#171B24]">
                Asignar a alumno...
              </option>
              {clients.map((c) => (
                <option key={c.id} value={c.id} className="bg-[#171B24]">
                  {c.name} ({c.goal})
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSaveCurrentPlan}
            className="flex items-center gap-2 bg-[#E2FB3A] hover:bg-[#ccee24] text-black font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-[#E2FB3A]/20 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Plantilla</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4" />
          <span>¡Plantilla guardada con éxito en la nube!</span>
        </div>
      )}

      {assignedSuccess && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4" />
          <span>¡Rutina asignada con éxito al alumno! Se actualizará automáticamente en su app móvil.</span>
        </div>
      )}

      {/* Days Tabs (Día 1, Día 2, + Añadir Día) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {activePlan.days.map((day, idx) => {
          const isActive = idx === activeDayIndex;
          const canDelete = activePlan.days.length > 1;
          return (
            <div
              key={day.id}
              className="relative group shrink-0 flex items-center"
            >
              <button
                onClick={() => setActiveDayIndex(idx)}
                className={`px-4 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer ${
                  isActive
                    ? `bg-[#E2FB3A] text-black shadow-md shadow-[#E2FB3A]/15 ${canDelete ? 'pr-8' : ''}`
                    : `bg-[#12151D] border border-[#232938] text-gray-300 hover:text-white hover:border-[#384358] ${canDelete ? 'group-hover:pr-8' : ''}`
                }`}
              >
                <span>{day.title}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isActive ? 'bg-black/15 text-black' : 'bg-[#1C212E] text-gray-400'
                  }`}
                >
                  {day.exercises.length} ej.
                </span>
              </button>

              {canDelete && (
                <button
                  type="button"
                  onClick={(e) => handleRemoveDay(idx, e)}
                  title={`Eliminar ${day.title}`}
                  className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-md transition-all cursor-pointer ${
                    isActive
                      ? 'text-black/60 hover:text-rose-700 hover:bg-black/10 opacity-100'
                      : 'text-gray-500 hover:text-rose-400 hover:bg-[#1C212E] opacity-0 group-hover:opacity-100'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          );
        })}

        <button
          onClick={handleAddNewDay}
          className="px-3.5 py-3 rounded-xl text-xs font-bold bg-[#141822] border border-dashed border-[#343F57] text-[#E2FB3A] hover:bg-[#1A202D] transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Añadir Día</span>
        </button>
      </div>

      {/* Current Day Details & Exercise List */}
      {currentDay && (
        <div className="space-y-4">
          {/* Day info bar */}
          <div className="p-4 rounded-xl bg-[#12151D] border border-[#232938] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div>
                <input
                  type="text"
                  value={currentDay.title}
                  onChange={(e) => {
                    const updated = { ...activePlan };
                    updated.days[activeDayIndex].title = e.target.value;
                    setActivePlan(updated);
                  }}
                  className="text-sm font-bold text-white bg-transparent border-b border-transparent hover:border-[#333C50] focus:border-[#E2FB3A] focus:outline-none"
                />
                <div className="flex items-center gap-3 text-[11px] text-gray-400 mt-0.5">
                  <span className="flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-[#E2FB3A]" />
                    {currentDay.targetMuscleGroup}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gray-400" />
                    ~{currentDay.estimatedTimeMinutes} min estimados
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
              {activePlan.days.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleRemoveDay(activeDayIndex)}
                  className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 font-bold text-xs px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                  title="Eliminar este día de la rutina"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Eliminar Día</span>
                </button>
              )}

              <button
                onClick={() => setIsExercisePickerOpen(true)}
                className="bg-[#E2FB3A] hover:bg-[#ccee24] text-black font-extrabold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-[#E2FB3A]/20 flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Añadir Ejercicio desde el Banco</span>
              </button>
            </div>
          </div>

          {/* Single Row per Exercise Table */}
          {currentDay.exercises.length > 0 ? (
            <div className="rounded-2xl bg-[#12151D] border border-[#232938] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-[#161A23] border-b border-[#232938] text-[10px] uppercase font-bold text-gray-400">
                      <th className="py-3 px-3 w-10 text-center">#</th>
                      <th className="py-3 px-3 min-w-[200px]">Ejercicio</th>
                      <th className="py-3 px-3 w-24 text-center">Series</th>
                      <th className="py-3 px-3 w-28 text-center">Reps</th>
                      <th className="py-3 px-3 w-28 text-center">RIR (Libre)</th>
                      <th className="py-3 px-3 w-24 text-center">Descanso</th>
                      <th className="py-3 px-3 w-32 text-center text-[#E2FB3A]">Peso (Alumno)</th>
                      <th className="py-3 px-3 min-w-[160px] text-emerald-400">Notas / Comentarios (Alumno)</th>
                      <th className="py-3 px-3 w-14 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1D222E]">
                    {currentDay.exercises.map((workoutEx, exIdx) => {
                      const setsCountVal = workoutEx.setsCount !== undefined ? workoutEx.setsCount : (workoutEx.sets?.length || 3);
                      const repsVal = workoutEx.reps !== undefined ? workoutEx.reps : (workoutEx.sets?.[0]?.reps || '10-12');
                      const rirVal = workoutEx.rir !== undefined ? workoutEx.rir : '3-2-2';
                      const restVal = workoutEx.restSeconds !== undefined ? workoutEx.restSeconds : (workoutEx.sets?.[0]?.restSeconds || 90);
                      const clientWeightVal = workoutEx.clientWeight || workoutEx.sets?.find(s => s.actualWeight)?.actualWeight || '';
                      const clientNotesVal = workoutEx.clientNotes || '';

                      return (
                        <tr key={workoutEx.id} className="hover:bg-[#151922] transition-colors">
                          <td className="py-3.5 px-3 text-center font-bold text-gray-500">
                            {exIdx + 1}
                          </td>
                          <td className="py-3.5 px-3">
                            <div className="flex items-center gap-2.5">
                              <img
                                src={workoutEx.thumbnailUrl}
                                alt={workoutEx.exerciseName}
                                className="w-10 h-10 rounded-xl object-cover border border-[#2A3244] shrink-0"
                              />
                              <div>
                                <div className="font-bold text-white text-xs">
                                  {workoutEx.exerciseName}
                                </div>
                                <span className="text-[10px] text-[#E2FB3A] font-semibold">
                                  {workoutEx.muscleGroup}
                                </span>
                              </div>
                            </div>
                            <input
                              type="text"
                              value={workoutEx.notes || ''}
                              onChange={(e) => handleUpdateExerciseField(exIdx, 'notes', e.target.value)}
                              placeholder="Indicación del coach..."
                              className="text-[10px] text-gray-400 bg-transparent w-full mt-1 border-b border-transparent hover:border-[#384358] focus:border-[#E2FB3A] focus:outline-none"
                            />
                          </td>

                          {/* 1. Series (entrenador) */}
                          <td className="py-3.5 px-2 text-center">
                            <input
                              type="text"
                              value={setsCountVal}
                              onChange={(e) => handleUpdateExerciseField(exIdx, 'setsCount', e.target.value)}
                              placeholder="3"
                              className="w-16 bg-[#191D28] text-center font-bold text-white px-2 py-1.5 rounded-lg border border-[#283144] focus:outline-none focus:border-[#E2FB3A]"
                            />
                          </td>

                          {/* 2. Reps (entrenador) */}
                          <td className="py-3.5 px-2 text-center">
                            <input
                              type="text"
                              value={repsVal}
                              onChange={(e) => handleUpdateExerciseField(exIdx, 'reps', e.target.value)}
                              placeholder="10-12"
                              className="w-20 bg-[#191D28] text-center font-bold text-white px-2 py-1.5 rounded-lg border border-[#283144] focus:outline-none focus:border-[#E2FB3A]"
                            />
                          </td>

                          {/* 3. RIR Libre (entrenador) */}
                          <td className="py-3.5 px-2 text-center">
                            <input
                              type="text"
                              value={rirVal}
                              onChange={(e) => handleUpdateExerciseField(exIdx, 'rir', e.target.value)}
                              placeholder="ej: 3-2-2"
                              className="w-24 bg-[#191D28] text-center font-mono font-bold text-[#E2FB3A] px-2 py-1.5 rounded-lg border border-[#283144] focus:outline-none focus:border-[#E2FB3A]"
                            />
                          </td>

                          {/* 4. Descanso (entrenador) */}
                          <td className="py-3.5 px-2 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <input
                                type="number"
                                value={restVal}
                                onChange={(e) => handleUpdateExerciseField(exIdx, 'restSeconds', parseInt(e.target.value) || 90)}
                                placeholder="90"
                                className="w-16 bg-[#191D28] text-center text-white px-1.5 py-1.5 rounded-lg border border-[#283144] focus:outline-none focus:border-[#E2FB3A]"
                              />
                              <span className="text-[10px] text-gray-500">s</span>
                            </div>
                          </td>

                          {/* 5. Peso (registrado por el cliente en vivo) */}
                          <td className="py-3.5 px-2 text-center">
                            {clientWeightVal ? (
                              <span className="font-mono font-bold text-xs px-2.5 py-1 rounded bg-[#1A2218] border border-emerald-500/30 text-emerald-400">
                                {clientWeightVal}
                              </span>
                            ) : (
                              <span className="text-[10px] text-gray-500 italic bg-[#171A22] px-2 py-1 rounded border border-[#232836]">
                                Pendiente alumno
                              </span>
                            )}
                          </td>

                          {/* 6. Notas / Comentarios (añadido por el cliente) */}
                          <td className="py-3.5 px-2">
                            {clientNotesVal ? (
                              <span className="text-xs text-gray-300 bg-[#161B25] p-1.5 rounded block border border-[#252C3D]">
                                {clientNotesVal}
                              </span>
                            ) : (
                              <span className="text-[10px] text-gray-500 italic">
                                Sin comentarios
                              </span>
                            )}
                          </td>

                          {/* 7. Eliminar */}
                          <td className="py-3.5 px-3 text-center">
                            <button
                              type="button"
                              onClick={() => handleRemoveExercise(exIdx)}
                              title="Eliminar ejercicio de la rutina"
                              className="p-1.5 text-gray-500 hover:text-rose-400 hover:bg-[#202636] rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center rounded-2xl bg-[#12151D] border border-dashed border-[#283144]">
              <Dumbbell className="w-10 h-10 text-gray-600 mx-auto mb-2" />
              <h4 className="text-sm font-bold text-white">Este día aún no tiene ejercicios</h4>
              <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                Selecciona ejercicios de tu biblioteca multimedia para estructurar series, repeticiones y tiempos de descanso.
              </p>
              <button
                onClick={() => setIsExercisePickerOpen(true)}
                className="mt-4 bg-[#E2FB3A] hover:bg-[#ccee24] text-black font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-[#E2FB3A]/20 inline-flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Explorar Banco de Ejercicios</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal: Exercise Picker from Bank */}
      {isExercisePickerOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141822] border border-[#283042] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl">
            {/* Header */}
            <div className="p-5 border-b border-[#242B3C] flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Dumbbell className="w-5 h-5 text-[#E2FB3A]" />
                  Añadir Ejercicio a {currentDay.title}
                </h3>
                <p className="text-xs text-gray-400">Selecciona del banco de ejercicios con técnica biomecánica</p>
              </div>
              <button
                onClick={() => setIsExercisePickerOpen(false)}
                className="text-gray-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-[#242B3C] flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  placeholder="Buscar ejercicio por nombre o músculo..."
                  className="w-full bg-[#181D2A] text-xs text-white placeholder-gray-500 pl-9 pr-3 py-2 rounded-xl border border-[#2B3448] focus:outline-none focus:border-[#E2FB3A]"
                />
              </div>
              <select
                value={pickerMuscle}
                onChange={(e) => setPickerMuscle(e.target.value)}
                className="bg-[#181D2A] text-xs text-white px-3 py-2 rounded-xl border border-[#2B3448] focus:outline-none focus:border-[#E2FB3A] cursor-pointer"
              >
                <option value="Todos">Todos los músculos</option>
                <option value="Pecho">Pecho</option>
                <option value="Espalda">Espalda</option>
                <option value="Pierna">Pierna</option>
                <option value="Cuádriceps">Cuádriceps</option>
                <option value="Isquios">Isquios</option>
                <option value="Glúteos">Glúteos</option>
                <option value="Hombros">Hombros</option>
                <option value="Bíceps">Bíceps</option>
                <option value="Tríceps">Tríceps</option>
                <option value="Core / Abdomen">Core / Abdomen</option>
              </select>
            </div>

            {/* Exercise List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {filteredPickerExercises.map((ex) => (
                <div
                  key={ex.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-[#171B26] hover:bg-[#1E2332] border border-[#252C3D] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={ex.thumbnailUrl}
                      alt={ex.name}
                      className="w-12 h-12 rounded-xl object-cover border border-[#283244]"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white">{ex.name}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] text-[#E2FB3A] font-semibold">{ex.muscleGroup}</span>
                        <span className="text-[10px] text-gray-500">•</span>
                        <span className="text-[10px] text-gray-400">{ex.equipment}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleAddExerciseToDay(ex)}
                    className="bg-[#E2FB3A] hover:bg-[#ccee24] text-black font-extrabold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-md shadow-[#E2FB3A]/20 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Añadir</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
