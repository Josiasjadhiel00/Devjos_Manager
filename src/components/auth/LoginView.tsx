import React, { useState } from 'react';
import {
  Shield,
  Layers,
  Lock,
  Mail,
  User,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  ExternalLink,
  Users,
  Eye,
  EyeOff,
  Building2,
  Fingerprint,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ROLE_PERMISSIONS } from '../../utils/permissions';
import { RoleType } from '../../types';

interface LoginViewProps {
  onSuccess?: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onSuccess }) => {
  const { team, clients, login, loginAsMember, loginAsClient, settings } = useApp();
  const [tab, setTab] = useState<'quick' | 'credentials' | 'client'>('quick');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');

  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const result = login(email, password);
    if (!result.success) {
      setErrorMessage(result.message || 'Credenciales inválidas. Revisa el correo y contraseña.');
    } else {
      if (onSuccess) onSuccess();
    }
  };

  const handleQuickMemberLogin = (memberId: string) => {
    loginAsMember(memberId);
    if (onSuccess) onSuccess();
  };

  const handleClientLogin = () => {
    if (!selectedClientId) return;
    loginAsClient(selectedClientId);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="min-h-screen bg-[#07152f] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background glowing gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* Left Brand Panel */}
          <div className="lg:col-span-5 p-8 sm:p-10 bg-gradient-to-br from-slate-950 via-slate-900 to-[#0c1a3b] border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between">
            <div>
              {/* Studio Logo */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#168dda] via-[#7a3fc4] to-[#1bb7e8] flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Layers className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="font-display font-black text-xl text-white tracking-tight">
                    {settings.studioName || 'DEVJOS STUDIO'}
                  </h1>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-cyan-400">
                    Control de Acceso & Roles
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-white font-display mb-2">
                Ingreso Seguro para el Equipo
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Cada colaborador cuenta con su perfil autenticado y permisos específicos para evitar sobreescrituras, errores y conflictos en proyectos y finanzas.
              </p>

              {/* Roles Summary */}
              <div className="mt-6 space-y-2">
                <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                  Roles Configurados:
                </p>
                <div className="space-y-1.5 text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    <span><strong className="text-slate-200">Director / Admin:</strong> Control financiero, NAS y equipo.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span><strong className="text-slate-200">Developer & Diseñador:</strong> Tareas, Kanban y entregables.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    <span><strong className="text-slate-200">Foto & Video:</strong> Galerías, RAWs y versiones.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span><strong className="text-slate-200">Cliente Externo:</strong> Portal de aprobación restringido.</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800/80 text-[11px] text-slate-500 flex items-center justify-between">
              <span>DevJos Studio Suite v2.6</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5" /> Encriptación Activa
              </span>
            </div>
          </div>

          {/* Right Action Panel */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              {/* Tab Selector */}
              <div className="flex rounded-xl bg-slate-950/80 p-1 border border-slate-800 mb-6">
                <button
                  onClick={() => { setTab('quick'); setErrorMessage(''); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    tab === 'quick'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Fingerprint className="w-3.5 h-3.5" />
                  <span>1-Clic Miembros</span>
                </button>
                <button
                  onClick={() => { setTab('credentials'); setErrorMessage(''); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    tab === 'credentials'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Correo & Clave</span>
                </button>
                <button
                  onClick={() => { setTab('client'); setErrorMessage(''); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    tab === 'client'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Portal Cliente</span>
                </button>
              </div>

              {/* Tab 1: 1-Click Quick Member Selector */}
              {tab === 'quick' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-slate-300">
                      Selecciona tu perfil de colaborador:
                    </p>
                    <span className="text-[10px] text-slate-500">
                      {team.length} miembros registrados
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[340px] overflow-y-auto pr-1">
                    {team.map((member) => {
                      const roleConfig = ROLE_PERMISSIONS[member.role] || ROLE_PERMISSIONS['Administrador'];
                      return (
                        <div
                          key={member.id}
                          onClick={() => handleQuickMemberLogin(member.id)}
                          className="p-3 rounded-2xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/70 hover:border-cyan-500/50 cursor-pointer transition-all flex items-center gap-3 group active:scale-98"
                        >
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-10 h-10 rounded-full object-cover border border-cyan-500/40 group-hover:border-cyan-400"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                              {member.name}
                            </p>
                            <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-900 text-cyan-400 border border-slate-700 mt-0.5">
                              {member.role}
                            </span>
                          </div>
                          <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Tab 2: Custom Credentials Login */}
              {tab === 'credentials' && (
                <form onSubmit={handleCredentialsLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Correo Electrónico
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu.nombre@devjosstudio.com"
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 placeholder-slate-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Contraseña
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-xs focus:outline-none focus:border-cyan-500 placeholder-slate-500 font-mono"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400">
                    <p className="font-semibold text-slate-300 mb-1">💡 Cuentas Demo de Prueba:</p>
                    <div className="grid grid-cols-2 gap-1 font-mono text-[10px]">
                      <span>Admin: <strong className="text-cyan-400">josias@devjosstudio.com</strong> (clave: admin)</span>
                      <span>Dev: <strong className="text-cyan-400">carlos.dev@devjosstudio.com</strong> (clave: dev)</span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all active:scale-98 flex items-center justify-center gap-2"
                  >
                    <span>Iniciar Sesión en el Estudio</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}

              {/* Tab 3: Client Portal Access */}
              {tab === 'client' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-xs text-purple-200">
                    <p className="font-bold text-sm text-purple-300 mb-1">
                      Acceso Exclusivo para Clientes
                    </p>
                    <p className="text-[11px] text-slate-300">
                      Entorno restringido para que el cliente pueda revisar y aprobar cotizaciones con firma digital, descargar fotografías y comprobar pagos.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Seleccionar Cliente a Previsualizar
                    </label>
                    <select
                      value={selectedClientId}
                      onChange={(e) => setSelectedClientId(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:border-purple-500 cursor-pointer"
                    >
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} — {c.company || 'Cliente'} ({c.email})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleClientLogin}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition-all active:scale-98 flex items-center justify-center gap-2"
                  >
                    <span>Entrar como Cliente al Portal</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Bottom Support & Quick Help */}
            <div className="pt-4 border-t border-slate-800 text-center">
              <p className="text-[11px] text-slate-500">
                ¿Necesitas una cuenta nueva o restablecer clave? Solicítalo al Director en la sección de <strong className="text-slate-400">Equipo</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
