import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  FolderKanban,
  CheckCircle2,
  Users,
  Download,
  Filter,
  PieChart as PieChartIcon,
  Sparkles,
  Award,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { StatCard } from '../ui/StatCard';
import { ProjectCategory, ProjectStatus } from '../../types';

const MONTH_LABELS_ES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const CATEGORY_COLORS: Record<string, string> = {
  'Desarrollo': '#06b6d4',
  'Video': '#a855f7',
  'Multimedia': '#a855f7',
  'Fotografía': '#3b82f6',
  'Diseño': '#ec4899',
  'Branding': '#ec4899',
  'Redes sociales': '#f59e0b',
  'Otro': '#64748b',
};

const STATUS_COLORS: Record<string, string> = {
  'Completado': '#10b981',
  'Entregado': '#10b981',
  'En progreso': '#06b6d4',
  'En revisión': '#8b5cf6',
  'Pausado': '#f59e0b',
  'Aprobado': '#3b82f6',
  'Cotización': '#64748b',
  'Lead': '#94a3b8',
  'Cancelado': '#f43f5e',
};

export const ReportsView: React.FC = () => {
  const { metrics, projects, clients, quotes, incomes, expenses, formatMoney, currencySymbol, settings } = useApp();
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y'>('90d');

  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalIncome - totalExpense;
  const marginPercent = totalIncome > 0 ? Math.round((netProfit / totalIncome) * 100) : 0;

  const quoteConversionRate =
    quotes.length > 0
      ? Math.round(
          (quotes.filter(q => q.status === 'Aprobada' || q.status === 'Facturada').length /
            quotes.length) *
            100
        )
      : 0;

  const nonCancelledProjects = projects.filter(p => p.status !== 'Cancelado');
  const deliveredProjects = projects.filter(p => p.status === 'Completado' || p.status === 'Entregado');
  const deliveryEffectivenessRate =
    nonCancelledProjects.length > 0
      ? Math.round((deliveredProjects.length / nonCancelledProjects.length) * 100)
      : 0;

  // Tendencia real: margen de este mes vs. el mes anterior (mismo criterio
  // que la gráfica de Ingresos vs. Gastos, solo que comparando 2 meses).
  const marginTrend = useMemo(() => {
    const now = new Date();
    const sumFor = (offset: number, field: 'ingresos' | 'gastos') => {
      const target = new Date(now.getFullYear(), now.getMonth() - offset, 1);
      const list = field === 'ingresos' ? incomes : expenses;
      return list.reduce((sum, item) => {
        const d = new Date(item.date);
        if (isNaN(d.getTime())) return sum;
        return d.getFullYear() === target.getFullYear() && d.getMonth() === target.getMonth()
          ? sum + (item.amount || 0)
          : sum;
      }, 0);
    };
    const thisMonthIncome = sumFor(0, 'ingresos');
    const thisMonthExpense = sumFor(0, 'gastos');
    const lastMonthIncome = sumFor(1, 'ingresos');
    const lastMonthExpense = sumFor(1, 'gastos');
    const thisMargin = thisMonthIncome > 0 ? (thisMonthIncome - thisMonthExpense) / thisMonthIncome : 0;
    const lastMargin = lastMonthIncome > 0 ? (lastMonthIncome - lastMonthExpense) / lastMonthIncome : 0;
    if (lastMonthIncome === 0) return null;
    const deltaPoints = Math.round((thisMargin - lastMargin) * 100);
    return { value: `${deltaPoints >= 0 ? '+' : ''}${deltaPoints} pts`, isPositive: deltaPoints >= 0 };
  }, [incomes, expenses]);

  // Ingresos vs. Gastos reales, agrupados por mes — la cantidad de meses
  // depende del filtro de rango seleccionado arriba.
  const monthlyFinanceData = useMemo(() => {
    const monthsToShow = timeRange === '30d' ? 1 : timeRange === '90d' ? 3 : 12;
    const now = new Date();
    const buckets: { key: string; month: string; ingresos: number; gastos: number; beneficio: number }[] = [];

    for (let i = monthsToShow - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      buckets.push({ key, month: MONTH_LABELS_ES[d.getMonth()], ingresos: 0, gastos: 0, beneficio: 0 });
    }

    const bucketByKey = new Map(buckets.map(b => [b.key, b]));

    incomes.forEach(i => {
      const d = new Date(i.date);
      if (isNaN(d.getTime())) return;
      const bucket = bucketByKey.get(`${d.getFullYear()}-${d.getMonth()}`);
      if (bucket) bucket.ingresos += i.amount || 0;
    });

    expenses.forEach(e => {
      const d = new Date(e.date);
      if (isNaN(d.getTime())) return;
      const bucket = bucketByKey.get(`${d.getFullYear()}-${d.getMonth()}`);
      if (bucket) bucket.gastos += e.amount || 0;
    });

    buckets.forEach(b => { b.beneficio = b.ingresos - b.gastos; });
    return buckets;
  }, [incomes, expenses, timeRange]);

  // Ingresos reales por categoría de proyecto (según el proyecto asociado
  // a cada ingreso registrado).
  const categoryData = useMemo(() => {
    const totals = new Map<string, number>();
    incomes.forEach(i => {
      const project = i.projectId ? projects.find(p => p.id === i.projectId) : undefined;
      const category = project?.category || 'Otro';
      totals.set(category, (totals.get(category) || 0) + (i.amount || 0));
    });
    const totalSum = Array.from(totals.values()).reduce((s, v) => s + v, 0);
    if (totalSum === 0) return [];
    return Array.from(totals.entries())
      .map(([name, amount]) => ({
        name,
        value: Math.round((amount / totalSum) * 100),
        amount,
        color: CATEGORY_COLORS[name] || '#64748b',
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [incomes, projects]);

  // Estado real de todos los proyectos registrados, agrupados por status.
  const projectStatusData = useMemo(() => {
    const totals = new Map<string, number>();
    projects.forEach(p => {
      totals.set(p.status, (totals.get(p.status) || 0) + 1);
    });
    return Array.from(totals.entries())
      .map(([name, value]) => ({ name, value, fill: STATUS_COLORS[name] || '#64748b' }))
      .sort((a, b) => b.value - a.value);
  }, [projects]);

  return (
    <div className="print-document relative space-y-6 animate-in fade-in duration-200">
      <div className="doc-accent-bar hidden print:block -mx-0" />

      {/* Print-only letterhead — hidden on screen, shown only on paper/PDF */}
      <div className="hidden print:flex justify-between items-start border-b border-slate-300 pb-4 mb-2">
        <div>
          <h1 className="font-display font-extrabold text-xl text-slate-900 tracking-wide">
            {settings.studioName || 'DEVJOS STUDIO'}
          </h1>
          <p className="text-xs text-slate-500">
            {settings.tagline || 'Software, Multimedia & Photography Studio'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Reporte</p>
          <p className="text-sm font-bold text-slate-900">
            Financiero & Rendimiento Operativo
          </p>
          <p className="text-[11px] text-slate-500">
            Período: {timeRange === '30d' ? 'Últimos 30 días' : timeRange === '90d' ? 'Últimos 3 meses' : 'Último año'}
          </p>
          <p className="text-[11px] text-slate-500">Generado: {new Date().toLocaleDateString()}</p>
        </div>
      </div>

      {/* Header */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Reportes Financieros & Rendimiento Operativo
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Analítica de ingresos, margen de rentabilidad, entregas de proyectos y conversión comercial
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1">
            {(['30d', '90d', '1y'] as const).map(r => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                  timeRange === r ? 'bg-cyan-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                {r === '30d' ? '30 días' : r === '90d' ? '3 meses' : '1 año'}
              </button>
            ))}
          </div>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Exportar / Imprimir</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Margen Operativo Neto"
          value={`${marginPercent}%`}
          icon={TrendingUp}
          trend={marginTrend || undefined}
          subtitle={`${formatMoney(netProfit || 0)} de utilidad neta`}
          colorScheme="emerald"
        />
        <StatCard
          title="Tasa Conversión Cotizaciones"
          value={`${quoteConversionRate}%`}
          icon={Award}
          subtitle={`${quotes.filter(q => q.status === 'Aprobada').length} de ${quotes.length} presupuestos ganados`}
          colorScheme="cyan"
        />
        <StatCard
          title="Efectividad en Entregas"
          value={`${deliveryEffectivenessRate}%`}
          icon={CheckCircle2}
          subtitle={`${deliveredProjects.length} de ${nonCancelledProjects.length} proyectos entregados`}
          colorScheme="purple"
        />
        <StatCard
          title="Valor Promedio por Cliente"
          value={formatMoney(clients.length > 0 ? (Math.round((totalIncome || 0) / clients.length) || 0) : 0)}
          icon={Users}
          subtitle="Ticket promedio de servicios contratados"
          colorScheme="blue"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Revenue vs Expenses Area Chart */}
        <div className="lg:col-span-8 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 print:bg-white print:border-slate-200 print:shadow-none print-avoid-break">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-sm text-white print:text-slate-900 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-400" />
                Ingresos vs. Gastos Operativos (Semestre)
              </h3>
              <p className="text-xs text-slate-400 print:text-slate-500">Comparativa mensual de liquidez y balance neto</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Ingresos
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" /> Gastos
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyFinanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" textAnchor="middle" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={v => `${currencySymbol}${v}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }}
                  formatter={(val: any) => [formatMoney(val), '']}
                />
                <Area type="monotone" dataKey="ingresos" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#incomeGrad)" />
                <Area type="monotone" dataKey="gastos" stroke="#f43f5e" strokeWidth={2} fillOpacity={1} fill="url(#expenseGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Service Category Pie Chart */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 flex flex-col justify-between print:bg-white print:border-slate-200 print:shadow-none print-avoid-break">
          <div>
            <h3 className="font-display font-bold text-sm text-white print:text-slate-900 flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-purple-400" />
              Ingresos por Categoría
            </h3>
            <p className="text-xs text-slate-400 print:text-slate-500">Distribución porcentual de facturación</p>
          </div>

          <div className="h-56 w-full relative flex items-center justify-center">
            {categoryData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '10px', fontSize: '11px' }}
                      formatter={(val: any, name: any, props: any) => [formatMoney(props?.payload?.amount || 0), name]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-bold font-mono text-white print:text-slate-900">100%</span>
                  <span className="text-[10px] text-slate-400 print:text-slate-500">Servicios</span>
                </div>
              </>
            ) : (
              <p className="text-xs text-slate-500 print:text-slate-400">Todavía no hay ingresos registrados a un proyecto.</p>
            )}
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800 print:border-slate-200">
            {categoryData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300 print:text-slate-700">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-mono font-bold text-slate-200 print:text-slate-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Status Breakdown Bar Chart */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 print:bg-white print:border-slate-200 print:shadow-none print-avoid-break">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-sm text-white print:text-slate-900 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-blue-400" />
              Proyectos por Estado
            </h3>
            <p className="text-xs text-slate-400 print:text-slate-500">Cuántos proyectos hay en cada etapa ahora mismo</p>
          </div>
        </div>

        <div className="h-60 w-full">
          {projectStatusData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectStatusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {projectStatusData.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500 print:text-slate-400">
              Todavía no hay proyectos registrados.
            </div>
          )}
        </div>
      </div>

      {/* Print-only footer */}
      <div className="hidden print:flex justify-between items-center pt-4 border-t border-slate-300 text-[10px] text-slate-400">
        <p>Documento generado por {settings.studioName || 'DevJos Studio'} — uso interno.</p>
        <p>Página 1 de 1</p>
      </div>
    </div>
  );
};
