'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Dumbbell,
  Smartphone,
  CheckCircle,
  CheckCircle2,
  TrendingUp,
  MessageCircle,
  Calendar,
  Video,
  ChevronDown,
  ArrowRight,
  Zap,
  Check,
  Flame,
  HeartPulse,
  Lock,
  Sparkles,
  Play,
  Sliders,
  ShieldCheck,
  Award,
  Share,
  PlusSquare,
  Camera,
  Layers,
  User,
  Menu,
  X,
  Activity,
  Target,
  SlidersHorizontal,
  Compass,
  Radio,
  Gauge,
  Crosshair,
  ChevronRight,
  Cpu,
  Terminal,
  Clock,
  Sparkle
} from 'lucide-react';

const SectionDivider: React.FC = () => (
  <div className="relative w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-0 overflow-visible z-20">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-[1px] bg-gradient-to-r from-transparent via-[#E2FB3A]/60 to-transparent" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[#06080C] border-2 border-[#E2FB3A] shadow-[0_0_12px_#E2FB3A]" />
  </div>
);

export const LandingPage: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Active Screen on Phone Showcase ('entreno' | 'cargas' | 'checkin' | 'chat')
  const [activeAppScreen, setActiveAppScreen] = useState<'entreno' | 'cargas' | 'checkin' | 'chat'>('entreno');

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Diagnostic Quiz State
  const [quizStep, setQuizStep] = useState(1);
  const [quizAnswers, setQuizAnswers] = useState<{ goal?: string; days?: string; obstacle?: string }>({});
  const handleQuizAnswer = (field: 'goal' | 'days' | 'obstacle', val: string) => {
    const next = { ...quizAnswers, [field]: val };
    setQuizAnswers(next);
    if (quizStep < 3) {
      setQuizStep(quizStep + 1);
    } else {
      setQuizStep(4);
    }
  };

  const whatsappNumber = '34695427545';
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    '¡Hola Tamara! He visto tu web y me gustaría información para empezar mi asesoramiento personalizado contigo.'
  )}`;

  // Desplazamiento suave para los enlaces de ancla
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        window.history.pushState(null, '', href);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#06080C] text-[#F3F4F6] selection:bg-[#E2FB3A] selection:text-black font-sans antialiased overflow-x-hidden">

      {/* Ambient Gym Lighting (Natural Scroll - No Parallax) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-gradient-to-b from-[#E2FB3A]/10 to-transparent rounded-full blur-[150px]" />
        <div className="absolute top-[35%] -left-48 w-[600px] h-[600px] bg-[#E2FB3A]/5 rounded-full blur-[160px]" />
        <div className="absolute top-[65%] -right-48 w-[600px] h-[600px] bg-[#E2FB3A]/6 rounded-full blur-[160px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      </div>

      {/* ============================================================ */}
      {/* HEADER PRINCIPAL TAMIFIT (DISEÑO RENOVADO ATHLETIC / URBAN)   */}
      {/* Secciones directamente sobre el header (sin recuadro)         */}
      {/* Con el hover láser neón original de la opción 1               */}
      {/* ============================================================ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#06080C]/85 backdrop-blur-2xl border-b border-white/[0.08] shadow-lg shadow-black/40 transition-all">
        {/* Línea láser inferior sutil en el borde del header */}
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#E2FB3A]/30 to-transparent pointer-events-none" />

        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between relative">
          
          {/* Logo visible en móvil a la izquierda (cuando el bloque central de desktop está oculto) */}
          <div className="xl:hidden flex items-center shrink-0">
            <Link href="/" className="flex items-center shrink-0 group">
              <Image
                src="/tamifit-logo.png"
                alt="Tamifit"
                width={130}
                height={40}
                className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-105"
                priority
              />
            </Link>
          </div>

          {/* CENTRO DE LA PANTALLA: [LOGO + LÍNEA VERTICAL SEPARATORIA + MENÚS] TODO CENTRADO */}
          <div className="hidden xl:flex items-center gap-4 xl:gap-5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-auto">
            {/* Logo Oficial */}
            <Link href="/" className="flex items-center shrink-0 group">
              <Image
                src="/tamifit-logo.png"
                alt="Tamifit"
                width={135}
                height={42}
                className="h-8 xl:h-9 w-auto object-contain transition-transform group-hover:scale-105"
                priority
              />
            </Link>

            {/* Línea vertical separatoria del color del logo (#E2FB3A) */}
            <div className="h-5 w-[2px] bg-[#E2FB3A] shadow-[0_0_8px_rgba(226,251,58,0.6)] rounded-full shrink-0" />

            {/* Los Menús de Navegación */}
            <nav className="flex items-center gap-1 xl:gap-2">
              {[
                { href: '#app-showcase', label: 'La App' },
                { href: '#diagnostico', label: 'Diagnóstico' },
                { href: '#metodo', label: 'Método 1a1' },
                { href: '#entrenadora', label: 'Tamara' },
                { href: '#faq', label: 'Preguntas' }
              ].map(item => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="group relative px-2.5 xl:px-3.5 py-2 text-xs font-black uppercase tracking-wider text-zinc-300 hover:text-white transition-colors duration-200 whitespace-nowrap"
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className="absolute bottom-0 left-2 right-2 h-[2px] bg-[#E2FB3A] shadow-[0_0_12px_#E2FB3A] rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                  <span className="absolute inset-0 rounded-lg bg-white/0 group-hover:bg-white/[0.03] transition-colors duration-200 pointer-events-none" />
                </a>
              ))}
            </nav>
          </div>

          {/* A LA DERECHA DEL TODO DEL HEADER: BOTONES DE ÁREA ALUMNOS Y EMPIEZA YA SEPARADOS */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0 ml-auto z-10">
            <Link
              href="/app"
              className="hidden sm:inline-flex items-center justify-center whitespace-nowrap px-4 py-2.5 rounded-xl border border-white/15 bg-white/[0.04] hover:bg-white/10 text-zinc-300 hover:text-white font-bold text-xs uppercase tracking-wider transition-all shrink-0"
            >
              Área Alumnos
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center whitespace-nowrap px-3 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-[#E2FB3A] hover:bg-[#d4ed28] text-black font-black text-[11px] sm:text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(226,251,58,0.25)] hover:shadow-[0_0_25px_rgba(226,251,58,0.4)] transition-all transform hover:scale-[1.02] active:scale-95 gap-1.5 sm:gap-2 shrink-0"
            >
              <span>¡Empieza Ya!</span>
              <ChevronRight className="w-4 h-4 stroke-[3]" />
            </a>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition-colors shrink-0"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-zinc-300" />}
            </button>
          </div>

        </div>

        {/* Menú Mobile desplegable acorde al nuevo estilo */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-[#0A0D15]/95 backdrop-blur-2xl border-b border-white/10 px-4 py-4 space-y-1.5 animate-fadeIn">
            {[
              { href: '#app-showcase', label: 'La App' },
              { href: '#diagnostico', label: 'Diagnóstico' },
              { href: '#metodo', label: 'Método 1a1' },
              { href: '#entrenadora', label: 'Tamara' },
              { href: '#faq', label: 'Preguntas' }
            ].map(item => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => {
                  setMobileMenuOpen(false);
                  handleNavClick(e, item.href);
                }}
                className="group flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] font-black text-xs uppercase tracking-wider text-zinc-300 hover:text-white transition-colors"
              >
                <span>{item.label}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#E2FB3A] shadow-[0_0_8px_#E2FB3A]" />
              </a>
            ))}
            
            <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
              <Link
                href="/app"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-xl border border-white/10 bg-white/5 text-white text-xs font-bold uppercase tracking-wider"
              >
                Área Alumnos
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* 1. HERO SECTION (NATURAL SCROLL - NO PARALLAX) */}
      <section
        id="hero"
        className="relative pt-24 sm:pt-32 pb-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden min-h-[85vh] flex items-center justify-center"
      >
        
        {/* Background Image con Paralaje Activo y Alta Visibilidad */}
        <div
          className="absolute inset-0 z-0 bg-fixed bg-cover bg-center pointer-events-none"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=2000&q=85')"
          }}
        >
          {/* Viñeta cinematográfica semitransparente: deja ver el gimnasio y resalta el contenido */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#06080C]/55 via-[#06080C]/25 to-[#06080C]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(226,251,58,0.12)_0%,transparent_70%)]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto space-y-6 sm:space-y-8">
          


          {/* Main Hero Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.05] uppercase drop-shadow-2xl">
            No es otra rutina en PDF. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-100 to-gray-300">
              Es tu transformación real con
            </span>{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E2FB3A] via-yellow-200 to-[#E2FB3A] drop-shadow-[0_0_35px_rgba(226,251,58,0.45)]">
              tu propia app móvil.
            </span>
          </h1>

          <p className="text-base sm:text-xl text-gray-200 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow-md">
            Planificación deportiva y nutricional adaptada a tu vida real. Con vídeos técnicos en HD para cada serie, control de cargas desde tu móvil y comunicación directa 1 a 1 con Tamara.
          </p>

          {/* Action CTAs in Hero */}
          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#E2FB3A] hover:bg-[#cbee22] text-black font-black text-base px-8 py-4 rounded-2xl shadow-[0_0_30px_rgba(226,251,58,0.4)] hover:shadow-[0_0_45px_rgba(226,251,58,0.6)] transition-all hover:scale-105 active:scale-95 uppercase tracking-tight cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-black stroke-none" />
              <span>Solicitar Plaza por WhatsApp</span>
            </a>

            <a
              href="#app-showcase"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0F1420]/80 hover:bg-[#151D2E] text-white border border-white/20 hover:border-[#E2FB3A]/60 font-bold text-base px-7 py-4 rounded-2xl backdrop-blur-md transition-all"
            >
              <Smartphone className="w-5 h-5 text-[#E2FB3A]" />
              <span>Ver Cómo Funciona la App</span>
            </a>
          </div>

          {/* 4 Urban Gym Metrics */}
          <div className="pt-10 border-t border-white/[0.12] grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md hover:border-[#E2FB3A]/40 transition-all">
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">+250</div>
              <div className="text-[11px] sm:text-xs text-gray-300 uppercase tracking-wider mt-1 font-bold">Alumnas Asesoradas</div>
            </div>
            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md hover:border-[#E2FB3A]/40 transition-all">
              <div className="text-3xl sm:text-4xl font-black text-[#E2FB3A] tracking-tight">100%</div>
              <div className="text-[11px] sm:text-xs text-gray-300 uppercase tracking-wider mt-1 font-bold">Planes a Medida</div>
            </div>
            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md hover:border-[#E2FB3A]/40 transition-all">
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">App PWA</div>
              <div className="text-[11px] sm:text-xs text-gray-300 uppercase tracking-wider mt-1 font-bold">iOS & Android Directa</div>
            </div>
            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 backdrop-blur-md hover:border-[#E2FB3A]/40 transition-all">
              <div className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight">&lt; 24h</div>
              <div className="text-[11px] sm:text-xs text-gray-300 uppercase tracking-wider mt-1 font-bold">Feedback Personal</div>
            </div>
          </div>

        </div>
      </section>

      <SectionDivider />

      {/* 2. APP SHOWCASE (CON PARALAJE Y ALTA VISIBILIDAD) */}
      <section
        id="app-showcase"
        className="relative py-24 sm:py-32 overflow-hidden bg-fixed bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=2000&q=85')"
        }}
      >
        {/* Degradado semitransparente deportivo con halo lime */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#06080C]/70 via-[#06080C]/35 to-[#06080C]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(226,251,58,0.10)_0%,transparent_60%)] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">


            <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight leading-tight">
              Todo tu entrenamiento en la palma de tu mano
            </h2>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-normal">
              Olvídate de mirar hojas de cálculo, PDFs imposibles de leer o notas desordenadas. Toda tu planificación deportiva vive en una app propia, limpia y rápida instalable en 1 segundo.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Interactive Feature Pills (7 Cols) */}
            <div className="lg:col-span-7 space-y-3.5">
              
              {/* Feature Pill 1: Entreno */}
              <div
                onClick={() => setActiveAppScreen('entreno')}
                className={`p-5 rounded-3xl border transition-all cursor-pointer backdrop-blur-md ${
                  activeAppScreen === 'entreno'
                    ? 'bg-[#121824]/90 border-[#E2FB3A] shadow-xl shadow-[#E2FB3A]/15 scale-[1.01]'
                    : 'bg-black/40 border-white/[0.08] hover:border-white/30 hover:bg-black/60'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    activeAppScreen === 'entreno' ? 'bg-[#E2FB3A] text-black font-black' : 'bg-white/10 text-[#E2FB3A]'
                  }`}>
                    <Dumbbell className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                        Rutinas Interactivas con Vídeo HD
                      </h3>
                      {activeAppScreen === 'entreno' && (
                        <span className="text-[10px] font-black uppercase bg-[#E2FB3A] text-black px-2.5 py-0.5 rounded-full">
                          Activo en Pantalla
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                      Cada ejercicio tiene su vídeo en alta definición con la técnica biomecánica exacta. Sabes cuántas series hacer, cuántas repeticiones y el RIR fijado.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Pill 2: Cargas */}
              <div
                onClick={() => setActiveAppScreen('cargas')}
                className={`p-5 rounded-3xl border transition-all cursor-pointer backdrop-blur-md ${
                  activeAppScreen === 'cargas'
                    ? 'bg-[#121824]/90 border-[#E2FB3A] shadow-xl shadow-[#E2FB3A]/15 scale-[1.01]'
                    : 'bg-black/40 border-white/[0.08] hover:border-white/30 hover:bg-black/60'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    activeAppScreen === 'cargas' ? 'bg-[#E2FB3A] text-black font-black' : 'bg-white/10 text-[#E2FB3A]'
                  }`}>
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                        Registro de Sobrecarga Serie a Serie
                      </h3>
                      {activeAppScreen === 'cargas' && (
                        <span className="text-[10px] font-black uppercase bg-[#E2FB3A] text-black px-2.5 py-0.5 rounded-full">
                          Activo en Pantalla
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                      Anotas los kilos y las repeticiones que has levantado en cada serie al instante. La app recuerda tu última marca para que superes tu récord en la siguiente sesión.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Pill 3: Check-in */}
              <div
                onClick={() => setActiveAppScreen('checkin')}
                className={`p-5 rounded-3xl border transition-all cursor-pointer backdrop-blur-md ${
                  activeAppScreen === 'checkin'
                    ? 'bg-[#121824]/90 border-[#E2FB3A] shadow-xl shadow-[#E2FB3A]/15 scale-[1.01]'
                    : 'bg-black/40 border-white/[0.08] hover:border-white/30 hover:bg-black/60'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    activeAppScreen === 'checkin' ? 'bg-[#E2FB3A] text-black font-black' : 'bg-white/10 text-[#E2FB3A]'
                  }`}>
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                        Check-in Semanal Fotográfico y Métricas
                      </h3>
                      {activeAppScreen === 'checkin' && (
                        <span className="text-[10px] font-black uppercase bg-[#E2FB3A] text-black px-2.5 py-0.5 rounded-full">
                          Activo en Pantalla
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                      Cada semana subes tus fotos de progreso, medidas y peso de forma 100% privada. Tamara lo revisa personalmente y te envía feedback con los ajustes del plan.
                    </p>
                  </div>
                </div>
              </div>

              {/* Feature Pill 4: Chat */}
              <div
                onClick={() => setActiveAppScreen('chat')}
                className={`p-5 rounded-3xl border transition-all cursor-pointer backdrop-blur-md ${
                  activeAppScreen === 'chat'
                    ? 'bg-[#121824]/90 border-[#E2FB3A] shadow-xl shadow-[#E2FB3A]/15 scale-[1.01]'
                    : 'bg-black/40 border-white/[0.08] hover:border-white/30 hover:bg-black/60'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    activeAppScreen === 'chat' ? 'bg-[#E2FB3A] text-black font-black' : 'bg-white/10 text-[#E2FB3A]'
                  }`}>
                    <MessageCircle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
                        Chat Directo 1 a 1 con tu Entrenadora
                      </h3>
                      {activeAppScreen === 'chat' && (
                        <span className="text-[10px] font-black uppercase bg-[#E2FB3A] text-black px-2.5 py-0.5 rounded-full">
                          Activo en Pantalla
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                      Si te surge una molestia o tienes duda de ejecución, le envías un vídeo o un mensaje a Tamara y te responde directamente. Cero intermediarios ni bots.
                    </p>
                  </div>
                </div>
              </div>

              {/* PWA Key Selling Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#E2FB3A]/20 via-[#E2FB3A]/10 to-transparent border border-[#E2FB3A]/40 flex items-center gap-3 text-xs text-gray-200 backdrop-blur-md">
                <Zap className="w-6 h-6 text-[#E2FB3A] shrink-0" />
                <div>
                  <span className="font-black text-white uppercase block tracking-wide">Instalación Inmediata Sin Pasar por Tiendas:</span>
                  <span className="text-gray-300">Entras con tu enlace y la guardas en tu pantalla de inicio en 1 segundo. Se abre a pantalla completa como una app nativa en iOS o Android.</span>
                </div>
              </div>

            </div>

            {/* Right Column: High-End Smartphone Mockup with Real App Screen (5 Cols) */}
            <div className="lg:col-span-5 flex justify-center">
              
              {/* Phone Exterior Frame */}
              <div className="w-full max-w-[310px] sm:max-w-[330px] bg-[#07090D] border-[4px] sm:border-[6px] border-[#222B3D] rounded-[40px] sm:rounded-[48px] p-2 sm:p-2.5 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative overflow-hidden ring-1 ring-white/15 mx-auto">
                
                {/* Phone Speaker & Dynamic Island */}
                <div className="w-24 h-4 bg-[#141A26] rounded-full mx-auto mb-3 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-black/60 mr-2" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#E2FB3A]/50" />
                </div>

                {/* Inner Phone Screen Content */}
                <div className="bg-[#090A0C] rounded-[36px] overflow-hidden p-3 min-h-[520px] flex flex-col justify-between border border-white/[0.06]">
                  
                  {/* Top Bar of the App */}
                  <div>
                    <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08] mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#161D2B] border border-[#E2FB3A]/50 flex items-center justify-center text-xs font-black text-white">
                          A
                        </div>
                        <div>
                          <p className="text-xs font-black text-white leading-tight">Alex Morales</p>
                          <p className="text-[10px] text-gray-400">Torso / Pierna Pro</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-extrabold bg-[#E2FB3A]/20 text-[#E2FB3A] px-2 py-0.5 rounded-full">
                        Adherencia 98%
                      </span>
                    </div>

                    {/* DYNAMIC SCREEN CONTENT */}
                    {activeAppScreen === 'entreno' && (
                      <div className="space-y-2.5 animate-fadeIn">
                        <div className="bg-[#121722] border border-[#232F42] rounded-2xl p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-[#E2FB3A]">EJERCICIO 1 • PECHO</span>
                            <span className="text-[10px] font-bold text-gray-300">4 Series</span>
                          </div>
                          <h4 className="text-xs font-black text-white">Press de Banca con Barra</h4>
                          <div className="flex items-center gap-2 text-[10px] text-gray-400">
                            <span>8-10 reps</span>
                            <span>•</span>
                            <span>RIR 1-2</span>
                            <span>•</span>
                            <span className="text-[#E2FB3A] font-bold">Descanso 120s</span>
                          </div>
                          
                          <div className="bg-black/50 border border-white/10 rounded-xl p-2 flex items-center justify-between mt-1 cursor-pointer">
                            <div className="flex items-center gap-2">
                              <Play className="w-3.5 h-3.5 text-[#E2FB3A] fill-[#E2FB3A]" />
                              <span className="text-[11px] font-bold text-white">Ver técnica en vídeo HD</span>
                            </div>
                            <span className="text-[9px] text-gray-400">0:45 min</span>
                          </div>
                        </div>

                        <div className="bg-[#10141E] border border-white/[0.06] rounded-2xl p-3 space-y-1">
                          <span className="text-[10px] font-black uppercase text-gray-400">EJERCICIO 2 • ESPALDA</span>
                          <h4 className="text-xs font-black text-white">Dominadas Pronas con Lastre</h4>
                          <p className="text-[10px] text-gray-400">3 Series x 6-8 reps • Control excéntrico 3s</p>
                        </div>
                      </div>
                    )}

                    {activeAppScreen === 'cargas' && (
                      <div className="space-y-2.5 animate-fadeIn">
                        <div className="bg-[#121722] border border-[#E2FB3A]/40 rounded-2xl p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-[#E2FB3A]">REGISTRO EN VIVO</span>
                            <span className="text-[10px] font-bold text-[#E2FB3A]">Semana 4</span>
                          </div>
                          <h4 className="text-xs font-black text-white">Sentadilla Hack Profunda</h4>

                          <div className="space-y-1.5 pt-1">
                            <div className="bg-[#18202E] p-2 rounded-xl flex items-center justify-between text-xs">
                              <span className="text-[10px] font-bold text-gray-400">Serie 1</span>
                              <span className="font-black text-white">80 kg × 10 reps</span>
                              <span className="text-[10px] text-[#E2FB3A] font-bold">✓ Hecha</span>
                            </div>

                            <div className="bg-[#18202E] p-2 rounded-xl flex items-center justify-between text-xs">
                              <span className="text-[10px] font-bold text-gray-400">Serie 2</span>
                              <span className="font-black text-white">82.5 kg × 9 reps</span>
                              <span className="text-[10px] text-[#E2FB3A] font-bold">✓ Récord</span>
                            </div>

                            <div className="bg-[#E2FB3A]/10 border border-[#E2FB3A]/40 p-2 rounded-xl flex items-center justify-between text-xs">
                              <span className="text-[10px] font-bold text-[#E2FB3A]">Serie 3</span>
                              <span className="font-black text-white">Anotar peso hoy...</span>
                              <span className="text-[10px] text-[#E2FB3A] font-bold">En curso</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeAppScreen === 'checkin' && (
                      <div className="space-y-2.5 animate-fadeIn">
                        <div className="bg-[#121722] border border-[#232F42] rounded-2xl p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black uppercase text-[#E2FB3A]">CHECK-IN SEMANAL</span>
                            <span className="text-[10px] font-bold text-gray-300">Domingo</span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2 text-center text-xs">
                            <div className="bg-[#18202E] p-2 rounded-xl">
                              <span className="text-[9px] text-gray-400 block uppercase">Peso Hoy</span>
                              <span className="font-black text-white text-sm">74.2 kg</span>
                              <span className="text-[9px] text-[#E2FB3A] block">-600g esta sem</span>
                            </div>
                            <div className="bg-[#18202E] p-2 rounded-xl">
                              <span className="text-[9px] text-gray-400 block uppercase">Cintura</span>
                              <span className="font-black text-white text-sm">78 cm</span>
                              <span className="text-[9px] text-[#E2FB3A] block">-1.5 cm</span>
                            </div>
                          </div>

                          <div className="p-2.5 bg-black/40 border border-white/10 rounded-xl space-y-1">
                            <span className="text-[10px] font-bold text-[#E2FB3A] block">📸 3 Fotos Subidas (Frente/Perfil/Espalda)</span>
                            <p className="text-[10px] text-gray-400">“Me he sentido con muchísima energía en las series pesadas de pierna”</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeAppScreen === 'chat' && (
                      <div className="space-y-2 animate-fadeIn text-xs">
                        <div className="bg-[#121722] border border-[#232F42] rounded-2xl p-3 space-y-2">
                          <div className="flex items-center gap-2 border-b border-white/[0.06] pb-1.5">
                            <div className="w-5 h-5 rounded-full bg-[#E2FB3A] text-black font-black text-[9px] flex items-center justify-center">T</div>
                            <span className="text-[11px] font-black text-white">Tamara (Coach)</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-green-400 ml-auto" />
                          </div>

                          <div className="bg-[#1A2232] text-gray-200 p-2 rounded-xl rounded-br-none ml-4 text-[10px] leading-relaxed">
                            ¡Tami! He subido el peso en hip thrust a 110kg y no he notado molestia en el lumbar. ¿Mantengo o subo?
                          </div>

                          <div className="bg-[#E2FB3A]/20 border border-[#E2FB3A]/30 text-white p-2 rounded-xl rounded-bl-none mr-4 text-[10px] leading-relaxed">
                            ¡Brutal Alex! Mantén 110kg una semana más para asentar la técnica con la pausa abajo y el domingo revisamos el vídeo 💪
                          </div>
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Bottom Navigation */}
                  <div className="bg-[#0E1015] border-t border-white/[0.08] rounded-2xl p-2 flex items-center justify-around text-gray-400 text-[9px] font-bold">
                    <div className={`flex flex-col items-center ${activeAppScreen === 'entreno' || activeAppScreen === 'cargas' ? 'text-[#E2FB3A]' : ''}`}>
                      <Dumbbell className="w-3.5 h-3.5" />
                      <span>Entreno</span>
                    </div>
                    <div className={`flex flex-col items-center ${activeAppScreen === 'checkin' ? 'text-[#E2FB3A]' : ''}`}>
                      <Camera className="w-3.5 h-3.5" />
                      <span>Check-in</span>
                    </div>
                    <div className={`flex flex-col items-center ${activeAppScreen === 'chat' ? 'text-[#E2FB3A]' : ''}`}>
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Chat</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <User className="w-3.5 h-3.5" />
                      <span>Perfil</span>
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      <SectionDivider />

      {/* ========================================================= */}
      {/* SECCIÓN 3: DIAGNÓSTICO INTERACTIVO                        */}
      {/* ========================================================= */}
      <section
        id="diagnostico"
        className="relative py-28 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 bg-fixed bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=2000&q=85')" }}
      >
        {/* Capa semitransparente visible sin blur destructivo */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/35 to-black/75" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(226,251,58,0.08)_0%,transparent_70%)]" />
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="text-center mb-12">

            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase">
              ¿QUÉ PLAN SE ADAPTA A TU <span className="text-[#E2FB3A]">OBJETIVO</span>?
            </h2>
            <p className="mt-4 text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
              Responde estas 3 preguntas y te decimos la ruta exacta para desbloquear tu mejor versión sin dietas restrictivas ni horas perdidas.
            </p>
          </div>

          <div className="bg-[#111113]/90 border border-zinc-800 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-72 h-72 bg-[#E2FB3A]/10 rounded-full blur-3xl pointer-events-none" />

            {/* Stepper Header */}
            <div className="flex items-center justify-between pb-6 border-b border-zinc-800/80 mb-8">
              <div className="flex items-center gap-2">
                {[1, 2, 3].map((step) => (
                  <div
                    key={step}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      quizStep === step
                        ? 'w-10 bg-[#E2FB3A]'
                        : quizStep > step
                        ? 'w-6 bg-zinc-600'
                        : 'w-6 bg-zinc-800'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-mono text-zinc-400">
                Paso {quizStep} de 3
              </span>
            </div>

            {/* Step 1 */}
            {quizStep === 1 && (
              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  1. ¿Cuál es tu meta principal en este momento?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { id: 'perder-grasa', label: 'Perder grasa y definir', desc: 'Sin perder músculo ni pasar hambre extrema' },
                    { id: 'ganar-musculo', label: 'Ganar masa muscular', desc: 'Progresión de cargas y volumen óptimo' },
                    { id: 'recomposicion', label: 'Recomposición corporal', desc: 'Perder grasa y ganar tono simultáneamente' },
                    { id: 'fuerza-salud', label: 'Salud, energía y fuerza', desc: 'Hábitos sólidos y rendimiento funcional' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleQuizAnswer('goal', option.id)}
                      className={`text-left p-4 rounded-2xl border transition-all ${
                        quizAnswers.goal === option.id
                          ? 'border-[#E2FB3A] bg-[#E2FB3A]/10 text-white ring-1 ring-[#E2FB3A]'
                          : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <div className="font-semibold text-base">{option.label}</div>
                      <div className="text-xs text-zinc-400 mt-1">{option.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 */}
            {quizStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  2. ¿Cuántos días reales puedes entrenar por semana?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { id: '2-3', label: '2 a 3 días', desc: 'Sesiones full-body eficientes de 45-50 min' },
                    { id: '4', label: '4 días', desc: 'Torso / Pierna o Upper / Lower balanceado' },
                    { id: '5', label: '5 días', desc: 'Push / Pull / Legs + enfoque específico' },
                    { id: 'irregular', label: 'Horarios rotativos / Variables', desc: 'Adaptabilidad total semana a semana' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleQuizAnswer('days', option.id)}
                      className={`text-left p-4 rounded-2xl border transition-all ${
                        quizAnswers.days === option.id
                          ? 'border-[#E2FB3A] bg-[#E2FB3A]/10 text-white ring-1 ring-[#E2FB3A]'
                          : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <div className="font-semibold text-base">{option.label}</div>
                      <div className="text-xs text-zinc-400 mt-1">{option.desc}</div>
                    </button>
                  ))}
                </div>
                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setQuizStep(1)}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                  >
                    ← Volver
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {quizStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                  3. ¿Dónde sueles estancarte o cuál es tu mayor obstáculo?
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {[
                    { id: 'constancia', label: 'Falta de constancia y motivación', desc: 'Empiezo con ganas pero abandono al mes' },
                    { id: 'nutricion', label: 'La nutrición me sobrepasa', desc: 'No sé cuadrar calorías ni comer fuera de casa' },
                    { id: 'estancamiento', label: 'Entreno duro pero no veo cambios', desc: 'Estancado en pesos y composición corporal' },
                    { id: 'tecnica', label: 'Miedo a lesiones y técnica insegura', desc: 'Dudas al ejecutar ejercicios complejos' },
                  ].map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleQuizAnswer('obstacle', option.id)}
                      className={`text-left p-4 rounded-2xl border transition-all ${
                        quizAnswers.obstacle === option.id
                          ? 'border-[#E2FB3A] bg-[#E2FB3A]/10 text-white ring-1 ring-[#E2FB3A]'
                          : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 text-zinc-300'
                      }`}
                    >
                      <div className="font-semibold text-base">{option.label}</div>
                      <div className="text-xs text-zinc-400 mt-1">{option.desc}</div>
                    </button>
                  ))}
                </div>
                <div className="pt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={() => setQuizStep(2)}
                    className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                  >
                    ← Volver
                  </button>
                </div>
              </div>
            )}

            {/* Resultado Final del Quiz */}
            {quizStep === 4 && (
              <div className="text-center py-6 space-y-6">
                <div className="w-16 h-16 rounded-full bg-[#E2FB3A]/20 border border-[#E2FB3A] flex items-center justify-center mx-auto text-[#E2FB3A]">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <span className="text-xs font-mono uppercase tracking-widest text-[#E2FB3A]">Diagnóstico Completado</span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white uppercase mt-2">
                    Tu Ruta Recomendada: <span className="text-[#E2FB3A]">Coaching 1 a 1 Integral</span>
                  </h3>
                  <p className="mt-3 text-zinc-300 text-sm sm:text-base max-w-xl mx-auto">
                    Con tu disponibilidad y tu meta de {quizAnswers.goal?.replace('-', ' ')}, necesitas una programación periodizada con feedback de técnica en vídeo y ajuste nutricional semanal.
                  </p>
                </div>

                <div className="p-4 bg-zinc-900/80 rounded-2xl border border-zinc-800 max-w-md mx-auto text-left text-xs sm:text-sm text-zinc-300 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#E2FB3A] flex-shrink-0" />
                    <span>Rutina ajustada exactamente a {quizAnswers.days} días</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#E2FB3A] flex-shrink-0" />
                    <span>Resolución de obstáculo: {quizAnswers.obstacle?.replace('-', ' ')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-[#E2FB3A] flex-shrink-0" />
                    <span>Soporte por WhatsApp y check-in semanal en la app</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                  <a
                    href="https://wa.me/34695427545?text=Hola%20Tamara,%20he%20hecho%20el%20diagnóstico%20en%20la%20web%20y%20quiero%20empezar%20mi%20plan%20personalizado."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#E2FB3A] text-black font-black uppercase text-sm tracking-wider hover:bg-[#c8e02b] transition-all transform hover:scale-[1.02] shadow-xl shadow-[#E2FB3A]/20"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Empezar con este diagnóstico
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      setQuizStep(1);
                      setQuizAnswers({ goal: '', days: '', obstacle: '' });
                    }}
                    className="text-xs text-zinc-400 hover:text-white underline underline-offset-4"
                  >
                    Reiniciar test
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ========================================================= */}
      {/* SECCIÓN 4: CONOCE A TU ENTRENADORA (TAMARA)               */}
      {/* ========================================================= */}
      <section
        id="entrenadora"
        className="relative py-28 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 bg-fixed bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1599058917212-d750089bc07e?auto=format&fit=crop&w=2000&q=85')" }}
      >
        {/* Viñeta lateral: oscuro a la izquierda para texto, gimnasio muy visible a la derecha */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/45 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/80" />
        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Foto y credenciales */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl overflow-hidden border border-zinc-700/80 shadow-2xl group">
                <img
                  src="https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=1000&q=80"
                  alt="Tamara - Entrenadora y Fundadora de Tamifit"
                  className="w-full h-auto object-cover grayscale contrast-125 group-hover:grayscale-0 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#E2FB3A] block mb-1">
                    Head Coach & Fundadora
                  </span>
                  <div className="text-2xl font-black text-white uppercase tracking-tight">
                    Tamara
                  </div>
                  <p className="text-xs text-zinc-300 mt-1">
                    Especialista en Biomecánica aplicada a la hipertrofia, nutrición deportiva y recomposición corporal.
                  </p>
                </div>
              </div>
            </div>

            {/* Manifiesto y Enfoque */}
            <div className="lg:col-span-7 space-y-6">

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase leading-none">
                NO CREO EN RUTINAS DE REVISTA NI EN DIETAS DE HAMBRE.
              </h2>
              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
                Durante años he visto a personas dejarse la piel en el gimnasio meses tras meses sin ver el físico que merecen. La razón nunca es la falta de voluntad: es la falta de un plan individualizado con progresión medible y adherencia real.
              </p>
              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed">
                En Tamifit no te damos una plantilla en PDF y te dejamos solo. Diseñamos cada microciclo a partir de tus palancas articulares, historial y estilo de vida, registrando cada kilo en la app para garantizar resultados sostenibles.
              </p>

              {/* Grid de pilares */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                  <div className="text-2xl font-black text-[#E2FB3A]">+500</div>
                  <div className="text-xs text-zinc-400 mt-1 uppercase font-semibold">Vidas Transformadas</div>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                  <div className="text-2xl font-black text-[#E2FB3A]">100%</div>
                  <div className="text-xs text-zinc-400 mt-1 uppercase font-semibold">Personalizado</div>
                </div>
                <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 col-span-2 sm:col-span-1">
                  <div className="text-2xl font-black text-[#E2FB3A]">24/7</div>
                  <div className="text-xs text-zinc-400 mt-1 uppercase font-semibold">Soporte Directo</div>
                </div>
              </div>

              <div className="pt-4">
                <a
                  href="https://wa.me/34695427545?text=Hola%20Tamara,%20quiero%20conocer%20más%20sobre%20tu%20método%20y%20agendar%20una%20llamada."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3.5 rounded-xl bg-white text-black font-black uppercase text-xs sm:text-sm tracking-wider hover:bg-[#E2FB3A] transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-black" />
                  Hablar directamente con Tamara
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ========================================================= */}
      {/* SECCIÓN 5: COMPARATIVA (GIMNASIO TRADICIONAL VS TAMIFIT) */}
      {/* ========================================================= */}
      <section
        id="metodo"
        className="relative py-28 px-4 sm:px-6 lg:px-8 border-b border-zinc-800/80 bg-fixed bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=2000&q=85')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b]/75 via-black/40 to-[#09090b]/75" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(226,251,58,0.06)_0%,transparent_60%)]" />
        <div className="relative z-10 max-w-5xl mx-auto">
          <div className="text-center mb-16 relative">
            {/* Halo de luz de fondo para que el título destaque al máximo */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] max-w-full h-[180px] bg-[#E2FB3A]/15 blur-[100px] pointer-events-none rounded-full" />
            

            <h2 className="relative text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white uppercase drop-shadow-[0_4px_24px_rgba(0,0,0,0.9)] leading-tight">
              LA DIFERENCIA ENTRE{' '}
              <span className="text-zinc-300 line-through decoration-red-500 decoration-2 sm:decoration-[3px] opacity-90">
                INTENTAR
              </span>{' '}
              Y{' '}
              <span className="text-[#E2FB3A] drop-shadow-[0_0_30px_rgba(226,251,58,0.55)]">
                CONSEGUIRLO
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Gimnasio Tradicional / Sin rumbo */}
            <div className="p-8 rounded-3xl bg-zinc-950/80 border border-zinc-800/80 relative">
              <div className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-2">Entrenar por tu cuenta</div>
              <h3 className="text-xl font-bold text-zinc-300 uppercase mb-6">El camino tradicional</h3>
              
              <ul className="space-y-4 text-sm text-zinc-400">
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Rutinas genéricas de internet copiadas de atletas con química</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Sin registro de cargas: repites el mismo peso mes tras mes</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Dietas imposibles que abandonas en cuanto sales un fin de semana</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Nadie corrige tu técnica: riesgo de lesión y sobrecarga articular</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✕</span>
                  <span>Dudas constantes sin respuesta: "¿lo estaré haciendo bien?"</span>
                </li>
              </ul>
            </div>

            {/* Método Tamifit */}
            <div className="p-8 rounded-3xl bg-zinc-900/90 border-2 border-[#E2FB3A] relative shadow-2xl shadow-[#E2FB3A]/10">
              <div className="absolute -top-3 right-6 bg-[#E2FB3A] text-black text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                RESULTADOS GARANTIZADOS
              </div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#E2FB3A] mb-2">Coaching Integral Tamifit</div>
              <h3 className="text-xl font-bold text-white uppercase mb-6">El sistema guiado paso a paso</h3>
              
              <ul className="space-y-4 text-sm text-zinc-200">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#E2FB3A] flex-shrink-0 mt-0.5" />
                  <span><strong>Plan a medida:</strong> adaptado a tu morfología, horario y material de tu gym o casa.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#E2FB3A] flex-shrink-0 mt-0.5" />
                  <span><strong>App Tamifit:</strong> registra pesos, series, RPE y mira vídeos guiados con 1 click.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#E2FB3A] flex-shrink-0 mt-0.5" />
                  <span><strong>Nutrición flexible:</strong> macros adaptados a tus comidas favoritas, sin pasar hambre.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#E2FB3A] flex-shrink-0 mt-0.5" />
                  <span><strong>Revisión semanal de técnica:</strong> envías tus vídeos de levantamiento y recibes correcciones en audio/vídeo.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-[#E2FB3A] flex-shrink-0 mt-0.5" />
                  <span><strong>Acompañamiento 1 a 1:</strong> WhatsApp directo con Tamara para resolver dudas en el momento.</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      <SectionDivider />

      {/* ========================================================= */}
      {/* SECCIÓN 6: PREGUNTAS FRECUENTES (FAQ)                     */}
      {/* ========================================================= */}
      <section
        id="faq"
        className="relative py-28 px-4 sm:px-6 lg:px-10 xl:px-14 border-b border-zinc-800/80 bg-fixed bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=2000&q=85')" }}
      >
        {/* Viñeta luminosa con halo de energía lime y fondo de gimnasio visible */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/75" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(226,251,58,0.14)_0%,transparent_65%)]" />

        <div className="relative z-10 w-full max-w-[1720px] 2xl:max-w-[1850px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-start">
            
            {/* ===================================================== */}
            {/* COLUMNA 1 (IZQUIERDA): PREGUNTAS FRECUENTES (FAQ)     */}
            {/* ===================================================== */}
            <div className="w-full space-y-6">
              <div>

                <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white uppercase leading-tight">
                  PREGUNTAS <span className="text-[#E2FB3A]">FRECUENTES</span>
                </h2>
                <p className="mt-3 text-zinc-400 text-sm sm:text-base">
                  Todo lo que necesitas saber antes de empezar a trabajar juntos.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {[
                  {
                    q: '¿Cómo funciona la app y qué necesito para instalarla?',
                    a: 'La app de Tamifit es una PWA ultrarrápida. No necesitas descargar nada pesado de la tienda: accedes desde tu navegador, inicias sesión y la instalas en la pantalla de inicio con un solo toque. Tienes tus entrenamientos, pesos y check-in sincronizados al instante.'
                  },
                  {
                    q: '¿Puedo entrenar en casa o necesito ir a un gimnasio comercial?',
                    a: 'Totalmente. Adaptamos la planificación 100% al equipamiento que tengas: desde un gimnasio comercial completo hasta mancuernas ajustables, bandas elásticas o peso corporal en casa.'
                  },
                  {
                    q: '¿La dieta me obligará a comer cosas raras o pasar hambre?',
                    a: 'Para nada. Trabajamos con nutrición flexible enfocada en tus gustos, horarios familiares o laborales. Aprenderás a gestionar tus macros y calorías sin eliminar hidratos, pan ni salir a cenar con amigos.'
                  },
                  {
                    q: '¿Cómo se corrigen mis ejercicios para evitar lesiones?',
                    a: 'En cada ejercicio de la app tienes la opción de grabar o subir tu serie. Tamara analiza tus palancas, velocidad de ejecución y rango de recorrido, y te envía feedback en audio o anotaciones directas.'
                  },
                  {
                    q: '¿Existe permanencia obligatoria?',
                    a: 'No. El compromiso se renueva mes a mes. Queremos que te quedes porque ves resultados y disfrutas del proceso, no por un contrato atado.'
                  }
                ].map((faq, i) => (
                  <div
                    key={i}
                    onClick={() => toggleFaq(i)}
                    className="rounded-2xl border border-zinc-800/90 bg-[#111115]/80 hover:border-zinc-700/80 backdrop-blur-md p-5 transition-all cursor-pointer group"
                  >
                    <h3 className="text-sm sm:text-base font-bold text-white flex items-center justify-between">
                      <span className="group-hover:text-[#E2FB3A] transition-colors">{faq.q}</span>
                      <span className="text-[#E2FB3A] text-lg font-mono ml-3 shrink-0">
                        {openFaq === i ? '−' : '+'}
                      </span>
                    </h3>
                    {openFaq === i && (
                      <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed pt-3 border-t border-zinc-800/60 mt-3 animate-fadeIn">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ===================================================== */}
            {/* COLUMNA 2 (DERECHA): DEJA DE IMPROVISAR (CTA)         */}
            {/* ===================================================== */}
            <div className="w-full lg:sticky lg:top-28">
              <div className="bg-[#0f1117]/95 border-2 border-[#E2FB3A]/60 rounded-3xl p-8 sm:p-10 xl:p-12 backdrop-blur-2xl shadow-2xl shadow-[#E2FB3A]/10 relative overflow-hidden space-y-6">
                <div className="absolute -top-24 -right-24 w-60 h-60 bg-[#E2FB3A]/15 rounded-full blur-3xl pointer-events-none" />



                <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase leading-[1.08]">
                  DEJA DE IMPROVISAR.<br />
                  EMPIEZA A <span className="text-[#E2FB3A]">TRANSFORMARTE</span>.
                </h2>

                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                  Da el primer paso hoy. Escríbeme directamente por WhatsApp para analizar tu situación y ver si somos compatibles para trabajar juntos.
                </p>

                <div className="pt-2 flex flex-col gap-3">
                  <a
                    href="https://wa.me/34695427545?text=Hola%20Tamara,%20quiero%20empezar%20mi%20coaching%20personalizado%20con%20Tamifit."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-[#E2FB3A] text-black font-black uppercase text-xs sm:text-sm tracking-wider hover:bg-[#c8e02b] transition-all transform hover:scale-[1.02] shadow-xl shadow-[#E2FB3A]/25"
                  >
                    <MessageCircle className="w-4 h-4 fill-current" />
                    <span>Solicitar plaza por WhatsApp</span>
                  </a>
                  <Link
                    href="/app"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold uppercase text-xs tracking-wider hover:bg-white/10 transition-colors"
                  >
                    Acceso a la App
                  </Link>
                </div>

                <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-zinc-400 font-mono">
                  <span>✓ SIN PERMANENCIA</span>
                  <span>✓ RESPUESTA &lt; 2H</span>
                  <span>✓ 100% PERSONALIZADO</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* FOOTER                                                    */}
      {/* ========================================================= */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-black border-t border-zinc-900">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/tamifit-logo.png"
              alt="Tamifit Logo"
              className="w-8 h-8 object-contain"
            />
            <span className="font-black tracking-widest text-white text-base">TAMIFIT</span>
            <span className="text-zinc-600 text-xs font-mono ml-2">© 2026</span>
          </div>

          <div className="flex items-center gap-6 text-xs text-zinc-400">
            <a href="#hero" onClick={(e) => handleNavClick(e, '#hero')} className="hover:text-white transition-colors">Inicio</a>
            <a href="#app-showcase" onClick={(e) => handleNavClick(e, '#app-showcase')} className="hover:text-white transition-colors">La App</a>
            <a href="#diagnostico" onClick={(e) => handleNavClick(e, '#diagnostico')} className="hover:text-white transition-colors">Diagnóstico</a>
            <a href="#metodo" onClick={(e) => handleNavClick(e, '#metodo')} className="hover:text-white transition-colors">Método 1a1</a>
            <a href="#entrenadora" onClick={(e) => handleNavClick(e, '#entrenadora')} className="hover:text-white transition-colors">Tamara</a>
            <a href="#faq" onClick={(e) => handleNavClick(e, '#faq')} className="hover:text-white transition-colors">FAQ</a>
            <Link href="/app" className="hover:text-[#E2FB3A] transition-colors">Acceso Clientes</Link>
          </div>


        </div>
      </footer>

      {/* ========================================================= */}
      {/* FLOATING WHATSAPP BUTTON                                  */}
      {/* ========================================================= */}
      <a
        href="https://wa.me/34695427545?text=Hola%20Tamara,%20quiero%20información%20sobre%20el%20coaching%20de%20Tamifit."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Contactar por WhatsApp"
        className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom,1.25rem))] right-4 sm:right-6 z-50 p-3.5 sm:p-4 rounded-full bg-[#25D366] text-white shadow-2xl hover:scale-110 transition-transform active:scale-95 flex items-center justify-center group"
      >
        <MessageCircle className="w-6 h-6 fill-current" />
        <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 ease-in-out text-xs font-bold pl-0 group-hover:pl-2 text-black">
          ¿Hablamos?
        </span>
      </a>

      
    </div>
  );
};
