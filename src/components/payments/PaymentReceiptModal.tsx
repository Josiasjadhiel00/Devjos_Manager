import React from 'react';
import { X, Printer, Download, CheckCircle2, Building, Receipt, QrCode, Phone, Mail } from 'lucide-react';
import { ProjectPayment, Client, Project } from '../../types';
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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 print:hidden">
          <div className="flex items-center gap-2">
            <Receipt className="w-4 h-4 text-cyan-400" />
            <h3 className="font-display font-bold text-sm text-white">Comprobante Oficial de Pago</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" /> Imprimir / PDF
            </button>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-slate-950 text-slate-100 font-sans space-y-6 print:p-0 print:bg-white print:text-black">
          {/* Header */}
          <div className="flex justify-between items-start border-b border-slate-800 pb-6 print:border-gray-300">
            <div>
              <h1 className="font-display font-bold text-xl text-white tracking-wider print:text-black">
                {settings.studioName || 'DEVJOS STUDIO'}
              </h1>
              <p className="text-xs text-slate-400 print:text-gray-600">
                {settings.tagline || 'Software, Multimedia & Photography Studio'}
              </p>
              <p className="text-xs text-slate-500 mt-1 print:text-gray-600">
                RNC / Tax ID: {settings.taxId || '132-45678-9'} • {settings.address || 'Santo Domingo, R.D.'}
              </p>
            </div>

            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono font-bold text-xs rounded-lg print:bg-gray-100 print:text-black">
                {receiptNumber}
              </div>
              <p className="text-[11px] text-slate-400 mt-1 print:text-gray-600">Fecha: {transactionDate}</p>
            </div>
          </div>

          {/* Client & Project Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900/60 border border-slate-800 print:bg-gray-50 print:border-gray-300">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider print:text-gray-600">
                RECIBIDO DE (CLIENTE):
              </p>
              <h3 className="text-sm font-bold text-white mt-0.5 print:text-black">{client?.name || 'Cliente'}</h3>
              <p className="text-xs text-cyan-400 print:text-blue-700">{client?.company || 'Particular'}</p>
              <p className="text-xs text-slate-400 mt-1 print:text-gray-600">Email: {client?.email || 'N/A'}</p>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider print:text-gray-600">
                PROYECTO / CONTRATO:
              </p>
              <h3 className="text-sm font-bold text-white mt-0.5 print:text-black">
                {project?.name || 'Servicio Profesional'}
              </h3>
              <p className="text-xs text-slate-400 print:text-gray-600">
                Categoría: {project?.category || 'Desarrollo & Multimedia'}
              </p>
              <p className="text-xs text-slate-400 mt-1 print:text-gray-600">
                Método: <span className="font-semibold text-slate-200 print:text-black">{paymentMethod}</span>
              </p>
            </div>
          </div>

          {/* Amounts Table */}
          <div className="space-y-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider print:border-gray-300 print:text-gray-700">
                  <th className="py-2 px-3">Concepto</th>
                  <th className="py-2 px-3 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 print:divide-gray-200">
                <tr>
                  <td className="py-3 px-3">
                    <p className="font-semibold text-slate-200 print:text-black">
                      Abono / Pago aplicado a {project?.name || 'Factura'}
                    </p>
                    <p className="text-[11px] text-slate-400 print:text-gray-600">
                      Liquidación de servicios audiovisuales y tecnológicos
                    </p>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-emerald-400 text-sm print:text-black">
                    {formatMoney(amountPaid || 0)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Balance summary */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-800 print:border-gray-300">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-white p-1 rounded-lg flex items-center justify-center shrink-0 border border-slate-700">
                {/* Simulated QR Code */}
                <div className="w-full h-full border-2 border-dashed border-slate-900 flex flex-col items-center justify-center text-[8px] text-slate-900 font-mono font-bold leading-none text-center">
                  <span>DEVJOS</span>
                  <span>VERIFIED</span>
                  <span>2026</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-400 print:text-gray-600">
                <p className="font-bold text-slate-300 print:text-black">Autenticidad Garantizada</p>
                <p>Verificado electrónicamente por el sistema contable de DevJos Studio.</p>
              </div>
            </div>

            <div className="w-full sm:w-60 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1.5 print:bg-gray-50 print:border-gray-300">
              <div className="flex justify-between text-slate-400 print:text-gray-600">
                <span>Total Contrato:</span>
                <span className="font-mono text-slate-200 print:text-black">
                  {formatMoney(payment.totalContract || 0)}
                </span>
              </div>
              <div className="flex justify-between text-slate-400 print:text-gray-600">
                <span>Total Pagado a la fecha:</span>
                <span className="font-mono text-emerald-400 font-semibold print:text-black">
                  {formatMoney(payment.totalPaid || 0)}
                </span>
              </div>
              <div className="pt-1.5 border-t border-slate-800 flex justify-between font-bold text-white print:text-black">
                <span>Saldo Pendiente:</span>
                <span className="font-mono text-cyan-400">
                  {formatMoney(payment.totalPending || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer signature stamp */}
          <div className="pt-6 border-t border-slate-800 flex justify-between items-end text-xs text-slate-400 print:border-gray-300 print:text-gray-600">
            <div>
              <p>Email: {settings.email || 'contacto@devjos.com'}</p>
              <p>WhatsApp: {settings.whatsapp || settings.phone || '+1 (809) 555-0199'}</p>
            </div>
            <div className="text-center">
              <div className="w-36 border-b border-slate-600 mx-auto mb-1 print:border-black" />
              <p className="text-[10px] uppercase font-bold text-slate-300 print:text-black">
                DevJos Studio • Administración
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
