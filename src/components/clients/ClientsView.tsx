import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  Phone,
  Mail,
  Building,
  MapPin,
  ExternalLink,
  MessageSquare,
  MoreVertical,
  LayoutGrid,
  List,
  Download,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { exportClientsToCsv } from '../../utils/exportCsv';
import { Badge } from '../ui/StatCard';
import { ClientModal } from './ClientModal';
import { ClientProfileModal } from './ClientProfileModal';
import { Client, ClientStatus } from '../../types';

export const ClientsView: React.FC = () => {
  const {
    clients,
    projects,
    addClient,
    updateClient,
    selectedClientId,
    setSelectedClientId,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [clientToEdit, setClientToEdit] = useState<Client | null>(null);

  const filteredClients = clients.filter(c => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveClient = (formData: any) => {
    if (clientToEdit) {
      updateClient(clientToEdit.id, formData);
      setClientToEdit(null);
    } else {
      addClient(formData);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar cliente, empresa o email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
            {['all', 'Cliente', 'Prospecto', 'Contactado', 'Inactivo'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl font-semibold transition-colors ${
                  statusFilter === st
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {st === 'all' ? 'Todos' : st}
              </button>
            ))}
          </div>
        </div>

        {/* View Toggle & Add Button */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex bg-slate-950 rounded-xl p-0.5 border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'grid' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Vista en tarjetas"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === 'table' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
              title="Vista en lista"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => exportClientsToCsv(clients)}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-all flex items-center gap-1.5 border border-slate-700"
            title="Exportar cartera de clientes a CSV"
          >
            <Download className="w-4 h-4 text-emerald-400" /> Exportar CSV
          </button>

          <button
            onClick={() => {
              setClientToEdit(null);
              setIsCreateModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" /> Nuevo Cliente
          </button>
        </div>
      </div>

      {/* Clients Content */}
      {filteredClients.length === 0 ? (
        <div className="py-16 text-center text-slate-500 bg-slate-900/40 border border-slate-800/80 rounded-2xl">
          <Users className="w-10 h-10 mx-auto text-slate-600 mb-2" />
          <p className="text-sm font-semibold text-slate-400">No se encontraron clientes</p>
          <p className="text-xs text-slate-500">Prueba con otros términos de búsqueda o agrega un nuevo cliente.</p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => {
            const clientProjCount = projects.filter((p) => p.clientId === client.id).length;
            return (
              <div
                key={client.id}
                onClick={() => setSelectedClientId(client.id)}
                className="bg-slate-900/80 backdrop-blur-md border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all cursor-pointer group space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={client.avatar}
                        alt={client.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-700 group-hover:border-cyan-400 transition-colors"
                      />
                      <div>
                        <h3 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                          {client.name}
                        </h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1">
                          <Building className="w-3 h-3 text-cyan-400" />
                          {client.company || 'Particular'}
                        </p>
                      </div>
                    </div>
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

                  <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                    <p className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span className="truncate">{client.email}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>{client.phone || '—'}</span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-400 font-medium">
                    {clientProjCount} proyecto(s) activo(s)
                  </span>
                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    {client.whatsapp && (
                      <a
                        href={`https://wa.me/${client.whatsapp.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                        title="WhatsApp"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </a>
                    )}
                    <button
                      onClick={() => setSelectedClientId(client.id)}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-300 text-[11px] font-semibold transition-colors"
                    >
                      Ver Perfil
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/40 text-slate-400 font-semibold">
                  <th className="p-4">Cliente / Empresa</th>
                  <th className="p-4">Contacto</th>
                  <th className="p-4">WhatsApp</th>
                  <th className="p-4">Estado</th>
                  <th className="p-4">Proyectos</th>
                  <th className="p-4 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredClients.map((client) => {
                  const clientProjCount = projects.filter((p) => p.clientId === client.id).length;
                  return (
                    <tr
                      key={client.id}
                      onClick={() => setSelectedClientId(client.id)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={client.avatar}
                            alt={client.name}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-700"
                          />
                          <div>
                            <p className="font-bold text-slate-100">{client.name}</p>
                            <p className="text-[11px] text-slate-400">{client.company}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-slate-200">{client.email}</p>
                        <p className="text-[11px] text-slate-400">{client.phone}</p>
                      </td>
                      <td className="p-4">
                        {client.whatsapp ? (
                          <span className="text-emerald-400 font-mono text-[11px]">{client.whatsapp}</span>
                        ) : (
                          <span className="text-slate-600">—</span>
                        )}
                      </td>
                      <td className="p-4">
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
                      </td>
                      <td className="p-4 font-semibold text-slate-300">
                        {clientProjCount}
                      </td>
                      <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedClientId(client.id)}
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-cyan-400 text-[11px] font-semibold"
                        >
                          Perfil Completo
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Client Modal */}
      <ClientModal
        isOpen={isCreateModalOpen || !!clientToEdit}
        onClose={() => {
          setIsCreateModalOpen(false);
          setClientToEdit(null);
        }}
        onSave={handleSaveClient}
        clientToEdit={clientToEdit}
      />

      {/* Full CRM Profile Drawer / Modal */}
      <ClientProfileModal
        clientId={selectedClientId}
        onClose={() => setSelectedClientId(null)}
        onEditClient={(c) => {
          setClientToEdit(c);
          setSelectedClientId(null);
        }}
      />
    </div>
  );
};
