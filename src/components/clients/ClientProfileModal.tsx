import React, { useState } from 'react';
import {
  X,
  Building,
  Phone,
  Mail,
  MapPin,
  Globe,
  Instagram,
  Facebook,
  DollarSign,
  FolderKanban,
  FileText,
  FolderOpen,
  History,
  Send,
  ExternalLink,
  MessageSquare,
  Edit2,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/StatCard';

export const ClientProfileModal: React.FC<{
  clientId: string | null;
  onClose: () => void;
  onEditClient: (client: any) => void;
}> = ({ clientId, onClose, onEditClient }) => {
  const {
    clients,
    projects,
    incomes,
    quotes,
    files,
    activityLogs,
    setSelectedProjectId,
    setSelectedQuoteId,
    setCurrentView,
    deleteClient,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'info' | 'projects' | 'finance' | 'quotes' | 'files' | 'activity'>('info');

  if (!clientId) return null;
  const client = clients.find(c => c.id === clientId);
  if (!client) return null;

  const clientProjects = projects.filter(p => p.clientId === clientId);
  const clientIncomes = incomes.filter(i => i.clientId === clientId);
  const clientQuotes = quotes.filter(q => q.clientId === clientId);
  const clientFiles = files.filter(f => f.clientId === clientId);
  const clientLogs = activityLogs.filter(
    l => l.targetTitle.includes(client.name) || l.targetTitle.includes(client.company)
  );

  const totalContracted = clientProjects.reduce((acc, p) => acc + (p.price || 0), 0);
  const totalPaid = clientIncomes.reduce((acc, i) => acc + (i.amount || 0), 0);
  const totalPending = Math.max(0, totalContracted - totalPaid);

  const handleDelete = () => {
    if (confirm(`¿Estás seguro de eliminar al cliente ${client.name}? Esta acción no se puede deshacer.`)) {
      deleteClient(client.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div
        className="w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Header Profile Hero */}
        <div className="relative p-6 bg-gradient-to-r from-[#07152f] via-slate-900 to-slate-950 border-b border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={client.avatar}
                alt={client.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/40 shadow-lg"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white font-display">{client.name}</h2>
                  <Badge
                    variant={
                      client.status === 'Cliente'
                        ? 'success'
                        : client.status === 'Prospecto'
                        ? 'info'
                        : 'warning'
                    }
                    size="sm"
                  >
                    {client.status}
                  </Badge>
                </div>
                <p className="text-xs text-slate-300 flex items-center gap-1.5 mt-0.5">
                  <Building className="w-3.5 h-3.5 text-cyan-400" />
                  {client.company || 'Cliente Particular'}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">Registrado el {client.registeredDate}</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {client.whatsapp && (
                <a
                  href={`https://wa.me/${client.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 rounded-xl bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border border-emerald-500/30 transition-colors text-xs font-semibold flex items-center gap-1.5"
                  title="Abrir WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" /> WhatsApp
                </a>
              )}
              <button
                onClick={() => onEditClient(client)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                title="Editar cliente"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 transition-colors"
                title="Eliminar cliente"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Metrics ribbon */}
          <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-slate-800/80 text-xs">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Contratado</span>
              <span className="text-sm font-bold text-slate-100 font-display">${(totalContracted || 0).toLocaleString()} USD</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-emerald-400 block">Total Pagado</span>
              <span className="text-sm font-bold text-emerald-400 font-display">${(totalPaid || 0).toLocaleString()} USD</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-amber-400 block">Saldo Pendiente</span>
              <span className="text-sm font-bold text-amber-400 font-display">${(totalPending || 0).toLocaleString()} USD</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-6 overflow-x-auto text-xs font-semibold">
          {[
            { id: 'info', label: 'Información', icon: Building },
            { id: 'projects', label: `Proyectos (${clientProjects.length})`, icon: FolderKanban },
            { id: 'finance', label: `Finanzas & Pagos (${clientIncomes.length})`, icon: DollarSign },
            { id: 'quotes', label: `Cotizaciones (${clientQuotes.length})`, icon: FileText },
            { id: 'files', label: `Archivos (${clientFiles.length})`, icon: FolderOpen },
            { id: 'activity', label: 'Historial', icon: History },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-4 border-b-2 font-medium flex items-center gap-2 whitespace-nowrap transition-colors ${
                  isActive
                    ? 'border-cyan-400 text-cyan-300 font-bold bg-slate-900/50'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {/* TAB 1: INFO */}
          {activeTab === 'info' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Canales de Contacto</h4>
                  <div className="space-y-2 text-xs">
                    <p className="flex items-center gap-2 text-slate-200">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" />
                      <a href={`mailto:${client.email}`} className="hover:underline">{client.email}</a>
                    </p>
                    <p className="flex items-center gap-2 text-slate-200">
                      <Phone className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{client.phone || 'No registrado'}</span>
                    </p>
                    <p className="flex items-center gap-2 text-slate-200">
                      <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                      <span>{client.address || 'Sin dirección física'}</span>
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Presencia Digital</h4>
                  <div className="space-y-2 text-xs">
                    {client.website && (
                      <p className="flex items-center gap-2 text-slate-200">
                        <Globe className="w-3.5 h-3.5 text-blue-400" />
                        <a href={client.website} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline">
                          {client.website}
                        </a>
                      </p>
                    )}
                    {client.instagram && (
                      <p className="flex items-center gap-2 text-slate-200">
                        <Instagram className="w-3.5 h-3.5 text-purple-400" />
                        <span>{client.instagram}</span>
                      </p>
                    )}
                    {client.facebook && (
                      <p className="flex items-center gap-2 text-slate-200">
                        <Facebook className="w-3.5 h-3.5 text-blue-500" />
                        <span>{client.facebook}</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {client.notes && (
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Notas Especiales</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">{client.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="space-y-3">
              {clientProjects.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-8">Este cliente aún no tiene proyectos asignados.</p>
              ) : (
                clientProjects.map(p => (
                  <div
                    key={p.id}
                    className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-white">{p.name}</h4>
                        <Badge size="sm" variant={p.status === 'Completado' ? 'success' : 'info'}>{p.status}</Badge>
                      </div>
                      <p className="text-[11px] text-slate-400">{p.category} • Entrega: {p.deliveryDate} • Progreso: {p.progress}%</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-200 block">${(p.price || 0).toLocaleString()} USD</span>
                      <button
                        onClick={() => {
                          setSelectedProjectId(p.id);
                          setCurrentView('projects');
                          onClose();
                        }}
                        className="text-[11px] text-cyan-400 hover:underline mt-1 inline-flex items-center gap-1"
                      >
                        Abrir <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 3: FINANCE */}
          {activeTab === 'finance' && (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400">
                      <th className="pb-2">Fecha</th>
                      <th className="pb-2">Factura</th>
                      <th className="pb-2">Descripción</th>
                      <th className="pb-2">Método</th>
                      <th className="pb-2 text-right">Monto</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {clientIncomes.map(inc => (
                      <tr key={inc.id} className="hover:bg-slate-800/40">
                        <td className="py-2.5 text-slate-300">{inc.date}</td>
                        <td className="py-2.5 text-cyan-400 font-mono">{inc.invoiceNumber || '—'}</td>
                        <td className="py-2.5 text-slate-200">{inc.description}</td>
                        <td className="py-2.5 text-slate-400">{inc.method}</td>
                        <td className="py-2.5 text-right font-bold text-emerald-400">+${(inc.amount || 0).toLocaleString()} USD</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: QUOTES */}
          {activeTab === 'quotes' && (
            <div className="space-y-3">
              {clientQuotes.map(qt => (
                <div key={qt.id} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-white font-mono">{qt.quoteNumber}</p>
                    <p className="text-[11px] text-slate-400">Emitida: {qt.issueDate} • Vence: {qt.expiryDate}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-200">${(qt.total || 0).toLocaleString()} USD</span>
                    <Badge size="sm" variant={qt.status === 'Aceptada' ? 'success' : 'warning'}>{qt.status}</Badge>
                    <button
                      onClick={() => {
                        setSelectedQuoteId(qt.id);
                        setCurrentView('quotes');
                        onClose();
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 text-cyan-400 text-[11px] font-semibold"
                    >
                      Ver PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: FILES */}
          {activeTab === 'files' && (
            <div className="space-y-2">
              {clientFiles.map(f => (
                <div key={f.id} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5">
                    <FolderOpen className="w-4 h-4 text-cyan-400" />
                    <div>
                      <p className="font-semibold text-slate-200">{f.name}</p>
                      <p className="text-[10px] text-slate-400">Carpeta: {f.folder} • {f.size}</p>
                    </div>
                  </div>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    Sincronizado NAS
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 6: ACTIVITY */}
          {activeTab === 'activity' && (
            <div className="space-y-2.5">
              {clientLogs.map(l => (
                <div key={l.id} className="p-3 rounded-xl bg-slate-950/50 border border-slate-800 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-cyan-400">{l.action}: </span>
                    <span className="text-slate-300">{l.targetTitle}</span>
                  </div>
                  <span className="text-[10px] text-slate-500">{l.timestamp}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
