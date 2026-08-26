import React from 'react';
import { ShieldAlert, ArrowLeft, Lock, ArrowRight, UserCheck } from 'lucide-react';
import { useApp, ActiveView } from '../../context/AppContext';
import { ROLE_PERMISSIONS } from '../../utils/permissions';

export const AccessRestrictedView: React.FC = () => {
  const { currentUser, currentUserRole, setCurrentView, setIsAuthModalOpen, setIsUserProfileModalOpen } = useApp();
  const role = currentUser?.role || currentUserRole;
  const permissions = ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS['Administrador'];

  const allowedViews = permissions.allowedViews;

  const viewLabels: Record<string, string> = {
    dashboard: 'Dashboard',
    clients: 'Clientes / CRM',
    projects: 'Proyectos',
    tasks: 'Tareas & Kanban',
    finance: 'Control Financiero',
    quotes: 'Cotizaciones',
    payments: 'Facturas & Cobros',
    files: 'Archivos (NAS)',
    photography: 'Fotografía & Galerías',
    multimedia: 'Multimedia & Video',
    content: 'Contenido Social',
    calendar: 'Calendario',
    team: 'Equipo & Roles',
    reports: 'Reportes',
    settings: 'Configuración',
    'client-portal': 'Portal del Cliente',
  };

  return (
    <div className="min-h-[500px] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in-95 duration-200">
      <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-4 shadow-lg shadow-rose-500/10">
        <Lock className="w-8 h-8" />
      </div>

      <h2 className="text-xl font-bold text-white font-display mb-2">
        Acceso Restringido para tu Rol
      </h2>
      <p className="text-xs text-slate-400 max-w-md mb-6 leading-relaxed">
        Tu cuenta de colaborador ({currentUser?.name || 'Usuario'}) tiene asignado el rol de{' '}
        <span className="font-semibold text-cyan-400">{role}</span>. Este módulo está bloqueado para evitar ediciones no autorizadas y conflictos operativos.
      </p>

      {/* Allowed Modules */}
      <div className="w-full max-w-md p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-left mb-6">
        <p className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-cyan-400" />
          <span>Módulos autorizados para ti:</span>
        </p>
        <div className="grid grid-cols-2 gap-2">
          {allowedViews.map((v) => (
            <button
              key={v}
              onClick={() => setCurrentView(v as ActiveView)}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-200 hover:text-cyan-300 flex items-center justify-between transition-all"
            >
              <span>{viewLabels[v] || v}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentView(allowedViews[0] as ActiveView || 'dashboard')}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md shadow-cyan-500/20 transition-all flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Ir a mi módulo principal</span>
        </button>

        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors"
        >
          Cambiar de cuenta
        </button>
      </div>
    </div>
  );
};
