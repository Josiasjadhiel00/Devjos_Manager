import React, { useState } from 'react';
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

const monthlyFinanceData = [
  { month: 'Oct', ingresos: 4800, gastos: 1900, beneficio: 2900 },
  { month: 'Nov', ingresos: 6200, gastos: 2100, beneficio: 4100 },
  { month: 'Dic', ingresos: 8900, gastos: 2800, beneficio: 6100 },
  { month: 'Ene', ingresos: 7400, gastos: 2300, beneficio: 5100 },
  { month: 'Feb', ingresos: 9100, gastos: 2500, beneficio: 6600 },
  { month: 'Mar', ingresos: 11400, gastos: 3100, beneficio: 8300 },
];

const categoryData = [
  { name: 'Desarrollo Web', value: 42, color: '#06b6d4' },
  { name: 'Producción Audiovisual', value: 28, color: '#a855f7' },
  { name: 'Fotografía Profesional', value: 18, color: '#3b82f6' },
  { name: 'Diseño & Branding', value: 12, color: '#ec4899' },
];

const projectStatusData = [
  { name: 'Completados a tiempo', value: 18, fill: '#10b981' },
  { name: 'En curso activo', value: 8, fill: '#06b6d4' },
  { name: 'En revisión de cliente', value: 4, fill: '#8b5cf6' },
  { name: 'Con ajustes menores', value: 2, fill: '#f59e0b' },
];

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
          trend={{ value: '+6.8%', isPositive: true }}
          description={`${formatMoney(netProfit || 0)} de utilidad neta`}
          colorScheme="emerald"
        />
        <StatCard
          title="Tasa Conversión Cotizaciones"
          value={`${quoteConversionRate}%`}
          icon={Award}
          trend={{ value: '+12.4%', isPositive: true }}
          description={`${quotes.filter(q => q.status === 'Aprobada').length} presupuestos ganados`}
          colorScheme="cyan"
        />
        <StatCard
          title="Efectividad en Entregas"
          value="94.2%"
          icon={CheckCircle2}
          description="Entregas dentro del cronograma pactado"
          colorScheme="purple"
        />
        <StatCard
          title="Valor Promedio por Cliente"
          value={formatMoney(clients.length > 0 ? (Math.round((totalIncome || 0) / clients.length) || 0) : 0)}
          icon={Users}
          description="Ticket promedio de servicios contratados"
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
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold font-mono text-white">100%</span>
              <span className="text-[10px] text-slate-400">Servicios</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800">
            {categoryData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-mono font-bold text-slate-200">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Completion Breakdown Bar Chart */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4 print:bg-white print:border-slate-200 print:shadow-none print-avoid-break">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display font-bold text-sm text-white print:text-slate-900 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-blue-400" />
              Estado de Entregas & Calidad de Producción
            </h3>
            <p className="text-xs text-slate-400 print:text-slate-500">Desglose de satisfacción y cumplimiento de hitos</p>
          </div>
        </div>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={projectStatusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
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
