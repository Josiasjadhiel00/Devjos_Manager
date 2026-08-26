import React, { useState } from 'react';
import {
  Camera,
  Search,
  Plus,
  Calendar,
  MapPin,
  Heart,
  Eye,
  Edit2,
  Trash2,
  ExternalLink,
  Users,
  CheckCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/StatCard';
import { PhotoSessionModal } from './PhotoSessionModal';
import { GalleryModal } from './GalleryModal';
import { PhotographySession, PhotoSessionStatus } from '../../types';

export const PhotographyView: React.FC = () => {
  const {
    photoSessions,
    galleries,
    clients,
    addPhotoSession,
    updatePhotoSession,
    deletePhotoSession,
    selectedGalleryId,
    setSelectedGalleryId,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sessionToEdit, setSessionToEdit] = useState<PhotographySession | null>(null);

  const filteredSessions = photoSessions.filter((s) => {
    const client = clients.find((c) => c.id === s.clientId);
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client?.name && client.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSaveSession = (data: any) => {
    if (sessionToEdit) {
      updatePhotoSession(sessionToEdit.id, data);
      setSessionToEdit(null);
    } else {
      addPhotoSession(data);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar sesión, locación o cliente..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
            {['all', 'Programada', 'Realizada', 'Selección', 'Edición', 'Entrega', 'Completada'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === st
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {st === 'all' ? 'Todas' : st}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            setSessionToEdit(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" /> Nueva Sesión
        </button>
      </div>

      {/* Sessions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSessions.map((session) => {
          const client = clients.find((c) => c.id === session.clientId);
          const gallery = galleries.find((g) => g.sessionId === session.id || g.clientId === session.clientId);
          const selectedCount = gallery?.images.filter((img) => img.selected).length || session.photosSelected || 0;

          return (
            <div
              key={session.id}
              className="bg-slate-900/80 backdrop-blur-md border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {session.sessionType}
                  </span>
                  <Badge
                    variant={
                      session.status === 'Completada'
                        ? 'success'
                        : session.status === 'Selección'
                        ? 'purple'
                        : session.status === 'Edición'
                        ? 'cyan'
                        : 'info'
                    }
                    size="sm"
                  >
                    {session.status}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors font-display">
                    {session.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-cyan-400" />
                    {client?.name} ({client?.company || 'Particular'})
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 pt-1">
                  <p className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      {session.date} {session.time ? `• ${session.time}` : ''}
                    </span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate">{session.location}</span>
                  </p>
                </div>

                {/* Photo counts indicator */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Camera className="w-3.5 h-3.5 text-cyan-400" />
                    {session.photosTaken} capturas
                  </span>
                  <span className="text-rose-400 font-semibold flex items-center gap-1">
                    <Heart className="w-3 h-3 fill-rose-400" />
                    {selectedCount} seleccionadas
                  </span>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <button
                  onClick={() => setSelectedGalleryId(gallery?.id || galleries[0]?.id || null)}
                  className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Eye className="w-3.5 h-3.5" /> Abrir Galería
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setSessionToEdit(session);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar la sesión "${session.title}"?`)) {
                        deletePhotoSession(session.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                    title="Eliminar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Session Modal */}
      <PhotoSessionModal
        isOpen={isModalOpen || !!sessionToEdit}
        onClose={() => {
          setIsModalOpen(false);
          setSessionToEdit(null);
        }}
        onSave={handleSaveSession}
        sessionToEdit={sessionToEdit}
      />

      {/* Interactive Gallery Selector Modal */}
      <GalleryModal
        galleryId={selectedGalleryId}
        onClose={() => setSelectedGalleryId(null)}
      />
    </div>
  );
};
