import { useState, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Loader2, Image, Music, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface FileUploadProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  accept: string;
  type: 'image' | 'audio';
  folder?: string;
}

export const FileUpload = ({ 
  label, 
  value, 
  onChange, 
  accept, 
  type,
  folder = 'uploads'
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Dosya çok büyük. Maksimum 10MB yükleyebilirsiniz.');
      return;
    }

    setUploading(true);

    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('invite-assets')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (error) throw error;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('invite-assets')
        .getPublicUrl(data.path);

      const publicUrl = urlData.publicUrl;
      
      setPreview(publicUrl);
      onChange(publicUrl);
      toast.success('Dosya başarıyla yüklendi!');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Yükleme hatası: ' + (error.message || 'Bilinmeyen hata'));
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (!value) return;

    try {
      // Extract path from URL
      const url = new URL(value);
      const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/invite-assets\/(.+)/);
      
      if (pathMatch) {
        await supabase.storage.from('invite-assets').remove([pathMatch[1]]);
      }
    } catch (error) {
      // Ignore removal errors - file might already be deleted
    }

    setPreview(null);
    onChange('');
  };

  const handleUrlInput = (url: string) => {
    setPreview(url);
    onChange(url);
  };

  return (
    <div className="space-y-3">
      <Label>{label}</Label>
      
      {/* Preview */}
      {preview && (
        <div className="relative">
          {type === 'image' ? (
            <div className="relative group">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-40 object-cover rounded-lg border"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <a href={preview} target="_blank" rel="noopener noreferrer">
                  <Button type="button" variant="secondary" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </a>
                <Button type="button" variant="destructive" size="sm" onClick={handleRemove}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
              <Music className="w-8 h-8 text-amber-600" />
              <div className="flex-1 min-w-0">
                <audio controls className="w-full h-8">
                  <source src={preview} />
                </audio>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={handleRemove}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Upload Area */}
      {!preview && (
        <div 
          className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-amber-400 transition-colors cursor-pointer"
          onClick={() => inputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-amber-600 animate-spin" />
              <p className="text-sm text-gray-500">Yükleniyor...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {type === 'image' ? (
                <Image className="w-8 h-8 text-gray-400" />
              ) : (
                <Music className="w-8 h-8 text-gray-400" />
              )}
              <p className="text-sm text-gray-600">
                Dosya yüklemek için tıklayın
              </p>
              <p className="text-xs text-gray-400">
                {type === 'image' ? 'PNG, JPG, WEBP (maks 10MB)' : 'MP3, WAV, OGG (maks 10MB)'}
              </p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />
        </div>
      )}

      {/* Manual URL Input */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">veya</span>
        <Input
          placeholder="URL yapıştır..."
          value={preview || ''}
          onChange={(e) => handleUrlInput(e.target.value)}
          className="text-xs"
        />
      </div>
    </div>
  );
};