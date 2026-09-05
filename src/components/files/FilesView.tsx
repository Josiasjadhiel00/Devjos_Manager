import React, { useState, useRef } from 'react';
import {
  FolderOpen,
  Folder,
  File,
  Search,
  UploadCloud,
  HardDrive,
  CheckCircle,
  Download,
  Plus,
  Trash2,
  ExternalLink,
  Server,
  FileText,
  Image as ImageIcon,
  Film,
  Code,
  X,
  FileCheck,
  Share2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Badge } from '../ui/StatCard';
import { ProjectFile, FileFolder } from '../../types';

function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export const FilesView: React.FC = () => {
  const { files, clients, projects, settings, addFile, deleteFile } = useApp();

  const [activeFolder, setActiveFolder] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Upload modal state
  const [selectedFileObj, setSelectedFileObj] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string>('');
  const [newFileName, setNewFileName] = useState('');
  const [newFileFolder, setNewFileFolder] = useState<FileFolder>('Diseños');
  const [newFileClient, setNewFileClient] = useState('');
  const [newFileProject, setNewFileProject] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const folders: (FileFolder | 'all')[] = ['all', 'Cotización', 'Contrato', 'Diseños', 'Fotografías', 'Videos', 'Entrega'];

  const filteredFiles = files.filter((f) => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFolder = activeFolder === 'all' || f.folder === activeFolder;
    return matchesSearch && matchesFolder;
  });

  const getFileIcon = (type: string, name: string) => {
    const lowerName = name.toLowerCase();
    if (type.includes('image') || lowerName.endsWith('.png') || lowerName.endsWith('.jpg') || lowerName.endsWith('.jpeg') || lowerName.endsWith('.webp'))
      return <ImageIcon className="w-5 h-5 text-cyan-400" />;
    if (type.includes('video') || lowerName.endsWith('.mp4') || lowerName.endsWith('.mov') || lowerName.endsWith('.mkv'))
      return <Film className="w-5 h-5 text-purple-400" />;
    if (type.includes('code') || lowerName.endsWith('.ts') || lowerName.endsWith('.tsx') || lowerName.endsWith('.js') || lowerName.endsWith('.html') || lowerName.endsWith('.zip'))
      return <Code className="w-5 h-5 text-emerald-400" />;
    return <FileText className="w-5 h-5 text-blue-400" />;
  };

  const handleProcessRawFile = (file: File) => {
    setSelectedFileObj(file);
    setNewFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      setFileDataUrl((e.target?.result as string) || '');
    };
    reader.readAsDataURL(file);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessRawFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFileName.trim()) return;

    const rootNas = settings.nasRootFolder || '/volume1/DevJos_Studio_Storage';
    const computedNasPath = `${rootNas}/${newFileFolder}/${newFileName}`;

    addFile({
      name: newFileName,
      folder: newFileFolder,
      clientId: newFileClient || (clients[0]?.id || 'cli-1'),
      projectId: newFileProject || (projects[0]?.id || 'proj-1'),
      size: selectedFileObj ? formatBytes(selectedFileObj.size) : `${(Math.random() * 8 + 1).toFixed(1)} MB`,
      type: selectedFileObj ? selectedFileObj.type || 'document' : newFileName.endsWith('.pdf') ? 'application/pdf' : 'document',
      url: fileDataUrl || '#',
      fileDataUrl: fileDataUrl,
      nasPath: computedNasPath,
    });

    setNewFileName('');
    setSelectedFileObj(null);
    setFileDataUrl('');
    setIsUploadOpen(false);
  };

  const handleDownloadFile = (file: ProjectFile) => {
    if (file.fileDataUrl) {
      const a = document.createElement('a');
      a.href = file.fileDataUrl;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Create virtual placeholder text download
      const blob = new Blob([`DevJos Studio File Storage\n\nNombre: ${file.name}\nCarpeta: ${file.folder}\nFecha: ${file.uploadDate}\nNAS Path: ${file.nasPath || 'Sincronizado en NAS'}`], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name.includes('.') ? file.name : `${file.name}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Storage Architecture Info Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-[#07152f] to-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display font-bold text-sm text-white">
                DevJos NAS & Almacenamiento Centralizado
              </h3>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />{' '}
                Modo Demo
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Ruta de referencia:{' '}
              <span className="font-mono text-cyan-300">
                {settings.nasRootFolder || '/volume1/DevJos_Studio_Storage'}
              </span>
              {' '}— los archivos se registran aquí, pero aún no se transfieren a un NAS físico.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setSelectedFileObj(null);
            setFileDataUrl('');
            setNewFileName('');
            setIsUploadOpen(true);
          }}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20 shrink-0"
        >
          <UploadCloud className="w-4 h-4" /> Subir / Drag & Drop
        </button>
      </div>

      {/* Filter & Folder Browser */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md border border-slate-800 p-4 rounded-2xl">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Buscar archivo por nombre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
            {folders.map((folder) => (
              <button
                key={folder}
                onClick={() => setActiveFolder(folder)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  activeFolder === folder
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Folder className="w-3.5 h-3.5" />
                {folder === 'all' ? 'Todos los Archivos' : folder}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Files List / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFiles.map((file) => {
          const client = clients.find((c) => c.id === file.clientId);
          const project = projects.find((p) => p.id === file.projectId);

          return (
            <div
              key={file.id}
              className="bg-slate-900/80 backdrop-blur-md border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all flex items-start justify-between gap-3 group"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 shrink-0">
                  {getFileIcon(file.type || '', file.name)}
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-xs text-slate-100 group-hover:text-cyan-300 transition-colors truncate">
                    {file.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span className="font-medium text-cyan-400 bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                      {file.folder}
                    </span>
                    <span>{file.size}</span>
                    <span>•</span>
                    <span>{file.uploadDate}</span>
                  </div>
                  {(client || project) && (
                    <p className="text-[10px] text-slate-500 mt-1 truncate">
                      {client?.company || client?.name} {project ? `• ${project.name}` : ''}
                    </p>
                  )}
                  {file.nasPath && (
                    <p className="text-[9px] font-mono text-slate-600 truncate mt-0.5">
                      {file.nasPath}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleDownloadFile(file)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                  title="Descargar archivo"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    if (confirm(`¿Eliminar archivo "${file.name}"?`)) {
                      deleteFile(file.id);
                    }
                  }}
                  className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-500 hover:text-rose-400 transition-colors"
                  title="Eliminar"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload & Drag and Drop File Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-stretch sm:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-xs">
          <div
            className="w-full h-full sm:h-auto max-w-lg bg-slate-900 sm:border sm:border-slate-800 rounded-none sm:rounded-2xl shadow-2xl overflow-y-auto max-h-[92vh] sm:max-h-[88vh] animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-cyan-400" />
                <h3 className="font-display font-bold text-sm text-white">
                  Subir Archivo al NAS / Almacenamiento
                </h3>
              </div>
              <button
                onClick={() => setIsUploadOpen(false)}
                className="p-1 rounded text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-5 space-y-4">
              {/* Drag and Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-6 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-cyan-500 bg-cyan-950/30'
                    : selectedFileObj
                    ? 'border-emerald-500/50 bg-emerald-950/20'
                    : 'border-slate-800 hover:border-cyan-500/40 bg-slate-950/60'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      handleProcessRawFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />

                {selectedFileObj ? (
                  <div className="space-y-1">
                    <FileCheck className="w-8 h-8 mx-auto text-emerald-400" />
                    <p className="text-xs font-bold text-white truncate max-w-xs mx-auto">
                      {selectedFileObj.name}
                    </p>
                    <p className="text-[11px] text-slate-400">{formatBytes(selectedFileObj.size)}</p>
                    <p className="text-[10px] text-cyan-400 pt-1">Clic para cambiar de archivo</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <UploadCloud className="w-8 h-8 mx-auto text-cyan-400" />
                    <div>
                      <p className="text-xs font-bold text-slate-200">
                        Arrastra y suelta tu archivo aquí, o haz clic para explorar
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Soporta PDF, PNG, JPG, MP4, PSD, AI, ZIP, etc.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre del Archivo en NAS *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Brand_Guidelines_Solaria_v2.pdf"
                  value={newFileName}
                  onChange={(e) => setNewFileName(e.target.value)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Carpeta Destino en NAS</label>
                <select
                  value={newFileFolder}
                  onChange={(e) => setNewFileFolder(e.target.value as FileFolder)}
                  className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none"
                >
                  <option value="Cotización">Cotizaciones (/01_Cotizaciones)</option>
                  <option value="Contrato">Contratos (/02_Contratos)</option>
                  <option value="Diseños">Diseños (/03_Disenos_Branding)</option>
                  <option value="Fotografías">Fotografías (/04_Fotografia_RAW)</option>
                  <option value="Videos">Videos (/05_Video_Master)</option>
                  <option value="Entrega">Entregables Finales (/06_Entregables_Cliente)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Cliente Asociado</label>
                  <select
                    value={newFileClient}
                    onChange={(e) => setNewFileClient(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-2.5 py-2 text-xs text-slate-100 focus:outline-none"
                  >
                    <option value="">Ninguno</option>
                    {clients.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Proyecto Asociado</label>
                  <select
                    value={newFileProject}
                    onChange={(e) => setNewFileProject(e.target.value)}
                    className="w-full bg-slate-950/80 border border-slate-800 focus:border-cyan-500 rounded-xl px-2.5 py-2 text-xs text-slate-100 focus:outline-none"
                  >
                    <option value="">Ninguno</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-md shadow-cyan-500/20"
                >
                  Guardar & Sincronizar en NAS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
