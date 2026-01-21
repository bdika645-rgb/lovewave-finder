import { useState, useRef } from 'react';
import { Plus, X, GripVertical, Star, Loader2, Camera, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePhotos } from '@/hooks/usePhotos';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import LazyImage from './LazyImage';

interface PhotoGalleryProps {
  profileId: string;
  currentAvatarUrl?: string | null;
  onAvatarChange?: () => void;
  maxPhotos?: number;
  editable?: boolean;
}

const PhotoGallery = ({
  profileId,
  currentAvatarUrl,
  onAvatarChange,
  maxPhotos = 6,
  editable = true,
}: PhotoGalleryProps) => {
  const { photos, loading, uploadPhoto, deletePhoto, setAsAvatar, reorderPhotos } = usePhotos(profileId);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [settingAvatar, setSettingAvatar] = useState<string | null>(null);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('נא לבחור קובץ תמונה בלבד');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('גודל הקובץ המקסימלי הוא 5MB');
      return;
    }

    if (photos.length >= maxPhotos) {
      toast.error(`ניתן להעלות עד ${maxPhotos} תמונות`);
      return;
    }

    setUploading(true);
    const { error } = await uploadPhoto(file);
    setUploading(false);

    if (error) {
      toast.error('שגיאה בהעלאת התמונה');
    } else {
      toast.success('התמונה הועלתה בהצלחה!');
      onAvatarChange?.();
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (photoId: string) => {
    setDeleting(photoId);
    const { error } = await deletePhoto(photoId);
    setDeleting(null);

    if (error) {
      toast.error('שגיאה במחיקת התמונה');
    } else {
      toast.success('התמונה נמחקה');
      onAvatarChange?.();
    }
  };

  const handleSetAvatar = async (photoUrl: string) => {
    setSettingAvatar(photoUrl);
    const { error } = await setAsAvatar(photoUrl);
    setSettingAvatar(null);

    if (error) {
      toast.error('שגיאה בהגדרת תמונת הפרופיל');
    } else {
      toast.success('תמונת הפרופיל עודכנה!');
      onAvatarChange?.();
    }
  };

  const handleDragStart = (photoId: string) => {
    setDraggedId(photoId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (targetId: string) => {
    if (!draggedId || draggedId === targetId) {
      setDraggedId(null);
      return;
    }

    const orderedIds = photos.map(p => p.id);
    const draggedIndex = orderedIds.indexOf(draggedId);
    const targetIndex = orderedIds.indexOf(targetId);

    // Reorder
    orderedIds.splice(draggedIndex, 1);
    orderedIds.splice(targetIndex, 0, draggedId);

    await reorderPhotos(orderedIds);
    setDraggedId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4" dir="rtl">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-foreground">
          גלריית תמונות ({photos.length}/{maxPhotos})
        </h3>
        {editable && photos.length < maxPhotos && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Plus className="w-4 h-4" />
                הוסף תמונה
              </>
            )}
          </Button>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="grid grid-cols-3 gap-3">
        {photos.map((photo) => {
          const isAvatar = photo.url === currentAvatarUrl;
          const isDeleting = deleting === photo.id;
          const isSettingAvatar = settingAvatar === photo.url;

          return (
            <div
              key={photo.id}
              draggable={editable}
              onDragStart={() => handleDragStart(photo.id)}
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(photo.id)}
              className={cn(
                "relative aspect-square rounded-xl overflow-hidden group",
                "border-2 transition-all",
                isAvatar ? "border-primary" : "border-transparent",
                draggedId === photo.id && "opacity-50",
                editable && "cursor-move"
              )}
            >
              <LazyImage
                src={photo.url}
                alt="תמונת פרופיל"
                aspectRatio="square"
                className="w-full h-full"
              />

              {/* Avatar badge */}
              {isAvatar && (
                <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  ראשית
                </div>
              )}

              {/* Drag handle */}
              {editable && (
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <GripVertical className="w-5 h-5 text-white drop-shadow-lg" />
                </div>
              )}

              {/* Actions overlay */}
              {editable && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!isAvatar && (
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => handleSetAvatar(photo.url)}
                      disabled={isSettingAvatar}
                    >
                      {isSettingAvatar ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Star className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                  <Button
                    variant="destructive"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => handleDelete(photo.id)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              )}
            </div>
          );
        })}

        {/* Add photo placeholder */}
        {editable && photos.length < maxPhotos && (
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className={cn(
              "aspect-square rounded-xl border-2 border-dashed border-muted-foreground/30",
              "flex flex-col items-center justify-center gap-2",
              "text-muted-foreground hover:border-primary hover:text-primary",
              "transition-colors",
              uploading && "opacity-50 cursor-not-allowed"
            )}
          >
            {uploading ? (
              <Loader2 className="w-8 h-8 animate-spin" />
            ) : (
              <>
                <Camera className="w-8 h-8" />
                <span className="text-sm">הוסף</span>
              </>
            )}
          </button>
        )}
      </div>

      {photos.length === 0 && !editable && (
        <div className="text-center py-8 text-muted-foreground">
          <Camera className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>אין תמונות בגלריה</p>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
