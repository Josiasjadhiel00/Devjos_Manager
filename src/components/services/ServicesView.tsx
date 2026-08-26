import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Search,
  Clock,
  DollarSign,
  CheckCircle2,
  Edit2,
  Trash2,
  Sparkles,
  Layers,
  FileCheck,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/StatCard';
import { ServiceModal } from './ServiceModal';
import { Service, ServiceCategory } from '../../types';

export const ServicesView: React.FC = () => {
  const { services, addService, updateService, deleteService, setCurrentView } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [serviceToEdit, setServiceToEdit] = useState<Service | null>(null);

  const categories = ['all', 'Desarrollo', 'Diseño', 'Branding', 'Fotografía', 'Video', 'Redes sociales', 'Paquete'];

  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || s.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleSaveService = (data: any) => {
    if (serviceToEdit) {
      updateService(serviceToEdit.id, data);
      setServiceToEdit(null);
    } else {
      addService(data);
    }
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`¿Estás seguro de eliminar el servicio "${name}"?`)) {
      deleteService(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar servicio o entregable..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                  categoryFilter === cat
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat === 'all' ? 'Todos' : cat}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            setServiceToEdit(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" /> Nuevo Servicio / Paquete
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="bg-slate-900/80 backdrop-blur-md border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                  {service.category}
                </span>
                <Badge variant={service.active ? 'success' : 'neutral'} size="sm">
                  {service.active ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>

              <div>
                <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors font-display">
                  {service.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Deliverables checklist */}
              {service.deliverables && service.deliverables.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    Entregables incluidos:
                  </span>
                  <div className="space-y-1">
                    {service.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span className="leading-tight text-[11px]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Meta & Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">Precio Base</span>
                <span className="text-base font-bold text-white font-display">
                  ${(service.basePrice || 0).toLocaleString()} USD
                </span>
                <span className="text-[10px] text-slate-400 block mt-0.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-500" /> {service.estimatedTime}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => {
                    setServiceToEdit(service);
                    setIsModalOpen(true);
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(service.id, service.name)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Service Modal */}
      <ServiceModal
        isOpen={isModalOpen || !!serviceToEdit}
        onClose={() => {
          setIsModalOpen(false);
          setServiceToEdit(null);
        }}
        onSave={handleSaveService}
        serviceToEdit={serviceToEdit}
      />
    </div>
  );
};
