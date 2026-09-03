import React, { useState } from 'react';
import {
  X,
  User,
  Mail,
  Phone,
  Shield,
  Key,
  CheckCircle2,
  Copy,
  ExternalLink,
  LogOut,
  Layers,
  Sparkles,
  Lock,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ROLE_PERMISSIONS } from '../../utils/permissions';
import { updatePassword } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { AvatarUpload } from '../common/AvatarUpload';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { currentUser, logout, team, updateTeamMember, setIsAuthModalOpen } = useApp();
  const [isCopied, setIsCopied] = useState(false);
  const [currentMember, setCurrentMember] = useState(() => {
    return team.find(m => m.id === currentUser?.id) || null;
  });

  const [editName, setEditName] = useState(currentUser?.name || '');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '');
  const [editAvatar, setEditAvatar] = useState(currentUser?.avatar || '');
  const [editBio, setEditBio] = useState(currentMember?.bio || '');
  const [newPassword, setNewPassword] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  if (!isOpen || !currentUser) return null;

  const roleConfig = ROLE_PERMISSIONS[currentUser.role] || ROLE_PERMISSIONS['Administrador'];

  const handleCopyAccessLink = () => {
    const url = window.location.origin;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    if (currentUser.id && currentUser.role !== 'Cliente') {
      const updates: any = {
        name: editName,
        phone: editPhone,
        avatar: editAvatar,
        bio: editBio,
      };
      updateTeamMember(currentUser.id, updates);

      if (newPassword.trim()) {
        if (newPassword.trim().length < 6) {
          setPasswordError('La nueva contraseña debe tener al menos 6 caracteres.');
          return;
        }
        setIsSavingPassword(true);
        try {
          if (!auth.currentUser) throw new Error('no-session');
          await updatePassword(auth.currentUser, newPassword.trim());
          setNewPassword('');
        } catch (err: any) {
          if (err?.code === 'auth/requires-recent-login') {
            setPasswordError('Por seguridad, cierra sesión y vuelve a entrar antes de cambiar tu contraseña.');
          } else {
            setPasswordError('No se pudo cambiar la contraseña. Intenta de nuevo.');
          }
          setIsSavingPassword(false);
          return;
        }
        setIsSavingPassword(false);
      }

      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 2000);
    }
  };

  const handleSwitchAccount = () => {
    onClose();
    setIsAuthModalOpen(true);
  };

  const handleLogOut = () => {
    logout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
              <User className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-display">
                Mi Perfil & Cuenta
              </h2>
              <p className="text-xs text-slate-400">
                Información de colaborador y permisos activos
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Avatar and Identity */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <img
              src={editAvatar || currentUser.avatar}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-500/40"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white truncate">
                  {currentUser.name}
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                {currentUser.email}
              </p>
              <p className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                <CheckCircle2 className="w-3 h-3" /> Sesión iniciada y activa
              </p>
            </div>
          </div>

          {/* Role Permissions Card */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                <Shield className="w-4 h-4 text-purple-400" />
                <span>Nivel de Permisos ({roleConfig.name})</span>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              {roleConfig.description}
            </p>
            <div className="pt-2 flex flex-wrap gap-1.5">
              {roleConfig.allowedViews.map((v) => (
                <span
                  key={v}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900 text-slate-300 border border-slate-700"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>

          {/* Edit Form */}
          {currentUser.role !== 'Cliente' && (
            <form onSubmit={handleSaveProfile} className="space-y-3 pt-2 border-t border-slate-800">
              <p className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Editar Datos de Perfil
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Teléfono / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                  Foto de Perfil
                </label>
                <AvatarUpload
                  value={editAvatar}
                  onChange={setEditAvatar}
                  storagePath={`avatars/team/${currentUser.id}`}
                  size="md"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Nueva Contraseña (Opcional)
                </label>
                <div className="relative">
                  <Key className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Dejar en blanco para mantener la actual"
                    className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-cyan-500 placeholder-slate-500"
                  />
                </div>
                {passwordError && (
                  <p className="mt-1.5 text-[11px] text-rose-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{passwordError}</span>
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors shadow-md shadow-cyan-500/20 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSavingPassword ? 'Guardando...' : 'Guardar Cambios'}
                </button>
                {isSaved && (
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Guardado
                  </span>
                )}
              </div>
            </form>
          )}

          {/* Quick Copy Link for Team */}
          <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-cyan-300">Enlace para tu Equipo</p>
              <p className="text-[11px] text-slate-300">Copia y envía la URL para que tus colaboradores entren.</p>
            </div>
            <button
              onClick={handleCopyAccessLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow transition-all active:scale-95"
            >
              {isCopied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{isCopied ? '¡Copiado!' : 'Copiar URL'}</span>
            </button>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            onClick={handleSwitchAccount}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>Cambiar de Usuario</span>
          </button>

          <button
            onClick={handleLogOut}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-semibold border border-rose-500/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    </div>
  );
};
