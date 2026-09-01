import React, { useState } from 'react';
import {
  Users,
  Plus,
  Mail,
  Phone,
  DollarSign,
  Briefcase,
  CheckCircle2,
  Edit2,
  Trash2,
  Shield,
  Clock,
  KeyRound,
  Fingerprint,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/StatCard';
import { MemberModal } from './MemberModal';
import { TeamMember } from '../../types';
import { ROLE_PERMISSIONS } from '../../utils/permissions';

export const TeamView: React.FC = () => {
  const { team, addTeamMember, updateTeamMember, deleteTeamMember, tasks, sendPasswordReset, currentUser } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<TeamMember | null>(null);
  const [resetSentId, setResetSentId] = useState<string | null>(null);
  const [resetError, setResetError] = useState<string | null>(null);

  const handleSaveMember = (data: any) => {
    if (memberToEdit) {
      updateTeamMember(memberToEdit.id, data);
      setMemberToEdit(null);
    } else {
      addTeamMember(data);
    }
  };

  const handleSendPasswordReset = async (member: TeamMember) => {
    setResetError(null);
    const result = await sendPasswordReset(member.email);
    if (result.success) {
      setResetSentId(member.id);
      setTimeout(() => setResetSentId(null), 3000);
    } else {
      setResetError(result.message || 'No se pudo enviar el correo.');
      setTimeout(() => setResetError(null), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white font-display">Equipo & Cuentas de Acceso</h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Control de Roles Activo
            </span>
          </div>
          <p className="text-xs text-slate-400">
            {team.length} cuentas individuales para evitar errores, sobreescrituras y conflictos en proyectos y finanzas.
          </p>
        </div>

        <button
          onClick={() => {
            setMemberToEdit(null);
            setIsModalOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-blue-500/20 shrink-0"
        >
          <Plus className="w-4 h-4" /> Nuevo Colaborador
        </button>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {team.map((member) => {
          const assignedTasks = tasks.filter((t) => t.responsibleId === member.id);
          const pendingTasks = assignedTasks.filter((t) => t.status !== 'Completada');
          const isCurrentUser = currentUser?.id === member.id;
          const roleConfig = ROLE_PERMISSIONS[member.role] || ROLE_PERMISSIONS['Administrador'];

          return (
            <div
              key={member.id}
              className={`bg-slate-900/80 backdrop-blur-md border rounded-2xl p-5 shadow-sm transition-all flex flex-col justify-between space-y-4 group ${
                isCurrentUser ? 'border-cyan-500/60 shadow-cyan-500/10' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-slate-700 group-hover:border-cyan-500/50"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-bold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors font-display">
                          {member.name}
                        </h3>
                        {isCurrentUser && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                            TÚ
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-cyan-400 font-semibold">{member.role}</span>
                    </div>
                  </div>

                  <Badge variant={member.active ? 'success' : 'neutral'} size="sm">
                    {member.active ? 'Activo' : 'Inactivo'}
                  </Badge>
                </div>

                <div className="space-y-1.5 text-xs text-slate-400 pt-1">
                  <p className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </p>
                  {member.phone && (
                    <p className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                      <span>{member.phone}</span>
                    </p>
                  )}
                </div>

                {/* Role Permissions summary */}
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
                  <div className="flex items-center gap-1 font-semibold text-slate-300 mb-1">
                    <Shield className="w-3 h-3 text-purple-400" />
                    <span>Vistas:</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {roleConfig.allowedViews.map((v) => (
                      <span key={v} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Assigned tasks indicator */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Tareas asignadas:</span>
                  <span className="font-bold text-cyan-400">
                    {pendingTasks.length} pendientes ({assignedTasks.length} total)
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleSendPasswordReset(member)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] font-semibold transition-colors"
                    title="Enviarle un correo para que establezca/restablezca su propia contraseña"
                  >
                    {resetSentId === member.id ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <KeyRound className="w-3.5 h-3.5" />}
                    <span>
                      {resetSentId === member.id
                        ? 'Correo enviado'
                        : resetError && resetSentId === null
                        ? 'Error, reintenta'
                        : 'Restablecer clave'}
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => {
                      setMemberToEdit(member);
                      setIsModalOpen(true);
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`¿Eliminar al colaborador "${member.name}"?`)) {
                        deleteTeamMember(member.id);
                      }
                    }}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors"
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

      <MemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMember}
        memberToEdit={memberToEdit}
      />
    </div>
  );
};
