import React from 'react';
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CheckSquare,
  DollarSign,
  FileText,
  Receipt,
  FolderOpen,
  Camera,
  Film,
  Share2,
  Calendar,
  UserCheck,
  BarChart3,
  Settings,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  ChevronRight,
  Layers,
  LogOut,
  User,
  Lock,
} from 'lucide-react';
import { useApp, ActiveView } from '../../context/AppContext';
import { ROLE_PERMISSIONS } from '../../utils/permissions';

export const Sidebar: React.FC<{ isOpen: boolean; onCloseMobile: () => void }> = ({
  isOpen,
  onCloseMobile,
}) => {
  const {
    currentView,
    setCurrentView,
    metrics,
    currentUserRole,
    setCurrentUserRole,
    setPortalClientId,
    clients,
    team,
    currentUser,
    hasAccessToView,
    setIsUserProfileModalOpen,
    setIsAuthModalOpen,
    logout,
  } = useApp();

  const allMenuItems: {
    id: ActiveView;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number | string;
    badgeVariant?: 'blue' | 'purple' | 'amber' | 'emerald';
  }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'clients', label: 'Clientes / CRM', icon: Users, badge: metrics.totalClients },
    { id: 'projects', label: 'Proyectos', icon: FolderKanban, badge: metrics.activeProjects, badgeVariant: 'blue' },
    { id: 'tasks', label: 'Tareas', icon: CheckSquare, badge: metrics.pendingTasksCount, badgeVariant: 'amber' },
    { id: 'finance', label: 'Finanzas', icon: DollarSign },
    { id: 'quotes', label: 'Cotizaciones', icon: FileText },
    { id: 'payments', label: 'Facturas / Pagos', icon: Receipt },
    { id: 'files', label: 'Archivos (NAS)', icon: FolderOpen },
    { id: 'photography', label: 'Fotografía', icon: Camera },
    { id: 'multimedia', label: 'Multimedia / Video', icon: Film },
    { id: 'content', label: 'Contenido Social', icon: Share2 },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
    { id: 'team', label: 'Equipo & Roles', icon: UserCheck },
    { id: 'reports', label: 'Reportes & Métricas', icon: BarChart3 },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  // Filter items according to role permissions to avoid operational conflicts
  const visibleMenuItems = allMenuItems.filter(item => hasAccessToView(item.id));

  const handleNav = (view: ActiveView) => {
    setCurrentView(view);
    onCloseMobile();
  };

  const handleOpenClientPortal = () => {
    if (clients.length > 0) {
      setPortalClientId(clients[0].id);
    }
    setCurrentView('client-portal');
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 bg-[#07152f] text-slate-200 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out lg:static lg:z-auto lg:translate-x-0 flex-shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/40">
          <div
            onClick={() => handleNav('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#168dda] via-[#7a3fc4] to-[#1bb7e8] flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-base tracking-tight text-white">
                  DEVJOS
                </span>
                <span className="text-[10px] font-bold tracking-widest px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                  Studio
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Ops Manager</p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 lg:hidden"
            aria-label="Cerrar menú"
          >
            <ChevronRight className="w-5 h-5 rotate-180" />
          </button>
        </div>

        {/* Active Role Indicator */}
        <div className="px-4 py-2.5 bg-slate-900/60 border-b border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-medium">Rol:</span>
            <span className="text-cyan-300 font-bold text-[11px]">{currentUser?.role || currentUserRole}</span>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="text-[10px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Cambiar de colaborador"
          >
            Cambiar
          </button>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-1 scrollbar-thin">
          <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Módulos Autorizados ({visibleMenuItems.length})
          </div>

          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 group ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600/90 to-blue-600/80 text-white shadow-md shadow-purple-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge !== undefined && item.badge !== 0 && item.badge !== '' && (
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      item.badgeVariant === 'amber'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : item.badgeVariant === 'blue'
                        ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Client Portal Mode Quick Access */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 space-y-2">
          <div
            onClick={handleOpenClientPortal}
            className={`p-2.5 rounded-xl border transition-all cursor-pointer group ${
              currentView === 'client-portal'
                ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-200'
                : 'bg-slate-900/80 border-slate-800 hover:border-cyan-500/40 text-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Portal del Cliente</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </div>
            <p className="text-[10px] text-slate-400 line-clamp-1">
              Vista del cliente para aprobar proyectos & fotos
            </p>
          </div>

          {/* User profile compact banner with interactive options */}
          <div
            onClick={() => setIsUserProfileModalOpen(true)}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all group"
          >
            <img
              src={currentUser?.avatar || team[0]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={currentUser?.name || 'Usuario'}
              className="w-8 h-8 rounded-full border border-cyan-500/40 object-cover group-hover:border-cyan-400"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate group-hover:text-cyan-300">
                {currentUser?.name || 'Josías Lachapelle'}
              </p>
              <p className="text-[10px] text-cyan-400 font-medium truncate">
                {currentUser?.role || 'Administrador'}
              </p>
            </div>
            <User className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
          </div>
        </div>
      </aside>
    </>
  );
};
