import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tamifit | Plataforma de Entrenamiento Personal',
  description: 'Control de atletas, creador de rutinas, banco de ejercicios y app para alumnos al estilo Traineeks.',
  icons: {
    icon: '/tamifit-logo.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Tamifit',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#07090C',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark h-full antialiased">
      <body className="min-h-full bg-[#090A0C] text-[#F3F4F6] selection:bg-[#E2FB3A] selection:text-black overscroll-none">
        {children}
      </body>
    </html>
  );
}
