'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Camera, Upload, Link as LinkIcon, Check, X, Sparkles, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export const PRESET_AVATARS = [
  { label: 'Entrenadora 1', url: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=350&auto=format&fit=crop&q=80' },
  { label: 'Entrenadora 2', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=350&auto=format&fit=crop&q=80' },
  { label: 'Entrenadora 3', url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=350&auto=format&fit=crop&q=80' },
  { label: 'Entrenador 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=350&auto=format&fit=crop&q=80' },
  { label: 'Atleta 1', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=350&auto=format&fit=crop&q=80' },
  { label: 'Atleta 2', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=350&auto=format&fit=crop&q=80' },
  { label: 'Atleta 3', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=350&auto=format&fit=crop&q=80' },
  { label: 'Atleta 4', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=350&auto=format&fit=crop&q=80' }
];

interface AvatarEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: string;
  title?: string;
  subtitle?: string;
  onSave: (newAvatarUrl: string) => Promise<void> | void;
}

export const AvatarEditModal: React.FC<AvatarEditModalProps> = ({
  isOpen,
  onClose,
  currentAvatar,
  title = 'Cambiar Foto de Perfil',
  subtitle = 'Sube una foto desde tu galería, elige una de la biblioteca o pega una URL',
  onSave
}) => {
  const [mounted, setMounted] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar || PRESET_AVATARS[0].url);
  const [customUrl, setCustomUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSelectedAvatar(currentAvatar || PRESET_AVATARS[0].url);
      setCustomUrl('');
      setErrorMessage('');
      setIsProcessing(false);
      setIsSuccess(false);
    }
  }, [isOpen, currentAvatar]);

  if (!isOpen || !mounted) return null;

  // Compress & resize uploaded image to lightweight data URL (max 350x350)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('Por favor, selecciona un archivo de imagen válido (JPG, PNG, WebP).');
      return;
    }

    setErrorMessage('');
    setIsProcessing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          const maxWidth = 350;
          const maxHeight = 350;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressed = canvas.toDataURL('image/jpeg', 0.85);
            setSelectedAvatar(compressed);
          } else {
            setSelectedAvatar(event.target?.result as string);
          }
        } catch (err) {
          setSelectedAvatar(event.target?.result as string);
        } finally {
          setIsProcessing(false);
        }
      };
      img.onerror = () => {
        setErrorMessage('No se pudo procesar la imagen seleccionada.');
        setIsProcessing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      setErrorMessage('Error al leer el archivo.');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    setSelectedAvatar(customUrl.trim());
  };

  const handleSave = async (avatarToSave?: string) => {
    const target = avatarToSave || selectedAvatar;
    if (!target) return;
    setIsProcessing(true);
    setErrorMessage('');
    try {
      await onSave(target);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 600);
    } catch (err: any) {
      console.error('Error saving avatar:', err);
      setErrorMessage('Ocurrió un error al guardar la foto. Revisa tu conexión.');
    } finally {
      setIsProcessing(false);
    }
  };

  const modalContent = (
    <div 
      className="fixed inset-0 z-[9999] bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 select-none animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-[#12151D] border border-[#272F3F] rounded-3xl w-full max-w-md shadow-2xl flex flex-col max-h-[92vh] overflow-hidden relative">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#202736] flex items-center justify-between shrink-0">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-[#E2FB3A]" />
              <span>{title}</span>
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-xl bg-[#181D26] hover:bg-[#202736] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <div className="relative">
              <img
                src={selectedAvatar}
                alt="Vista previa"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-3 border-[#E2FB3A] shadow-xl shadow-[#E2FB3A]/20"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer text-white"
                title="Cambiar imagen"
              >
                <Camera className="w-6 h-6 text-[#E2FB3A]" />
              </button>
              <div className="absolute -bottom-1 -right-1 bg-[#E2FB3A] text-black p-1.5 rounded-full shadow-md">
                <Camera className="w-3 h-3 stroke-[2.5]" />
              </div>
            </div>
            <span className="text-[10px] text-gray-400 font-medium">Vista previa actual</span>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {isSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>¡Foto guardada correctamente! Sincronizando...</span>
            </div>
          )}

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-[#161B26] border border-[#232B3B] rounded-xl text-xs font-bold text-center">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'upload' ? 'bg-[#E2FB3A] text-black shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Subir</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'presets' ? 'bg-[#E2FB3A] text-black shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Galería</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`py-2 px-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'url' ? 'bg-[#E2FB3A] text-black shadow-sm' : 'text-gray-400 hover:text-white'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>URL</span>
            </button>
          </div>

          {/* TAB 1: File Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-[#2E374A] hover:border-[#E2FB3A] rounded-2xl p-6 flex flex-col items-center justify-center gap-2 bg-[#161B26]/60 hover:bg-[#161B26] transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-full bg-[#E2FB3A]/10 text-[#E2FB3A] flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Upload className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div className="text-center">
                  <p className="text-xs font-bold text-white">Elige una foto de tu dispositivo</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Compatible con cámara de móvil o archivos JPG, PNG</p>
                </div>
              </button>
            </div>
          )}

          {/* TAB 2: Presets Grid */}
          {activeTab === 'presets' && (
            <div className="space-y-2.5">
              <p className="text-[11px] text-gray-400">Toca el avatar que más te guste:</p>
              <div className="grid grid-cols-4 gap-2.5 max-h-48 overflow-y-auto pr-1">
                {PRESET_AVATARS.map((item, idx) => {
                  const isSelected = selectedAvatar === item.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAvatar(item.url)}
                      className={`relative rounded-full aspect-square overflow-hidden border-2 transition-all cursor-pointer group ${
                        isSelected ? 'border-[#E2FB3A] ring-2 ring-[#E2FB3A]/60 scale-105' : 'border-[#232938] hover:border-gray-400'
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.label}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-[#E2FB3A]/30 flex items-center justify-center">
                          <Check className="w-4 h-4 text-black stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Direct URL */}
          {activeTab === 'url' && (
            <form onSubmit={handleApplyUrl} className="space-y-3">
              <label className="text-[11px] font-bold text-gray-300 block">
                Pega la dirección web de una imagen:
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://ejemplo.com/mifoto.jpg"
                  className="flex-1 bg-[#171B26] text-xs text-white px-3 py-2.5 rounded-xl border border-[#273042] focus:outline-none focus:border-[#E2FB3A]"
                />
                <button
                  type="submit"
                  className="bg-[#202636] hover:bg-[#283144] text-[#E2FB3A] text-xs font-bold px-3 py-2.5 rounded-xl border border-[#2E394E] cursor-pointer"
                >
                  Cargar
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-[#202736] bg-[#0E1015] flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white bg-[#161B24] border border-[#232938] hover:bg-[#1E2432] transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={isProcessing || isSuccess}
            onClick={() => handleSave()}
            className="px-5 py-2.5 rounded-xl text-xs font-extrabold text-black bg-[#E2FB3A] hover:bg-[#d5f028] shadow-lg shadow-[#E2FB3A]/20 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin stroke-[2.5]" />
                <span>Guardando...</span>
              </>
            ) : isSuccess ? (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>¡Guardado!</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Guardar Foto</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
