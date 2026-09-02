import React, { useRef, useState, useEffect } from 'react';
import { X, Check, RotateCcw, PenTool, ShieldCheck, User, CreditCard } from 'lucide-react';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSignature: (signatureData: {
    signatureDataUrl: string;
    signedByName: string;
    signedDni: string;
    signedAt: string;
  }) => void;
  documentTitle?: string;
  defaultSignerName?: string;
}

export const SignatureModal: React.FC<SignatureModalProps> = ({
  isOpen,
  onClose,
  onConfirmSignature,
  documentTitle = 'Aprobación de Cotización / Contrato',
  defaultSignerName = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [signerName, setSignerName] = useState(defaultSignerName);
  const [signerDni, setSignerDni] = useState('');
  const [inkColor, setInkColor] = useState<'#0284c7' | '#0f172a' | '#2563eb'>('#0284c7');

  useEffect(() => {
    if (defaultSignerName) {
      setSignerName(defaultSignerName);
    }
  }, [defaultSignerName]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setHasDrawn(false);
      }, 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.beginPath();
    ctx.moveTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = inkColor;
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    ctx.lineTo((clientX - rect.left) * scaleX, (clientY - rect.top) * scaleY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerName.trim()) {
      alert('Por favor introduce tu nombre completo');
      return;
    }
    if (!hasDrawn) {
      alert('Por favor dibuja tu firma en el recuadro');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const signatureDataUrl = canvas.toDataURL('image/png');

    onConfirmSignature({
      signatureDataUrl,
      signedByName: signerName.trim(),
      signedDni: signerDni.trim() || 'N/A',
      signedAt: new Date().toLocaleString('es-DO', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-xs">
      <div
        className="w-full h-full sm:h-auto max-w-lg bg-slate-900 sm:border sm:border-slate-800 rounded-none sm:rounded-2xl shadow-2xl overflow-y-auto max-h-[92vh] sm:max-h-[88vh] animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <PenTool className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-white">Firma Digital del Cliente</h3>
              <p className="text-[11px] text-slate-400 truncate max-w-xs">{documentTitle}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleConfirm} className="p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nombre Completo del Firmante *
              </label>
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Ej. Ing. Carlos Santana"
                  value={signerName}
                  onChange={(e) => setSignerName(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Cédula / DNI / Pasaporte
              </label>
              <div className="relative">
                <CreditCard className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Ej. 001-1234567-8"
                  value={signerDni}
                  onChange={(e) => setSignerDni(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Signature Canvas Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <span>Dibuja tu firma con el dedo o ratón *</span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-400">Tinta:</span>
                <button
                  type="button"
                  onClick={() => setInkColor('#0284c7')}
                  className={`w-4 h-4 rounded-full bg-cyan-600 ${inkColor === '#0284c7' ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-900' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setInkColor('#0f172a')}
                  className={`w-4 h-4 rounded-full bg-slate-900 border border-slate-500 ${inkColor === '#0f172a' ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-900' : ''}`}
                />
                <button
                  type="button"
                  onClick={() => setInkColor('#2563eb')}
                  className={`w-4 h-4 rounded-full bg-blue-600 ${inkColor === '#2563eb' ? 'ring-2 ring-white ring-offset-1 ring-offset-slate-900' : ''}`}
                />
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="text-[11px] text-slate-400 hover:text-cyan-400 ml-2 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Limpiar
                </button>
              </div>
            </div>

            <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-white shadow-inner">
              <canvas
                ref={canvasRef}
                width={480}
                height={160}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-40 cursor-crosshair touch-none"
              />
              {!hasDrawn && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-slate-400 text-xs font-medium">
                  Firma aquí dentro
                </div>
              )}
              <div className="absolute bottom-2 left-4 right-4 border-b border-dashed border-slate-300 pointer-events-none" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Al estampar esta firma digital, confirmas la aceptación de los términos del documento y autorizas el inicio de los trabajos correspondientes en DevJos Studio.
            </span>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" /> Confirmar & Firmar Documento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
