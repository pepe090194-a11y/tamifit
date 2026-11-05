'use client';

import React, { useState, useEffect } from 'react';

export default function GatePage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Asegurar fondo blanco puro y texto oscuro eliminando el tema oscuro global
    document.documentElement.classList.remove('dark');
    document.documentElement.style.backgroundColor = '#ffffff';
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.color = '#18181b';

    return () => {
      document.documentElement.classList.add('dark');
      document.documentElement.style.backgroundColor = '';
      document.body.style.backgroundColor = '';
      document.body.style.color = '';
    };
  }, []);

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
    <div className="fixed inset-0 z-[9999] min-h-[100dvh] w-full bg-white text-zinc-900 flex flex-col items-center justify-center p-4 py-8 overflow-y-auto font-sans">
      <div className="w-full max-w-sm mx-auto">
        
        {/* Cartel simple de mantenimiento */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">
            Web en mantenimiento
          </h1>
        </div>

        {/* Formulario minimalista limpio sobre fondo blanco */}
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Usuario
              </label>
              <input
                type="text"
                autoCapitalize="none"
                autoCorrect="off"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 bg-white text-zinc-900 text-base sm:text-sm focus:outline-none focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-zinc-300 bg-white text-zinc-900 text-base sm:text-sm focus:outline-none focus:border-zinc-800 focus:ring-1 focus:ring-zinc-800 transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 rounded-lg bg-zinc-900 hover:bg-black text-white text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
