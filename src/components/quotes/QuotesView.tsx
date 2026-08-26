import React, { useState } from 'react';
import {
  FileText,
  Search,
  Plus,
  Filter,
  DollarSign,
  CheckCircle,
  Clock,
  Send,
  Eye,
  Edit2,
  Trash2,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/StatCard';
import { QuoteBuilderModal } from './QuoteBuilderModal';
import { QuotePreviewModal } from './QuotePreviewModal';
import { Quote, QuoteStatus } from '../../types';

export const QuotesView: React.FC = () => {
  const {
    quotes,
    clients,
    addQuote,
    updateQuote,
    deleteQuote,
    selectedQuoteId,
    setSelectedQuoteId,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [quoteToEdit, setQuoteToEdit] = useState<Quote | null>(null);

  const filteredQuotes = quotes.filter((q) => {
    const client = clients.find((c) => c.id === q.clientId);
    const matchesSearch =
      q.quoteNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client?.name && client.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (client?.company && client.company.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveQuote = (data: any) => {
    if (quoteToEdit) {
      updateQuote(quoteToEdit.id, data);
      setQuoteToEdit(null);
    } else {
      addQuote(data);
    }
  };

  const totalQuoted = quotes.reduce((sum, q) => sum + q.total, 0);
  const acceptedQuotes = quotes.filter((q) => q.status === 'Aceptada');
  const acceptedTotal = acceptedQuotes.reduce((sum, q) => sum + q.total, 0);
  const conversionRate = quotes.length > 0 ? Math.round((acceptedQuotes.length / quotes.length) * 100) : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Metric summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Total Cotizado</span>
            <FileText className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold text-white font-display">${(totalQuoted || 0).toLocaleString()} USD</p>
          <p className="text-[11px] text-slate-400">{quotes.length} cotizaciones emitidas</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Aceptadas & Aprobadas</span>
            <CheckCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400 font-display">${(acceptedTotal || 0).toLocaleString()} USD</p>
          <p className="text-[11px] text-slate-400">{acceptedQuotes.length} proyectos concretados</p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-semibold">Tasa de Conversión</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <p className="text-2xl font-bold text-cyan-400 font-display">{conversionRate}%</p>
          <p className="text-[11px] text-slate-400">Efectividad de cierre</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar por número o cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
            {['all', 'Borrador', 'Enviada', 'Aceptada', 'Rechazada', 'Vencida'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-purple-600 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {st === 'all' ? 'Todas' : st}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            setQuoteToEdit(null);
            setIsBuilderOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-purple-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" /> Nueva Cotización
        </button>
      </div>

      {/* Quotes Table */}
      <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-semibold">
                <th className="p-4">Número</th>
                <th className="p-4">Cliente</th>
                <th className="p-4">Fecha Emisión</th>
                <th className="p-4">Vencimiento</th>
                <th className="p-4">Estado</th>
                <th className="p-4">Total (USD)</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No se encontraron cotizaciones con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((q) => {
                  const client = clients.find((c) => c.id === q.clientId);
                  return (
                    <tr
                      key={q.id}
                      onClick={() => setSelectedQuoteId(q.id)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      <td className="p-4">
                        <span className="font-mono font-bold text-cyan-400 bg-slate-800 px-2 py-0.5 rounded">
                          {q.quoteNumber}
                        </span>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-slate-100">{client?.name || 'Cliente sin asignar'}</p>
                        <p className="text-[11px] text-slate-400">{client?.company || 'Particular'}</p>
                      </td>
                      <td className="p-4 text-slate-300">{q.issueDate}</td>
                      <td className="p-4 text-slate-300">{q.expiryDate}</td>
                      <td className="p-4">
                        <Badge
                          variant={
                            q.status === 'Aceptada'
                              ? 'success'
                              : q.status === 'Enviada'
                              ? 'info'
                              : q.status === 'Rechazada'
                              ? 'danger'
                              : 'warning'
                          }
                          size="sm"
                        >
                          {q.status}
                        </Badge>
                      </td>
                      <td className="p-4 font-bold text-slate-100 font-display">
                        ${(q.total || 0).toLocaleString()} USD
                      </td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedQuoteId(q.id)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-cyan-300 transition-colors"
                            title="Ver / Imprimir"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setQuoteToEdit(q);
                              setIsBuilderOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                            title="Editar"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`¿Eliminar la cotización ${q.quoteNumber}?`)) {
                                deleteQuote(q.id);
                              }
                            }}
                            className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                            title="Eliminar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quote Builder Modal */}
      <QuoteBuilderModal
        isOpen={isBuilderOpen || !!quoteToEdit}
        onClose={() => {
          setIsBuilderOpen(false);
          setQuoteToEdit(null);
        }}
        onSave={handleSaveQuote}
        quoteToEdit={quoteToEdit}
      />

      {/* Quote Preview & Print Modal */}
      <QuotePreviewModal
        quoteId={selectedQuoteId}
        onClose={() => setSelectedQuoteId(null)}
        onEdit={(q) => {
          setQuoteToEdit(q);
          setSelectedQuoteId(null);
        }}
      />
    </div>
  );
};
