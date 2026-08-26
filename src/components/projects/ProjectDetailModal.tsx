import React, { useState } from 'react';
import {
  X,
  FolderKanban,
  Building,
  Calendar,
  DollarSign,
  User,
  CheckSquare,
  Plus,
  Clock,
  ArrowRight,
  Edit2,
  Trash2,
  FolderOpen,
  Send,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/StatCard';
import { ProjectStatus, Priority, PaymentMethod } from '../../types';

export const ProjectDetailModal: React.FC<{
  projectId: string | null;
  onClose: () => void;
  onEditProject: (project: any) => void;
}> = ({ projectId, onClose, onEditProject }) => {
  const {
    projects,
    clients,
    tasks,
    files,
    team,
    updateProject,
    updateProjectStatus,
    deleteProject,
    addTask,
    toggleTaskStatus,
    deleteTask,
    recordPayment,
    addFile,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'finance' | 'files'>('overview');
  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Priority>('Media');
  const [paymentAmount, setPaymentAmount] = useState<number>(500);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Transferencia');
  const [paymentNote, setPaymentNote] = useState('');
  const [isPaymentFormOpen, setIsPaymentFormOpen] = useState(false);

  if (!projectId) return null;
  const project = projects.find(p => p.id === projectId);
  if (!project) return null;

  const client = clients.find(c => c.id === project.clientId);
  const responsible = team.find(m => m.id === project.responsibleId);
  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const projectFiles = files.filter(f => f.projectId === project.id);

  const pendingAmount = Math.max(0, project.price - (project.paidAmount || 0));
  const isOverdue =
    !['Completado', 'Cancelado'].includes(project.status) &&
    new Date(project.deliveryDate).getTime() < new Date().getTime();

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskName.trim()) return;
    addTask({
      name: newTaskName,
      description: `Tarea de proyecto ${project.name}`,
      projectId: project.id,
      responsibleId: project.responsibleId,
      priority: newTaskPriority,
      dueDate: project.deliveryDate,
      status: 'Pendiente',
    });
    setNewTaskName('');
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentAmount <= 0) return;
    recordPayment(project.id, paymentAmount, paymentMethod, paymentNote);
    setIsPaymentFormOpen(false);
    setPaymentNote('');
  };

  const handleDelete = () => {
    if (confirm(`¿Estás seguro de eliminar el proyecto "${project.name}"?`)) {
      deleteProject(project.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="p-5 bg-gradient-to-r from-[#07152f] via-slate-900 to-slate-950 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {project.category}
                </span>
                <Badge
                  variant={
                    project.status === 'Completado'
                      ? 'success'
                      : project.status === 'En progreso'
                      ? 'info'
                      : project.status === 'En revisión'
                      ? 'purple'
                      : project.status === 'Aprobado'
                      ? 'cyan'
                      : 'warning'
                  }
                  size="sm"
                >
                  {project.status}
                </Badge>
                {isOverdue && (
                  <Badge variant="danger" size="sm">
                    Atrasado
                  </Badge>
                )}
              </div>
              <h2 className="text-lg font-bold text-white font-display">{project.name}</h2>
              <p className="text-xs text-slate-300 flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-cyan-400" />
                <span>{client?.company || client?.name || 'Sin cliente asignado'}</span>
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onEditProject(project)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Editar proyecto"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 transition-colors"
                title="Eliminar proyecto"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Progress & Status Bar */}
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex-1 max-w-sm space-y-1">
              <div className="flex justify-between font-semibold text-slate-300 text-[11px]">
                <span>Progreso de Entrega</span>
                <span className="text-cyan-400">{project.progress}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={project.progress}
                onChange={(e) => updateProject(project.id, { progress: parseInt(e.target.value) })}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-400 text-[11px]">Cambiar Estado:</span>
              <select
                value={project.status}
                onChange={(e) => updateProjectStatus(project.id, e.target.value as ProjectStatus)}
                className="bg-slate-950 text-cyan-300 text-[11px] font-semibold rounded-lg px-2.5 py-1 border border-slate-700 focus:outline-none"
              >
                <option value="Lead">Lead</option>
                <option value="Cotización">Cotización</option>
                <option value="Aprobado">Aprobado</option>
                <option value="En progreso">En progreso</option>
                <option value="En revisión">En revisión</option>
                <option value="Pausado">Pausado</option>
                <option value="Entregado">Entregado</option>
                <option value="Completado">Completado</option>
                <option value="Cancelado">Cancelado</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-5 text-xs font-semibold">
          {[
            { id: 'overview', label: 'Resumen & Fechas', icon: FolderKanban },
            { id: 'tasks', label: `Tareas (${projectTasks.length})`, icon: CheckSquare },
            { id: 'finance', label: 'Balance & Pagos', icon: DollarSign },
            { id: 'files', label: `Archivos (${projectFiles.length})`, icon: FolderOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300 font-bold bg-slate-900/50'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                    Precio Contratado
                  </span>
                  <span className="text-base font-bold text-white font-display">
                    ${(project.price || 0).toLocaleString()} USD
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block mb-1">
                    Monto Pagado
                  </span>
                  <span className="text-base font-bold text-emerald-400 font-display">
                    ${(project.paidAmount || 0).toLocaleString()} USD
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800">
                  <span className="text-[10px] uppercase font-bold text-amber-400 block mb-1">
                    Pendiente por Cobrar
                  </span>
                  <span className="text-base font-bold text-amber-400 font-display">
                    ${(pendingAmount || 0).toLocaleString()} USD
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-300">Cronograma de Entrega</h4>
                  <div className="space-y-1.5 text-slate-400">
                    <p className="flex items-center justify-between">
                      <span>Inicio:</span>
                      <span className="text-slate-200 font-semibold">{project.startDate}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Fecha Límite:</span>
                      <span className={`font-semibold ${isOverdue ? 'text-rose-400' : 'text-slate-200'}`}>
                        {project.deliveryDate}
                      </span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Responsable Asignado:</span>
                      <span className="text-cyan-400 font-semibold">{responsible?.name || 'Josías Lachapelle'}</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
                  <h4 className="font-bold text-slate-300">Detalles del Cliente</h4>
                  <div className="space-y-1.5 text-slate-400">
                    <p className="flex items-center justify-between">
                      <span>Empresa:</span>
                      <span className="text-slate-200 font-semibold">{client?.company || 'Particular'}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Contacto:</span>
                      <span className="text-slate-200">{client?.name}</span>
                    </p>
                    <p className="flex items-center justify-between">
                      <span>Email:</span>
                      <span className="text-slate-200">{client?.email}</span>
                    </p>
                  </div>
                </div>
              </div>

              {project.description && (
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-1">
                  <h4 className="font-bold text-slate-300">Descripción del Proyecto</h4>
                  <p className="text-slate-400 leading-relaxed">{project.description}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: TASKS */}
          {activeTab === 'tasks' && (
            <div className="space-y-4">
              {/* Add task form */}
              <form onSubmit={handleCreateTask} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nueva tarea para este proyecto..."
                  value={newTaskName}
                  onChange={(e) => setNewTaskName(e.target.value)}
                  className="flex-1 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
                />
                <select
                  value={newTaskPriority}
                  onChange={(e) => setNewTaskPriority(e.target.value as Priority)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-2 text-xs text-slate-200 focus:outline-none"
                >
                  <option value="Baja">Baja</option>
                  <option value="Media">Media</option>
                  <option value="Alta">Alta</option>
                  <option value="Urgente">Urgente</option>
                </select>
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold transition-colors flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" /> Agregar
                </button>
              </form>

              <div className="space-y-2">
                {projectTasks.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-6">No hay tareas creadas para este proyecto.</p>
                ) : (
                  projectTasks.map((t) => (
                    <div
                      key={t.id}
                      className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <input
                          type="checkbox"
                          checked={t.status === 'Completada'}
                          onChange={() => toggleTaskStatus(t.id)}
                          className="w-4 h-4 rounded text-cyan-500 bg-slate-800 border-slate-700 cursor-pointer"
                        />
                        <span
                          className={`font-semibold truncate ${
                            t.status === 'Completada' ? 'line-through text-slate-500' : 'text-slate-200'
                          }`}
                        >
                          {t.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Badge
                          size="sm"
                          variant={
                            t.priority === 'Urgente'
                              ? 'danger'
                              : t.priority === 'Alta'
                              ? 'warning'
                              : 'neutral'
                          }
                        >
                          {t.priority}
                        </Badge>
                        <button
                          onClick={() => deleteTask(t.id)}
                          className="p-1 rounded text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: FINANCE & PAYMENTS */}
          {activeTab === 'finance' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <h4 className="font-bold text-white">Estado de Cobros</h4>
                  <p className="text-slate-400 mt-0.5">
                    Pagado: ${project.paidAmount || 0} de ${project.price} USD
                  </p>
                </div>
                <button
                  onClick={() => setIsPaymentFormOpen(!isPaymentFormOpen)}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                >
                  <Plus className="w-3.5 h-3.5" /> Registrar Cobro
                </button>
              </div>

              {isPaymentFormOpen && (
                <form onSubmit={handleRecordPayment} className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3">
                  <h4 className="font-bold text-emerald-400">Registrar Pago para este Proyecto</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Monto (USD)</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Método</label>
                      <select
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      >
                        <option value="Transferencia">Transferencia</option>
                        <option value="Tarjeta">Tarjeta</option>
                        <option value="Efectivo">Efectivo</option>
                        <option value="Stripe">Stripe</option>
                        <option value="PayPal">PayPal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-300 mb-1">Nota / Concepto</label>
                      <input
                        type="text"
                        placeholder="Ej. Segundo abono"
                        value={paymentNote}
                        onChange={(e) => setPaymentNote(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsPaymentFormOpen(false)}
                      className="px-3 py-1 bg-slate-800 text-slate-400 rounded-lg"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg"
                    >
                      Confirmar Pago
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* TAB 4: FILES */}
          {activeTab === 'files' && (
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {['Cotización', 'Contrato', 'Diseños', 'Fotografías', 'Videos', 'Entrega'].map((folder) => {
                  const folderFiles = projectFiles.filter((f) => f.folder === folder);
                  return (
                    <div key={folder} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-slate-200">
                        <FolderOpen className="w-3.5 h-3.5 text-cyan-400" />
                        <span>{folder}</span>
                      </div>
                      <p className="text-[10px] text-slate-400">{folderFiles.length} archivo(s)</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
