import React, { useState } from 'react';
import { X, DollarSign, Calendar, Tag, CreditCard } from 'lucide-react';
import { Expense, ExpenseCategory, PaymentMethod } from '../../types';
import { useApp } from '../../context/AppContext';

interface ExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export const ExpenseModal: React.FC<ExpenseModalProps> = ({ isOpen, onClose, onSave }) => {
  const { currencyCode, currencySymbol } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    category: 'Software' as ExpenseCategory,
    amount: 150,
    date: new Date().toISOString().split('T')[0],
    method: 'Tarjeta' as PaymentMethod,
    receiptUrl: '',
    notes: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || formData.amount <= 0) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h3 className="font-display font-bold text-base text-white">Registrar Gasto del Estudio</h3>
            <p className="text-xs text-slate-400">Control de egresos operativos, suscripciones y equipo</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Concepto / Título del Gasto *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Suscripción Adobe Creative Cloud"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-rose-500 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Categoría</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-rose-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              >
                <option value="Software">Software & Licencias</option>
                <option value="Servicios">Servicios Básicos / Internet</option>
                <option value="Equipo">Equipos & Cámaras</option>
                <option value="Transporte">Transporte / Rodaje</option>
                <option value="Publicidad">Publicidad / Marketing</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Oficina">Oficina / Estudio</option>
                <option value="Otro">Otro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Monto Pagado ({currencyCode}) *
              </label>
              <div className="relative">
                <span className="text-xs font-semibold text-rose-400 absolute left-3 top-2.5">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  min="0.5"
                  step="any"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-rose-500 rounded-xl pl-12 pr-3 py-2 text-xs text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Método de Pago</label>
              <select
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value as PaymentMethod })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-rose-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              >
                <option value="Tarjeta">Tarjeta Corporativa</option>
                <option value="Transferencia">Transferencia Bancaria</option>
                <option value="Efectivo">Efectivo</option>
                <option value="PayPal">PayPal</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Fecha</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-rose-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Notas / Justificación</label>
            <textarea
              rows={2}
              placeholder="Detalle o proveedor..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-rose-500 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none resize-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-md shadow-rose-500/20 transition-all"
            >
              Registrar Gasto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
