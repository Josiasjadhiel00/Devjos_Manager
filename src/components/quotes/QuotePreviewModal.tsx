import React from 'react';
import { X, Printer, Download, CheckCircle, Mail, Building, FileText, Send } from 'lucide-react';
import { Quote } from '../../types';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/StatCard';

interface QuotePreviewModalProps {
  quoteId: string | null;
  onClose: () => void;
}

export const QuotePreviewModal: React.FC<QuotePreviewModalProps> = ({ quoteId, onClose }) => {
  const { quotes, clients, settings, updateQuoteStatus, formatMoney } = useApp();

  if (!quoteId) return null;
  const quote = quotes.find((q) => q.id === quoteId);
  if (!quote) return null;

  const client = clients.find((c) => c.id === quote.clientId);

  const handlePrint = () => {
    window.print();
  };

  const handleAccept = () => {
    updateQuoteStatus(quote.id, 'Aprobada', true);
    alert(
      `¡Cotización ${quote.quoteNumber} aceptada! Se ha generado automáticamente el proyecto y la orden de trabajo en DevJos Manager.`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Actions */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 print:hidden">
          <div className="flex items-center gap-3">
            <h3 className="font-display font-bold text-sm text-white">
              Vista Previa: {quote.quoteNumber}
            </h3>
            <Badge
              variant={
                quote.status === 'Aprobada'
                  ? 'success'
                  : quote.status === 'Enviada'
                  ? 'cyan'
                  : quote.status === 'Rechazada'
                  ? 'danger'
                  : 'neutral'
              }
              size="sm"
            >
              {quote.status}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {quote.status !== 'Aprobada' && (
              <button
                onClick={handleAccept}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
              >
                <CheckCircle className="w-4 h-4" /> Aprobar & Generar Proyecto
              </button>
            )}

            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-4 h-4" /> Imprimir / PDF
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Page */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 bg-slate-950 text-slate-100 font-sans space-y-8 print:p-0 print:bg-white print:text-black">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-slate-800 pb-6 print:border-gray-300">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 print:bg-cyan-600" />
                <h1 className="font-display font-bold text-2xl text-white tracking-wider print:text-black">
                  {settings.studioName || 'DEVJOS STUDIO'}
                </h1>
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono print:text-gray-600">
                {settings.tagline || 'Software, Multimedia & Photography Studio'}
              </p>
              <div className="text-xs text-slate-400 mt-3 space-y-0.5 print:text-gray-600">
                <p>{settings.address || 'Santo Domingo, República Dominicana'}</p>
                <p>Email: {settings.email || 'contacto@devjos.com'}</p>
                <p>WhatsApp: {settings.whatsapp || settings.phone || '+1 (809) 555-0199'}</p>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-1">
              <div className="inline-block px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 font-mono font-bold text-sm rounded-lg print:bg-gray-100 print:text-black">
                {quote.quoteNumber}
              </div>
              <p className="text-xs text-slate-400 print:text-gray-600">
                Fecha de Emisión: <span className="font-semibold text-slate-200 print:text-black">{quote.issueDate}</span>
              </p>
              <p className="text-xs text-slate-400 print:text-gray-600">
                Válida hasta: <span className="font-semibold text-slate-200 print:text-black">{quote.expiryDate}</span>
              </p>
            </div>
          </div>

          {/* Client Recipient Info */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 print:bg-gray-50 print:border-gray-300">
            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 print:text-gray-700">
              COTIZADO PARA:
            </h4>
            <h3 className="text-base font-bold text-white print:text-black">{client?.name || 'Cliente'}</h3>
            <p className="text-xs text-cyan-400 font-semibold print:text-blue-700">{client?.company}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 text-xs text-slate-400 print:text-gray-600">
              <p>Email: {client?.email}</p>
              <p>Tel: {client?.phone || client?.whatsapp}</p>
              {client?.address && <p className="sm:col-span-2">Dirección: {client.address}</p>}
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider print:border-gray-300 print:text-gray-700">
                  <th className="py-2.5 px-3">Concepto / Entregable</th>
                  <th className="py-2.5 px-3 text-center w-20">Cant.</th>
                  <th className="py-2.5 px-3 text-right w-28">Precio Unit.</th>
                  <th className="py-2.5 px-3 text-right w-28">Subtotal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 print:divide-gray-200">
                {quote.items?.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-100 print:text-black">{item.description}</p>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-300 print:text-gray-800">{item.quantity}</td>
                    <td className="py-3 px-3 text-right text-slate-300 print:text-gray-800">
                      {formatMoney(item.unitPrice || 0)}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-100 print:text-black">
                      {formatMoney(item.total || 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculations Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-slate-800 print:border-gray-300">
            <div className="space-y-3 flex-1 text-xs text-slate-400 print:text-gray-600">
              {quote.notes && (
                <div>
                  <h5 className="font-bold text-slate-200 uppercase text-[10px] print:text-black">
                    Condiciones de Pago:
                  </h5>
                  <p className="mt-0.5">{quote.notes}</p>
                </div>
              )}
              {quote.terms && (
                <div>
                  <h5 className="font-bold text-slate-200 uppercase text-[10px] print:text-black">
                    Términos & Validez:
                  </h5>
                  <p className="mt-0.5">{quote.terms}</p>
                </div>
              )}
            </div>

            <div className="w-full sm:w-72 space-y-2 p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs print:bg-gray-50 print:border-gray-300">
              <div className="flex justify-between text-slate-400 print:text-gray-600">
                <span>Subtotal:</span>
                <span className="font-medium text-slate-200 print:text-black">{formatMoney(quote.subtotal || 0)}</span>
              </div>

              {quote.discountTotal > 0 && (
                <div className="flex justify-between text-rose-400">
                  <span>Descuento:</span>
                  <span>-{formatMoney(quote.discountTotal || 0)}</span>
                </div>
              )}

              {quote.taxAmount > 0 && (
                <div className="flex justify-between text-slate-400 print:text-gray-600">
                  <span>Impuesto ({quote.taxRate}%):</span>
                  <span className="text-slate-200 print:text-black">+{formatMoney(quote.taxAmount || 0)}</span>
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-sm font-bold print:border-gray-300">
                <span className="text-white print:text-black">TOTAL:</span>
                <span className="text-cyan-400 text-base font-display print:text-black">
                  {formatMoney(quote.total || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
