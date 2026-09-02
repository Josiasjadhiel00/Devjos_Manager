import React from 'react';
import { X, Printer, CheckCircle, FileText } from 'lucide-react';
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

  const stampConfig =
    quote.status === 'Aprobada'
      ? { label: 'Aprobada', color: '#059669' }
      : quote.status === 'Rechazada'
      ? { label: 'Rechazada', color: '#e11d48' }
      : null;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-xs">
      <div
        className="w-full h-full sm:h-auto sm:max-w-4xl bg-slate-900 sm:border sm:border-slate-800 sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col sm:max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Actions — never printed */}
        <div className="no-print p-3 sm:p-4 border-b border-slate-800 flex items-center justify-between gap-2 bg-slate-950/80 flex-wrap">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <h3 className="font-display font-bold text-xs sm:text-sm text-white truncate">
              {quote.quoteNumber}
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

          <div className="flex items-center gap-2 ml-auto">
            {quote.status !== 'Aprobada' && (
              <button
                onClick={handleAccept}
                className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] sm:text-xs flex items-center gap-1.5 shadow-sm transition-colors whitespace-nowrap"
              >
                <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Aprobar & Generar Proyecto</span>
                <span className="sm:hidden">Aprobar</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] sm:text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Imprimir / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable / on-screen document */}
        <div className="flex-1 overflow-y-auto bg-slate-950 print:bg-white">
          <div className="print-document relative bg-slate-950 print:bg-white text-slate-100 print:text-slate-900 font-sans">
            <div className="doc-accent-bar" />

            {stampConfig && (
              <div className="doc-stamp" style={{ color: stampConfig.color, borderColor: stampConfig.color }}>
                {stampConfig.label}
              </div>
            )}

            <div className="p-5 sm:p-10 space-y-6 sm:space-y-8">
              {/* Header / Letterhead */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-5 sm:gap-6 border-b border-slate-800 print:border-slate-300 pb-5 sm:pb-6">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-[#168dda] via-[#7a3fc4] to-[#1bb7e8] flex items-center justify-center shadow-md shrink-0 print:shadow-none">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="font-display font-extrabold text-xl sm:text-2xl text-white print:text-slate-900 tracking-wide leading-tight">
                      {settings.studioName || 'DEVJOS STUDIO'}
                    </h1>
                    <p className="text-[11px] sm:text-xs text-slate-400 print:text-slate-500 mt-0.5">
                      {settings.tagline || 'Software, Multimedia & Photography Studio'}
                    </p>
                    <div className="text-[11px] text-slate-400 print:text-slate-500 mt-2.5 space-y-0.5">
                      <p>{settings.address || 'Santo Domingo, República Dominicana'}</p>
                      <p>{settings.email || 'contacto@devjos.com'} · {settings.whatsapp || settings.phone || '+1 (809) 555-0199'}</p>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right space-y-1.5 shrink-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 print:text-slate-400">
                    Cotización
                  </p>
                  <div className="inline-block px-3 py-1 bg-cyan-500/10 print:bg-cyan-50 border border-cyan-500/30 print:border-cyan-300 text-cyan-400 print:text-cyan-700 font-mono font-bold text-sm rounded-lg">
                    {quote.quoteNumber}
                  </div>
                  <p className="text-[11px] text-slate-400 print:text-slate-500">
                    Emisión: <span className="font-semibold text-slate-200 print:text-slate-800">{quote.issueDate}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 print:text-slate-500">
                    Válida hasta: <span className="font-semibold text-slate-200 print:text-slate-800">{quote.expiryDate}</span>
                  </p>
                </div>
              </div>

              {/* Client Recipient Info */}
              <div className="print-avoid-break p-4 rounded-xl bg-slate-900/60 print:bg-slate-50 border border-slate-800/80 print:border-slate-200">
                <h4 className="text-[10px] font-bold text-slate-400 print:text-slate-500 uppercase tracking-wider mb-2">
                  Cotizado para
                </h4>
                <h3 className="text-base font-bold text-white print:text-slate-900">{client?.name || 'Cliente'}</h3>
                {client?.company && (
                  <p className="text-xs text-cyan-400 print:text-cyan-700 font-semibold">{client.company}</p>
                )}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-2 text-xs text-slate-400 print:text-slate-600">
                  {client?.email && <p className="truncate">{client.email}</p>}
                  {(client?.phone || client?.whatsapp) && <p>{client?.phone || client?.whatsapp}</p>}
                  {client?.address && <p className="sm:col-span-2">{client.address}</p>}
                </div>
              </div>

              {/* Items Table — horizontally scrollable on small screens */}
              <div className="print-avoid-break -mx-5 sm:mx-0 overflow-x-auto">
                <table className="w-full min-w-[520px] sm:min-w-0 text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-800 print:border-slate-300 text-slate-400 print:text-slate-500 font-bold uppercase tracking-wider">
                      <th className="py-2.5 px-5 sm:px-3">Concepto / Entregable</th>
                      <th className="py-2.5 px-3 text-center w-16">Cant.</th>
                      <th className="py-2.5 px-3 text-right w-24">P. Unit.</th>
                      <th className="py-2.5 px-5 sm:px-3 text-right w-28">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 print:divide-slate-200">
                    {quote.items?.map((item, idx) => (
                      <tr key={item.id || idx}>
                        <td className="py-3 px-5 sm:px-3">
                          <p className="font-semibold text-slate-100 print:text-slate-900">{item.description}</p>
                        </td>
                        <td className="py-3 px-3 text-center text-slate-300 print:text-slate-700">{item.quantity}</td>
                        <td className="py-3 px-3 text-right text-slate-300 print:text-slate-700">
                          {formatMoney(item.unitPrice || 0)}
                        </td>
                        <td className="py-3 px-5 sm:px-3 text-right font-bold text-slate-100 print:text-slate-900">
                          {formatMoney(item.total || 0)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Calculations Summary */}
              <div className="print-avoid-break flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-slate-800 print:border-slate-300">
                <div className="space-y-3 flex-1 text-xs text-slate-400 print:text-slate-600 order-2 sm:order-1">
                  {quote.notes && (
                    <div>
                      <h5 className="font-bold text-slate-200 print:text-slate-800 uppercase text-[10px]">
                        Condiciones de Pago
                      </h5>
                      <p className="mt-0.5">{quote.notes}</p>
                    </div>
                  )}
                  {quote.terms && (
                    <div>
                      <h5 className="font-bold text-slate-200 print:text-slate-800 uppercase text-[10px]">
                        Términos & Validez
                      </h5>
                      <p className="mt-0.5">{quote.terms}</p>
                    </div>
                  )}
                </div>

                <div className="w-full sm:w-72 space-y-2 p-4 rounded-xl bg-slate-900/60 print:bg-slate-50 border border-slate-800/80 print:border-slate-200 text-xs order-1 sm:order-2">
                  <div className="flex justify-between text-slate-400 print:text-slate-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-slate-200 print:text-slate-900">{formatMoney(quote.subtotal || 0)}</span>
                  </div>

                  {quote.discountTotal > 0 && (
                    <div className="flex justify-between text-rose-400 print:text-rose-600">
                      <span>Descuento</span>
                      <span>-{formatMoney(quote.discountTotal || 0)}</span>
                    </div>
                  )}

                  {quote.taxAmount > 0 && (
                    <div className="flex justify-between text-slate-400 print:text-slate-600">
                      <span>Impuesto ({quote.taxRate}%)</span>
                      <span className="text-slate-200 print:text-slate-900">+{formatMoney(quote.taxAmount || 0)}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800 print:border-slate-300 flex justify-between items-center text-sm font-bold">
                    <span className="text-white print:text-slate-900">TOTAL</span>
                    <span className="text-cyan-400 print:text-cyan-700 text-base font-display">
                      {formatMoney(quote.total || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-5 border-t border-slate-800 print:border-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 text-[10px] text-slate-500 print:text-slate-400">
                <p>Documento generado por {settings.studioName || 'DevJos Studio'} — no requiere firma para ser válido.</p>
                <p>Página 1 de 1</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
