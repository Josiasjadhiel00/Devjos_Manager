import React, { useState } from 'react';
import {
  FolderKanban,
  Search,
  Plus,
  Filter,
  LayoutGrid,
  List,
  Columns3,
  Calendar,
  Building,
  DollarSign,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/StatCard';
import { ProjectModal } from './ProjectModal';
import { ProjectDetailModal } from './ProjectDetailModal';
import { ProjectKanban } from './ProjectKanban';
import { Project, ProjectCategory } from '../../types';

export const ProjectsView: React.FC = () => {
  const {
    projects,
    clients,
    team,
    addProject,
    updateProject,
    selectedProjectId,
    setSelectedProjectId,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'table' | 'grid'>('kanban');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSaveProject = (data: any) => {
    if (projectToEdit) {
      updateProject(projectToEdit.id, data);
      setProjectToEdit(null);
    } else {
      addProject(data);
    }
  };

  const categories = ['all', 'Desarrollo', 'Diseño', 'Branding', 'Fotografía', 'Video', 'Multimedia', 'Redes sociales'];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[200px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar proyecto o alcance..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat === 'all' ? 'Todas' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* View Toggle & Add Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex bg-slate-950 rounded-xl p-0.5 border border-slate-800">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'kanban' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Tablero Kanban"
            >
              <Columns3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Vista de Tarjetas"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'table' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Vista de Lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => {
              setProjectToEdit(null);
              setIsCreateModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" /> Nuevo Proyecto
          </button>
        </div>
      </div>

      {/* Projects Content based on View Mode */}
      {viewMode === 'kanban' ? (
        <ProjectKanban
          projects={filteredProjects}
          onSelectProject={(id) => setSelectedProjectId(id)}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProjects.map((p) => {
            const client = clients.find((c) => c.id === p.clientId);
            const responsible = team.find((m) => m.id === p.responsibleId);
            return (
              <div
                key={p.id}
                onClick={() => setSelectedProjectId(p.id)}
                className="bg-slate-900/80 backdrop-blur-md border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {p.category}
                    </span>
                    <Badge
                      variant={
                        p.status === 'Completado'
                          ? 'success'
                          : p.status === 'En progreso'
                          ? 'info'
                          : p.status === 'En revisión'
                          ? 'purple'
                          : 'warning'
                      }
                      size="sm"
                    >
                      {p.status}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-cyan-400" />
                      {client?.company || client?.name || 'Particular'}
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400 font-semibold">
                      <span>Avance</span>
                      <span className="text-cyan-400 font-bold">{p.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                        style={{ width: `${p.progress}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="font-bold text-slate-100">${(p.price || 0).toLocaleString()} USD</span>
                  <span className="flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {p.deliveryDate}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-semibold">
                  <th className="p-4">Proyecto / Cliente</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4">Prioridad</th>
                  <th className="p-4">Progreso</th>
                  <th className="p-4">Entrega</th>
                  <th className="p-4">Precio</th>
                  <th className="p-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredProjects.map((p) => {
                  const client = clients.find((c) => c.id === p.clientId);
                  return (
                    <tr
                      key={p.id}
                      onClick={() => setSelectedProjectId(p.id)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      <td className="p-4">
                        <div>
                          <p className="font-bold text-slate-100">{p.name}</p>
                          <p className="text-[11px] text-slate-400">{client?.company || client?.name}</p>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300 font-medium">{p.category}</td>
                      <td className="p-4">
                        <Badge
                          variant={
                            p.status === 'Completado'
                              ? 'success'
                              : p.status === 'En progreso'
                              ? 'info'
                              : p.status === 'En revisión'
                              ? 'purple'
                              : 'warning'
                          }
                          size="sm"
                        >
                          {p.status}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant={
                            p.priority === 'Urgente'
                              ? 'danger'
                              : p.priority === 'Alta'
                              ? 'warning'
                              : 'neutral'
                          }
                          size="sm"
                        >
                          {p.priority}
                        </Badge>
                      </td>
                      <td className="p-4 w-32">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 flex-1 bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-cyan-400 rounded-full"
                              style={{ width: `${p.progress}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-bold text-slate-300">{p.progress}%</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300">{p.deliveryDate}</td>
                      <td className="p-4 font-bold text-slate-100">${(p.price || 0).toLocaleString()} USD</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedProjectId(p.id)}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[11px] font-semibold"
                        >
                          Ver Detalle
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Project Modal */}
      <ProjectModal
        isOpen={isCreateModalOpen || !!projectToEdit}
        onClose={() => {
          setIsCreateModalOpen(false);
          setProjectToEdit(null);
        }}
        onSave={handleSaveProject}
        projectToEdit={projectToEdit}
      />

      {/* Project Details Modal */}
      <ProjectDetailModal
        projectId={selectedProjectId}
        onClose={() => setSelectedProjectId(null)}
        onEditProject={(proj) => {
          setProjectToEdit(proj);
          setSelectedProjectId(null);
        }}
      />
    </div>
  );
};
