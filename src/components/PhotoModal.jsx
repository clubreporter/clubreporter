import { useState, useRef } from 'react';
import { entities } from '@/api/entities';
import { Core } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { Camera, X, Upload } from 'lucide-react';

export default function PhotoModal({ match, onPhotoAdded, onClose, isPremium }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [caption, setCaption] = useState('');
  const inputRef = useRef();

  const photoCount = match.photos?.length || 0;
  const atLimit = !isPremium && photoCount >= 1;

  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file || atLimit) return;
    setUploading(true);
    const { file_url } = await Core.UploadFile({ file });
    const updatedPhotos = [...(match.photos || []), file_url];
    await entities.Match.update(match.id, { photos: updatedPhotos });
    onPhotoAdded({ photoUrl: file_url, caption });
    setUploading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50" onClick={onClose}>
      <div className="w-full max-w-lg bg-card rounded-t-3xl p-5 space-y-4 shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base flex items-center gap-2"><Camera className="w-4 h-4" /> Add Photo</h3>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-muted"><X className="w-4 h-4" /></button>
        </div>

        {atLimit ? (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center space-y-2">
            <p className="font-bold text-amber-800 text-sm">Photo limit reached</p>
            <p className="text-xs text-amber-700">Basic plan allows 1 photo per match.</p>
            <p className="text-xs text-amber-600">Upgrade to Premium for unlimited photos.</p>
          </div>
        ) : (
          <>
            {!preview ? (
              <button onClick={() => inputRef.current?.click()}
                className="w-full border-2 border-dashed border-border rounded-2xl h-40 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                <Upload className="w-8 h-8" />
                <p className="text-sm font-semibold">Tap to choose photo</p>
                {!isPremium && <p className="text-xs opacity-60">1 photo remaining (Basic plan)</p>}
              </button>
            ) : (
              <div className="relative rounded-2xl overflow-hidden">
                <img src={preview} alt="Preview" className="w-full h-48 object-cover" />
                <button onClick={() => { setPreview(null); setFile(null); }}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
            {preview && (
              <input
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Add a caption (optional)"
                className="w-full border border-[#d1d5db] bg-white rounded-xl px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-ring"
              />
            )}
          </>
        )}

        <div className="flex gap-3">
          <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
          {!atLimit && (
            <Button onClick={handleUpload} disabled={!file || uploading} className="flex-1 bg-green-700 hover:bg-green-800">
              {uploading ? 'Uploading…' : 'Add to Match'}
            </Button>
          )}
          {atLimit && (
            <Button onClick={() => window.location.href = '/billing'} className="flex-1 bg-green-700 hover:bg-green-800 text-sm">
              Upgrade to Premium
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}