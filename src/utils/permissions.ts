import { RoleType } from '../types';
import { ActiveView } from '../context/AppContext';

export const ROLE_PERMISSIONS: Record<RoleType, {
  name: string;
  description: string;
  allowedViews: ActiveView[];
  canEditFinances: boolean;
  canCreateProjects: boolean;
  canManageTeam: boolean;
  canDeleteEntities: boolean;
  canApproveQuotes: boolean;
}> = {
  Administrador: {
    name: 'Director / Administrador',
    description: 'Acceso total sin restricciones a finanzas, equipo, clientes y operaciones.',
    allowedViews: [
      'dashboard',
      'clients',
      'projects',
      'tasks',
      'finance',
      'quotes',
      'payments',
      'files',
      'photography',
      'multimedia',
      'content',
      'calendar',
      'team',
      'reports',
      'settings',
      'client-portal',
    ],
    canEditFinances: true,
    canCreateProjects: true,
    canManageTeam: true,
    canDeleteEntities: true,
    canApproveQuotes: true,
  },
  Developer: {
    name: 'Ingeniero de Software / Developer',
    description: 'Enfoque en desarrollo web, proyectos, tareas, archivos NAS y calendario.',
    allowedViews: [
      'dashboard',
      'projects',
      'tasks',
      'files',
      'calendar',
      'team',
      'reports',
    ],
    canEditFinances: false,
    canCreateProjects: true,
    canManageTeam: false,
    canDeleteEntities: false,
    canApproveQuotes: false,
  },
  Diseñador: {
    name: 'Diseñador UI/UX & Branding',
    description: 'Gestión de entregables de diseño, multimedia, contenido social y tareas.',
    allowedViews: [
      'dashboard',
      'projects',
      'tasks',
      'files',
      'multimedia',
      'content',
      'calendar',
      'team',
    ],
    canEditFinances: false,
    canCreateProjects: true,
    canManageTeam: false,
    canDeleteEntities: false,
    canApproveQuotes: false,
  },
  Fotógrafo: {
    name: 'Fotógrafo / Retocador',
    description: 'Control de sesiones fotográficas, galerías, archivos RAW en NAS y tareas.',
    allowedViews: [
      'dashboard',
      'photography',
      'tasks',
      'files',
      'calendar',
      'client-portal',
    ],
    canEditFinances: false,
    canCreateProjects: false,
    canManageTeam: false,
    canDeleteEntities: false,
    canApproveQuotes: false,
  },
  Videógrafo: {
    name: 'Videógrafo / Editor Audiovisual',
    description: 'Producción de video, reels, control de versiones V1-Final y tareas.',
    allowedViews: [
      'dashboard',
      'multimedia',
      'tasks',
      'files',
      'calendar',
      'client-portal',
    ],
    canEditFinances: false,
    canCreateProjects: false,
    canManageTeam: false,
    canDeleteEntities: false,
    canApproveQuotes: false,
  },
  Finanzas: {
    name: 'Gerencia Financiera & Cobros',
    description: 'Administración de ingresos, gastos, facturas, abonos y cotizaciones.',
    allowedViews: [
      'dashboard',
      'clients',
      'projects',
      'quotes',
      'payments',
      'finance',
      'reports',
    ],
    canEditFinances: true,
    canCreateProjects: true,
    canManageTeam: false,
    canDeleteEntities: true,
    canApproveQuotes: true,
  },
  Contenido: {
    name: 'Community Manager & Social Media',
    description: 'Planificador de contenido social, proyectos, calendario y publicaciones.',
    allowedViews: [
      'dashboard',
      'content',
      'projects',
      'tasks',
      'calendar',
    ],
    canEditFinances: false,
    canCreateProjects: false,
    canManageTeam: false,
    canDeleteEntities: false,
    canApproveQuotes: false,
  },
  Cliente: {
    name: 'Cliente del Estudio',
    description: 'Portal exclusivo para revisión de entregables, aprobación de cotizaciones y fotos.',
    allowedViews: ['client-portal'],
    canEditFinances: false,
    canCreateProjects: false,
    canManageTeam: false,
    canDeleteEntities: false,
    canApproveQuotes: false,
  },
};

export function canAccessView(role: RoleType, view: ActiveView, customViews?: string[]): boolean {
  if (customViews && customViews.includes(view)) return true;
  const config = ROLE_PERMISSIONS[role];
  if (!config) return role === 'Administrador';
  return config.allowedViews.includes(view);
}
