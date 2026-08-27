import React, { useState, useEffect } from 'react';
import { X, DollarSign, Tag, ListPlus, Clock, Check } from 'lucide-react';
import { Service, ServiceCategory } from '../../types';
import { useApp } from '../../context/AppContext';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  serviceToEdit?: Service | null;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  serviceToEdit,
}) => {
  const { currencyCode, currencySymbol } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    category: 'Desarrollo' as ServiceCategory,
    basePrice: 500,
    estimatedTime: '2 semanas',
    description: '',
    deliverables: [''],
    active: true,
  });

  useEffect(() => {
    if (serviceToEdit) {
      setFormData({
        name: serviceToEdit.name || '',
        category: serviceToEdit.category || 'Desarrollo',
        basePrice: serviceToEdit.basePrice || 0,
        estimatedTime: serviceToEdit.estimatedTime || '',
        description: serviceToEdit.description || '',
        deliverables: serviceToEdit.deliverables.length ? serviceToEdit.deliverables : [''],
        active: serviceToEdit.active !== undefined ? serviceToEdit.active : true,
      });
    } else {
      setFormData({
        name: '',
        category: 'Desarrollo',
        basePrice: 500,
        estimatedTime: '2 semanas',
        description: '',
        deliverables: [''],
        active: true,
      });
    }
  }, [serviceToEdit, isOpen]);

  if (!isOpen) return null;

  const handleDeliverableChange = (index: number, val: string) => {
    const updated = [...formData.deliverables];
    updated[index] = val;
    setFormData({ ...formData, deliverables: updated });
  };

  const addDeliverableRow = () => {
    setFormData({ ...formData, deliverables: [...formData.deliverables, ''] });
  };

  const removeDeliverableRow = (index: number) => {
    const updated = formData.deliverables.filter((_, i) => i !== index);
    setFormData({ ...formData, deliverables: updated.length ? updated : [''] });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave({
      ...formData,
      deliverables: formData.deliverables.filter((d) => d.trim() !== ''),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div
        className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h3 className="font-display font-bold text-base text-white">
              {serviceToEdit ? 'Editar Servicio / Paquete' : 'Nuevo Servicio o Paquete'}
            </h3>
            <p className="text-xs text-slate-400">Define el catálogo de servicios ofrecidos por DevJos</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nombre del Servicio o Paquete *
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Diseño Web Corporativo Pro"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Categoría
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ServiceCategory })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              >
                <option value="Desarrollo">Desarrollo Web / Software</option>
                <option value="Diseño">Diseño Gráfico</option>
                <option value="Branding">Branding e Identidad</option>
                <option value="Fotografía">Fotografía</option>
                <option value="Video">Video y Multimedia</option>
                <option value="Redes sociales">Redes Sociales</option>
                <option value="Paquete">Paquete Multidisciplinario</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Precio Base Sugerido ({currencyCode}) *
              </label>
              <div className="relative">
                <span className="text-xs font-semibold text-cyan-400 absolute left-3 top-2.5">
                  {currencySymbol}
                </span>
                <input
                  type="number"
                  min="0"
                  required
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl pl-12 pr-3 py-2 text-xs text-slate-100 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tiempo Estimado de Entrega
              </label>
              <input
                type="text"
                placeholder="Ej. 10 - 15 días hábiles"
                value={formData.estimatedTime}
                onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Estado en Catálogo
              </label>
              <select
                value={formData.active ? 'active' : 'inactive'}
                onChange={(e) => setFormData({ ...formData, active: e.target.value === 'active' })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              >
                <option value="active">Activo (Disponible en cotizador)</option>
                <option value="inactive">Inactivo / Pausado</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Descripción del Servicio
            </label>
            <textarea
              rows={2}
              placeholder="Explicación concisa de lo que abarca este servicio o paquete..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none resize-none"
            />
          </div>

          {/* Deliverables List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-slate-300">
                Entregables Incluidos
              </label>
              <button
                type="button"
                onClick={addDeliverableRow}
                className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold"
              >
                + Agregar Entregable
              </button>
            </div>

            <div className="space-y-2">
              {formData.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Entregable #${idx + 1} (Ej. 10 Fotos Retocadas en Alta Resolución)`}
                    value={item}
                    onChange={(e) => handleDeliverableChange(idx, e.target.value)}
                    className="flex-1 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-1.5 text-xs text-slate-100 focus:outline-none"
                  />
                  {formData.deliverables.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDeliverableRow(idx)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
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
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 transition-all"
            >
              {serviceToEdit ? 'Guardar Cambios' : 'Registrar Servicio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
