import React from 'react';
import { X, Bell, Sparkles, DollarSign, FolderKanban, Camera, FileText, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

function timeAgo(isoOrText: string): string {
  const date = new Date(isoOrText);
  if (isNaN(date.getTime())) return isoOrText; // valores viejos tipo "Justo ahora"
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Justo ahora';
  if (diffMin < 60) return `Hace ${diffMin} min`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `Hace ${diffHr} h`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `Hace ${diffDay} d`;
  return date.toLocaleDateString();
}

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationOpen,
    setIsNotificationOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    clearAllNotifications,
  } = useApp();

  if (!isNotificationOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'quote':
        return <FileText className="w-4 h-4 text-purple-400" />;
      case 'payment':
        return <DollarSign className="w-4 h-4 text-emerald-400" />;
      case 'session':
        return <Camera className="w-4 h-4 text-cyan-400" />;
      case 'project':
        return <FolderKanban className="w-4 h-4 text-blue-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-amber-400" />;
    }
  };

  const handleClearAll = () => {
    if (notifications.length === 0) return;
    if (confirm('¿Borrar todas las notificaciones? No se puede deshacer.')) {
      clearAllNotifications();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end">
      <div
        className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60 flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-cyan-400" />
            <h3 className="font-display font-bold text-base text-white">Notificaciones</h3>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={markAllNotificationsRead}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold px-2 py-1 rounded hover:bg-slate-800 transition-colors"
            >
              Marcar leídas
            </button>
            <button
              onClick={handleClearAll}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold px-2 py-1 rounded hover:bg-slate-800 transition-colors"
            >
              Limpiar todas
            </button>
            <button
              onClick={() => setIsNotificationOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-slate-500 space-y-2">
              <Bell className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-sm">No tienes notificaciones pendientes</p>
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`group p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  n.read
                    ? 'bg-slate-900/50 border-slate-800 text-slate-400'
                    : 'bg-slate-800/80 border-slate-700 text-slate-200 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-800 border border-slate-700/80 shrink-0">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <p className={`text-xs font-bold truncate ${n.read ? 'text-slate-300' : 'text-white'}`}>
                        {n.title}
                      </p>
                      <span className="text-[10px] text-slate-500 shrink-0">{timeAgo(n.timestamp)}</span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed pr-5">{n.message}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteNotification(n.id);
                  }}
                  className="absolute bottom-3 right-3 p-1 rounded-md text-slate-600 hover:text-rose-400 hover:bg-slate-900 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Eliminar notificación"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
