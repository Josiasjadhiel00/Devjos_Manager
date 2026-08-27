import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  X,
  Users,
  FolderKanban,
  CheckSquare,
  FileText,
  Camera,
  Film,
  FolderOpen,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const GlobalSearchModal: React.FC = () => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    clients,
    projects,
    tasks,
    quotes,
    files,
    photoSessions,
    mediaProjects,
    setCurrentView,
    setSelectedClientId,
    setSelectedProjectId,
    setSelectedQuoteId,
    setSelectedGalleryId,
    formatMoney,
  } = useApp();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  const results = useMemo(() => {
    if (!query.trim()) return { clients: [], projects: [], tasks: [], quotes: [], files: [], photos: [] };
    const q = query.toLowerCase();

    return {
      clients: clients.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.company.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.phone.includes(q)
      ),
      projects: projects.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      ),
      tasks: tasks.filter(
        t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)
      ),
      quotes: quotes.filter(
        qt => qt.quoteNumber.toLowerCase().includes(q) || qt.notes.toLowerCase().includes(q)
      ),
      files: files.filter(f => f.name.toLowerCase().includes(q) || f.folder.toLowerCase().includes(q)),
      photos: photoSessions.filter(
        s => s.title.toLowerCase().includes(q) || s.location.toLowerCase().includes(q)
      ),
    };
  }, [query, clients, projects, tasks, quotes, files, photoSessions]);

  const totalResults =
    results.clients.length +
    results.projects.length +
    results.tasks.length +
    results.quotes.length +
    results.files.length +
    results.photos.length;

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950/60">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            placeholder="Buscar por cliente, proyecto, tarea, cotización o archivo..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs font-semibold px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-white border border-slate-700"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!query.trim() ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <Search className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-sm font-medium">Comienza a escribir para buscar en todo DevJos Studio</p>
              <p className="text-xs text-slate-600">Ejemplos: "Solaria", "Cotización", "Reels", "Marcos"</p>
            </div>
          ) : totalResults === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <p className="text-sm">No se encontraron resultados para "{query}"</p>
            </div>
          ) : (
            <>
              {/* Clients section */}
              {results.clients.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-400" /> Clientes ({results.clients.length})
                  </h4>
                  <div className="space-y-1">
                    {results.clients.map(c => (
                      <div
                        key={c.id}
                        onClick={() => {
                          setSelectedClientId(c.id);
                          setCurrentView('clients');
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-200 flex items-center justify-between cursor-pointer group transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="w-7 h-7 rounded-full object-cover border border-slate-700"
                          />
                          <div>
                            <p className="text-xs font-semibold text-white group-hover:text-cyan-400">
                              {c.name}
                            </p>
                            <p className="text-[11px] text-slate-400">{c.company} • {c.email}</p>
                          </div>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects section */}
              {results.projects.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <FolderKanban className="w-3.5 h-3.5 text-cyan-400" /> Proyectos ({results.projects.length})
                  </h4>
                  <div className="space-y-1">
                    {results.projects.map(p => (
                      <div
                        key={p.id}
                        onClick={() => {
                          setSelectedProjectId(p.id);
                          setCurrentView('projects');
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-200 flex items-center justify-between cursor-pointer group transition-colors"
                      >
                        <div>
                          <p className="text-xs font-semibold text-white group-hover:text-cyan-400">
                            {p.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {p.category} • Estado: {p.status} • Entrega: {p.deliveryDate}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-slate-300">${p.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tasks section */}
              {results.tasks.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <CheckSquare className="w-3.5 h-3.5 text-amber-400" /> Tareas ({results.tasks.length})
                  </h4>
                  <div className="space-y-1">
                    {results.tasks.map(t => (
                      <div
                        key={t.id}
                        onClick={() => {
                          setCurrentView('tasks');
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-200 flex items-center justify-between cursor-pointer group transition-colors"
                      >
                        <div>
                          <p className="text-xs font-semibold text-white group-hover:text-amber-400">
                            {t.name}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            Prioridad: {t.priority} • Vence: {t.dueDate}
                          </p>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quotes section */}
              {results.quotes.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-purple-400" /> Cotizaciones ({results.quotes.length})
                  </h4>
                  <div className="space-y-1">
                    {results.quotes.map(qt => (
                      <div
                        key={qt.id}
                        onClick={() => {
                          setSelectedQuoteId(qt.id);
                          setCurrentView('quotes');
                          setIsSearchOpen(false);
                        }}
                        className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 text-slate-200 flex items-center justify-between cursor-pointer group transition-colors"
                      >
                        <div>
                          <p className="text-xs font-semibold text-white group-hover:text-purple-400">
                            {qt.quoteNumber}
                          </p>
                          <p className="text-[11px] text-slate-400">Total: {formatMoney(qt.total || 0)} • {qt.status}</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-purple-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
