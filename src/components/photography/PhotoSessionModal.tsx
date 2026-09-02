import React, { useState, useEffect } from 'react';
import { X, Camera, Calendar, MapPin, User, Link, Image } from 'lucide-react';
import { PhotographySession, PhotoSessionStatus, PhotoSessionType } from '../../types';
import { useApp } from '../../context/AppContext';

interface PhotoSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  sessionToEdit?: PhotographySession | null;
}

export const PhotoSessionModal: React.FC<PhotoSessionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  sessionToEdit,
}) => {
  const { clients, projects } = useApp();

  const [formData, setFormData] = useState({
    title: '',
    clientId: clients[0]?.id || '',
    projectId: '',
    date: new Date().toISOString().split('T')[0],
    time: '15:00',
    location: '',
    sessionType: 'Fotografía corporativa' as PhotoSessionType,
    status: 'Programada' as PhotoSessionStatus,
    photosTaken: 0,
    photosSelected: 0,
    photosEdited: 0,
    photosDelivered: 0,
    notes: '',
  });

  useEffect(() => {
    if (sessionToEdit) {
      setFormData({
        title: sessionToEdit.title || '',
        clientId: sessionToEdit.clientId || (clients[0]?.id || ''),
        projectId: sessionToEdit.projectId || '',
        date: sessionToEdit.date || '',
        time: sessionToEdit.time || '15:00',
        location: sessionToEdit.location || '',
        sessionType: sessionToEdit.sessionType || 'Fotografía corporativa',
        status: sessionToEdit.status || 'Programada',
        photosTaken: sessionToEdit.photosTaken || 0,
        photosSelected: sessionToEdit.photosSelected || 0,
        photosEdited: sessionToEdit.photosEdited || 0,
        photosDelivered: sessionToEdit.photosDelivered || 0,
        notes: sessionToEdit.notes || '',
      });
    } else {
      setFormData({
        title: '',
        clientId: clients[0]?.id || '',
        projectId: '',
        date: new Date().toISOString().split('T')[0],
        time: '15:00',
        location: '',
        sessionType: 'Fotografía corporativa',
        status: 'Programada',
        photosTaken: 0,
        photosSelected: 0,
        photosEdited: 0,
        photosDelivered: 0,
        notes: '',
      });
    }
  }, [sessionToEdit, isOpen, clients]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.clientId) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center sm:p-4 bg-black/70 backdrop-blur-xs">
      <div
        className="w-full h-full sm:h-auto max-w-lg bg-slate-900 sm:border sm:border-slate-800 rounded-none sm:rounded-2xl shadow-2xl overflow-y-auto max-h-[92vh] sm:max-h-[88vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h3 className="font-display font-bold text-base text-white">
              {sessionToEdit ? 'Editar Sesión Fotográfica' : 'Nueva Sesión Fotográfica'}
            </h3>
            <p className="text-xs text-slate-400">Agendamiento, locación y control de entregables</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Título de la Sesión *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Sesión Corporativa & Retratos Directivos"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Cliente *</label>
              <select
                required
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              >
                <option value="">Selecciona cliente</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.company || 'Particular'})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Sesión</label>
              <select
                value={formData.sessionType}
                onChange={(e) => setFormData({ ...formData, sessionType: e.target.value as PhotoSessionType })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              >
                <option value="Fotografía corporativa">Fotografía Corporativa</option>
                <option value="Retratos">Retratos Profesionales</option>
                <option value="Productos">Fotografía de Productos</option>
                <option value="Eventos">Cobertura de Eventos</option>
                <option value="Sesiones">Sesiones en Estudio</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Estado</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as PhotoSessionStatus })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              >
                <option value="Programada">Programada</option>
                <option value="Realizada">Realizada</option>
                <option value="Selección">En Selección</option>
                <option value="Edición">En Edición</option>
                <option value="Entrega">Lista para Entrega</option>
                <option value="Completada">Completada</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Fecha</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hora</label>
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Locación / Estudio</label>
              <input
                type="text"
                placeholder="Ej. Estudio DevJos o Sede Cliente"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Fotos Tomadas</label>
              <input
                type="number"
                min="0"
                value={formData.photosTaken}
                onChange={(e) => setFormData({ ...formData, photosTaken: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Fotos a Entregar</label>
              <input
                type="number"
                min="0"
                value={formData.photosDelivered}
                onChange={(e) => setFormData({ ...formData, photosDelivered: parseInt(e.target.value) || 0 })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Notas / Requerimientos</label>
            <textarea
              rows={2}
              placeholder="Iluminación, fondos requeridos, vestuario..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none resize-none"
            />
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
              {sessionToEdit ? 'Guardar Cambios' : 'Agendar Sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
