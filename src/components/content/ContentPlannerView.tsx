import React, { useState } from 'react';
import {
  Share2,
  Search,
  Plus,
  Calendar,
  Instagram,
  Facebook,
  Linkedin,
  Video,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Send,
  Building2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/StatCard';

interface SocialPost {
  id: string;
  clientId: string;
  platform: 'Instagram' | 'TikTok' | 'Facebook' | 'LinkedIn';
  contentType: 'Reel' | 'Carrusel' | 'Post Único' | 'Historia';
  title: string;
  copyText: string;
  hashtags: string;
  scheduledDate: string;
  scheduledTime: string;
  status: 'Idea' | 'Guion listo' | 'Diseñado' | 'Aprobado por Cliente' | 'Publicado';
  mediaUrl?: string;
}

const initialPosts: SocialPost[] = [
  {
    id: 'post-1',
    clientId: 'cli-1',
    platform: 'Instagram',
    contentType: 'Carrusel',
    title: '5 Consejos para Optimizar la Conversión de tu Ecommerce en 2026',
    copyText: '¿Sabías que un checkout simplificado aumenta las ventas hasta un 35%? Desliza para ver la guía paso a paso 🚀.',
    hashtags: '#Ecommerce #ConversionRate #UXDesign #DevJosStudio',
    scheduledDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    scheduledTime: '18:00',
    status: 'Aprobado por Cliente',
    mediaUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'post-2',
    clientId: 'cli-2',
    platform: 'TikTok',
    contentType: 'Reel',
    title: 'Detrás de Cámaras: Sesión Fotográfica Gastronómica',
    copyText: 'Cómo iluminamos el nuevo menú de temporada con luces continuas Aputure 📸',
    hashtags: '#FoodPhotography #BehindTheScenes #StudioLighting',
    scheduledDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    scheduledTime: '12:30',
    status: 'Diseñado',
    mediaUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'post-3',
    clientId: 'cli-3',
    platform: 'LinkedIn',
    contentType: 'Post Único',
    title: 'Lanzamiento de Plataforma Cloud Empresarial',
    copyText: 'Orgullosos de presentar la nueva infraestructura cloud que desarrollamos junto al equipo de NexaCorp.',
    hashtags: '#CloudSolutions #SoftwareEngineering #TechLaunch',
    scheduledDate: new Date(Date.now() + 4 * 86400000).toISOString().split('T')[0],
    scheduledTime: '09:00',
    status: 'Guion listo',
    mediaUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80',
  },
];

export const ContentPlannerView: React.FC = () => {
  const { clients } = useApp();
  const [posts, setPosts] = useState<SocialPost[]>(initialPosts);
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [postTitle, setPostTitle] = useState('');
  const [postClientId, setPostClientId] = useState(clients[0]?.id || '');
  const [postPlatform, setPostPlatform] = useState<SocialPost['platform']>('Instagram');
  const [postType, setPostType] = useState<SocialPost['contentType']>('Carrusel');
  const [postCopy, setPostCopy] = useState('');
  const [postHashtags, setPostHashtags] = useState('');
  const [postDate, setPostDate] = useState(new Date().toISOString().split('T')[0]);
  const [postTime, setPostTime] = useState('15:00');

  const filteredPosts = posts.filter(p => {
    const client = clients.find(c => c.id === p.clientId);
    const text = `${p.title} ${p.copyText} ${client?.name || ''}`.toLowerCase();
    const matchesSearch = text.includes(searchQuery.toLowerCase());
    const matchesPlatform = platformFilter === 'all' || p.platform === platformFilter;
    return matchesSearch && matchesPlatform;
  });

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postTitle.trim()) return;

    const newPost: SocialPost = {
      id: 'post-' + Date.now(),
      clientId: postClientId,
      platform: postPlatform,
      contentType: postType,
      title: postTitle,
      copyText: postCopy,
      hashtags: postHashtags,
      scheduledDate: postDate,
      scheduledTime: postTime,
      status: 'Idea',
      mediaUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    };

    setPosts(prev => [newPost, ...prev]);
    setIsModalOpen(false);
    setPostTitle('');
    setPostCopy('');
    setPostHashtags('');
  };

  const handleUpdateStatus = (id: string, newStatus: SocialPost['status']) => {
    setPosts(prev => prev.map(p => (p.id === id ? { ...p, status: newStatus } : p)));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white font-display flex items-center gap-2">
            <Share2 className="w-5 h-5 text-pink-400" />
            Planificador de Contenido & Redes Sociales
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Organiza publicaciones, copys, reels y aprobaciones de contenido para tus clientes
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-semibold text-xs shadow-md shadow-pink-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Nueva Publicación</span>
        </button>
      </div>

      {/* Filter and search bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por tema o cliente..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-pink-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['all', 'Instagram', 'TikTok', 'LinkedIn', 'Facebook'].map(p => (
            <button
              key={p}
              onClick={() => setPlatformFilter(p)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                platformFilter === p
                  ? 'bg-pink-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {p === 'all' ? 'Todas las Redes' : p}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Planned Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPosts.map(post => {
          const client = clients.find(c => c.id === post.clientId);
          return (
            <div
              key={post.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden flex flex-col hover:border-slate-700 transition-all shadow-xl group"
            >
              {/* Media Thumbnail */}
              <div className="relative h-44 bg-slate-950 overflow-hidden">
                <img
                  src={post.mediaUrl}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/20">
                    {post.platform}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-pink-500/80 text-[10px] font-bold text-white">
                    {post.contentType}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <span className="flex items-center gap-1 text-[11px] font-medium text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-pink-400" />
                    {post.scheduledDate} a las {post.scheduledTime}
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-semibold">
                      <Building2 className="w-3 h-3 text-cyan-400" /> {client?.name}
                    </span>
                    <Badge
                      variant={
                        post.status === 'Publicado'
                          ? 'emerald'
                          : post.status === 'Aprobado por Cliente'
                          ? 'blue'
                          : post.status === 'Diseñado'
                          ? 'purple'
                          : 'amber'
                      }
                    >
                      {post.status}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-white text-sm font-display line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1.5 line-clamp-3 bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/80">
                    {post.copyText}
                  </p>
                  <p className="text-[11px] text-pink-400 mt-1 font-mono truncate">
                    {post.hashtags}
                  </p>
                </div>

                {/* Status Switcher Action */}
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Estado:</span>
                  <select
                    value={post.status}
                    onChange={e => handleUpdateStatus(post.id, e.target.value as any)}
                    className="px-2 py-1 rounded-lg bg-slate-800 border border-slate-700 text-[11px] text-cyan-300 font-semibold focus:outline-none focus:border-pink-500 cursor-pointer"
                  >
                    <option value="Idea">Idea</option>
                    <option value="Guion listo">Guión listo</option>
                    <option value="Diseñado">Diseñado</option>
                    <option value="Aprobado por Cliente">Aprobado por Cliente</option>
                    <option value="Publicado">Publicado</option>
                  </select>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center sm:p-4 bg-black/75 backdrop-blur-xs">
          <div
            className="w-full h-full sm:h-auto max-w-lg bg-slate-900 sm:border sm:border-slate-800 rounded-none sm:rounded-2xl shadow-2xl overflow-y-auto max-h-[92vh] sm:max-h-[88vh] animate-in zoom-in-95 duration-150"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-pink-500/20 text-pink-400">
                  <Share2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-sm text-white">Planificar Publicación</h3>
                  <p className="text-[11px] text-slate-400">Crea copys, hashtags y programa fecha de publicación</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded-lg hover:bg-slate-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Título / Tema del Post
                </label>
                <input
                  type="text"
                  value={postTitle}
                  onChange={e => setPostTitle(e.target.value)}
                  placeholder="Ej: 3 Errores comunes al crear contenido en video"
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-pink-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Cliente
                  </label>
                  <select
                    value={postClientId}
                    onChange={e => setPostClientId(e.target.value)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-pink-500"
                  >
                    {clients.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Plataforma
                  </label>
                  <select
                    value={postPlatform}
                    onChange={e => setPostPlatform(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-pink-500"
                  >
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Facebook">Facebook</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Formato
                  </label>
                  <select
                    value={postType}
                    onChange={e => setPostType(e.target.value as any)}
                    className="w-full px-2.5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-pink-500"
                  >
                    <option value="Carrusel">Carrusel</option>
                    <option value="Reel">Reel / Video</option>
                    <option value="Post Único">Post Único</option>
                    <option value="Historia">Historia</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Copy / Texto de la publicación
                </label>
                <textarea
                  rows={3}
                  value={postCopy}
                  onChange={e => setPostCopy(e.target.value)}
                  placeholder="Escribe el texto principal, llamado a la acción y enlaces..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Fecha de Publicación
                  </label>
                  <input
                    type="date"
                    value={postDate}
                    onChange={e => setPostDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Hora Programada
                  </label>
                  <input
                    type="time"
                    value={postTime}
                    onChange={e => setPostTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-pink-500"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white text-xs font-semibold shadow-md shadow-pink-500/20"
                >
                  Guardar Publicación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
