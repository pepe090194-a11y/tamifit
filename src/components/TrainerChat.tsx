'use client';

import React, { useState } from 'react';
import { 
  Send, 
  Mic, 
  Paperclip, 
  CheckCheck, 
  Clock, 
  Dumbbell, 
  Smile, 
  Search,
  Sparkles,
  Phone,
  MessageSquare,
  ChevronLeft
} from 'lucide-react';
import { Client, ChatMessage } from '@/types';

interface TrainerChatProps {
  clients: Client[];
  activeClientId: string;
  setActiveClientId: (id: string) => void;
  messages: Record<string, ChatMessage[]>;
  onSendMessage: (clientId: string, text: string) => void;
  onMarkAsRead?: (clientId: string) => void;
}

export const TrainerChat: React.FC<TrainerChatProps> = ({
  clients,
  activeClientId,
  setActiveClientId,
  messages,
  onSendMessage,
  onMarkAsRead
}) => {
  const [inputText, setInputText] = useState('');
  const [search, setSearch] = useState('');
  const [showMobileThread, setShowMobileThread] = useState(false);

  const currentClient = clients.find(c => c.id === activeClientId) || clients[0] || null;
  const clientMessages = currentClient ? (messages[currentClient.id] || []) : [];

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentClient) return;
    onSendMessage(currentClient.id, inputText.trim());
    setInputText('');
  };

  const handleQuickReply = (text: string) => {
    if (!currentClient) return;
    onSendMessage(currentClient.id, text);
  };

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-120px)] sm:h-[calc(100vh-140px)] rounded-2xl bg-[#12151D] border border-[#232938] overflow-hidden flex flex-col md:flex-row">
      {/* Left Conversations List */}
      <div className={`w-full md:w-72 lg:w-80 border-r border-[#232938] flex flex-col bg-[#0F1218] shrink-0 ${showMobileThread ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-3.5 sm:p-4 border-b border-[#232938]">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar conversación..."
              className="w-full bg-[#161A23] text-xs text-white placeholder-gray-500 pl-8 pr-3 py-2 rounded-xl border border-[#283144] focus:outline-none focus:border-[#E2FB3A]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#181D28]">
          {filteredClients.map((client) => {
            const isSelected = client.id === currentClient?.id;
            const lastMsg = (messages[client.id] || [])[messages[client.id]?.length - 1];
            return (
              <div
                key={client.id}
                onClick={() => {
                  setActiveClientId(client.id);
                  setShowMobileThread(true);
                  onMarkAsRead?.(client.id);
                }}
                className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                  isSelected ? 'bg-[#181D27] border-l-2 border-[#E2FB3A]' : 'hover:bg-[#141822]'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={client.avatar}
                    alt={client.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#2A3142]"
                  />
                  {client.unreadMessagesCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#E2FB3A] text-black text-[9px] font-bold flex items-center justify-center">
                      {client.unreadMessagesCount}
                    </span>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white truncate">{client.name}</h4>
                    <span className="text-[10px] text-gray-500">
                      {lastMsg ? lastMsg.timestamp : client.lastActive}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">
                    {lastMsg ? lastMsg.text : `Objetivo: ${client.goal}`}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Chat Thread */}
      {currentClient ? (
        <div className={`flex-1 flex flex-col bg-[#12151D] ${!showMobileThread ? 'hidden md:flex' : 'flex'}`}>
          {/* Thread Header */}
          <div className="p-3.5 sm:p-4 border-b border-[#232938] bg-[#141822] flex items-center justify-between">
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setShowMobileThread(false)}
                className="md:hidden p-1.5 rounded-lg bg-[#181D28] text-gray-400 hover:text-white shrink-0 cursor-pointer"
                title="Volver a lista"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <img
                src={currentClient.avatar}
                alt={currentClient.name}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover border border-[#E2FB3A]/60 shrink-0"
              />
              <div className="min-w-0">
                <h3 className="text-xs font-bold text-white flex items-center gap-2 truncate">
                  <span className="truncate">{currentClient.name}</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                </h3>
                <p className="text-[10px] text-gray-400 truncate">
                  {currentClient.goal} • {currentClient.currentPlanName || 'Plan Hipertrofia'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] text-gray-400 hidden sm:inline">
                {currentClient.phone}
              </span>
            </div>
          </div>

          {/* Quick reply recommendations */}
          <div className="px-4 py-2 border-b border-[#232938] bg-[#0E1015] flex items-center gap-2 overflow-x-auto scrollbar-none text-[11px]">
            <span className="text-gray-500 text-[10px] font-bold uppercase shrink-0">
              Respuestas Rápidas:
            </span>
            <button
              onClick={() => handleQuickReply('¡Brutal sesión de hoy Carlos! Las cargas suben con técnica perfecta 🔥')}
              className="px-2.5 py-1 rounded-lg bg-[#181D28] hover:bg-[#252E40] text-gray-300 hover:text-[#E2FB3A] shrink-0 transition-colors border border-[#273042]"
            >
              🔥 ¡Brutal sesión hoy!
            </button>
            <button
              onClick={() => handleQuickReply('Asegúrate de mantener la retracción escapular durante todo el descenso.')}
              className="px-2.5 py-1 rounded-lg bg-[#181D28] hover:bg-[#252E40] text-gray-300 hover:text-[#E2FB3A] shrink-0 transition-colors border border-[#273042]"
            >
              💪 Ajuste técnico de escápulas
            </button>
            <button
              onClick={() => handleQuickReply('Recuerda subir el pesaje y fotos de la semana en ayunas mañana.')}
              className="px-2.5 py-1 rounded-lg bg-[#181D28] hover:bg-[#252E40] text-gray-300 hover:text-[#E2FB3A] shrink-0 transition-colors border border-[#273042]"
            >
              📸 Recordatorio de fotos
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3.5">
            {clientMessages.map((msg) => {
              const isMe = msg.senderRole === 'trainer';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[75%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      isMe
                        ? 'bg-[#E2FB3A] text-black font-medium rounded-tr-none shadow-md shadow-[#E2FB3A]/10'
                        : 'bg-[#1C212E] text-white rounded-tl-none border border-[#2B3448]'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <div className="flex items-center gap-1 mt-1 px-1 text-[10px] text-gray-500">
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-[#E2FB3A]" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Chat input form */}
          <form
            onSubmit={handleSend}
            className="p-3.5 border-t border-[#232938] bg-[#141822] flex items-center gap-2.5"
          >
            <button
              type="button"
              title="Adjuntar rutina o archivo"
              className="p-2 text-gray-400 hover:text-white hover:bg-[#1E2432] rounded-xl transition-colors"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Escribe un mensaje a ${currentClient.name}...`}
              className="flex-1 bg-[#191E2A] text-xs text-white placeholder-gray-500 px-4 py-2.5 rounded-xl border border-[#293246] focus:outline-none focus:border-[#E2FB3A]"
            />

            <button
              type="button"
              title="Nota de voz"
              className="p-2 text-gray-400 hover:text-[#E2FB3A] hover:bg-[#1E2432] rounded-xl transition-colors"
            >
              <Mic className="w-4 h-4" />
            </button>

            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-[#E2FB3A] hover:bg-[#ccee24] disabled:opacity-40 disabled:hover:bg-[#E2FB3A] text-black font-extrabold p-2.5 rounded-xl transition-all shadow-md shadow-[#E2FB3A]/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-[#12151D]">
          <MessageSquare className="w-12 h-12 text-gray-600 mb-3" />
          <h3 className="text-sm font-bold text-white">No hay alumnos seleccionados</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-xs">
            Selecciona una conversación de la izquierda o registra a un alumno para comenzar a chatear.
          </p>
        </div>
      )}
    </div>
  );
};
