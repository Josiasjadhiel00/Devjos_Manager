import React, { useState } from 'react';
import {
  CheckSquare,
  Search,
  Plus,
  Filter,
  Calendar,
  User,
  FolderKanban,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Timer,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/StatCard';
import { TaskModal } from './TaskModal';
import { Task, Priority, TaskStatus } from '../../types';

function formatSeconds(totalSeconds: number = 0): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    seconds.toString().padStart(2, '0'),
  ].join(':');
}

export const TasksView: React.FC = () => {
  const {
    tasks,
    projects,
    team,
    addTask,
    updateTask,
    toggleTaskStatus,
    deleteTask,
    startTaskTimer,
    stopTaskTimer,
    resetTaskTimer,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  // Quick task input state
  const [quickTaskText, setQuickTaskText] = useState('');
  const [quickTaskProject, setQuickTaskProject] = useState('');

  const filteredTasks = tasks.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'Pendientes'
        ? t.status !== 'Completada'
        : t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesProject = projectFilter === 'all' || t.projectId === projectFilter;

    return matchesSearch && matchesStatus && matchesPriority && matchesProject;
  });

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTaskText.trim()) return;

    addTask({
      name: quickTaskText,
      description: '',
      projectId: quickTaskProject || undefined,
      responsibleId: team[0]?.id || '',
      priority: 'Media',
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
      status: 'Pendiente',
      timeSpentSeconds: 0,
      isTimerRunning: false,
    });
    setQuickTaskText('');
  };

  const handleSaveTask = (data: any) => {
    if (taskToEdit) {
      updateTask(taskToEdit.id, data);
      setTaskToEdit(null);
    } else {
      addTask({
        ...data,
        timeSpentSeconds: 0,
        isTimerRunning: false,
      });
    }
  };

  const pendingCount = tasks.filter((t) => t.status === 'Pendiente').length;
  const inProgressCount = tasks.filter((t) => t.status === 'En progreso').length;
  const urgentCount = tasks.filter((t) => t.priority === 'Urgente' && t.status !== 'Completada').length;
  const completedCount = tasks.filter((t) => t.status === 'Completada').length;

  const totalTrackedSeconds = tasks.reduce((acc, t) => acc + (t.timeSpentSeconds || 0), 0);
  const totalTrackedHours = (totalTrackedSeconds / 3600).toFixed(1);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Pendientes</span>
            <Clock className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-white font-display">{pendingCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">En Curso</span>
            <CheckSquare className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-blue-400 font-display">{inProgressCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Urgentes 🔥</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-rose-400 font-display">{urgentCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Completadas</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 font-display">{completedCount}</p>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1 col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Horas Logueadas</span>
            <Timer className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400 font-display">{totalTrackedHours} hrs</p>
        </div>
      </div>

      {/* Quick Add Form Bar */}
      <form
        onSubmit={handleQuickAdd}
        className="flex flex-col sm:flex-row items-center gap-2 p-3 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl"
      >
        <div className="relative flex-1 w-full">
          <CheckSquare className="w-4 h-4 text-cyan-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Añadir tarea rápida... (Presiona Enter para crear)"
            value={quickTaskText}
            onChange={(e) => setQuickTaskText(e.target.value)}
            className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
          />
        </div>
        <select
          value={quickTaskProject}
          onChange={(e) => setQuickTaskProject(e.target.value)}
          className="w-full sm:w-56 bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
        >
          <option value="">Proyecto General</option>
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="w-full sm:w-auto px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> Agregar
        </button>
      </form>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar en tareas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {['all', 'Pendientes', 'En progreso', 'Completada'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                  statusFilter === st
                    ? 'bg-cyan-600 text-white'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white'
                }`}
              >
                {st === 'all' ? 'Todas' : st}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            setTaskToEdit(null);
            setIsCreateModalOpen(true);
          }}
          className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs transition-colors flex items-center gap-1.5 border border-slate-700"
        >
          <Plus className="w-3.5 h-3.5" /> Tarea Detallada
        </button>
      </div>

      {/* Tasks List */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-sm space-y-2">
        {filteredTasks.length === 0 ? (
          <div className="py-12 text-center text-slate-500 space-y-2">
            <CheckSquare className="w-8 h-8 mx-auto text-slate-600" />
            <p className="text-xs">No se encontraron tareas con los filtros actuales</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const project = projects.find((p) => p.id === task.projectId);
            const responsible = team.find((m) => m.id === task.responsibleId);
            const isCompleted = task.status === 'Completada';
            const isRunning = task.isTimerRunning;

            return (
              <div
                key={task.id}
                className={`p-3.5 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isRunning
                    ? 'bg-cyan-950/20 border-cyan-500/40 shadow-sm shadow-cyan-950/40'
                    : isCompleted
                    ? 'bg-slate-950/40 border-slate-900 text-slate-500'
                    : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 text-slate-200'
                }`}
              >
                {/* Left check & info */}
                <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                  <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={() => toggleTaskStatus(task.id)}
                    className="mt-0.5 sm:mt-0 w-4 h-4 rounded text-cyan-500 bg-slate-800 border-slate-700 focus:ring-0 cursor-pointer shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-bold truncate ${
                        isCompleted ? 'line-through text-slate-500' : 'text-slate-100'
                      }`}
                    >
                      {task.name}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-400">
                      {project ? (
                        <span className="text-cyan-400 font-medium">{project.name}</span>
                      ) : (
                        <span className="text-slate-500">General</span>
                      )}
                      <span>•</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Calendar className="w-3 h-3 text-slate-500" />
                        {task.dueDate}
                      </span>
                      {responsible && (
                        <>
                          <span>•</span>
                          <span className="text-slate-400">Asignado a {responsible.name}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right timer, badges & actions */}
                <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0 border-t sm:border-t-0 border-slate-800/80 pt-2 sm:pt-0">
                  {/* Real Time Tracker Control */}
                  <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-2.5 py-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => (isRunning ? stopTaskTimer(task.id) : startTaskTimer(task.id))}
                      className={`p-1 rounded-lg transition-colors ${
                        isRunning
                          ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                      }`}
                      title={isRunning ? 'Pausar cronómetro' : 'Iniciar cronómetro de tarea'}
                    >
                      {isRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    </button>

                    <div className="flex items-center gap-1 font-mono text-[11px]">
                      {isRunning && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />}
                      <span className={isRunning ? 'text-cyan-300 font-bold' : 'text-slate-400'}>
                        {formatSeconds(task.timeSpentSeconds || 0)}
                      </span>
                    </div>

                    {(task.timeSpentSeconds || 0) > 0 && !isRunning && (
                      <button
                        type="button"
                        onClick={() => resetTaskTimer(task.id)}
                        className="p-0.5 text-slate-500 hover:text-slate-300 transition-colors ml-0.5"
                        title="Reiniciar tiempo"
                      >
                        <RotateCcw className="w-2.5 h-2.5" />
                      </button>
                    )}
                  </div>

                  <Badge
                    size="sm"
                    variant={
                      task.priority === 'Urgente'
                        ? 'danger'
                        : task.priority === 'Alta'
                        ? 'warning'
                        : 'neutral'
                    }
                  >
                    {task.priority}
                  </Badge>

                  <button
                    onClick={() => {
                      setTaskToEdit(task);
                      setIsCreateModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Task Modal */}
      <TaskModal
        isOpen={isCreateModalOpen || !!taskToEdit}
        onClose={() => {
          setIsCreateModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleSaveTask}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};
