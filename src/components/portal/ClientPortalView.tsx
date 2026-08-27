import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  FileText,
  Camera,
  FolderOpen,
  FolderKanban,
  Download,
  ExternalLink,
  MessageSquare,
  ThumbsUp,
  Heart,
  Eye,
  ShieldCheck,
  Building2,
  Clock,
  Send,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/StatCard';

export const ClientPortalView: React.FC = () => {
  const {
    clients,
    portalClientId,
    setPortalClientId,
    projects,
    quotes,
    photoSessions,
    files,
    updateQuote,
    setCurrentView,
    formatMoney,
  } = useApp();

  const activeClientId = portalClientId || clients[0]?.id || '';
  const currentClient = clients.find(c => c.id === activeClientId) || clients[0];

  const clientProjects = projects.filter(p => p.clientId === activeClientId);
  const clientQuotes = quotes.filter(q => q.clientId === activeClientId);
  const clientSessions = photoSessions.filter(s => s.clientId === activeClientId);
  const clientFiles = files.filter(f => f.clientId === activeClientId);

  const [activeTab, setActiveTab] = useState<'overview' | 'quotes' | 'gallery' | 'files'>('overview');
  const [selectedPhotoLikes, setSelectedPhotoLikes] = useState<Record<string, boolean>>({});
  const [approvalFeedback, setApprovalFeedback] = useState('');
  const [justApprovedQuoteId, setJustApprovedQuoteId] = useState<string | null>(null);

  const handleApproveQuote = (quoteId: string) => {
    updateQuote(quoteId, { status: 'Aprobada' });
    setJustApprovedQuoteId(quoteId);
    setTimeout(() => setJustApprovedQuoteId(null), 4000);
  };

  const togglePhotoLike = (photoId: string) => {
    setSelectedPhotoLikes(prev => ({
      ...prev,
      [photoId]: !prev[photoId],
    }));
  };

  if (!currentClient) {
    return (
      <div className="p-8 text-center bg-slate-900/60 rounded-2xl border border-slate-800 text-slate-400">
        No hay clientes registrados en el sistema. Registra un cliente primero.
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Studio Header Banner with Client Switcher */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/80 via-blue-950/60 to-purple-950/80 border border-cyan-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-300">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Portal Interactivo del Cliente
              </span>
              <span className="text-xs text-slate-400">Vista en vivo</span>
            </div>
            <h2 className="text-lg font-bold text-white font-display mt-0.5">
              Bienvenido, {currentClient.name} {currentClient.company ? `(${currentClient.company})` : ''}
            </h2>
          </div>
        </div>

        {/* Switch client preview dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300 whitespace-nowrap">Simular como:</span>
          <select
            value={activeClientId}
            onChange={e => setPortalClientId(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 font-semibold text-xs focus:outline-none cursor-pointer"
          >
            {clients.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} {c.company ? `• ${c.company}` : ''}
              </option>
            ))}
          </select>
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
          >
            Volver a Admin
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FolderKanban className="w-4 h-4" />
          <span>Mis Proyectos ({clientProjects.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('quotes')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'quotes'
              ? 'bg-purple-600 text-white shadow-md shadow-purple-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Cotizaciones & Aprobaciones ({clientQuotes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('gallery')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'gallery'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Galerías & Selección ({clientSessions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('files')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'files'
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>Archivos & Descargas ({clientFiles.length})</span>
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clientProjects.length === 0 ? (
              <div className="col-span-2 p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-500 text-xs">
                No hay proyectos activos registrados para este cliente.
              </div>
            ) : (
              clientProjects.map(proj => (
                <div
                  key={proj.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl hover:border-slate-700 transition-all"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase">
                        {proj.category}
                      </span>
                      <h3 className="font-display font-bold text-base text-white mt-1">
                        {proj.name}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">{proj.description}</p>
                    </div>
                    <Badge
                      variant={
                        proj.status === 'Entregado'
                          ? 'emerald'
                          : proj.status === 'Revisión'
                          ? 'purple'
                          : 'blue'
                      }
                    >
                      {proj.status}
                    </Badge>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span>Progreso de Desarrollo & Entrega</span>
                      <span className="font-mono font-bold text-cyan-400">{proj.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all"
                        style={{ width: `${proj.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-cyan-400" />
                      Fecha pactada: {proj.deliveryDate || proj.startDate || 'Pendiente'}
                    </span>
                    <span className="font-mono text-slate-300 font-semibold">
                      Presupuesto: {formatMoney(proj.price || 0)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'quotes' && (
        <div className="space-y-4">
          {justApprovedQuoteId && (
            <div className="p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 flex items-center gap-2 text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              ¡Cotización aprobada formalmente! El equipo de DevJos Studio ha recibido tu confirmación.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clientQuotes.length === 0 ? (
              <div className="col-span-2 p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-500 text-xs">
                No hay presupuestos pendientes para este cliente.
              </div>
            ) : (
              clientQuotes.map(quote => (
                <div
                  key={quote.id}
                  className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-purple-400">
                          {quote.number}
                        </span>
                        <span className="text-[10px] text-slate-400">Vence: {quote.validUntil}</span>
                      </div>
                      <h3 className="font-display font-bold text-base text-white mt-1">
                        {quote.title}
                      </h3>
                    </div>
                    <Badge
                      variant={
                        quote.status === 'Aprobada'
                          ? 'emerald'
                          : quote.status === 'Rechazada'
                          ? 'rose'
                          : 'purple'
                      }
                    >
                      {quote.status}
                    </Badge>
                  </div>

                  {/* Items summary */}
                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 space-y-1.5 text-xs">
                    {quote.items.map((it: any, idx) => (
                      <div key={idx} className="flex items-center justify-between text-slate-300">
                        <span className="truncate pr-2">
                          {it.quantity}x {it.description || it.serviceName}
                        </span>
                        <span className="font-mono font-semibold text-slate-200">
                          {formatMoney(it.total || 0)}
                        </span>
                      </div>
                    ))}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between font-bold text-white text-sm">
                      <span>Total Presupuesto:</span>
                      <span className="font-mono text-cyan-400">
                        {formatMoney(quote.total || 0)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex items-center justify-between gap-2">
                    <button
                      onClick={() => window.print()}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5 text-cyan-400" /> Descargar PDF
                    </button>

                    {quote.status === 'Borrador' || quote.status === 'Enviada' ? (
                      <button
                        onClick={() => handleApproveQuote(quote.id)}
                        className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
                      >
                        <ThumbsUp className="w-3.5 h-3.5" /> Aprobar Presupuesto
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Presupuesto Aceptado
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'gallery' && (
        <div className="space-y-4">
          <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <span className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
              Haz clic en el corazón de tus fotos favoritas para que nuestro equipo las retome en alta resolución.
            </span>
            <span className="font-mono font-bold text-cyan-400">
              {Object.values(selectedPhotoLikes).filter(Boolean).length} fotos seleccionadas
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {clientSessions.flatMap(s => s.gallery).length === 0 ? (
              <div className="col-span-3 p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-500 text-xs">
                No hay galerías de fotos cargadas para este cliente.
              </div>
            ) : (
              clientSessions.flatMap(s => s.gallery).map(photo => {
                const isLiked = !!selectedPhotoLikes[photo.id];
                return (
                  <div
                    key={photo.id}
                    className="relative rounded-2xl overflow-hidden group bg-slate-950 border border-slate-800 shadow-xl"
                  >
                    <img
                      src={photo.url}
                      alt={photo.name}
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

                    <button
                      onClick={() => togglePhotoLike(photo.id)}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all ${
                        isLiked
                          ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/40 scale-110'
                          : 'bg-black/50 text-white hover:bg-rose-500/80'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                    </button>

                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                      <div>
                        <p className="font-semibold text-white">{photo.name}</p>
                        <p className="text-[10px] text-slate-300">{photo.size}</p>
                      </div>
                      <a
                        href={photo.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {activeTab === 'files' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
            <h3 className="font-display font-bold text-sm text-white flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-emerald-400" />
              Archivos Finales y Entregables en NAS
            </h3>
            <span className="text-xs text-slate-400">Descarga directa sin compresión</span>
          </div>

          <div className="divide-y divide-slate-800">
            {clientFiles.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs">
                No hay archivos entregables disponibles para este cliente.
              </div>
            ) : (
              clientFiles.map(file => (
                <div
                  key={file.id}
                  className="p-4 flex items-center justify-between hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <FolderOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">{file.name}</h4>
                      <p className="text-[11px] text-slate-400">
                        {file.size} • Subido el {file.createdAt} • Ruta: {file.path}
                      </p>
                    </div>
                  </div>

                  <a
                    href={file.url || '#'}
                    download={file.name}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-500/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar</span>
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
