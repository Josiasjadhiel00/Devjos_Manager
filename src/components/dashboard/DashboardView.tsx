import React from 'react';
import {
  Users,
  FolderKanban,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  ArrowUpRight,
  Plus,
  Calendar,
  Camera,
  Film,
  CheckSquare,
  Sparkles,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { StatCard, Badge } from '../ui/StatCard';

export const DashboardView: React.FC<{
  onOpenNewClient: () => void;
  onOpenNewProject: () => void;
  onOpenNewQuote: () => void;
  onOpenNewIncome: () => void;
}> = ({ onOpenNewClient, onOpenNewProject, onOpenNewQuote, onOpenNewIncome }) => {
  const {
    metrics,
    clients,
    projects,
    tasks,
    calendarEvents,
    photoSessions,
    services,
    incomes,
    expenses,
    setCurrentView,
    setSelectedClientId,
    setSelectedProjectId,
    toggleTaskStatus,
    settings,
  } = useApp();

  // Financial timeline data for chart
  const chartData = [
    { month: 'Mayo', ingresos: 2100, gastos: 420, ganancia: 1680 },
    { month: 'Junio', ingresos: 3400, gastos: 610, ganancia: 2790 },
    { month: 'Julio', ingresos: 4800, gastos: 790, ganancia: 4010 },
    { month: 'Agosto (Act.)', ingresos: metrics.monthlyRevenue, gastos: metrics.monthlyExpenses, ganancia: metrics.monthlyProfit },
  ];

  // Service categories distribution
  const categoryStats = [
    { name: 'Desarrollo Web', value: 45, color: '#168dda' },
    { name: 'Multimedia / Video', value: 25, color: '#7a3fc4' },
    { name: 'Fotografía', value: 20, color: '#1bb7e8' },
    { name: 'Branding & Diseño', value: 10, color: '#10b981' },
  ];

  const activeProjectsList = projects.filter(p => !['Completado', 'Cancelado'].includes(p.status)).slice(0, 5);
  const upcomingTasksList = tasks.filter(t => t.status !== 'Completada').slice(0, 5);
  const upcomingEventsList = calendarEvents.slice(0, 4);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Studio Banner / Action shortcuts */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#07152f] via-slate-900 to-[#168dda]/30 border border-slate-800 p-5 lg:p-6 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Centro de Operaciones Activo
            </div>
            <h2 className="text-xl lg:text-2xl font-extrabold text-white font-display">
              {settings.studioName} — Panel de Control
            </h2>
            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              {settings.tagline}. Monitorea proyectos activos, entregas, sesiones fotográficas y balance financiero en tiempo real.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={onOpenNewQuote}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-purple-500/20"
            >
              <Plus className="w-3.5 h-3.5" /> Cotización
            </button>
            <button
              onClick={onOpenNewProject}
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              <Plus className="w-3.5 h-3.5" /> Proyecto
            </button>
            <button
              onClick={onOpenNewIncome}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <Plus className="w-3.5 h-3.5" /> Pago / Ingreso
            </button>
          </div>
        </div>

        {/* Decorative backdrop light */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 7 Key Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard
          title="Clientes Totales"
          value={metrics.totalClients}
          subtitle={`${clients.filter(c => c.status === 'Cliente').length} clientes activos`}
          icon={Users}
          colorScheme="blue"
          onClick={() => setCurrentView('clients')}
        />
        <StatCard
          title="Proyectos Activos"
          value={metrics.activeProjects}
          subtitle={`${metrics.completedProjects} completados con éxito`}
          icon={FolderKanban}
          colorScheme="cyan"
          trend={{ value: '+2 este mes', isPositive: true }}
          onClick={() => setCurrentView('projects')}
        />
        <StatCard
          title="Ingresos Registrados"
          value={`$${(metrics?.monthlyRevenue || 0).toLocaleString()} USD`}
          subtitle="Facturación acumulada"
          icon={TrendingUp}
          colorScheme="emerald"
          trend={{ value: '18% vs mes ant.', isPositive: true }}
          onClick={() => setCurrentView('finance')}
        />
        <StatCard
          title="Dinero por Cobrar"
          value={`$${(metrics?.totalPendingReceivables || 0).toLocaleString()} USD`}
          subtitle="Saldos pendientes de clientes"
          icon={Clock}
          colorScheme="amber"
          onClick={() => setCurrentView('payments')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <StatCard
          title="Gastos Operativos"
          value={`$${(metrics?.monthlyExpenses || 0).toLocaleString()} USD`}
          subtitle="Software, equipo y transporte"
          icon={TrendingDown}
          colorScheme="rose"
          onClick={() => setCurrentView('finance')}
        />
        <StatCard
          title="Ganancia Neta Calculada"
          value={`$${(metrics?.monthlyProfit || 0).toLocaleString()} USD`}
          subtitle="Ingresos netos tras deducción"
          icon={DollarSign}
          colorScheme="purple"
          onClick={() => setCurrentView('finance')}
        />
        <StatCard
          title="Sesiones Fotográficas"
          value={photoSessions.length}
          subtitle={`${photoSessions.filter(s => s.status === 'Completada').length} entregadas`}
          icon={Camera}
          colorScheme="navy"
          onClick={() => setCurrentView('photography')}
        />
      </div>

      {/* Main Charts & Active Projects Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Flow Chart (2 cols) */}
        <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-display">
                Flujo Financiero (Ingresos vs Gastos)
              </h3>
              <p className="text-xs text-slate-400">Evolución de ingresos y margen de ganancia en USD</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Ingresos
              </span>
              <span className="flex items-center gap-1 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Gastos
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#168dda" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#168dda" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(val) => `$${val}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                  formatter={(val: any) => [`$${val} USD`, '']}
                />
                <Area
                  type="monotone"
                  dataKey="ingresos"
                  stroke="#168dda"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorIngresos)"
                />
                <Area
                  type="monotone"
                  dataKey="gastos"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorGastos)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Chart */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 font-display">
              Servicios Más Contratados
            </h3>
            <p className="text-xs text-slate-400">Distribución de demanda en DevJos</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryStats}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '0.75rem',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val}%`, 'Participación']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            {categoryStats.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  {item.name}
                </span>
                <span className="font-bold text-slate-200">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Projects Table & Quick Overview */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 font-display">
              Proyectos en Curso ({activeProjectsList.length})
            </h3>
            <p className="text-xs text-slate-400">Control de fechas límites, avances y cobros</p>
          </div>
          <button
            onClick={() => setCurrentView('projects')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1 transition-colors"
          >
            Ver todos los proyectos <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                <th className="pb-3">Proyecto / Cliente</th>
                <th className="pb-3">Categoría</th>
                <th className="pb-3">Estado</th>
                <th className="pb-3">Progreso</th>
                <th className="pb-3">Fecha Entrega</th>
                <th className="pb-3">Precio</th>
                <th className="pb-3 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {activeProjectsList.map((p) => {
                const client = clients.find((c) => c.id === p.clientId);
                return (
                  <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3">
                      <div>
                        <p className="font-semibold text-slate-100">{p.name}</p>
                        <p className="text-[11px] text-slate-400">
                          {client?.company || client?.name || 'Cliente sin asignar'}
                        </p>
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="text-slate-300 font-medium">{p.category}</span>
                    </td>
                    <td className="py-3">
                      <Badge
                        variant={
                          p.status === 'Completado'
                            ? 'success'
                            : p.status === 'En progreso'
                            ? 'info'
                            : p.status === 'En revisión'
                            ? 'purple'
                            : p.status === 'Aprobado'
                            ? 'cyan'
                            : 'warning'
                        }
                        size="sm"
                      >
                        {p.status}
                      </Badge>
                    </td>
                    <td className="py-3 w-36">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                          <span>{p.progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                            style={{ width: `${p.progress}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-300">{p.deliveryDate}</td>
                    <td className="py-3 font-semibold text-slate-100">
                      ${(p.price || 0).toLocaleString()} USD
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => {
                          setSelectedProjectId(p.id);
                          setCurrentView('projects');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[11px] font-semibold transition-colors"
                      >
                        Detalles
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Column Section: Upcoming Tasks & Upcoming Events/Sessions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Tasks */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-slate-100 font-display">
                Tareas Próximas ({upcomingTasksList.length})
              </h3>
            </div>
            <button
              onClick={() => setCurrentView('tasks')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              Ver todas
            </button>
          </div>

          <div className="space-y-2.5">
            {upcomingTasksList.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No hay tareas pendientes</p>
            ) : (
              upcomingTasksList.map((t) => {
                const proj = projects.find((p) => p.id === t.projectId);
                return (
                  <div
                    key={t.id}
                    className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 hover:border-slate-700 flex items-start gap-3 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={t.status === 'Completada'}
                      onChange={() => toggleTaskStatus(t.id)}
                      className="mt-0.5 w-4 h-4 rounded text-cyan-500 bg-slate-800 border-slate-700 focus:ring-0 cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">{t.name}</p>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                        <span>{proj?.name || 'General'}</span>
                        <span>•</span>
                        <span className="text-amber-400">Vence: {t.dueDate}</span>
                      </div>
                    </div>
                    <Badge
                      variant={
                        t.priority === 'Urgente'
                          ? 'danger'
                          : t.priority === 'Alta'
                          ? 'warning'
                          : 'neutral'
                      }
                      size="sm"
                    >
                      {t.priority}
                    </Badge>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Upcoming Events & Shoots */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-bold text-slate-100 font-display">
                Próximos Eventos & Sesiones
              </h3>
            </div>
            <button
              onClick={() => setCurrentView('calendar')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Ver calendario
            </button>
          </div>

          <div className="space-y-2.5">
            {upcomingEventsList.map((evt) => (
              <div
                key={evt.id}
                className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start gap-3"
              >
                <div
                  className={`p-2 rounded-lg shrink-0 ${
                    evt.type === 'Sesión fotográfica'
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : evt.type === 'Grabación'
                      ? 'bg-purple-500/20 text-purple-300'
                      : 'bg-blue-500/20 text-blue-300'
                  }`}
                >
                  {evt.type === 'Sesión fotográfica' ? (
                    <Camera className="w-4 h-4" />
                  ) : evt.type === 'Grabación' ? (
                    <Film className="w-4 h-4" />
                  ) : (
                    <Calendar className="w-4 h-4" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-100 truncate">{evt.title}</p>
                    <span className="text-[10px] font-bold text-cyan-400 bg-slate-800 px-2 py-0.5 rounded">
                      {evt.startDate}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    {evt.time || 'Todo el día'} {evt.location ? `• ${evt.location}` : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
