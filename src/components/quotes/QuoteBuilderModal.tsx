import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, DollarSign, FileText, User, Calendar, Percent } from 'lucide-react';
import { Quote, QuoteItem, QuoteStatus } from '../../types';
import { useApp } from '../../context/AppContext';

interface QuoteBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  quoteToEdit?: Quote | null;
}

export const QuoteBuilderModal: React.FC<QuoteBuilderModalProps> = ({
  isOpen,
  onClose,
  onSave,
  quoteToEdit,
}) => {
  const { clients, services } = useApp();

  const [clientId, setClientId] = useState('');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [expiryDate, setExpiryDate] = useState(
    new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]
  );
  const [status, setStatus] = useState<QuoteStatus>('Borrador');
  const [taxRate, setTaxRate] = useState(0); // 0% or 18% ITBIS
  const [discountPercent, setDiscountPercent] = useState(0);
  const [notes, setNotes] = useState('Condiciones: 50% de anticipo al aprobar y 50% contra entrega final satisfactoria.');
  const [terms, setTerms] = useState('Validez de 15 días. Incluye revisiones pactadas y soporte.');

  const [items, setItems] = useState<QuoteItem[]>([
    {
      id: 'item-1',
      description: 'Desarrollo Web Full-Stack',
      quantity: 1,
      unitPrice: 1800,
      discount: 0,
      total: 1800,
    },
  ]);

  useEffect(() => {
    if (quoteToEdit) {
      setClientId(quoteToEdit.clientId);
      setIssueDate(quoteToEdit.issueDate);
      setExpiryDate(quoteToEdit.expiryDate);
      setStatus(quoteToEdit.status);
      setTaxRate(quoteToEdit.taxRate || 0);
      setDiscountPercent(quoteToEdit.discountTotal ? Math.round((quoteToEdit.discountTotal / (quoteToEdit.subtotal || 1)) * 100) : 0);
      setNotes(quoteToEdit.notes || '');
      setTerms(quoteToEdit.terms || '');
      setItems(quoteToEdit.items || []);
    } else {
      setClientId(clients[0]?.id || '');
      setIssueDate(new Date().toISOString().split('T')[0]);
      setExpiryDate(new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0]);
      setStatus('Borrador');
      setTaxRate(0);
      setDiscountPercent(0);
      setNotes('Condiciones: 50% de anticipo al aprobar y 50% contra entrega final.');
      setTerms('Validez de 15 días. Incluye revisiones pactadas.');
      setItems([
        {
          id: 'item-1',
          description: services[0]?.name || 'Servicio Profesional DevJos',
          quantity: 1,
          unitPrice: services[0]?.basePrice || 1200,
          discount: 0,
          total: services[0]?.basePrice || 1200,
        },
      ]);
    }
  }, [quoteToEdit, isOpen, clients, services]);

  if (!isOpen) return null;

  // Item management
  const handleItemChange = (index: number, field: keyof QuoteItem, val: any) => {
    const updated = [...items];
    const item = { ...updated[index], [field]: val };
    item.total = item.quantity * item.unitPrice;
    updated[index] = item;
    setItems(updated);
  };

  const handleSelectService = (index: number, serviceId: string) => {
    const s = services.find((srv) => srv.id === serviceId);
    if (!s) return;
    const updated = [...items];
    updated[index] = {
      ...updated[index],
      serviceId: s.id,
      description: s.name,
      unitPrice: s.basePrice,
      discount: 0,
      total: updated[index].quantity * s.basePrice,
    };
    setItems(updated);
  };

  const addItemRow = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        description: '',
        quantity: 1,
        unitPrice: 0,
        discount: 0,
        total: 0,
      },
    ]);
  };

  const removeItemRow = (index: number) => {
    if (items.length <= 1) return;
    setItems(items.filter((_, i) => i !== index));
  };

  // Calculations
  const subtotal = items.reduce((sum, item) => sum + (item.total || 0), 0);
  const discountTotal = (subtotal * discountPercent) / 100;
  const taxableAmount = Math.max(0, subtotal - discountTotal);
  const taxAmount = (taxableAmount * taxRate) / 100;
  const total = taxableAmount + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;

    onSave({
      clientId,
      issueDate,
      expiryDate,
      status,
      items,
      subtotal,
      discountTotal,
      taxRate,
      taxAmount,
      total,
      notes,
      terms,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div
        className="w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h3 className="font-display font-bold text-base text-white">
              {quoteToEdit ? `Editar Cotización ${quoteToEdit.quoteNumber}` : 'Crear Nueva Cotización'}
            </h3>
            <p className="text-xs text-slate-400">Genera presupuestos automáticos con desglose y exportación</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Client & Date info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-950/50 border border-slate-800">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Cliente Receptor *
              </label>
              <select
                required
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              >
                <option value="">Selecciona un cliente</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.company ? `(${c.company})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Fecha de Emisión
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Fecha de Vencimiento
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          {/* Line Items Table */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Conceptos / Servicios
              </h4>
              <button
                type="button"
                onClick={addItemRow}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Agregar Ítem
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div
                  key={item.id || index}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2"
                >
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    {/* Quick Service Picker */}
                    <select
                      onChange={(e) => handleSelectService(index, e.target.value)}
                      defaultValue=""
                      className="w-full sm:w-44 bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-[11px] text-cyan-400 focus:outline-none"
                    >
                      <option value="" disabled>
                        Importar del Catálogo
                      </option>
                      {services.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} (${s.basePrice})
                        </option>
                      ))}
                    </select>

                    <input
                      type="text"
                      placeholder="Descripción del entregable o servicio..."
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className="flex-1 w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none"
                    />

                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <div className="w-20">
                        <input
                          type="number"
                          min="1"
                          placeholder="Cant."
                          value={item.quantity}
                          onChange={(e) =>
                            handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-center text-slate-100"
                        />
                      </div>

                      <div className="w-28 relative">
                        <span className="absolute left-2 top-1.5 text-[11px] text-slate-400">$</span>
                        <input
                          type="number"
                          min="0"
                          placeholder="Precio"
                          value={item.unitPrice}
                          onChange={(e) =>
                            handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)
                          }
                          className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-5 pr-2 py-1.5 text-xs text-slate-100"
                        />
                      </div>

                      <span className="w-24 text-right font-bold text-xs text-slate-200">
                        ${(item.total || 0).toLocaleString()}
                      </span>

                      {items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItemRow(index)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals and Discounts Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Notas de Pago & Métodos Aceptados
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Términos & Condiciones
                </label>
                <textarea
                  rows={2}
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none resize-none"
                />
              </div>
            </div>

            {/* Calculations right */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal Bruto:</span>
                <span className="font-semibold text-slate-200">${(subtotal || 0).toLocaleString()} USD</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Descuento (%):</span>
                <div className="flex items-center gap-1 w-24">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(parseFloat(e.target.value) || 0)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-right text-slate-200"
                  />
                  <span className="text-slate-400">%</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Impuestos (ITBIS / IVA):</span>
                <select
                  value={taxRate}
                  onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200"
                >
                  <option value={0}>0% (Exento)</option>
                  <option value={18}>18% (ITBIS República Dominicana)</option>
                  <option value={16}>16% (IVA estándar)</option>
                </select>
              </div>

              {taxAmount > 0 && (
                <div className="flex justify-between text-slate-400">
                  <span>Monto Impuesto:</span>
                  <span className="text-slate-200">+${(taxAmount || 0).toFixed(2)} USD</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                <span className="text-sm font-bold text-white font-display">TOTAL COTIZADO:</span>
                <span className="text-lg font-bold text-cyan-400 font-display">
                  ${(total || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
                </span>
              </div>
            </div>
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
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-purple-500/20 transition-all"
            >
              {quoteToEdit ? 'Guardar Cotización' : 'Crear Cotización'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
