import React, { useRef, useState } from 'react';
import { Camera, Loader2, User as UserIcon } from 'lucide-react';

interface AvatarUploadProps {
  value?: string;
  onChange: (url: string) => void;
  /** Se conserva por compatibilidad con quien use el componente; ya no se
   * usa para subir a un bucket externo — la imagen se guarda como parte
   * del propio registro (cliente/colaborador) en la base de datos. */
  storagePath?: string;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_MAP: Record<string, string> = {
  sm: 'w-12 h-12',
  md: 'w-20 h-20',
  lg: 'w-28 h-28',
};

// Redimensiona y comprime la imagen en el navegador y la devuelve como una
// imagen JPEG codificada en base64 (data URL), lista para guardarse como
// cualquier otro campo de texto — sin depender de almacenamiento externo.
function resizeImageToDataUrl(file: File, maxDim = 400, quality = 0.8): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('El archivo no es una imagen válida.'));
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > maxDim) {
          height = Math.round(height * (maxDim / width));
          width = maxDim;
        } else if (height >= width && height > maxDim) {
          width = Math.round(width * (maxDim / height));
          height = maxDim;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('No se pudo procesar la imagen.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export const AvatarUpload: React.FC<AvatarUploadProps> = ({ value, onChange, size = 'md' }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setError(null);

    if (!file.type.startsWith('image/')) {
      setError('Selecciona un archivo de imagen (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError('La imagen es muy grande (máximo 8MB).');
      return;
    }

    setUploading(true);
    try {
      const dataUrl = await resizeImageToDataUrl(file);
      onChange(dataUrl);
    } catch (err: any) {
      console.error('Error procesando la foto de perfil:', err);
      setError(err?.message || 'No se pudo procesar la imagen. Intenta de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div
        className={`relative ${SIZE_MAP[size]} rounded-full overflow-hidden bg-slate-800 border-2 border-slate-700 flex items-center justify-center shrink-0`}
      >
        {value ? (
          <img src={value} alt="Foto de perfil" className="w-full h-full object-cover" />
        ) : (
          <UserIcon className="w-1/2 h-1/2 text-slate-500" />
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-white animate-spin" />
          </div>
        )}
      </div>

      <div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <Camera className="w-3.5 h-3.5" />
          {uploading ? 'Procesando...' : value ? 'Cambiar foto' : 'Subir foto'}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        {error ? (
          <p className="text-[11px] text-rose-400 mt-1 max-w-[200px]">{error}</p>
        ) : (
          <p className="text-[10px] text-slate-500 mt-1">Desde tu cámara o galería · máx. 8MB</p>
        )}
      </div>
    </div>
  );
};
