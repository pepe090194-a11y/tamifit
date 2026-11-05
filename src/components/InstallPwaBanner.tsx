'use client';

import React, { useState, useEffect } from 'react';
import { Download, Share, PlusSquare, X, Smartphone, MoreVertical } from 'lucide-react';

export const InstallPwaBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios'>('android');

  useEffect(() => {
    // 1. Detectar si ya está corriendo como app instalada (standalone)
    const checkStandalone = () => {
      const isStand =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(isStand);
      return isStand;
    };

    if (checkStandalone()) return;

    // 2. Detectar si es iOS o Android
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua) && !(window as any).MSStream;
    setIsIos(isIosDevice);
    setActiveTab(isIosDevice ? 'ios' : 'android');

    // 3. Comprobar si el usuario cerró el banner en la sesión actual
    const sessionDismissed = sessionStorage.getItem('tamifit_pwa_dismissed');
    if (sessionDismissed === 'true') {
      setIsDismissed(true);
    }

    // 4. Capturar el evento nativo de instalación (Android/Chrome/Edge)
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Si el navegador avisa que se puede instalar, nos aseguramos de mostrarlo
      setIsDismissed(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 5. Escuchar evento de instalación completada
    window.addEventListener('appinstalled', () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
      setShowGuide(false);
    });

    // 6. Escuchar evento global para abrir la guía desde cualquier botón de la app
    const handleOpenGuide = () => {
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choice: any) => {
          if (choice.outcome === 'accepted') {
            setIsStandalone(true);
          }
          setDeferredPrompt(null);
        });
      } else {
        setShowGuide(true);
      }
    };

    window.addEventListener('tamifit-open-install', handleOpenGuide);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('tamifit-open-install', handleOpenGuide);
    };
  }, [deferredPrompt]);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('tamifit_pwa_dismissed', 'true');
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setIsStandalone(true);
      }
      setDeferredPrompt(null);
    } else {
      // Si el navegador tiene el prompt nativo en cooldown tras desinstalar o es iOS
      setShowGuide(true);
    }
  };

  if (isStandalone) {
    return null;
  }

  return (
    <>
      {/* Barra superior de instalación fija con z-index superior para no ser tapada */}
      {!isDismissed && (
        <div className="fixed top-0 left-0 right-0 z-[100] bg-[#10141E]/95 backdrop-blur-xl border-b border-[#E2FB3A]/30 px-3 sm:px-4 py-2.5 text-white shadow-2xl shadow-black/80 animate-fadeIn">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-2.5 sm:gap-4">
            
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-[#090A0C] border border-[#E2FB3A] flex items-center justify-center p-1 shrink-0 shadow-md shadow-[#E2FB3A]/20">
                <span className="font-black text-[#E2FB3A] text-sm">T</span>
              </div>
              <div className="min-w-0">
                <p className="text-xs sm:text-sm font-bold text-white truncate flex items-center gap-1.5">
                  <span>Instala TamiFit en tu móvil</span>
                  <span className="hidden sm:inline-block px-1.5 py-0.2 rounded bg-[#E2FB3A]/20 text-[#E2FB3A] text-[9px] font-mono">PWA</span>
                </p>
                <p className="text-[10px] sm:text-xs text-zinc-400 truncate">
                  Acceso directo a pantalla completa sin navegador
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <button
                type="button"
                onClick={handleInstallClick}
                className="bg-[#E2FB3A] hover:bg-[#d4ed28] text-black font-black text-[11px] sm:text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-lg shadow-[#E2FB3A]/20 transition-all active:scale-95 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Instalar App</span>
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="text-zinc-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Cerrar aviso temporalmente"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Guía de Instalación para Android / iPhone */}
      {showGuide && (
        <div className="fixed inset-0 z-[200] bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-[#11141D] border border-white/15 rounded-3xl p-5 sm:p-6 shadow-2xl shadow-black/90 space-y-4">
            
            {/* Cabecera del modal */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-black/60 border border-[#E2FB3A] flex items-center justify-center shadow-lg shadow-[#E2FB3A]/20">
                  <Smartphone className="w-5 h-5 text-[#E2FB3A]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                    Cómo Instalar TamiFit
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    Sigue estos 2 sencillos pasos en tu navegador
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowGuide(false)}
                className="text-zinc-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Pestañas Android vs iPhone */}
            <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-black/50 border border-white/10 text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('android')}
                className={`py-2 rounded-lg transition-all ${
                  activeTab === 'android'
                    ? 'bg-[#E2FB3A] text-black shadow-md shadow-[#E2FB3A]/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                Android / Chrome
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`py-2 rounded-lg transition-all ${
                  activeTab === 'ios'
                    ? 'bg-[#E2FB3A] text-black shadow-md shadow-[#E2FB3A]/20'
                    : 'text-zinc-400 hover:text-white'
                }`}
              >
                iPhone / Safari
              </button>
            </div>

            {/* Pasos para Android / Chrome */}
            {activeTab === 'android' && (
              <div className="space-y-2.5 text-xs sm:text-sm text-zinc-300">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="w-6 h-6 rounded-full bg-[#E2FB3A]/20 text-[#E2FB3A] flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-white">Abre el menú de opciones</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-1.5">
                      Pulsa los 3 puntos <MoreVertical className="w-3.5 h-3.5 text-[#E2FB3A] inline" /> en la esquina superior derecha de Chrome.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="w-6 h-6 rounded-full bg-[#E2FB3A]/20 text-[#E2FB3A] flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-white">Pulsa en "Instalar aplicación"</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-1.5">
                      (O "Añadir a pantalla de inicio"). Dale a <strong className="text-white">Instalar</strong> y ¡listo!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Pasos para iPhone / Safari */}
            {activeTab === 'ios' && (
              <div className="space-y-2.5 text-xs sm:text-sm text-zinc-300">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="w-6 h-6 rounded-full bg-[#E2FB3A]/20 text-[#E2FB3A] flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <p className="font-bold text-white">Toca el botón Compartir</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-1.5">
                      En la barra inferior de Safari, pulsa el icono <Share className="w-3.5 h-3.5 text-[#E2FB3A] inline" />
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                  <div className="w-6 h-6 rounded-full bg-[#E2FB3A]/20 text-[#E2FB3A] flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <p className="font-bold text-white">Selecciona "Añadir a pantalla de inicio"</p>
                    <p className="text-[11px] text-zinc-400 mt-0.5 flex items-center gap-1.5">
                      Desliza hacia abajo y busca <PlusSquare className="w-3.5 h-3.5 text-[#E2FB3A] inline" />. Luego pulsa "Añadir".
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Botón de cierre */}
            <button
              type="button"
              onClick={() => setShowGuide(false)}
              className="w-full bg-[#E2FB3A] hover:bg-[#d4ed28] text-black font-black text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer shadow-lg shadow-[#E2FB3A]/20"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
