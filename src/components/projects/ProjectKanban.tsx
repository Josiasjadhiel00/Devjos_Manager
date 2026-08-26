import React from 'react';
import { Project, ProjectStatus } from '../../types';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/StatCard';
import { Building, Calendar, DollarSign, ArrowRight, ArrowLeft, MoreHorizontal, User } from 'lucide-react';

export const ProjectKanban: React.FC<{
  projects: Project[];
  onSelectProject: (id: string) => void;
}> = ({ projects, onSelectProject }) => {
  const { clients, team, updateProjectStatus } = useApp();

  const columns: { id: ProjectStatus; title: string; color: string }[] = [
    { id: 'Lead', title: 'Nuevos / Lead', color: 'border-slate-700' },
    { id: 'Cotización', title: 'En Cotización', color: 'border-purple-500/50' },
    { id: 'Aprobado', title: 'Aprobados', color: 'border-cyan-500/50' },
    { id: 'En progreso', title: 'En Progreso', color: 'border-blue-500/50' },
    { id: 'En revisión', title: 'En Revisión', color: 'border-amber-500/50' },
    { id: 'Entregado', title: 'Entregados', color: 'border-teal-500/50' },
    { id: 'Completado', title: 'Completados', color: 'border-emerald-500/50' },
  ];

  const getNextStatus = (current: ProjectStatus): ProjectStatus | null => {
    const order: ProjectStatus[] = ['Lead', 'Cotización', 'Aprobado', 'En progreso', 'En revisión', 'Entregado', 'Completado'];
    const idx = order.indexOf(current);
    if (idx >= 0 && idx < order.length - 1) return order[idx + 1];
    return null;
  };

  const getPrevStatus = (current: ProjectStatus): ProjectStatus | null => {
    const order: ProjectStatus[] = ['Lead', 'Cotización', 'Aprobado', 'En progreso', 'En revisión', 'Entregado', 'Completado'];
    const idx = order.indexOf(current);
    if (idx > 0) return order[idx - 1];
    return null;
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 pt-2 snap-x">
      {columns.map((col) => {
        const colProjects = projects.filter((p) => p.status === col.id);
        return (
          <div
            key={col.id}
            className="w-72 shrink-0 bg-slate-900/70 border border-slate-800 rounded-2xl flex flex-col max-h-[75vh]"
          >
            {/* Column Header */}
            <div className={`p-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/40 rounded-t-2xl border-t-2 ${col.color}`}>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-100 font-display">
                  {col.title}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                  {colProjects.length}
                </span>
              </div>
            </div>

            {/* Cards List */}
            <div className="p-3 overflow-y-auto flex-1 space-y-3">
              {colProjects.length === 0 ? (
                <div className="py-8 text-center text-slate-600 text-xs border border-dashed border-slate-800 rounded-xl">
                  Sin proyectos
                </div>
              ) : (
                colProjects.map((p) => {
                  const client = clients.find((c) => c.id === p.clientId);
                  const responsible = team.find((m) => m.id === p.responsibleId);
                  const next = getNextStatus(p.status);
                  const prev = getPrevStatus(p.status);

                  return (
                    <div
                      key={p.id}
                      onClick={() => onSelectProject(p.id)}
                      className="bg-slate-950/80 border border-slate-800/90 hover:border-cyan-500/50 rounded-xl p-3.5 shadow-sm hover:shadow-md transition-all cursor-pointer group space-y-2.5"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-cyan-300">
                          {p.category}
                        </span>
                        <Badge
                          size="sm"
                          variant={
                            p.priority === 'Urgente'
                              ? 'danger'
                              : p.priority === 'Alta'
                              ? 'warning'
                              : 'neutral'
                          }
                        >
                          {p.priority}
                        </Badge>
                      </div>

                      <div>
                        <h4 className="font-bold text-xs text-slate-100 group-hover:text-cyan-300 transition-colors line-clamp-2">
                          {p.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                          {client?.company || client?.name || 'Particular'}
                        </p>
                      </div>

                      {/* Progress bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                          <span>Progreso</span>
                          <span>{p.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Footer Info */}
                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                        <span className="font-bold text-slate-200">${p.price} USD</span>
                        <span className="flex items-center gap-1 text-[10px]">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {p.deliveryDate}
                        </span>
                      </div>

                      {/* Quick Move controls */}
                      <div
                        className="pt-1 flex items-center justify-between gap-1 text-[10px]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {prev ? (
                          <button
                            onClick={() => updateProjectStatus(p.id, prev)}
                            className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white flex items-center gap-1"
                            title={`Mover a ${prev}`}
                          >
                            <ArrowLeft className="w-3 h-3" />
                          </button>
                        ) : <div />}

                        {next && (
                          <button
                            onClick={() => updateProjectStatus(p.id, next)}
                            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
                            title={`Avanzar a ${next}`}
                          >
                            <span>{next}</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
