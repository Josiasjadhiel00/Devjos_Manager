import React from 'react';
import {
  Menu,
  Search,
  Plus,
  Bell,
  Sun,
  Moon,
  HardDrive,
  Shield,
  Layers,
  Database,
  User,
  LogOut,
  Fingerprint,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Topbar: React.FC<{ onOpenMobileMenu: () => void }> = ({ onOpenMobileMenu }) => {
  const {
    currentView,
    theme,
    toggleTheme,
    notifications,
    setIsNotificationOpen,
    setIsSearchOpen,
    setQuickActionOpen,
    currentUserRole,
    currentUser,
    setIsUserProfileModalOpen,
    setIsAuthModalOpen,
    settings,
  } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  const viewTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Dashboard General', subtitle: 'Resumen operativo, métricas y estado del estudio' },
    clients: { title: 'Gestión de Clientes', subtitle: 'CRM, contactos, historial comercial y perfiles' },
    projects: { title: 'Proyectos & Flujo de Trabajo', subtitle: 'Gestión de entregas, avance y tablero Kanban' },
    tasks: { title: 'Tareas & Pendientes', subtitle: 'Organización operativa, prioridades y asignaciones' },
    finance: { title: 'Control Financiero', subtitle: 'Ingresos, gastos, ganancias y flujo de caja' },
    quotes: { title: 'Generador de Cotizaciones', subtitle: 'Presupuestos formales, cálculos automáticos y PDF' },
    payments: { title: 'Facturas & Cobros', subtitle: 'Control de anticipos, saldos pendientes y recibos' },
    files: { title: 'Almacenamiento de Archivos', subtitle: 'Estructura por cliente y proyecto conectada a NAS' },
    photography: { title: 'Sesiones & Galerías Fotográficas', subtitle: 'Control de fotos tomadas, editadas y selección de clientes' },
    multimedia: { title: 'Producción Multimedia & Video', subtitle: 'Reels, videos comerciales, guiones y control de versiones' },
    content: { title: 'Planificador de Redes Sociales', subtitle: 'Estrategia, calendario de posts y publicaciones' },
    calendar: { title: 'Calendario de Operaciones', subtitle: 'Sesiones, grabaciones, reuniones y fechas de entrega' },
    team: { title: 'Equipo de Trabajo & Permisos', subtitle: 'Colaboradores, roles de acceso y cargas de trabajo' },
    reports: { title: 'Reportes & Analítica', subtitle: 'Rendimiento financiero, tiempos de entrega y servicios' },
    settings: { title: 'Configuración del Estudio', subtitle: 'Datos fiscales, catálogo de servicios, NAS y automatizaciones' },
    'client-portal': { title: 'Portal del Cliente (Vista Previa)', subtitle: 'Experiencia interactiva del cliente para revisiones' },
  };

  const currentMeta = viewTitles[currentView] || { title: 'DevJos Manager', subtitle: 'Operaciones de estudio' };

  return (
    <header className="sticky top-0 z-30 h-16 bg-slate-900/90 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-6 flex items-center justify-between transition-colors">
      {/* Left section: Mobile menu + Page Title / Breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-100 font-display">
              {currentMeta.title}
            </h1>
            {settings.nasStorageEnabled && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <HardDrive className="w-3 h-3" /> NAS
              </span>
            )}
            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-cyan-400 border border-cyan-500/20" title="Base de datos Cloud SQL PostgreSQL activa">
              <Database className="w-3 h-3 text-cyan-400" /> PostgreSQL SQL
            </span>
          </div>
          <p className="hidden md:block text-xs text-slate-400">
            {currentMeta.subtitle}
          </p>
        </div>
      </div>

      {/* Right section: Search bar, Quick Action, Notifications, Theme, Active User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search Button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700/60 text-xs transition-colors"
        >
          <Search className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Buscar...</span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-700">
            ⌘K
          </span>
        </button>

        {/* Quick Action (+) Button */}
        <button
          onClick={() => setQuickActionOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nuevo</span>
        </button>

        {/* Notifications Button */}
        <button
          onClick={() => setIsNotificationOpen(true)}
          className="relative p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700"
          aria-label="Notificaciones"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-slate-950 animate-pulse" />
          )}
        </button>

        {/* Dark/Light Mode Switcher */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors border border-transparent hover:border-slate-700"
          aria-label="Cambiar tema"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
        </button>

        {/* Active User / Profile Button */}
        {currentUser ? (
          <button
            onClick={() => setIsUserProfileModalOpen(true)}
            className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/40 transition-all text-left group"
            title="Ver mi perfil y permisos"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-cyan-500/40 group-hover:border-cyan-400"
            />
            <div className="hidden md:block">
              <p className="text-xs font-bold text-slate-200 group-hover:text-cyan-300 leading-tight truncate max-w-[110px]">
                {currentUser.name}
              </p>
              <span className="text-[10px] text-cyan-400 font-semibold block leading-tight">
                {currentUser.role}
              </span>
            </div>
          </button>
        ) : (
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold shadow-md shadow-cyan-500/20 transition-all"
          >
            <Fingerprint className="w-3.5 h-3.5" />
            <span>Ingresar</span>
          </button>
        )}
      </div>
    </header>
  );
};
