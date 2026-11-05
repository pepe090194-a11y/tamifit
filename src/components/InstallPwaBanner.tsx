'use client';

import React, { useState, useEffect } from 'react';
import { Download, ExternalLink } from 'lucide-react';

export const InstallPwaBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const promptRef = React.useRef<any>(null);

  useEffect(() => {
    promptRef.current = deferredPrompt;
  }, [deferredPrompt]);

  const executeInstallOrOpen = async () => {
    const promptEvent = promptRef.current;
    // Si la app aún no está instalada y el navegador tiene el prompt listo, lanza la instalación directa automáticamente
    if (promptEvent) {
      try {
        promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice && choice.outcome === 'accepted') {
          setIsInstalled(true);
          localStorage.setItem('tamifit_app_installed', 'true');
        }
        promptRef.current = null;
        setDeferredPrompt(null);
        return;
      } catch (err) {
        console.error('Error al lanzar instalación directa:', err);
      }
    }

    // Si ya está instalada o le vuelve a dar, abre la aplicación instalada directamente
    window.location.href = '/app';
  };

  useEffect(() => {
    // 1. Detectar si ya está corriendo en modo standalone (dentro de la app instalada)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
    }

    // 2. Comprobar si se había instalado previamente
    if (localStorage.getItem('tamifit_app_installed') === 'true') {
      setIsInstalled(true);
    }

    // 3. Capturar el evento de instalación nativo automático
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      promptRef.current = e;
      setDeferredPrompt(e);
      setIsInstalled(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // 4. Cuando se completa la instalación con éxito
    const handleAppInstalled = () => {
      setIsInstalled(true);
      localStorage.setItem('tamifit_app_installed', 'true');
      promptRef.current = null;
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    // 5. Escuchar evento global si se pulsa desde otro botón de la app
    const handleTrigger = () => {
      executeInstallOrOpen();
    };
    window.addEventListener('tamifit-open-install', handleTrigger);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('tamifit-open-install', handleTrigger);
    };
  }, []);

  return (
    <div className="relative w-full z-40 bg-[#10141E]/95 backdrop-blur-xl border-b border-[#E2FB3A]/30 px-3 sm:px-4 py-2.5 text-white shadow-md">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-2.5 sm:gap-4">
        
        {/* Identificador y texto descriptivo */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[#090A0C] border border-[#E2FB3A] flex items-center justify-center p-1 shrink-0 shadow-md shadow-[#E2FB3A]/20">
            <span className="font-black text-[#E2FB3A] text-sm">T</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm font-bold text-white truncate flex items-center gap-1.5">
              <span>{isInstalled && !deferredPrompt ? 'TamiFit Instalada' : 'Instala TamiFit en tu móvil'}</span>
              <span className="px-1.5 py-0.5 rounded bg-[#E2FB3A]/20 text-[#E2FB3A] text-[9px] font-mono font-bold">
                APP
              </span>
            </p>
            <p className="text-[10px] sm:text-xs text-zinc-400 truncate">
              {isInstalled && !deferredPrompt
                ? 'Pulsa para abrir directamente en pantalla completa'
                : 'Acceso directo en tu pantalla de inicio'}
            </p>
          </div>
        </div>

        {/* Botón de acción: si es la 1ª vez la instala automáticamente; si ya está instalada, la abre */}
        <button
          type="button"
          onClick={executeInstallOrOpen}
          className="bg-[#E2FB3A] hover:bg-[#d4ed28] text-black font-black text-[11px] sm:text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-[#E2FB3A]/20 transition-all active:scale-95 cursor-pointer shrink-0"
        >
          {isInstalled && !deferredPrompt ? (
            <>
              <ExternalLink className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Abrir App</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Instalar App</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
};
