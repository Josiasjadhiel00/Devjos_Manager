import React from 'react';
import { X, Printer, Receipt } from 'lucide-react';
import { ProjectPayment } from '../../types';
import { useApp } from '../../context/AppContext';

interface PaymentReceiptModalProps {
  payment: ProjectPayment | null;
  onClose: () => void;
  specificAmount?: number;
  specificMethod?: string;
  specificDate?: string;
}

export const PaymentReceiptModal: React.FC<PaymentReceiptModalProps> = ({
  payment,
  onClose,
  specificAmount,
  specificMethod,
  specificDate,
}) => {
  const { clients, projects, settings, formatMoney } = useApp();

  if (!payment) return null;

  const client = clients.find((c) => c.id === payment.clientId);
  const project = projects.find((p) => p.id === payment.projectId);

  const receiptNumber = `REC-${payment.id.toUpperCase()}-${new Date().getFullYear()}`;
  const transactionDate = specificDate || payment.lastPaymentDate || new Date().toISOString().split('T')[0];
  const amountPaid = specificAmount !== undefined ? specificAmount : payment.totalPaid;
  const paymentMethod = specificMethod || 'Transferencia Bancaria';
  const isFullyPaid = (payment.totalPending || 0) <= 0;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-xs">
      <div
        className="w-full h-full sm:h-auto sm:max-w-2xl bg-slate-900 sm:border sm:border-slate-800 sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col sm:max-h-[92vh] animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar — never printed */}
        <div className="no-print p-3 sm:p-4 border-b border-slate-800 flex items-center justify-between gap-2 bg-slate-950/80 flex-wrap">
          <div className="flex items-center gap-2 min-w-0">
            <Receipt className="w-4 h-4 text-cyan-400 shrink-0" />
            <h3 className="font-display font-bold text-xs sm:text-sm text-white truncate">Comprobante de Pago</h3>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handlePrint}
              className="px-2.5 sm:px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-[11px] sm:text-xs flex items-center gap-1.5 transition-colors shadow-sm whitespace-nowrap"
            >
              <Printer className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Imprimir / PDF
            </button>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable / on-screen document */}
        <div className="flex-1 overflow-y-auto bg-slate-950 print:bg-white">
          <div className="print-document relative bg-slate-950 print:bg-white text-slate-100 print:text-slate-900 font-sans">
            <div className="doc-accent-bar" />

            {isFullyPaid && (
              <div className="doc-stamp" style={{ color: '#059669', borderColor: '#059669' }}>
                Pagado
              </div>
            )}

            <div className="p-5 sm:p-8 space-y-5 sm:space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-slate-800 print:border-slate-300 pb-5 sm:pb-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#168dda] via-[#7a3fc4] to-[#1bb7e8] flex items-center justify-center shadow-md shrink-0 print:shadow-none">
                    <Receipt className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div>
                    <h1 className="font-display font-extrabold text-lg sm:text-xl text-white print:text-slate-900 tracking-wide">
                      {settings.studioName || 'DEVJOS STUDIO'}
                    </h1>
                    <p className="text-[11px] text-slate-400 print:text-slate-500">
                      {settings.tagline || 'Software, Multimedia & Photography Studio'}
                    </p>
                    <p className="text-[10px] text-slate-500 print:text-slate-400 mt-1">
                      RNC/Tax ID: {settings.taxId || '132-45678-9'} · {settings.address || 'Santo Domingo, R.D.'}
                    </p>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 print:text-slate-400">
                    Recibo
                  </p>
                  <div className="inline-block px-3 py-1 bg-emerald-500/10 print:bg-emerald-50 border border-emerald-500/30 print:border-emerald-300 text-emerald-400 print:text-emerald-700 font-mono font-bold text-xs rounded-lg">
                    {receiptNumber}
                  </div>
                  <p className="text-[11px] text-slate-400 print:text-slate-500 mt-1">Fecha: {transactionDate}</p>
                </div>
              </div>

              {/* Client & Project Box */}
              <div className="print-avoid-break grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-200">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 print:text-slate-500 uppercase tracking-wider">
                    Recibido de
                  </p>
                  <h3 className="text-sm font-bold text-white print:text-slate-900 mt-0.5">{client?.name || 'Cliente'}</h3>
                  {client?.company && <p className="text-xs text-cyan-400 print:text-cyan-700">{client.company}</p>}
                  {client?.email && <p className="text-xs text-slate-400 print:text-slate-500 mt-1 truncate">{client.email}</p>}
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 print:text-slate-500 uppercase tracking-wider">
                    Proyecto / Contrato
                  </p>
                  <h3 className="text-sm font-bold text-white print:text-slate-900 mt-0.5">
                    {project?.name || 'Servicio Profesional'}
                  </h3>
                  <p className="text-xs text-slate-400 print:text-slate-500">
                    {project?.category || 'Desarrollo & Multimedia'}
                  </p>
                  <p className="text-xs text-slate-400 print:text-slate-500 mt-1">
                    Método: <span className="font-semibold text-slate-200 print:text-slate-800">{paymentMethod}</span>
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className="print-avoid-break -mx-5 sm:mx-0 overflow-x-auto">
                <table className="w-full min-w-[420px] sm:min-w-0 text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b-2 border-slate-800 print:border-slate-300 text-slate-400 print:text-slate-500 font-bold uppercase tracking-wider">
                      <th className="py-2 px-5 sm:px-3">Concepto</th>
                      <th className="py-2 px-5 sm:px-3 text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 print:divide-slate-200">
                    <tr>
                      <td className="py-3 px-5 sm:px-3">
                        <p className="font-semibold text-slate-200 print:text-slate-900">
                          Abono aplicado a {project?.name || 'factura'}
                        </p>
                        <p className="text-[11px] text-slate-400 print:text-slate-500">
                          Liquidación de servicios audiovisuales y tecnológicos
                        </p>
                      </td>
                      <td className="py-3 px-5 sm:px-3 text-right font-bold text-emerald-400 print:text-emerald-700 text-sm">
                        {formatMoney(amountPaid || 0)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Balance summary */}
              <div className="print-avoid-break flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 pt-4 border-t border-slate-800 print:border-slate-300">
                <div className="flex items-center gap-3 order-2 sm:order-1">
                  <div className="text-[11px] text-slate-400 print:text-slate-500">
                    <p className="font-bold text-slate-300 print:text-slate-800">Autenticidad Garantizada</p>
                    <p>Verificado electrónicamente por el sistema contable de {settings.studioName || 'DevJos Studio'}.</p>
                  </div>
                </div>

                <div className="w-full sm:w-60 p-3 rounded-xl bg-slate-900/60 print:bg-slate-50 border border-slate-800 print:border-slate-200 text-xs space-y-1.5 order-1 sm:order-2">
                  <div className="flex justify-between text-slate-400 print:text-slate-500">
                    <span>Total Contrato</span>
                    <span className="font-mono text-slate-200 print:text-slate-900">
                      {formatMoney(payment.totalContract || 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-400 print:text-slate-500">
                    <span>Pagado a la fecha</span>
                    <span className="font-mono text-emerald-400 print:text-emerald-700 font-semibold">
                      {formatMoney(payment.totalPaid || 0)}
                    </span>
                  </div>
                  <div className="pt-1.5 border-t border-slate-800 print:border-slate-300 flex justify-between font-bold text-white print:text-slate-900">
                    <span>Saldo Pendiente</span>
                    <span className="font-mono text-cyan-400 print:text-cyan-700">
                      {formatMoney(payment.totalPending || 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer signature */}
              <div className="pt-5 border-t border-slate-800 print:border-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 text-[11px] text-slate-400 print:text-slate-500">
                <div>
                  <p>{settings.email || 'contacto@devjos.com'}</p>
                  <p>{settings.whatsapp || settings.phone || '+1 (809) 555-0199'}</p>
                </div>
                <div className="text-center self-center sm:self-auto">
                  <div className="w-36 border-b border-slate-600 print:border-slate-400 mx-auto mb-1" />
                  <p className="text-[10px] uppercase font-bold text-slate-300 print:text-slate-700">
                    {settings.studioName || 'DevJos Studio'} · Administración
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
