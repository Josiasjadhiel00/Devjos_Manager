import React, { useState } from 'react';
import {
  Receipt,
  Search,
  Plus,
  Filter,
  DollarSign,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Download,
  CreditCard,
  Building2,
  FileText,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard, Badge } from '../ui/StatCard';
import { PaymentMethod } from '../../types';

export const PaymentsView: React.FC = () => {
  const { payments, projects, clients, incomes, addIncome, settings } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedPaymentProject, setSelectedPaymentProject] = useState<string | null>(null);

  // New payment modal state
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Transferencia');
  const [payNote, setPayNote] = useState('');
  const [targetProjectId, setTargetProjectId] = useState<string>('');

  const totalContracted = payments.reduce((acc, p) => acc + p.totalContract, 0);
  const totalCollected = payments.reduce((acc, p) => acc + p.totalPaid, 0);
  const totalPending = payments.reduce((acc, p) => acc + p.totalPending, 0);
  const paidCount = payments.filter(p => p.status === 'Pagado').length;

  const filteredPayments = payments.filter(p => {
    const proj = projects.find(pr => pr.id === p.projectId);
    const client = clients.find(cl => cl.id === p.clientId);
    const text = `${proj?.name || ''} ${client?.name || ''} ${client?.company || ''}`.toLowerCase();
    const matchesSearch = text.includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenPayModal = (projectId: string, defaultAmount: number = 0) => {
    setTargetProjectId(projectId);
    setPayAmount(defaultAmount);
    setPayNote('Abono registrado a factura / proyecto');
    setIsPayModalOpen(true);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetProjectId || payAmount <= 0) return;

    const proj = projects.find(p => p.id === targetProjectId);
    if (!proj) return;

    addIncome({
      clientId: proj.clientId,
      projectId: proj.id,
      amount: Number(payAmount),
      date: new Date().toISOString().split('T')[0],
      method: payMethod,
      description: payNote || `Abono a proyecto ${proj.name}`,
    });

    setIsPayModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header & KPI Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
            <Receipt className="w-5 h-5 text-cyan-400" />
            Control de Facturas & Cobros
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Monitorea anticipos (50%), saldos pendientes y pagos registrados por proyecto
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenPayModal(projects[0]?.id || '')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Cobro</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Contratado"
          value={`$${(totalContracted || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={Receipt}
          description="Suma total de presupuestos aprobados"
          iconColor="text-blue-400"
          iconBg="bg-blue-500/10"
        />
        <StatCard
          title="Cobrado / Recaudado"
          value={`$${(totalCollected || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={TrendingUp}
          description="Dinero ingresado a cuentas del estudio"
          iconColor="text-emerald-400"
          iconBg="bg-emerald-500/10"
        />
        <StatCard
          title="Por Cobrar (Pendiente)"
          value={`$${(totalPending || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          icon={Clock}
          description="Cuentas por cobrar a clientes"
          iconColor="text-amber-400"
          iconBg="bg-amber-500/10"
        />
        <StatCard
          title="Proyectos Liquidados"
          value={`${paidCount} de ${payments.length}`}
          icon={CheckCircle2}
          description="Proyectos 100% pagados"
          iconColor="text-cyan-400"
          iconBg="bg-cyan-500/10"
        />
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por cliente o proyecto..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Estado:
          </span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 text-xs focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            <option value="all">Todos los estados</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Parcial">Parcial (Anticipo)</option>
            <option value="Pagado">Pagado Completo</option>
          </select>
        </div>
      </div>

      {/* Payment Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Proyecto / Cliente</th>
                <th className="px-4 py-3.5">Monto Contrato</th>
                <th className="px-4 py-3.5">Anticipo / Pagado</th>
                <th className="px-4 py-3.5">Saldo Pendiente</th>
                <th className="px-4 py-3.5">Progreso de Pago</th>
                <th className="px-4 py-3.5">Estado</th>
                <th className="px-5 py-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    No se encontraron registros de cobros o facturas.
                  </td>
                </tr>
              ) : (
                filteredPayments.map(payment => {
                  const project = projects.find(p => p.id === payment.projectId);
                  const client = clients.find(c => c.id === payment.clientId);
                  const percent = payment.totalContract > 0 ? Math.min(100, Math.round((payment.totalPaid / payment.totalContract) * 100)) : 0;

                  return (
                    <tr key={payment.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="font-semibold text-white text-xs">
                          {project?.name || 'Proyecto General'}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Building2 className="w-3 h-3 text-cyan-400" />
                          <span>{client?.name}</span>
                          {client?.company && <span className="text-slate-500">({client.company})</span>}
                        </div>
                      </td>
                      <td className="px-4 py-4 font-mono font-bold text-slate-200">
                        ${(payment.totalContract || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-4 font-mono font-semibold text-emerald-400">
                        ${(payment.totalPaid || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-4 font-mono font-semibold text-amber-400">
                        ${(payment.totalPending || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-4 py-4 w-44">
                        <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1 font-mono">
                          <span>{percent}%</span>
                          <span>{payment.totalPending === 0 ? 'Liquidado' : 'Pendiente'}</span>
                        </div>
                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              percent >= 100
                                ? 'bg-emerald-500'
                                : percent >= 50
                                ? 'bg-cyan-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <Badge
                          variant={
                            payment.status === 'Pagado'
                              ? 'emerald'
                              : payment.status === 'Parcial'
                              ? 'blue'
                              : 'amber'
                          }
                        >
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => handleOpenPayModal(payment.projectId, payment.totalPending)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[11px] font-semibold transition-colors"
                        >
                          + Registrar Abono
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Payment Modal */}
      {isPayModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-white">Registrar Abono o Cobro</h3>
                  <p className="text-[11px] text-slate-400">Actualiza el saldo del proyecto e ingresa a finanzas</p>
                </div>
              </div>
              <button
                onClick={() => setIsPayModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRecordPayment} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Proyecto a Acreditar
                </label>
                <select
                  value={targetProjectId}
                  onChange={e => {
                    setTargetProjectId(e.target.value);
                    const pay = payments.find(p => p.projectId === e.target.value);
                    if (pay) setPayAmount(pay.totalPending);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  required
                >
                  <option value="">Selecciona un proyecto...</option>
                  {projects.map(p => {
                    const pay = payments.find(paym => paym.projectId === p.id);
                    return (
                      <option key={p.id} value={p.id}>
                        {p.name} (Pendiente: ${pay?.totalPending || 0})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Monto a Registrar ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={payAmount}
                    onChange={e => setPayAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Método de Pago
                  </label>
                  <select
                    value={payMethod}
                    onChange={e => setPayMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                  >
                    <option value="Transferencia">Transferencia Bancaria</option>
                    <option value="Efectivo">Efectivo</option>
                    <option value="Tarjeta">Tarjeta Débito/Crédito</option>
                    <option value="PayPal">PayPal</option>
                    <option value="Cripto">Cripto (USDT/BTC)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nota / Concepto del Pago
                </label>
                <input
                  type="text"
                  value={payNote}
                  onChange={e => setPayNote(e.target.value)}
                  placeholder="Ej: Anticipo 50% inicio de proyecto"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPayModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-md shadow-emerald-500/20"
                >
                  Guardar Pago
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
