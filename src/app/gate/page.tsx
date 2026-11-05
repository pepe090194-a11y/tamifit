'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Lock, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function GatePage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/provisional-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Redirigir o recargar para entrar a la web
        window.location.reload();
      } else {
        setError(data.error || 'Credenciales incorrectas');
        setLoading(false);
      }
    } catch {
      setError('Error de conexión. Inténtalo de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06080C] text-[#F3F4F6] flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-[#E2FB3A] selection:text-black">
      
      {/* Luces y auras de fondo estilo Tamifit */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#E2FB3A]/12 to-transparent rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#E2FB3A]/5 rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto">
        
        {/* Cabecera del candado */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4 group">
            <Image
              src="/tamifit-logo.png"
              alt="Tamifit"
              width={160}
              height={50}
              className="h-10 w-auto object-contain drop-shadow-[0_0_15px_rgba(226,251,58,0.3)]"
              priority
            />
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-3">
            <Lock className="w-3.5 h-3.5 text-[#E2FB3A]" />
            <span>ACCESO EXCLUSIVO EN CONSTRUCCIÓN</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Sitio Web Privado
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-zinc-400 max-w-xs mx-auto">
            Introduce las credenciales de administración para acceder a la plataforma.
          </p>
        </div>

        {/* Tarjeta de Login */}
        <div className="bg-[#0D1017]/90 border border-white/10 rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl shadow-black/80 relative">
          
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-3 text-red-400 text-xs sm:text-sm animate-fadeIn">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Usuario
              </label>
              <input
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="ej. pepe"
                className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#E2FB3A] focus:ring-1 focus:ring-[#E2FB3A] text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 rounded-xl bg-black/50 border border-white/10 text-white placeholder-zinc-600 focus:outline-none focus:border-[#E2FB3A] focus:ring-1 focus:ring-[#E2FB3A] text-sm transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#E2FB3A] text-black font-black uppercase text-xs sm:text-sm tracking-wider hover:bg-[#c8e02b] transition-all transform hover:scale-[1.01] active:scale-95 shadow-xl shadow-[#E2FB3A]/20 disabled:opacity-50 disabled:pointer-events-none"
            >
              <span>{loading ? 'Verificando...' : 'Acceder al Sitio'}</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-white/[0.07] flex items-center justify-center gap-2 text-[11px] text-zinc-500 font-mono">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E2FB3A]" />
            <span>SESIÓN SEGURA DE ADMINISTRADOR</span>
          </div>
        </div>

        {/* Footer simple */}
        <p className="text-center text-[11px] text-zinc-600 font-mono mt-8">
          TAMIFIT © 2026 // ACCESO PRIVADO
        </p>

      </div>
    </div>
  );
}
