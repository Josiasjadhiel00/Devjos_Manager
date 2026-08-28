import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Building,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Percent,
  HardDrive,
  Database,
  Download,
  Upload,
  Save,
  CheckCircle2,
  Bell,
  Sparkles,
  RotateCcw,
  Server,
  Activity,
  FolderTree,
  Shield,
  Key,
  Globe,
  Share2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NasBrandType } from '../../types';
import { getCurrencySymbol } from '../../utils/formatCurrency';

export const SettingsView: React.FC = () => {
  const { 
    settings, 
    updateSettings, 
    testNasConnection, 
    createNasFoldersTree, 
    resetToDemoData,
    testFirestoreConnection,
    forceUploadToFirestore,
    forceDownloadFromFirestore,
    syncToPostgres,
    checkVercelDbStatus,
    refreshDataFromDb,
    syncStatus,
    isDatabaseConnected,
    clients,
  } = useApp();

  const [formData, setFormData] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync formData when settings change
  React.useEffect(() => {
    setFormData({ ...settings });
  }, [settings]);
  const [isTestingNas, setIsTestingNas] = useState(false);
  const [nasTestResult, setNasTestResult] = useState<{
    success: boolean;
    latencyMs: number;
    message: string;
  } | null>(null);
  const [isCreatingFolders, setIsCreatingFolders] = useState(false);
  const [foldersCreatedSuccess, setFoldersCreatedSuccess] = useState(false);

  // Vercel Postgres diagnostic state
  const [isTestingVercelDb, setIsTestingVercelDb] = useState(false);
  const [isSyncingVercelDb, setIsSyncingVercelDb] = useState(false);
  const [vercelDbResult, setVercelDbResult] = useState<{
    success: boolean;
    message: string;
    connected?: boolean;
    totalClientsInPostgres?: number;
  } | null>(null);

  // Firebase Cloud sync diagnostic
  const [isTestingFirestore, setIsTestingFirestore] = useState(false);
  const [isUploadingToCloud, setIsUploadingToCloud] = useState(false);
  const [firestoreTestResult, setFirestoreTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const handleTestVercelDb = async () => {
    setIsTestingVercelDb(true);
    setVercelDbResult(null);
    try {
      const res = await checkVercelDbStatus();
      setVercelDbResult(res);
    } catch (e: any) {
      setVercelDbResult({
        success: false,
        message: 'Error al comprobar base de datos Vercel: ' + (e?.message || String(e)),
      });
    } finally {
      setIsTestingVercelDb(false);
    }
  };

  const handleSyncToVercelDb = async () => {
    setIsSyncingVercelDb(true);
    try {
      const res = await syncToPostgres();
      setVercelDbResult(res);
    } catch (e: any) {
      setVercelDbResult({
        success: false,
        message: 'Error al subir a PostgreSQL Vercel: ' + (e?.message || String(e)),
      });
    } finally {
      setIsSyncingVercelDb(false);
    }
  };

  const handleDownloadFromVercelDb = async () => {
    setIsSyncingVercelDb(true);
    try {
      const data = await refreshDataFromDb();
      if (data) {
        setVercelDbResult({
          success: true,
          message: `¡Datos descargados desde Vercel Postgres con éxito! (${data.clients?.length || 0} clientes cargados).`,
        });
      } else {
        setVercelDbResult({
          success: false,
          message: 'No se recibieron datos desde el backend de Vercel.',
        });
      }
    } catch (e: any) {
      setVercelDbResult({
        success: false,
        message: 'Error al descargar datos de Vercel: ' + (e?.message || String(e)),
      });
    } finally {
      setIsSyncingVercelDb(false);
    }
  };

  const handleTestFirestore = async () => {
    setIsTestingFirestore(true);
    setFirestoreTestResult(null);
    try {
      const res = await testFirestoreConnection();
      setFirestoreTestResult(res);
    } catch (e: any) {
      setFirestoreTestResult({
        success: false,
        message: e?.message || 'Error al conectar con Firebase Firestore',
      });
    } finally {
      setIsTestingFirestore(false);
    }
  };

  const handleForceUpload = async () => {
    setIsUploadingToCloud(true);
    try {
      const res = await forceUploadToFirestore();
      setFirestoreTestResult(res);
    } catch (e: any) {
      setFirestoreTestResult({
        success: false,
        message: e?.message || 'Error al subir datos a Firebase Firestore',
      });
    } finally {
      setIsUploadingToCloud(false);
    }
  };

  const handleForceDownload = async () => {
    setIsUploadingToCloud(true);
    try {
      const res = await forceDownloadFromFirestore();
      setFirestoreTestResult(res);
    } catch (e: any) {
      setFirestoreTestResult({
        success: false,
        message: e?.message || 'Error al descargar datos de Firebase Firestore',
      });
    } finally {
      setIsUploadingToCloud(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleNasBrandChange = (brand: NasBrandType) => {
    let defaultPort = 5001;
    let defaultProtocol: 'HTTPS' | 'HTTP' | 'WebDAV' | 'SMB/CIFS' | 'FTP' = 'HTTPS';
    let defaultPath = '/volume1/DevJos_Studio_Storage';

    if (brand === 'Synology') {
      defaultPort = 5001;
      defaultProtocol = 'HTTPS';
      defaultPath = '/volume1/DevJos_Studio_Storage';
    } else if (brand === 'TrueNAS') {
      defaultPort = 443;
      defaultProtocol = 'HTTPS';
      defaultPath = '/mnt/pool0/devjos-vault';
    } else if (brand === 'QNAP') {
      defaultPort = 8080;
      defaultProtocol = 'HTTP';
      defaultPath = '/share/CACHEDEV1_DATA/DevJos_Studio';
    } else if (brand === 'WebDAV') {
      defaultPort = 443;
      defaultProtocol = 'WebDAV';
      defaultPath = '/webdav/devjos_storage';
    } else if (brand === 'SMB') {
      defaultPort = 445;
      defaultProtocol = 'SMB/CIFS';
      defaultPath = '//192.168.1.120/DevJos_Studio';
    }

    setFormData({
      ...formData,
      nasBrand: brand,
      nasPort: defaultPort,
      nasProtocol: defaultProtocol,
      nasRootFolder: defaultPath,
    });
  };

  const handleTestNas = async () => {
    setIsTestingNas(true);
    setNasTestResult(null);
    try {
      // First save current form data for NAS
      updateSettings({
        nasStorageEnabled: formData.nasStorageEnabled,
        nasBrand: formData.nasBrand,
        nasHost: formData.nasHost,
        nasPort: formData.nasPort,
        nasProtocol: formData.nasProtocol,
        nasRootFolder: formData.nasRootFolder,
        nasUsername: formData.nasUsername,
        nasSharedLinksPrefix: formData.nasSharedLinksPrefix,
      });

      const result = await testNasConnection();
      setNasTestResult(result);
    } catch (err: any) {
      setNasTestResult({
        success: false,
        latencyMs: 0,
        message: err?.message || 'Error al intentar conectar con el servidor NAS.',
      });
    } finally {
      setIsTestingNas(false);
    }
  };

  const handleCreateFoldersTree = async () => {
    setIsCreatingFolders(true);
    try {
      await createNasFoldersTree();
      setFoldersCreatedSuccess(true);
      setTimeout(() => setFoldersCreatedSuccess(false), 4000);
    } finally {
      setIsCreatingFolders(false);
    }
  };

  const handleExportBackup = () => {
    const fullBackup = localStorage.getItem('devjos_manager_v1_store');
    if (!fullBackup) {
      alert('No hay datos guardados para exportar');
      return;
    }
    const blob = new Blob([fullBackup], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `devjos_manager_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = event.target?.result as string;
        JSON.parse(json);
        localStorage.setItem('devjos_manager_v1_store', json);
        alert('¡Copia de seguridad restaurada correctamente! La página se recargará.');
        window.location.reload();
      } catch (err) {
        alert('Error al leer o procesar el archivo JSON de respaldo.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl space-y-6 animate-in fade-in duration-200 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-base font-bold text-white font-display">Configuración de DevJos Studio</h2>
          <p className="text-xs text-slate-400">
            Ajustes del servidor NAS, identidad de estudio, reglas de automatización y respaldos.
          </p>
        </div>

        {savedSuccess && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" /> Cambios Guardados con Éxito
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* NAS CONFIGURATION (TOP PRIORITY REQUESTED BY USER) */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-5 sm:p-6 space-y-5 shadow-lg shadow-cyan-950/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-display">
                    Servidor NAS & Almacenamiento Privado
                  </h3>
                  <p className="text-xs text-slate-400">
                    Conecta tu Synology, TrueNAS, QNAP o servidor local para guardar archivos pesados y entregar a clientes.
                  </p>
                </div>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.nasStorageEnabled || false}
                onChange={(e) => setFormData({ ...formData, nasStorageEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
              <span className="ml-2.5 text-xs font-semibold text-slate-200">
                {formData.nasStorageEnabled ? 'NAS Activo' : 'NAS Desactivado'}
              </span>
            </label>
          </div>

          {formData.nasStorageEnabled && (
            <div className="space-y-4">
              {/* Presets */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Tipo o Marca de Servidor NAS
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  {(['Synology', 'TrueNAS', 'QNAP', 'WebDAV', 'SMB', 'Personalizado'] as NasBrandType[]).map((brand) => (
                    <button
                      key={brand}
                      type="button"
                      onClick={() => handleNasBrandChange(brand)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition-all border text-center ${
                        formData.nasBrand === brand
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm shadow-cyan-500/20'
                          : 'bg-slate-950/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-900'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* Server Host & Port */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Dirección IP / Host / Dominio del NAS *
                  </label>
                  <div className="relative">
                    <Globe className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="Ej. 192.168.1.120 o nas.devjosstudio.com"
                      value={formData.nasHost || ''}
                      onChange={(e) => setFormData({ ...formData, nasHost: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-100 focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Puerto del Servicio
                  </label>
                  <input
                    type="number"
                    placeholder="5001"
                    value={formData.nasPort || 5001}
                    onChange={(e) => setFormData({ ...formData, nasPort: parseInt(e.target.value) || 5001 })}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-100 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* Protocol & Root Folder */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Protocolo</label>
                  <select
                    value={formData.nasProtocol || 'HTTPS'}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        nasProtocol: e.target.value as any,
                      })
                    }
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none font-mono"
                  >
                    <option value="HTTPS">HTTPS (Seguro - Recomendado)</option>
                    <option value="HTTP">HTTP</option>
                    <option value="WebDAV">WebDAV</option>
                    <option value="SMB/CIFS">SMB / CIFS (Red Local)</option>
                    <option value="FTP">FTP / SFTP</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Ruta / Carpeta Raíz en el NAS
                  </label>
                  <div className="relative">
                    <HardDrive className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder="/volume1/DevJos_Studio_Storage"
                      value={formData.nasRootFolder || formData.nasStoragePath || ''}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          nasRootFolder: e.target.value,
                          nasStoragePath: e.target.value,
                        })
                      }
                      className="w-full pl-8 pr-3 py-2 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-100 focus:outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Credentials & Shared Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Usuario del NAS / API Key
                  </label>
                  <input
                    type="text"
                    placeholder="admin_devjos"
                    value={formData.nasUsername || ''}
                    onChange={(e) => setFormData({ ...formData, nasUsername: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Contraseña / Token de Autenticación
                  </label>
                  <div className="relative">
                    <Key className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      placeholder="••••••••••••"
                      value={formData.nasPassword || ''}
                      onChange={(e) => setFormData({ ...formData, nasPassword: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-100 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Public Sharing Links Prefix */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Prefijo de Enlaces Compartidos para Clientes (Descargas Portal)
                </label>
                <div className="relative">
                  <Share2 className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="https://nas.devjosstudio.com/sharing/ o http://quickconnect.to/devjos/"
                    value={formData.nasSharedLinksPrefix || ''}
                    onChange={(e) => setFormData({ ...formData, nasSharedLinksPrefix: e.target.value })}
                    className="w-full pl-8 pr-3 py-2 bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs text-slate-100 focus:outline-none font-mono"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Los clientes descargarán las galerías y entregables finales usando este túnel de tu NAS sin límite de gigabytes.
                </p>
              </div>

              {/* Actions: Test Connection & Create Directory Structure */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleTestNas}
                  disabled={isTestingNas}
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingNas ? 'animate-spin' : ''}`} />
                  {isTestingNas ? 'Verificando Conexión...' : 'Probar Conexión con el NAS'}
                </button>

                <button
                  type="button"
                  onClick={handleCreateFoldersTree}
                  disabled={isCreatingFolders}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center gap-2 border border-slate-700 disabled:opacity-50"
                >
                  <FolderTree className="w-3.5 h-3.5 text-purple-400" />
                  {isCreatingFolders ? 'Creando estructura...' : 'Generar Árbol de Carpetas de Estudio'}
                </button>

                {nasTestResult && (
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ${
                      nasTestResult.success
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}
                  >
                    {nasTestResult.success ? (
                      <>
                        <Activity className="w-3.5 h-3.5" />
                        <span>Online (Latencia: {nasTestResult.latencyMs}ms)</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Fallo de conexión</span>
                      </>
                    )}
                  </div>
                )}

                {foldersCreatedSuccess && (
                  <span className="text-xs font-bold text-purple-400 bg-purple-500/10 px-3 py-1.5 rounded-xl border border-purple-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Árbol de 6 directorios creado en NAS
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Studio Identity */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-cyan-400 font-display flex items-center gap-2">
            <Building className="w-4 h-4" /> Datos de Identidad & Contacto
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nombre del Estudio / Empresa
              </label>
              <input
                type="text"
                value={formData.studioName || ''}
                onChange={(e) => setFormData({ ...formData, studioName: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Eslogan / Especialidad
              </label>
              <input
                type="text"
                value={formData.tagline || ''}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Email Oficial</label>
              <input
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Teléfono / WhatsApp de Contacto
              </label>
              <input
                type="tel"
                value={formData.phone || formData.whatsapp || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value, whatsapp: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">Dirección del Estudio</label>
              <input
                type="text"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Automation Rules */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-amber-400 font-display flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Reglas de Automatización de Flujos
          </h3>

          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={formData.automationRules?.autoCreateProjectOnQuoteAccept ?? true}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    automationRules: {
                      ...formData.automationRules,
                      autoCreateProjectOnQuoteAccept: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 text-cyan-600 rounded bg-slate-900 border-slate-700"
              />
              <div>
                <p className="text-xs font-bold text-white">Crear Proyecto al Aceptar Cotización</p>
                <p className="text-[11px] text-slate-400">
                  Inicia un proyecto automáticamente cuando el cliente firma o acepta la cotización.
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={formData.automationRules?.autoCreateKickoffTasks ?? true}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    automationRules: {
                      ...formData.automationRules,
                      autoCreateKickoffTasks: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 text-cyan-600 rounded bg-slate-900 border-slate-700"
              />
              <div>
                <p className="text-xs font-bold text-white">Generar Tareas Iniciales de Kickoff</p>
                <p className="text-[11px] text-slate-400">
                  Asigna tareas de brief y estructura inicial al equipo en proyectos recién creados.
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                checked={formData.automationRules?.autoRecordAdvanceDeposit ?? true}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    automationRules: {
                      ...formData.automationRules,
                      autoRecordAdvanceDeposit: e.target.checked,
                    },
                  })
                }
                className="w-4 h-4 text-cyan-600 rounded bg-slate-900 border-slate-700"
              />
              <div>
                <p className="text-xs font-bold text-white">Registrar Ingreso de Anticipo 50%</p>
                <p className="text-[11px] text-slate-400">
                  Crea automáticamente un registro de ingreso por el 50% de anticipo acordado.
                </p>
              </div>
            </label>
          </div>
        </div>

        {/* Financial defaults */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-cyan-400 font-display flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Configuración Fiscal & Moneda
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Moneda Principal</label>
              <select
                value={formData.currency || 'DOP'}
                onChange={(e) => {
                  const newCurr = e.target.value;
                  setFormData({ 
                    ...formData, 
                    currency: newCurr, 
                    currencySymbol: getCurrencySymbol(newCurr) 
                  });
                }}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none font-semibold text-cyan-300"
              >
                <option value="DOP">DOP (RD$) - Pesos Dominicanos</option>
                <option value="USD">USD ($) - Dólares Americanos</option>
                <option value="EUR">EUR (€) - Euros</option>
                <option value="MXN">MXN (MX$) - Pesos Mexicanos</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                RNC / Cédula / Tax ID
              </label>
              <input
                type="text"
                value={formData.taxId || ''}
                onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Tasa de Impuesto / ITBIS (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.taxRate || 18}
                onChange={(e) =>
                  setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })
                }
                className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Cloud Database Synchronization Status */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-cyan-400 font-display flex items-center gap-2">
              <Server className="w-4 h-4" /> Sincronización en la Nube Multi-Cuenta (Firebase Firestore)
            </h3>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Proyecto: estudio-devjos
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Permite que todos los cambios (clientes registrados, cotizaciones, pagos, proyectos) se sincronicen en tiempo real entre múltiples cuentas de Google, navegadores y computadoras.
          </p>

          {/* Current local state stats */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <span className="text-slate-400">Clientes en este navegador:</span>
            <span className="font-bold text-white font-mono bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded-lg border border-cyan-500/30">
              {clients.length} clientes
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Estado de conexión:</span>
            {isDatabaseConnected && syncStatus === 'connected' ? (
              <span className="font-semibold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Conectado a la nube
              </span>
            ) : (
              <span className="font-semibold text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Modo Local (Base de datos sin activar en Firebase)
              </span>
            )}
          </div>

          {/* Cloud Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleTestFirestore}
              disabled={isTestingFirestore}
              className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-md shadow-cyan-600/20"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingFirestore ? 'animate-spin' : ''}`} />
              {isTestingFirestore ? 'Comprobando...' : 'Diagnosticar Conexión'}
            </button>

            <button
              type="button"
              onClick={handleForceUpload}
              disabled={isUploadingToCloud}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs transition-colors flex items-center gap-1.5 border border-slate-700 disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              {isUploadingToCloud ? 'Subiendo...' : 'Subir mis datos actuales a Firestore'}
            </button>

            <button
              type="button"
              onClick={handleForceDownload}
              disabled={isUploadingToCloud}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5 border border-slate-700 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar datos desde Firestore
            </button>
          </div>

          {firestoreTestResult && (
            <div
              className={`p-3.5 rounded-xl text-xs leading-relaxed border ${
                firestoreTestResult.success
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-300 border-rose-500/30'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {firestoreTestResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">{firestoreTestResult.message}</p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Setup Instructions Box for Firebase */}
          {(!isDatabaseConnected || syncStatus !== 'connected') && (
            <div className="p-4 rounded-xl bg-slate-950/90 border border-amber-500/30 space-y-2.5">
              <div className="flex items-center gap-2 text-amber-400 text-xs font-bold">
                <AlertCircle className="w-4 h-4" />
                ¿Por qué una cuenta tiene 7 clientes y la otra 8?
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Actualmente tu proyecto de Firebase <strong className="text-white font-mono">estudio-devjos</strong> no tiene creada la base de datos Firestore. Por eso cada navegador guarda sus clientes en su propia memoria local aislada.
              </p>
              <div className="text-xs text-slate-300 space-y-1.5 pt-1">
                <p className="font-bold text-white">Para activar la sincronización en tiempo real en 1 minuto:</p>
                <ol className="list-decimal list-inside space-y-1 text-slate-400">
                  <li>
                    Abre la consola de Firebase:{' '}
                    <a
                      href="https://console.firebase.google.com/project/estudio-devjos/firestore"
                      target="_blank"
                      rel="noreferrer"
                      className="text-cyan-400 underline font-semibold hover:text-cyan-300"
                    >
                      https://console.firebase.google.com/project/estudio-devjos/firestore
                    </a>
                  </li>
                  <li>Haz clic en el botón <strong className="text-white">"Crear base de datos"</strong> (puedes elegir ubicación <span className="text-cyan-300 font-mono">nam5 (us-central)</span> y modo de prueba).</li>
                  <li>
                    En la pestaña <strong className="text-white">Reglas (Rules)</strong>, asegúrate de permitir lectura/escritura pública temporalmente para tu estudio:
                    <pre className="mt-1 p-2 rounded-lg bg-slate-900 text-[11px] font-mono text-cyan-300 border border-slate-800 select-all overflow-x-auto">
{`rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}`}
                    </pre>
                  </li>
                  <li>Pulsa <strong className="text-white">Publicar</strong> y luego vuelve aquí y pulsa <strong className="text-cyan-400">"Subir mis datos actuales a Firestore"</strong>.</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Vercel Postgres & PostgreSQL Database Section */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-blue-400 font-display flex items-center gap-2">
              <Database className="w-4 h-4" /> Base de Datos PostgreSQL en Vercel (Vercel Postgres / Neon)
            </h3>
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-blue-500/10 text-cyan-400 border border-cyan-500/20">
              Vercel Serverless API
            </span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Cuando la app está desplegada en <strong className="text-white">Vercel</strong> (<span className="text-cyan-300 font-mono">devjos-manager.vercel.app</span>), todas las consultas y registros se almacenan y consultan directamente a través de las funciones Serverless conectadas a tu base de datos PostgreSQL (<span className="text-blue-300 font-mono">POSTGRES_URL</span> o <span className="text-blue-300 font-mono">DATABASE_URL</span>).
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleTestVercelDb}
              disabled={isTestingVercelDb}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 disabled:opacity-50 shadow-md shadow-blue-600/20"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingVercelDb ? 'animate-spin' : ''}`} />
              {isTestingVercelDb ? 'Comprobando Vercel...' : 'Diagnosticar Vercel Postgres'}
            </button>

            <button
              type="button"
              onClick={handleSyncToVercelDb}
              disabled={isSyncingVercelDb}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs transition-colors flex items-center gap-1.5 border border-slate-700 disabled:opacity-50"
            >
              <Upload className="w-3.5 h-3.5" />
              {isSyncingVercelDb ? 'Subiendo...' : 'Subir mis datos actuales a Vercel Postgres'}
            </button>

            <button
              type="button"
              onClick={handleDownloadFromVercelDb}
              disabled={isSyncingVercelDb}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors flex items-center gap-1.5 border border-slate-700 disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              Descargar datos desde Vercel Postgres
            </button>
          </div>

          {vercelDbResult && (
            <div
              className={`p-3.5 rounded-xl text-xs leading-relaxed border ${
                vercelDbResult.success || vercelDbResult.connected
                  ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
              }`}
            >
              <div className="flex items-start gap-2.5">
                {vercelDbResult.success || vercelDbResult.connected ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <p className="font-semibold">{vercelDbResult.message}</p>
                  {vercelDbResult.totalClientsInPostgres !== undefined && (
                    <p className="text-[11px] text-slate-300">
                      Total de clientes guardados en la tabla PostgreSQL: <strong className="text-white font-mono">{vercelDbResult.totalClientsInPostgres}</strong>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-400 space-y-1">
            <p className="font-bold text-slate-300">💡 Configuración en el panel de Vercel:</p>
            <p>
              En tu proyecto de Vercel (<span className="text-cyan-300 font-mono">Settings &gt; Environment Variables</span>), asegúrate de tener conectada la base de datos Vercel Postgres o Neon (con la variable <span className="text-cyan-300 font-mono">POSTGRES_URL</span> o <span className="text-cyan-300 font-mono">DATABASE_URL</span>).
            </p>
          </div>
        </div>

        {/* Database Backup & NAS Export Section */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-purple-400 font-display flex items-center gap-2">
            <Database className="w-4 h-4" /> Base de Datos, Respaldos & Migración
          </h3>
          <p className="text-xs text-slate-400">
            Exporta todos los clientes, proyectos, tareas, cotizaciones y registros contables en un archivo JSON seguro para migración o backup.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleExportBackup}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold text-xs transition-colors flex items-center gap-2 border border-slate-700"
            >
              <Download className="w-4 h-4" /> Exportar Copia de Seguridad JSON
            </button>

            <label className="px-4 py-2.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-semibold text-xs transition-colors flex items-center gap-2 border border-purple-500/30 cursor-pointer">
              <Upload className="w-4 h-4" /> Restaurar Respaldo
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>

            <button
              type="button"
              onClick={() => {
                if (confirm('¿Restablecer los datos a la demostración inicial de DevJos Studio?')) {
                  resetToDemoData();
                  alert('¡Datos restablecidos!');
                }
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-200 font-semibold text-xs transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Restablecer Demo
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-semibold text-xs transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5"
          >
            <Save className="w-4 h-4" /> Guardar Todos los Ajustes
          </button>
        </div>
      </form>
    </div>
  );
};
