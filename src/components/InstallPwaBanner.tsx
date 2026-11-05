'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Download, Share, PlusSquare, X, Smartphone, Check } from 'lucide-react';

export const InstallPwaBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIos, setIsIos] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true); // default true until verified
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // 1. Check if running inside installed PWA
    const checkStandalone = () => {
      const isStand =
        window.matchMedia('(display-mode: standalone)').matches ||
        (window.navigator as any).standalone === true ||
        document.referrer.includes('android-app://');
      setIsStandalone(isStand);
      return isStand;
    };

    if (checkStandalone()) return;

    // 2. Check if user dismissed banner recently
    const dismissedAt = localStorage.getItem('tamifit_pwa_banner_dismissed');
    if (dismissedAt) {
      const days = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60 * 24);
      if (days < 5) {
        setIsDismissed(true);
        return;
      }
    }
    setIsDismissed(false);

    // 3. Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
    setIsIos(isIosDevice);

    // 4. Android/Chrome native prompt capture
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsDismissed(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsStandalone(true);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('tamifit_pwa_banner_dismissed', Date.now().toString());
  };

  const handleInstallClick = async () => {
    if (isIos) {
      setShowIosGuide(true);
      return;
    }

    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsStandalone(true);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback instruction if browser doesn't expose prompt yet
      setShowIosGuide(true);
    }
  };

  if (isStandalone || isDismissed) {
    return null;
  }

  return (
    <>
      {/* Floating PWA Install Bar */}
      <div className="relative z-50 bg-[#121620] border-b border-[#283245] px-3 sm:px-4 py-2.5 text-white shadow-xl animate-fadeIn">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2.5 sm:gap-4">
          
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-[#090A0C] border border-[#E2FB3A]/40 flex items-center justify-center p-1 shrink-0 shadow-md shadow-[#E2FB3A]/10">
              <span className="font-black text-[#E2FB3A] text-sm">T</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-bold text-white truncate">
                Instala TamiFit en tu móvil
              </p>
              <p className="text-[10px] sm:text-xs text-gray-400 truncate">
                Acceso rápido a pantalla completa sin navegador
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handleInstallClick}
              className="bg-[#E2FB3A] hover:bg-[#d6f026] text-black font-extrabold text-[11px] sm:text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md shadow-[#E2FB3A]/20 transition-all active:scale-95 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Instalar App</span>
            </button>

            <button
              onClick={handleDismiss}
              className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Cerrar aviso"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* iOS / Fallback Installation Modal */}
      {showIosGuide && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-[#131722] border border-[#273247] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#090A0C] border border-[#E2FB3A]/50 flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-[#E2FB3A]" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-white">
                    Instalar en tu Pantalla de Inicio
                  </h3>
                  <p className="text-[11px] text-gray-400">
                    Solo te llevará 5 segundos
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowIosGuide(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 pt-2 text-xs sm:text-sm text-gray-200">
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#1A2030] border border-[#2D384E]">
                <div className="w-7 h-7 rounded-full bg-[#E2FB3A]/20 text-[#E2FB3A] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <p className="font-semibold text-white">Toca el botón Compartir</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1.5">
                    En la barra inferior de Safari, pulsa <Share className="w-3.5 h-3.5 text-[#E2FB3A] inline" />
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#1A2030] border border-[#2D384E]">
                <div className="w-7 h-7 rounded-full bg-[#E2FB3A]/20 text-[#E2FB3A] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <p className="font-semibold text-white">Selecciona "Añadir a pantalla de inicio"</p>
                  <p className="text-[11px] text-gray-400 mt-0.5 flex items-center gap-1.5">
                    Desliza hacia abajo y busca <PlusSquare className="w-3.5 h-3.5 text-[#E2FB3A] inline" />
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#1A2030] border border-[#2D384E]">
                <div className="w-7 h-7 rounded-full bg-[#E2FB3A]/20 text-[#E2FB3A] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <p className="font-semibold text-white">Pulsa "Añadir"</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    En la esquina superior derecha. ¡Y listo!
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIosGuide(false)}
              className="w-full bg-[#E2FB3A] hover:bg-[#d6f026] text-black font-extrabold text-xs sm:text-sm py-3 rounded-xl transition-all cursor-pointer"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
