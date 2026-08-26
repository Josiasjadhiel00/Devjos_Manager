import React, { useState } from 'react';
import {
  Film,
  Search,
  Plus,
  Video,
  Play,
  CheckCircle2,
  Clock,
  Layers,
  FileCode,
  Sparkles,
  ExternalLink,
  MessageSquare,
  History,
  Tag,
  Building2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StatCard, Badge } from '../ui/StatCard';
import { MediaProject, MediaVersion } from '../../types';

export const MultimediaView: React.FC = () => {
  const {
    mediaProjects,
    projects,
    clients,
    addMediaProject,
    updateMediaProject,
    deleteMediaProject,
    addMediaVersion,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState<string>('all');
  const [activeMedia, setActiveMedia] = useState<MediaProject | null>(mediaProjects[0] || null);

  // New Media Project Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newClientId, setNewClientId] = useState(clients[0]?.id || '');
  const [newProjectId, setNewProjectId] = useState(projects[0]?.id || '');
  const [newFormat, setNewFormat] = useState<'Reel' | 'YouTube' | 'Comercial' | 'TikTok' | 'Documental'>('Reel');
  const [newDuration, setNewDuration] = useState('0:45');
  const [newScript, setNewScript] = useState('');

  // Add Version Modal
  const [isVersionModalOpen, setIsVersionModalOpen] = useState(false);
  const [versionNotes, setVersionNotes] = useState('');
  const [versionFileUrl, setVersionFileUrl] = useState('');

  const filteredMedia = mediaProjects.filter(m => {
    const client = clients.find(c => c.id === m.clientId);
    const text = `${m.title} ${client?.name || ''} ${client?.company || ''}`.toLowerCase();
    const matchesSearch = text.includes(searchQuery.toLowerCase());
    const matchesFormat = selectedFormat === 'all' || m.format === selectedFormat;
    return matchesSearch && matchesFormat;
  });

  const handleCreateMedia = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created = addMediaProject({
      title: newTitle,
      clientId: newClientId,
      projectId: newProjectId || undefined,
      format: newFormat,
      duration: newDuration || '0:30',
      script: newScript,
      status: 'En edición',
      versions: [
        {
          version: 'V1',
          fileUrl: 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4',
          createdAt: new Date().toISOString().split('T')[0],
          notes: 'Primer corte bruto montado con banda sonora y corrección de color inicial.',
          status: 'En revisión',
        },
      ],
      notes: 'Proyecto iniciado en DevJos Suite',
    });

    setIsCreateModalOpen(false);
    setActiveMedia(created);
    setNewTitle('');
    setNewScript('');
  };

  const handleAddVersion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMedia || !versionNotes.trim()) return;

    addMediaVersion(
      activeMedia.id,
      versionNotes,
      versionFileUrl || 'https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4'
    );

    setIsVersionModalOpen(false);
    setVersionNotes('');
    setVersionFileUrl('');
  };

  const selectedClient = clients.find(c => c.id === activeMedia?.clientId);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
            <Film className="w-5 h-5 text-purple-400" />
            Producción Multimedia & Video
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Gestión de videos comerciales, Reels, control de versiones V1/V2/Final y revisión de guiones
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold text-xs shadow-md shadow-purple-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo Video / Reel</span>
        </button>
      </div>

      {/* Main Grid: Left projects list, Right details & version player */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Video project list */}
        <div className="lg:col-span-5 space-y-3">
          {/* Filters */}
          <div className="bg-slate-900/70 p-3 rounded-2xl border border-slate-800 space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar video o cliente..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {['all', 'Reel', 'YouTube', 'Comercial', 'TikTok'].map(fmt => (
                <button
                  key={fmt}
                  onClick={() => setSelectedFormat(fmt)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors ${
                    selectedFormat === fmt
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800/80 text-slate-400 hover:text-white'
                  }`}
                >
                  {fmt === 'all' ? 'Todos los Formatos' : fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Cards List */}
          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredMedia.length === 0 ? (
              <div className="p-8 text-center bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-500 text-xs">
                No hay proyectos audiovisuales en este formato.
              </div>
            ) : (
              filteredMedia.map(m => {
                const client = clients.find(c => c.id === m.clientId);
                const isSelected = activeMedia?.id === m.id;

                return (
                  <div
                    key={m.id}
                    onClick={() => setActiveMedia(m)}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-purple-950/20 border-purple-500/50 shadow-lg shadow-purple-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase">
                            {m.format}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            ⏱ {m.duration}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mt-1.5 font-display">
                          {m.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                          <Building2 className="w-3 h-3 text-cyan-400" />
                          <span>{client?.name || 'Cliente'}</span>
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                          {m.currentVersion}
                        </span>
                        <Badge
                          variant={
                            m.status === 'Aprobado'
                              ? 'emerald'
                              : m.status === 'En revisión'
                              ? 'blue'
                              : 'purple'
                          }
                        >
                          {m.status}
                        </Badge>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                      <span>{m.versions.length} versiones registradas</span>
                      <span className="text-purple-400 font-medium">Ver detalles →</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Active Media Project Detail & Version Manager */}
        <div className="lg:col-span-7">
          {activeMedia ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase">
                      {activeMedia.format}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">
                      Duración estimada: {activeMedia.duration}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white font-display mt-1">
                    {activeMedia.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Cliente: <strong className="text-slate-200">{selectedClient?.name}</strong> ({selectedClient?.company || 'Particular'})
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsVersionModalOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-500/20"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Nueva Versión ({activeMedia.currentVersion === 'V1' ? 'V2' : activeMedia.currentVersion === 'V2' ? 'V3' : 'Final'})</span>
                  </button>
                </div>
              </div>

              {/* Mock Video Preview Canvas / Player Box */}
              <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col items-center justify-center group shadow-inner">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />
                <div className="z-10 text-center p-4">
                  <div className="w-14 h-14 rounded-full bg-purple-600/90 text-white flex items-center justify-center mx-auto shadow-xl shadow-purple-500/30 group-hover:scale-110 transition-transform cursor-pointer">
                    <Play className="w-6 h-6 ml-1" />
                  </div>
                  <p className="text-xs font-bold text-white mt-3 font-display">
                    {activeMedia.title} • Versión {activeMedia.currentVersion}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Formato {activeMedia.format} ({activeMedia.duration}) • Listo para revisión del cliente
                  </p>
                </div>
                <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between text-xs text-slate-300">
                  <span className="font-mono text-[11px]">00:00 / {activeMedia.duration}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 text-[10px] text-cyan-300">
                    ProRes / H.264 4K
                  </span>
                </div>
              </div>

              {/* Guión & Script Section */}
              <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5" /> Guión & Estructura Audiovisual
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line font-mono bg-slate-900/60 p-3 rounded-lg border border-slate-800/80">
                  {activeMedia.script || 'No se ha redactado un guión aún para esta producción.'}
                </p>
              </div>

              {/* Versions History Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-purple-400" /> Historial de Versiones & Feedback
                </h4>
                <div className="space-y-2">
                  {activeMedia.versions.map((ver, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
                    >
                      <div className="flex items-start gap-2.5">
                        <span className="px-2 py-1 rounded-md bg-purple-500/20 text-purple-300 font-mono font-bold text-[11px]">
                          {ver.version}
                        </span>
                        <div>
                          <p className="text-slate-200 font-medium">{ver.notes}</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Fecha de subida: {ver.createdAt}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={
                          ver.status === 'Aprobada'
                            ? 'emerald'
                            : ver.status === 'Con cambios'
                            ? 'amber'
                            : 'blue'
                        }
                      >
                        {ver.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[350px] flex items-center justify-center p-8 bg-slate-900/40 rounded-2xl border border-slate-800 text-slate-500 text-xs">
              Selecciona un proyecto audiovisual de la lista para ver su flujo de trabajo y versiones.
            </div>
          )}
        </div>
      </div>

      {/* New Media Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-white">Nuevo Proyecto de Video / Reel</h3>
                  <p className="text-[11px] text-slate-400">Registra una producción audiovisual</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateMedia} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Título del Video
                </label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  placeholder="Ej: Reel Promocional Lanzamiento Menú Sushi"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cliente
                  </label>
                  <select
                    value={newClientId}
                    onChange={e => setNewClientId(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.company ? `(${c.company})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Formato
                  </label>
                  <select
                    value={newFormat}
                    onChange={e => setNewFormat(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="Reel">Reel (9:16)</option>
                    <option value="TikTok">TikTok (9:16)</option>
                    <option value="YouTube">YouTube 4K (16:9)</option>
                    <option value="Comercial">Comercial TV / Web (16:9)</option>
                    <option value="Documental">Documental / Corporativo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Guión / Storyboard / Descripción de tomas
                </label>
                <textarea
                  rows={3}
                  value={newScript}
                  onChange={e => setNewScript(e.target.value)}
                  placeholder="Estructura: Gancho 0-3s, Problema 3-15s, Solución 15-30s, CTA..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-purple-500/20"
                >
                  Crear Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Version Modal */}
      {isVersionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div
            className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <h3 className="font-display font-bold text-sm text-white">
                Subir Nueva Versión ({activeMedia?.currentVersion === 'V1' ? 'V2' : activeMedia?.currentVersion === 'V2' ? 'V3' : 'Final'})
              </h3>
              <button
                onClick={() => setIsVersionModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleAddVersion} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Notas del Corte / Cambios realizados
                </label>
                <textarea
                  rows={3}
                  value={versionNotes}
                  onChange={e => setVersionNotes(e.target.value)}
                  placeholder="Ej: Se ajustó el audio en el minuto 0:15 y se añadieron subtítulos animados..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsVersionModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-500/20"
                >
                  Guardar Versión
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
