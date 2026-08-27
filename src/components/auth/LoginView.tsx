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
  const { team, clients, login, settings } = useApp();
  const [tab, setTab] = useState<'quick' | 'credentials' | 'client'>('quick');
  
  // Profile selection state
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [memberPassword, setMemberPassword] = useState('');
  const [showMemberPassword, setShowMemberPassword] = useState(false);
  
  // Credentials tab state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Client tab state
  const [selectedClientId, setSelectedClientId] = useState(clients[0]?.id || '');
  const [clientPassword, setClientPassword] = useState('');
  const [showClientPassword, setShowClientPassword] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const selectedMember = team.find(m => m.id === selectedMemberId);

  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember) return;
    setErrorMessage('');

    if (!memberPassword.trim()) {
      setErrorMessage('Por favor ingresa tu contraseña para continuar.');
      return;
    }

    const result = login(selectedMember.email, memberPassword);
    if (!result.success) {
      setErrorMessage(result.message || 'Contraseña incorrecta para este perfil.');
    } else {
      if (onSuccess) onSuccess();
    }
  };

  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    if (!password.trim()) {
      setErrorMessage('Por favor ingresa tu contraseña.');
      return;
    }
    const result = login(email, password);
    if (!result.success) {
      setErrorMessage(result.message || 'Credenciales inválidas. Revisa el correo y contraseña.');
    } else {
      if (onSuccess) onSuccess();
    }
  };

  const handleClientLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClientId) return;
    const client = clients.find(c => c.id === selectedClientId);
    if (!client) return;
    
    setErrorMessage('');
    const result = login(client.email, clientPassword);
    if (!result.success) {
      setErrorMessage(result.message || 'Contraseña o clave de acceso incorrecta.');
    } else {
      if (onSuccess) onSuccess();
    }
  };

  return (
    <div className="min-h-screen bg-[#07152f] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background glowing gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-4xl bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          
          {/* Left Brand Panel */}
          <div className="lg:col-span-5 p-8 sm:p-10 bg-gradient-to-br from-slate-950 via-[#071329] to-[#0c1a3b] border-b lg:border-b-0 lg:border-r border-slate-800 flex flex-col justify-between relative overflow-hidden">
            {/* Ambient background glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center sm:items-start text-center sm:text-left">
              {/* Studio Big Logo */}
              <div className="mb-6">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#168dda] via-[#7a3fc4] to-[#1bb7e8] flex items-center justify-center shadow-xl shadow-cyan-500/25 border border-white/20">
                  <Layers className="w-11 h-11 text-white drop-shadow-md" />
                </div>
              </div>

              {/* Big Title & Subtitle */}
              <h1 className="font-display font-black text-3xl sm:text-4xl text-white tracking-tight leading-none mb-2">
                {settings.studioName || 'DevJos Studio'}
              </h1>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-semibold tracking-wide mb-6">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>Suite Profesional de Gestión</span>
              </div>

              {/* Warm Welcome Message */}
              <div className="space-y-3 bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 sm:p-5 backdrop-blur-md">
                <h2 className="text-base sm:text-lg font-bold text-white font-display flex items-center gap-2 justify-center sm:justify-start">
                  <span>¡Bienvenido a tu espacio!</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Inicia sesión para gestionar tus proyectos, coordinar con tu equipo, revisar finanzas y entregar resultados con la máxima calidad.
                </p>
              </div>
            </div>

            <div className="relative z-10 pt-6 mt-6 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
              <span>DevJos Studio Suite</span>
              <span className="flex items-center gap-1 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" /> Sistema Protegido
              </span>
            </div>
          </div>

          {/* Right Action Panel */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
            <div>
              {/* Tab Selector */}
              <div className="flex rounded-xl bg-slate-950/80 p-1 border border-slate-800 mb-6">
                <button
                  type="button"
                  onClick={() => { setTab('quick'); setErrorMessage(''); setSelectedMemberId(null); setMemberPassword(''); }}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    tab === 'quick'
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Elegir Perfil</span>
                </button>
                <button
                  type="button"
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
                  type="button"
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

              {/* Tab 1: Profile Selector + Obligatory Password */}
              {tab === 'quick' && (
                <div className="space-y-4">
                  {!selectedMember ? (
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-semibold text-slate-300">
                          Selecciona tu usuario para ingresar:
                        </p>
                        <span className="text-[10px] text-slate-500">
                          {team.length} perfiles activos
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[330px] overflow-y-auto pr-1">
                        {team.map((member) => (
                          <div
                            key={member.id}
                            onClick={() => {
                              setSelectedMemberId(member.id);
                              setMemberPassword('');
                              setErrorMessage('');
                            }}
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
                            <Lock className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleMemberSubmit} className="space-y-4 animate-in fade-in zoom-in-95 duration-150">
                      {/* Selected Member Header Card */}
                      <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-cyan-500/40 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img
                            src={selectedMember.avatar}
                            alt={selectedMember.name}
                            className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400 shadow-md"
                          />
                          <div>
                            <h3 className="text-sm font-bold text-white">
                              {selectedMember.name}
                            </h3>
                            <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 mt-0.5">
                              {selectedMember.role}
                            </span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMemberId(null);
                            setMemberPassword('');
                            setErrorMessage('');
                          }}
                          className="text-[11px] font-semibold text-slate-400 hover:text-cyan-300 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/40 transition-colors"
                        >
                          Cambiar
                        </button>
                      </div>

                      {/* Password Input for Selected Member */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          Ingresa tu Contraseña de Acceso:
                        </label>
                        <div className="relative">
                          <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" />
                          <input
                            type={showMemberPassword ? 'text' : 'password'}
                            value={memberPassword}
                            onChange={(e) => setMemberPassword(e.target.value)}
                            placeholder="Introduce tu contraseña"
                            autoFocus
                            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/90 border border-slate-700 focus:border-cyan-500 text-slate-100 text-xs focus:outline-none placeholder-slate-500 font-mono transition-all"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowMemberPassword(!showMemberPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 text-xs"
                          >
                            {showMemberPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {errorMessage && (
                        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          <span>{errorMessage}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all active:scale-98 flex items-center justify-center gap-2"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Validar Contraseña & Entrar</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  )}
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
                <form onSubmit={handleClientLogin} className="space-y-4">
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
                      Seleccionar Cuenta de Cliente
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

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-purple-500/20 transition-all active:scale-98 flex items-center justify-center gap-2"
                  >
                    <span>Entrar como Cliente al Portal</span>
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </form>
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
