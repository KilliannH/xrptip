import { useState, useRef, useEffect } from 'react';
import { uploadAPI } from '../api';

export const ImageUpload = ({ 
  type = 'avatar', // 'avatar' or 'banner'
  currentImage,
  onUploadSuccess,
  onUploadError
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const fileInputRef = useRef(null);

  // Mettre à jour le preview quand currentImage change
  useEffect(() => {
    setPreview(currentImage || '');
  }, [currentImage]);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation taille (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      onUploadError?.('Fichier trop volumineux (max 5MB)');
      return;
    }

    // Validation type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      onUploadError?.('Type de fichier non autorisé. Utilisez JPG, PNG, GIF ou WebP.');
      return;
    }

    // Preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);

    // Upload vers S3
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append(type, file);

      const response = type === 'avatar' 
        ? await uploadAPI.uploadAvatar(formData)
        : await uploadAPI.uploadBanner(formData);

      // Succès
      const imageUrl = response.data.url;
      setPreview(imageUrl);
      onUploadSuccess?.(imageUrl);
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError?.(error.message || 'Erreur lors de l\'upload');
      // Reset preview en cas d'erreur
      setPreview(currentImage || '');
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const isAvatar = type === 'avatar';

  return (
    <div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      {isAvatar ? (
        // Avatar upload
        <div className="flex items-start gap-4">
          {/* Preview */}
          <div className="shrink-0">
            <div className="relative h-24 w-24 overflow-hidden rounded-full border-2 border-white/10 bg-white/5">
              {preview ? (
                <img
                  src={preview}
                  alt="Avatar preview"
                  className="h-full w-full object-cover"
                  onError={() => setPreview('')}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <svg className="h-12 w-12 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                  <div className="spinner" style={{ width: '24px', height: '24px' }} />
                </div>
              )}
            </div>
          </div>

          {/* Upload button */}
          <div className="flex-1">
            <button
              type="button"
              onClick={handleClick}
              disabled={uploading}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-all hover:border-xrpBlue/50 hover:bg-xrpBlue/10 hover:text-xrpBlue disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? 'Upload en cours...' : 'Choisir une photo'}
            </button>
            <p className="mt-2 text-xs text-white/50">
              💡 Format: JPG, PNG, GIF, WebP · Max: 5MB
            </p>
          </div>
        </div>
      ) : (
        // Banner upload
        <div className="space-y-4">
          {/* Preview */}
          <div className="relative h-40 w-full overflow-hidden rounded-xl border-2 border-white/10 bg-white/5">
            {preview ? (
              <img
                src={preview}
                alt="Banner preview"
                className="h-full w-full object-cover"
                onError={() => setPreview('')}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <svg className="h-16 w-16 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                <div className="spinner" style={{ width: '32px', height: '32px' }} />
              </div>
            )}
          </div>

          {/* Upload button */}
          <div>
            <button
              type="button"
              onClick={handleClick}
              disabled={uploading}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white transition-all hover:border-xrpBlue/50 hover:bg-xrpBlue/10 hover:text-xrpBlue disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? 'Upload en cours...' : 'Choisir une bannière'}
            </button>
            <p className="mt-2 text-xs text-white/50">
              💡 Recommandé: 1500x500px · Format: JPG, PNG, WebP · Max: 5MB
            </p>
          </div>
        </div>
      )}
    </div>
  );
};