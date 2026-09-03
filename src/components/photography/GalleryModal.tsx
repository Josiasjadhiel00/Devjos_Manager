import React, { useState } from 'react';
import {
  X,
  Heart,
  Download,
  Share2,
  Check,
  Image as ImageIcon,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/StatCard';

export const GalleryModal: React.FC<{
  galleryId: string | null;
  onClose: () => void;
}> = ({ galleryId, onClose }) => {
  const { galleries, toggleGalleryImageSelection, clients } = useApp();

  const [activeFilter, setActiveFilter] = useState<'all' | 'selected'>('all');
  const [lightboxPhoto, setLightboxPhoto] = useState<any | null>(null);

  if (!galleryId) return null;
  const gallery = galleries.find((g) => g.id === galleryId);
  if (!gallery) return null;

  const client = clients.find((c) => c.id === gallery.clientId);
  const images = gallery.images || [];
  const selectedImages = images.filter((img) => img.selected);
  const displayedImages = activeFilter === 'selected' ? selectedImages : images;

  return (
    <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center sm:p-4 bg-black/85 backdrop-blur-xs">
      <div
        className="w-full h-full sm:h-auto max-w-5xl bg-slate-900 sm:border sm:border-slate-800 rounded-none sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Toolbar */}
        <div className="p-4 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/80">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-base text-white">{gallery.title}</h3>
              <Badge variant={gallery.clientShared ? 'success' : 'neutral'} size="sm">
                {gallery.clientShared ? 'Compartida con Cliente' : 'Privada'}
              </Badge>
            </div>
            <p className="text-xs text-slate-400">
              Cliente: {client?.name} ({client?.company}) • Creada el {gallery.createdAt}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Selection Counter Pill */}
            <div className="px-3 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
              <span>
                {selectedImages.length} / {images.length} Seleccionadas
              </span>
            </div>

            {/* Filter Toggle */}
            <div className="flex bg-slate-950 rounded-xl p-0.5 border border-slate-800 text-xs">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  activeFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400'
                }`}
              >
                Todas ({images.length})
              </button>
              <button
                onClick={() => setActiveFilter('selected')}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors ${
                  activeFilter === 'selected' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400'
                }`}
              >
                Favoritas ({selectedImages.length})
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {displayedImages.length === 0 ? (
            <div className="py-20 text-center text-slate-500 space-y-2">
              <ImageIcon className="w-10 h-10 mx-auto text-slate-600" />
              <p className="text-sm">No hay fotografías para mostrar con este filtro</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {displayedImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-950 aspect-4/3 shadow-sm hover:shadow-lg transition-all"
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onClick={() => setLightboxPhoto(image)}
                  />

                  {/* Top action heart badge */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleGalleryImageSelection(gallery.id, image.id);
                    }}
                    className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-md transition-all ${
                      image.selected
                        ? 'bg-rose-600 text-white shadow-lg'
                        : 'bg-black/60 text-slate-300 hover:text-white hover:bg-black/80'
                    }`}
                    title={image.selected ? 'Quitar de seleccionadas' : 'Marcar como seleccionada'}
                  >
                    <Heart className={`w-3.5 h-3.5 ${image.selected ? 'fill-white' : ''}`} />
                  </button>

                  {/* Bottom Meta */}
                  <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-[10px] text-white flex items-center justify-between opacity-90 group-hover:opacity-100 transition-opacity">
                    <span className="truncate max-w-[120px] font-mono">{image.title}</span>
                    <button
                      onClick={() => setLightboxPhoto(image)}
                      className="px-2 py-0.5 rounded bg-slate-800/80 text-cyan-300 font-semibold"
                    >
                      Ampliar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer client action prompt */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p className="text-slate-400">
            Haz clic en el corazón de cada foto para seleccionarla para retoque y entrega de alta resolución.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => alert(`¡Selección de ${selectedImages.length} fotos confirmada y enviada a edición en DevJos Studio!`)}
              className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
            >
              <Check className="w-4 h-4" /> Confirmar Selección ({selectedImages.length})
            </button>
          </div>
        </div>

        {/* Lightbox Modal */}
        {lightboxPhoto && (
          <div
            className="fixed inset-0 z-60 bg-black/95 flex flex-col items-center justify-center p-4 animate-in fade-in"
            onClick={() => setLightboxPhoto(null)}
          >
            <div className="relative max-w-4xl max-h-[85vh] flex flex-col items-center" onClick={(e) => e.stopPropagation()}>
              <img
                src={lightboxPhoto.url}
                alt={lightboxPhoto.title}
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-slate-800"
              />
              <div className="mt-3 flex items-center justify-between w-full text-white text-xs">
                <span className="font-mono font-bold">{lightboxPhoto.title}</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleGalleryImageSelection(gallery.id, lightboxPhoto.id)}
                    className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 ${
                      lightboxPhoto.selected
                        ? 'bg-rose-600 text-white'
                        : 'bg-slate-800 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${lightboxPhoto.selected ? 'fill-white' : ''}`} />
                    {lightboxPhoto.selected ? 'Seleccionada' : 'Seleccionar'}
                  </button>
                  <button
                    onClick={() => setLightboxPhoto(null)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
