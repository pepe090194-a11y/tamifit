'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, Sparkles, UserCheck } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (username: string, pass: string) => Promise<{ success: boolean; error?: string } | boolean>;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Strictly lock document, html, body and prevent any scroll, bounce or wheel/touch dragging
  useEffect(() => {
    const originalHtmlOverflow = document.documentElement.style.overflow;
    const originalHtmlTouchAction = document.documentElement.style.touchAction;
    const originalBodyOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalHeight = document.body.style.height;
    const originalWidth = document.body.style.width;
    const originalTouchAction = document.body.style.touchAction;

    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
    document.documentElement.style.touchAction = 'none';

    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.height = '100%';
    document.body.style.width = '100%';
    document.body.style.top = '0';
    document.body.style.left = '0';
    document.body.style.touchAction = 'none';

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      document.documentElement.style.overflow = originalHtmlOverflow;
      document.documentElement.style.height = '';
      document.documentElement.style.touchAction = originalHtmlTouchAction;

      document.body.style.overflow = originalBodyOverflow;
      document.body.style.position = originalPosition;
      document.body.style.height = originalHeight;
      document.body.style.width = originalWidth;
      document.body.style.top = '';
      document.body.style.left = '';
      document.body.style.touchAction = originalTouchAction;

      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const u = username.trim();
    let p = password.trim();

    if (!u) {
      setErrorMessage('Por favor, introduce tu usuario.');
      return;
    }

    // If demo test user is entered without password, auto-provide default generated pass
    if (u.toLowerCase() === 'test' && !p) {
      p = 'TAMI-8978';
      setPassword('TAMI-8978');
    }

    if (!p) {
      setErrorMessage('Por favor, introduce tu contraseña.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await onLogin(u, p);
      if (typeof res === 'object') {
        if (!res.success) {
          setErrorMessage(res.error || 'Usuario o contraseña incorrectos.');
          setIsLoading(false);
        }
      } else if (!res) {
        setErrorMessage('Usuario o contraseña incorrectos. Revisa tus datos e inténtalo de nuevo.');
        setIsLoading(false);
      }
    } catch (err) {
      setErrorMessage('Error de conexión al servidor. Inténtalo de nuevo.');
      setIsLoading(false);
    }
  };

  const handleQuickLogin = (quickUser: string, quickPass: string) => {
    setUsername(quickUser);
    setPassword(quickPass);
    setErrorMessage('');
  };

  return (
    <div className="login-container fixed inset-0 w-full h-[100dvh] max-h-[100dvh] bg-[#07090C] text-[#F3F4F6] flex flex-col items-center justify-center p-3 sm:p-6 select-none touch-none overscroll-none overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-[#E2FB3A]/10 rounded-full blur-[100px] sm:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-60 sm:w-80 h-60 sm:h-80 bg-blue-500/5 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-[360px] sm:max-w-[400px] relative z-10 px-1">
        <div className="bg-[#11141C]/95 backdrop-blur-xl border border-[#232938] rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-2xl shadow-black/80 space-y-3.5 sm:space-y-4">
          
          {/* Logo & Header */}
          <div className="text-center space-y-1.5 sm:space-y-2">
            <div className="inline-flex items-center justify-center px-3 py-1.5 rounded-2xl bg-[#161B26] border border-[#2A3346] shadow-inner mb-0.5">
              <Image
                src="/tamifit-logo.png"
                alt="tamifit."
                width={120}
                height={35}
                className="object-contain h-7 sm:h-8 w-auto"
                priority
              />
            </div>
            
            <div>
              <h2 className="text-base sm:text-lg font-black text-white tracking-tight">
                Iniciar Sesión
              </h2>
              <p className="text-[11px] sm:text-xs text-gray-400 mt-0.5">
                Acceso al Portal de Entrenamiento & Coaching
              </p>
            </div>
          </div>

          {/* Quick Demo Access Chips */}
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => handleQuickLogin('test', 'TAMI-8978')}
              className="px-2.5 py-1.5 rounded-xl bg-[#181D2A] hover:bg-[#202738] border border-[#2B3548] text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#E2FB3A]">
                <UserCheck className="w-3 h-3" />
                <span>Alumno Demo</span>
              </div>
              <p className="text-[9px] text-gray-400 font-mono mt-0.5">test / TAMI-8978</p>
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('tamifit', 'alm2026')}
              className="px-2.5 py-1.5 rounded-xl bg-[#181D2A] hover:bg-[#202738] border border-[#2B3548] text-left transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-white">
                <Sparkles className="w-3 h-3 text-[#E2FB3A]" />
                <span>Entrenadora</span>
              </div>
              <p className="text-[9px] text-gray-400 font-mono mt-0.5">tamifit / alm2026</p>
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs px-3.5 py-2.5 rounded-xl flex items-center gap-2 animate-fadeIn">
              <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-3.5">
            {/* Input: Usuario */}
            <div className="space-y-1">
              <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-300 block">
                Usuario
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  autoCapitalize="none"
                  autoCorrect="off"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Tu usuario (ej. test o tamifit)"
                  className="w-full bg-[#181D2A] text-base sm:text-sm text-white placeholder-gray-500 pl-10 pr-3 py-2.5 sm:py-3 rounded-xl border border-[#2A3348] focus:outline-none focus:border-[#E2FB3A] focus:ring-1 focus:ring-[#E2FB3A] transition-all"
                />
              </div>
            </div>

            {/* Input: Contraseña */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-300 block">
                  Contraseña / Clave
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-[#181D2A] text-base sm:text-sm text-white placeholder-gray-500 pl-10 pr-11 py-2.5 sm:py-3 rounded-xl border border-[#2A3348] focus:outline-none focus:border-[#E2FB3A] focus:ring-1 focus:ring-[#E2FB3A] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white p-1 cursor-pointer"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#E2FB3A] hover:bg-[#d5f028] disabled:opacity-60 text-black font-black text-xs sm:text-sm py-3 sm:py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-[#E2FB3A]/20 transition-all cursor-pointer active:scale-[0.98] mt-2 min-h-[44px]"
            >
              {isLoading ? (
                <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Entrar a TamiFit</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="pt-2 border-t border-[#1F2636] text-center space-y-0.5 text-[10px] sm:text-[11px] text-gray-400">
            <p className="flex items-center justify-center gap-1.5 text-gray-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#E2FB3A]" />
              Acceso seguro para entrenadores y alumnos
            </p>
          </div>
        </div>

        {/* Small copyright below */}
        <p className="text-center text-[10px] sm:text-[11px] text-gray-500 mt-2 sm:mt-3">
          TamiFit • Coaching Deportivo & Rendimiento
        </p>
      </div>
    </div>
  );
};
