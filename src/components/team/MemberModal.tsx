import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Shield, Briefcase, Lock, Key, CheckCircle2 } from 'lucide-react';
import { TeamMember, RoleType } from '../../types';
import { ROLE_PERMISSIONS } from '../../utils/permissions';

interface MemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  memberToEdit?: TeamMember | null;
}

export const MemberModal: React.FC<MemberModalProps> = ({
  isOpen,
  onClose,
  onSave,
  memberToEdit,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    role: 'Developer' as RoleType,
    email: '',
    phone: '',
    avatar: '',
    active: true,
    skills: [] as string[],
  });

  useEffect(() => {
    if (memberToEdit) {
      setFormData({
        name: memberToEdit.name || '',
        role: memberToEdit.role || 'Developer',
        email: memberToEdit.email || '',
        phone: memberToEdit.phone || '',
        avatar: memberToEdit.avatar || '',
        active: memberToEdit.active !== false,
        skills: memberToEdit.skills || [],
      });
    } else {
      setFormData({
        name: '',
        role: 'Developer',
        email: '',
        phone: '',
        avatar: '',
        active: true,
        skills: ['React', 'TypeScript', 'Tailwind'],
      });
    }
  }, [memberToEdit, isOpen]);

  if (!isOpen) return null;

  const roleConfig = ROLE_PERMISSIONS[formData.role] || ROLE_PERMISSIONS['Administrador'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div>
            <h3 className="font-display font-bold text-base text-white">
              {memberToEdit ? 'Editar Miembro del Equipo' : 'Nuevo Integrante del Equipo'}
            </h3>
            <p className="text-xs text-slate-400">Credenciales de acceso y asignación de permisos</p>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre Completo *</label>
            <input
              type="text"
              required
              placeholder="Ej. Carlos Mendoza"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Rol / Especialidad</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as RoleType })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-2.5 py-2 text-xs text-slate-100 focus:outline-none"
              >
                <option value="Administrador">Director / Administrador</option>
                <option value="Developer">Desarrollador Software</option>
                <option value="Diseñador">Diseñador UI/UX & Branding</option>
                <option value="Fotógrafo">Fotógrafo / Editor</option>
                <option value="Videógrafo">Videógrafo / Editor</option>
                <option value="Contenido">Community Manager / Contenido</option>
                <option value="Finanzas">Finanzas</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Estado</label>
              <select
                value={formData.active ? 'true' : 'false'}
                onChange={(e) => setFormData({ ...formData, active: e.target.value === 'true' })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-2.5 py-2 text-xs text-slate-100 focus:outline-none"
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
          </div>

          {/* Role permissions summary preview */}
          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-slate-200">
              <Shield className="w-3.5 h-3.5 text-cyan-400" />
              <span>Permisos del Rol ({formData.role}):</span>
            </div>
            <p className="text-[10px] text-slate-400">{roleConfig.description}</p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Profesional (Usuario de Login) *</label>
            <input
              type="email"
              required
              placeholder="nombre@devjosstudio.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
            />
          </div>

          {!memberToEdit && (
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-[11px] text-cyan-200 flex items-start gap-2">
              <Key className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <span>
                Después de guardar, ve a su tarjeta en "Equipo & Roles" y presiona
                <strong> "Dar Acceso"</strong> para crear su cuenta real y enviarle el
                correo para que ponga su propia contraseña.
              </span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Teléfono / WhatsApp</label>
            <input
              type="tel"
              placeholder="+1 809 555 0199"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">URL de Foto / Avatar</label>
            <input
              type="url"
              placeholder="https://..."
              value={formData.avatar}
              onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none font-mono text-[11px]"
            />
          </div>

          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold"
            >
              {memberToEdit ? 'Guardar Cambios' : 'Agregar al Equipo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
