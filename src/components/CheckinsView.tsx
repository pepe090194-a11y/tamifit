'use client';

import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Calendar, 
  Scale, 
  CheckCircle2, 
  Camera, 
  Send, 
  Sparkles,
  ArrowRight,
  Video,
  PlayCircle,
  Plus,
  X,
  ExternalLink,
  Edit2
} from 'lucide-react';
import { Client, WeeklyFeedback } from '@/types';
import { VideoPlayer } from '@/components/VideoPlayer';

interface CheckinsViewProps {
  clients: Client[];
  onSendFeedback: (
    clientId: string,
    checkinId?: string,
    feedback?: string,
    videoUrl?: string,
    title?: string
  ) => void;
  onClearPendingReviews?: () => void;
}

export const CheckinsView: React.FC<CheckinsViewProps> = ({
  clients,
  onSendFeedback,
  onClearPendingReviews
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>(
    clients.find(c => c.checkins && c.checkins.length > 0)?.id || clients[0]?.id || ''
  );

  React.useEffect(() => {
    onClearPendingReviews?.();
  }, [onClearPendingReviews]);
  
  // Feedback response on a check-in
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackVideoUrl, setFeedbackVideoUrl] = useState('');
  const [editingCheckinId, setEditingCheckinId] = useState<string | null>(null);
  const [submittedFeedbackId, setSubmittedFeedbackId] = useState<string | null>(null);

  // Modal for publishing direct weekly video feedback
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalClientId, setModalClientId] = useState(selectedClientId);
  const [modalTitle, setModalTitle] = useState('');
  const [modalVideoUrl, setModalVideoUrl] = useState('');
  const [modalContent, setModalContent] = useState('');

  const selectedClient = clients.find(c => c.id === selectedClientId) || clients[0] || null;

  const handleSendCheckinResponse = (checkinId: string) => {
    if ((!feedbackText.trim() && !feedbackVideoUrl.trim()) || !selectedClient) return;
    onSendFeedback(
      selectedClient.id,
      checkinId,
      feedbackText.trim(),
      feedbackVideoUrl.trim(),
      `Revisión Semanal • ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}`
    );
    setSubmittedFeedbackId(checkinId);
    setEditingCheckinId(null);
    setFeedbackText('');
    setFeedbackVideoUrl('');
    setTimeout(() => setSubmittedFeedbackId(null), 3000);
  };

  const handleOpenDirectFeedbackModal = () => {
    setModalClientId(selectedClientId || clients[0]?.id || '');
    setModalTitle(`Revisión Técnica & Ajustes • ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}`);
    setModalVideoUrl('');
    setModalContent('');
    setIsModalOpen(true);
  };

  const handleSubmitModalFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalClientId || (!modalContent.trim() && !modalVideoUrl.trim())) return;
    onSendFeedback(
      modalClientId,
      undefined,
      modalContent.trim(),
      modalVideoUrl.trim(),
      modalTitle.trim() || undefined
    );
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-[#12151D] border border-[#232938] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-black text-white flex items-center gap-2">
            <ClipboardCheck className="w-5 h-5 text-[#E2FB3A]" />
            Control de Revisiones & Vídeo Feedback Semanal
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Analiza pesajes de tus alumnos y responde enviando vídeos de YouTube/Loom con pautas directas a su app móvil
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleOpenDirectFeedbackModal}
            className="bg-[#E2FB3A] hover:bg-[#ccee24] text-black font-black text-xs px-4 py-2.5 rounded-xl transition-all shadow-md shadow-[#E2FB3A]/20 flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Video className="w-4 h-4" />
            <span>Publicar Vídeo Feedback</span>
          </button>
        </div>
      </div>

      {/* Client selector tabs */}
      {clients.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {clients.map((client) => {
            const hasCheckin = client.checkins && client.checkins.length > 0;
            const hasPending = client.checkins?.some(chk => !chk.trainerFeedback);
            const isSelected = client.id === selectedClientId;
            return (
              <button
                key={client.id}
                onClick={() => {
                  setSelectedClientId(client.id);
                  setEditingCheckinId(null);
                  setFeedbackText('');
                  setFeedbackVideoUrl('');
                }}
                className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#E2FB3A] text-black shadow-sm'
                    : 'bg-[#161A24] border border-[#232938] text-gray-300 hover:text-white'
                }`}
              >
                <span>{client.name}</span>
                {hasPending ? (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Revisión pendiente" />
                ) : hasCheckin ? (
                  <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-black' : 'bg-emerald-400'}`} />
                ) : null}
              </button>
            );
          })}
        </div>
      )}

      {/* Main Check-in content */}
      {selectedClient && selectedClient.checkins && selectedClient.checkins.length > 0 ? (
        <div className="space-y-6">
          {selectedClient.checkins.map((checkin) => {
            const isEditing = editingCheckinId === checkin.id;
            const hasFeedback = !!checkin.trainerFeedback || !!checkin.trainerVideoUrl;

            return (
              <div
                key={checkin.id}
                className="bg-[#12151D] rounded-2xl border border-[#232938] p-6 space-y-6"
              >
                {/* Checkin Top Info */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#232938]">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedClient.avatar}
                      alt={selectedClient.name}
                      className="w-12 h-12 rounded-full object-cover border border-[#E2FB3A]"
                    />
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        {selectedClient.name} • {checkin.date}
                      </h3>
                      <p className="text-xs text-gray-400">Objetivo: {selectedClient.goal}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                    <div className="px-3.5 py-1.5 rounded-xl bg-[#171B24] border border-[#262D3D] text-center">
                      <span className="text-[10px] text-gray-400 block">Peso Semana</span>
                      <span className="text-sm font-extrabold text-[#E2FB3A]">{checkin.weight} kg</span>
                    </div>
                    {checkin.waistCm && (
                      <div className="px-3.5 py-1.5 rounded-xl bg-[#171B24] border border-[#262D3D] text-center">
                        <span className="text-[10px] text-gray-400 block">Cintura</span>
                        <span className="text-sm font-extrabold text-white">{checkin.waistCm} cm</span>
                      </div>
                    )}
                    <div className="px-3.5 py-1.5 rounded-xl bg-[#171B24] border border-[#262D3D] text-center">
                      <span className="text-[10px] text-gray-400 block">Energía / Sueño</span>
                      <span className="text-sm font-extrabold text-emerald-400">
                        {checkin.energyScore}/10 ({checkin.sleepHours}h)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress Photos Side-by-Side */}
                {checkin.photos && (
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Camera className="w-4 h-4 text-[#E2FB3A]" />
                      Fotografías de Estado Físico
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {checkin.photos.front && (
                        <div className="rounded-xl overflow-hidden border border-[#272F3F] bg-black">
                          <div className="p-2 bg-[#171B24] text-[10px] font-bold text-gray-300">
                            Fotografía Frontal
                          </div>
                          <img
                            src={checkin.photos.front}
                            alt="Frontal"
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      )}
                      {checkin.photos.side && (
                        <div className="rounded-xl overflow-hidden border border-[#272F3F] bg-black">
                          <div className="p-2 bg-[#171B24] text-[10px] font-bold text-gray-300">
                            Fotografía Lateral / Perfil
                          </div>
                          <img
                            src={checkin.photos.side}
                            alt="Lateral"
                            className="w-full h-64 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Trainee Notes */}
                <div className="p-4 rounded-xl bg-[#171B24] border border-[#242A39]">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                    Comentario del Alumno sobre la semana:
                  </span>
                  <p className="text-xs text-white italic">"{checkin.notes}"</p>
                </div>

                {/* Coach Feedback Section */}
                {hasFeedback && !isEditing ? (
                  <div className="p-5 rounded-2xl bg-[#E2FB3A]/10 border border-[#E2FB3A]/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#E2FB3A]">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Feedback enviado al alumno ({checkin.feedbackDate || 'Reciente'})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCheckinId(checkin.id);
                          setFeedbackText(checkin.trainerFeedback || '');
                          setFeedbackVideoUrl(checkin.trainerVideoUrl || '');
                        }}
                        className="text-xs text-gray-300 hover:text-white flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#141923] border border-[#2A3448] cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3 text-[#E2FB3A]" />
                        <span>Editar</span>
                      </button>
                    </div>

                    {/* Attached Video Preview */}
                    {checkin.trainerVideoUrl && (
                      <div className="space-y-1.5 max-w-lg">
                        <span className="text-[10px] uppercase font-bold text-gray-300 block">
                          Vídeo de devolución adjunto:
                        </span>
                        <div className="aspect-video bg-black rounded-xl overflow-hidden border border-[#2B3548] relative">
                          <VideoPlayer
                            url={checkin.trainerVideoUrl}
                            title="Vídeo Feedback Semanal"
                            autoPlay={false}
                          />
                        </div>
                      </div>
                    )}

                    {checkin.trainerFeedback && (
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold text-gray-300 block">
                          Pautas & Observaciones:
                        </span>
                        <p className="text-xs text-gray-200 whitespace-pre-line leading-relaxed bg-[#11141C]/60 p-3 rounded-xl border border-[#2B3548]">
                          {checkin.trainerFeedback}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  /* Feedback Form (Pending or Editing) */
                  <div className="space-y-4 p-5 rounded-2xl bg-[#161B26] border border-[#262F42]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[#E2FB3A]" />
                        {isEditing ? 'Editar Devolución Semanal' : 'Responder y Enviar Vídeo Feedback'}
                      </span>
                      {isEditing ? (
                        <button
                          type="button"
                          onClick={() => setEditingCheckinId(null)}
                          className="text-xs text-gray-400 hover:text-white cursor-pointer"
                        >
                          Cancelar edición
                        </button>
                      ) : (
                        <span className="text-[10px] text-amber-300 font-semibold px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20">
                          Pendiente de evaluación
                        </span>
                      )}
                    </div>

                    {/* Video URL Input */}
                    <div>
                      <label className="text-[11px] font-bold text-gray-300 flex items-center gap-1.5 mb-1.5">
                        <Video className="w-3.5 h-3.5 text-[#E2FB3A]" />
                        <span>Enlace de Vídeo Feedback (YouTube o Loom)</span>
                      </label>
                      <input
                        type="url"
                        value={feedbackVideoUrl}
                        onChange={(e) => setFeedbackVideoUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=... o https://www.loom.com/share/..."
                        className="w-full bg-[#11141C] text-xs text-white px-3.5 py-2.5 rounded-xl border border-[#283144] focus:outline-none focus:border-[#E2FB3A]"
                      />
                      <span className="text-[10px] text-gray-400 block mt-1">
                        Pega el enlace de tu vídeo privado de YouTube o Loom donde explicas las correcciones al alumno.
                      </span>

                      {/* Live Video Preview in Coach Form */}
                      {feedbackVideoUrl.trim() && (
                        <div className="mt-3 p-3 rounded-xl bg-[#0D0F14] border border-[#232B3C] space-y-2">
                          <span className="text-[10px] font-bold text-[#E2FB3A] flex items-center gap-1">
                            <PlayCircle className="w-3 h-3" />
                            Vista previa del vídeo
                          </span>
                          <div className="aspect-video max-w-sm bg-black rounded-lg overflow-hidden border border-[#252E40]">
                            <VideoPlayer
                              url={feedbackVideoUrl}
                              title="Vista previa del vídeo feedback"
                              autoPlay={false}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Notes Textarea */}
                    <div>
                      <label className="text-[11px] font-bold text-gray-300 block mb-1.5">
                        Pautas, Ajustes y Observaciones Escritas
                      </label>
                      <textarea
                        rows={3}
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        placeholder="Escribe tus observaciones: ajustes calóricos, felicitación por la técnica, correcciones clave..."
                        className="w-full bg-[#11141C] text-xs text-white p-3 rounded-xl border border-[#283144] focus:outline-none focus:border-[#E2FB3A]"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-[10px] text-gray-400">
                        Se enviará automáticamente a la pestaña "Feedback" de la app del alumno.
                      </span>
                      <button
                        type="button"
                        onClick={() => handleSendCheckinResponse(checkin.id)}
                        disabled={!feedbackText.trim() && !feedbackVideoUrl.trim()}
                        className="bg-[#E2FB3A] hover:bg-[#ccee24] disabled:opacity-40 text-black font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md shadow-[#E2FB3A]/20 flex items-center gap-2 cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                        <span>{isEditing ? 'Guardar Cambios' : 'Enviar Vídeo Feedback'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-[#12151D] border border-dashed border-[#283144] space-y-3">
          <ClipboardCheck className="w-12 h-12 text-gray-600 mx-auto" />
          <h4 className="text-sm font-bold text-white">
            {selectedClient ? `No hay revisiones para ${selectedClient.name}` : 'No hay alumnos registrados'}
          </h4>
          <p className="text-xs text-gray-400 max-w-sm mx-auto">
            {selectedClient 
              ? 'Cuando el alumno envíe su pesaje y fotos desde la app móvil, aparecerán aquí para tu valoración.'
              : 'Registra a tus alumnos desde la sección Alumnos para ver sus revisiones y pesajes semanales.'}
          </p>
          {selectedClient && (
            <button
              type="button"
              onClick={handleOpenDirectFeedbackModal}
              className="mt-2 bg-[#1C2230] hover:bg-[#252D40] text-white text-xs font-bold px-4 py-2 rounded-xl border border-[#2A3448] transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Video className="w-3.5 h-3.5 text-[#E2FB3A]" />
              <span>Publicar Vídeo Feedback Directo a {selectedClient.name}</span>
            </button>
          )}
        </div>
      )}

      {/* MODAL: PUBLICAR VÍDEO FEEDBACK SEMANAL DIRECTO */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#12151D] border border-[#262F42] rounded-2xl w-full max-w-lg p-5 sm:p-6 space-y-4 shadow-2xl max-h-[90dvh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#222838]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#E2FB3A]/10 text-[#E2FB3A] flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Publicar Vídeo Feedback Semanal</h3>
                  <p className="text-[10px] text-gray-400">Envía un vídeo análisis y notas a la app del alumno</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitModalFeedback} className="space-y-4">
              {/* Select Client */}
              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">
                  Alumno Destinatario *
                </label>
                <select
                  value={modalClientId}
                  onChange={(e) => setModalClientId(e.target.value)}
                  className="w-full bg-[#181D29] text-xs text-white px-3 py-2 rounded-xl border border-[#2A3448] focus:outline-none focus:border-[#E2FB3A]"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.goal})
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">
                  Título de la Devolución *
                </label>
                <input
                  type="text"
                  required
                  value={modalTitle}
                  onChange={(e) => setModalTitle(e.target.value)}
                  placeholder="ej: Revisión Técnica & Ajustes • Semana 3"
                  className="w-full bg-[#181D29] text-xs text-white px-3 py-2 rounded-xl border border-[#2A3448] focus:outline-none focus:border-[#E2FB3A]"
                />
              </div>

              {/* Video URL */}
              <div>
                <label className="text-[11px] font-bold text-gray-300 flex items-center gap-1 mb-1">
                  <Video className="w-3.5 h-3.5 text-[#E2FB3A]" />
                  <span>Enlace del Vídeo (YouTube, Loom o Vimeo)</span>
                </label>
                <input
                  type="url"
                  value={modalVideoUrl}
                  onChange={(e) => setModalVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... o https://www.loom.com/share/..."
                  className="w-full bg-[#181D29] text-xs text-white px-3 py-2 rounded-xl border border-[#2A3448] focus:outline-none focus:border-[#E2FB3A]"
                />

                {/* Instant Video Preview inside Modal */}
                {modalVideoUrl.trim() && (
                  <div className="mt-3 p-2.5 rounded-xl bg-[#0D0F14] border border-[#232B3C] space-y-1.5">
                    <span className="text-[10px] font-bold text-[#E2FB3A] flex items-center gap-1">
                      <PlayCircle className="w-3 h-3" />
                      Vista previa del vídeo a enviar:
                    </span>
                    <div className="aspect-video bg-black rounded-lg overflow-hidden border border-[#252E40]">
                      <VideoPlayer
                        url={modalVideoUrl}
                        title="Vista previa modal feedback"
                        autoPlay={false}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Notes */}
              <div>
                <label className="text-[11px] font-bold text-gray-300 block mb-1">
                  Observaciones Técnicas & Pautas para el Alumno *
                </label>
                <textarea
                  rows={4}
                  required
                  value={modalContent}
                  onChange={(e) => setModalContent(e.target.value)}
                  placeholder="Explica qué mejorar esta semana, ajustes en las series, felicitaciones o consejos nutricionales..."
                  className="w-full bg-[#181D29] text-xs text-white p-3 rounded-xl border border-[#2A3448] focus:outline-none focus:border-[#E2FB3A]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#222838]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!modalClientId || (!modalContent.trim() && !modalVideoUrl.trim())}
                  className="bg-[#E2FB3A] hover:bg-[#ccee24] disabled:opacity-40 text-black font-black text-xs px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publicar en la App del Alumno</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};