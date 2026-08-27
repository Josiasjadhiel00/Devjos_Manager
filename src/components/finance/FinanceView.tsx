import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Search,
  Filter,
  Calendar,
  CreditCard,
  Building,
  Download,
  Printer,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  PieChart as PieIcon,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useApp } from '../../context/AppContext';
import { StatCard, Badge } from '../ui/StatCard';
import { IncomeModal } from './IncomeModal';
import { ExpenseModal } from './ExpenseModal';

export const FinanceView: React.FC = () => {
  const {
    metrics,
    incomes,
    expenses,
    clients,
    projects,
    addIncome,
    addExpense,
    deleteIncome,
    deleteExpense,
    recordPayment,
    formatMoney,
    currencySymbol,
    settings,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'incomes' | 'expenses' | 'receivables'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isIncomeModalOpen, setIsIncomeModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Category breakdown for expenses
  const expenseCategoryBreakdown = expenses.reduce((acc: any, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  const expensePieData = Object.keys(expenseCategoryBreakdown).map((cat, idx) => ({
    name: cat,
    value: expenseCategoryBreakdown[cat],
    color: ['#f43f5e', '#7a3fc4', '#168dda', '#1bb7e8', '#f59e0b', '#10b981'][idx % 6],
  }));

  // Projects pending receivables
  const pendingProjects = projects
    .filter((p) => (p.paidAmount || 0) < p.price && p.status !== 'Cancelado')
    .map((p) => {
      const client = clients.find((c) => c.id === p.clientId);
      const pending = p.price - (p.paidAmount || 0);
      return { ...p, client, pending };
    });

  const handlePrintReport = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Financial Top KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <StatCard
          title="Ingresos Totales"
          value={formatMoney(metrics?.monthlyRevenue || 0)}
          subtitle="Cobros y anticipos registrados"
          icon={TrendingUp}
          colorScheme="emerald"
        />
        <StatCard
          title="Gastos Operativos"
          value={formatMoney(metrics?.monthlyExpenses || 0)}
          subtitle="Software, equipo y servicios"
          icon={TrendingDown}
          colorScheme="rose"
        />
        <StatCard
          title="Ganancia Neta (Margen)"
          value={formatMoney(metrics?.monthlyProfit || 0)}
          subtitle={`${Math.round(((metrics?.monthlyProfit || 0) / (metrics?.monthlyRevenue || 1)) * 100)}% de margen de beneficio`}
          icon={DollarSign}
          colorScheme="purple"
        />
        <StatCard
          title="Por Cobrar (Pendiente)"
          value={formatMoney(metrics?.totalPendingReceivables || 0)}
          subtitle={`${pendingProjects.length} proyectos con saldo`}
          icon={Clock}
          colorScheme="amber"
          onClick={() => setActiveTab('receivables')}
        />
      </div>

      {/* Navigation Tab Bar & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'overview', label: 'Resumen & Gráficos', icon: PieIcon },
            { id: 'incomes', label: `Ingresos (${incomes.length})`, icon: ArrowDownRight },
            { id: 'expenses', label: `Gastos (${expenses.length})`, icon: ArrowUpRight },
            { id: 'receivables', label: `Cuentas por Cobrar (${pendingProjects.length})`, icon: Clock },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrintReport}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            title="Exportar reporte financiero"
          >
            <Printer className="w-3.5 h-3.5" /> Exportar
          </button>
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-md shadow-rose-500/20"
          >
            <Plus className="w-3.5 h-3.5" /> Gasto
          </button>
          <button
            onClick={() => setIsIncomeModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-md shadow-emerald-500/20"
          >
            <Plus className="w-3.5 h-3.5" /> Ingreso
          </button>
        </div>
      </div>

      {/* TAB 1: OVERVIEW CHARTS */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Income vs Expenses Bar comparison */}
          <div className="lg:col-span-2 bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-100 font-display">
              Comparativa Mensual de Ingresos y Gastos
            </h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { month: 'Mayo', Ingresos: 2100, Gastos: 420 },
                    { month: 'Junio', Ingresos: 3400, Gastos: 610 },
                    { month: 'Julio', Ingresos: 4800, Gastos: 790 },
                    { month: 'Agosto (Act.)', Ingresos: metrics.monthlyRevenue, Gastos: metrics.monthlyExpenses },
                  ]}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `${currencySymbol}${v}`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '0.75rem',
                      fontSize: '12px',
                    }}
                    formatter={(val: any) => [formatMoney(val), '']}
                  />
                  <Bar dataKey="Ingresos" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Gastos" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expense Category Pie */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-100 font-display">
              Distribución de Gastos
            </h3>
            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensePieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {expensePieData.map((entry, index) => (
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
                    formatter={(val: any) => [formatMoney(val), 'Gasto']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-slate-800">
              {expensePieData.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-300">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-bold text-slate-200">{formatMoney(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INCOMES TABLE */}
      {activeTab === 'incomes' && (
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-sm space-y-2">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-semibold">
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Factura / ID</th>
                  <th className="p-4">Cliente / Proyecto</th>
                  <th className="p-4">Concepto</th>
                  <th className="p-4">Método</th>
                  <th className="p-4 text-right">Monto</th>
                  <th className="p-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {incomes.map((inc) => {
                  const client = clients.find((c) => c.id === inc.clientId);
                  const project = projects.find((p) => p.id === inc.projectId);
                  return (
                    <tr key={inc.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="p-4 text-slate-300">{inc.date}</td>
                      <td className="p-4 font-mono text-cyan-400">{inc.invoiceNumber || '—'}</td>
                      <td className="p-4">
                        <p className="font-bold text-slate-100">{client?.name || 'Cliente Particular'}</p>
                        <p className="text-[11px] text-slate-400">{project?.name || client?.company}</p>
                      </td>
                      <td className="p-4 text-slate-200">{inc.concept || inc.description}</td>
                      <td className="p-4 text-slate-400">{inc.method}</td>
                      <td className="p-4 text-right font-bold text-emerald-400 text-sm font-display">
                        +{formatMoney(inc.amount || 0)}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => {
                            if (confirm('¿Eliminar este registro de ingreso?')) {
                              deleteIncome(inc.id);
                            }
                          }}
                          className="text-slate-500 hover:text-rose-400 text-[11px]"
                        >
                          Eliminar
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

      {/* TAB 3: EXPENSES TABLE */}
      {activeTab === 'expenses' && (
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-semibold">
                  <th className="p-4">Fecha</th>
                  <th className="p-4">Concepto del Gasto</th>
                  <th className="p-4">Categoría</th>
                  <th className="p-4">Método</th>
                  <th className="p-4">Notas</th>
                  <th className="p-4 text-right">Monto</th>
                  <th className="p-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {expenses.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-4 text-slate-300">{exp.date}</td>
                    <td className="p-4 font-bold text-slate-100">{exp.title}</td>
                    <td className="p-4">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {exp.category}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400">{exp.method}</td>
                    <td className="p-4 text-slate-400 text-[11px]">{exp.notes || '—'}</td>
                    <td className="p-4 text-right font-bold text-rose-400 text-sm font-display">
                      -{formatMoney(exp.amount || 0)}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm('¿Eliminar este registro de gasto?')) {
                            deleteExpense(exp.id);
                          }
                        }}
                        className="text-slate-500 hover:text-rose-400 text-[11px]"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: RECEIVABLES / PENDING BALANCES */}
      {activeTab === 'receivables' && (
        <div className="space-y-4">
          <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-slate-100 font-display mb-1">
              Saldos Pendientes de Cobro por Proyecto
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Clientes que tienen saldo adeudado para liquidar o anticipar entregas.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                    <th className="pb-3">Proyecto</th>
                    <th className="pb-3">Cliente</th>
                    <th className="pb-3">Total Proyecto</th>
                    <th className="pb-3">Pagado</th>
                    <th className="pb-3">Saldo Deudor</th>
                    <th className="pb-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {pendingProjects.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 font-bold text-slate-100">{item.name}</td>
                      <td className="py-3 text-slate-300">
                        {item.client?.company || item.client?.name || 'Particular'}
                      </td>
                      <td className="py-3 font-semibold text-slate-200">{formatMoney(item.price)}</td>
                      <td className="py-3 text-emerald-400 font-semibold">
                        {formatMoney(item.paidAmount || 0)}
                      </td>
                      <td className="py-3 font-bold text-amber-400 font-display">
                        {formatMoney(item.pending)}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            setIsIncomeModalOpen(true);
                          }}
                          className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold text-[11px] transition-colors"
                        >
                          Cobrar Saldo
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Income & Expense Modals */}
      <IncomeModal
        isOpen={isIncomeModalOpen}
        onClose={() => setIsIncomeModalOpen(false)}
        onSave={addIncome}
      />
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSave={addExpense}
      />
    </div>
  );
};
