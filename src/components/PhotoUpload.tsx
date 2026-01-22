import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Camera, Loader2, X, Plus } from "lucide-react";
import { toast } from "sonner";

interface PhotoUploadProps {
  profileId: string;
  currentAvatarUrl?: string | null;
  onUploadComplete: (url: string) => void;
}

export function PhotoUpload({ profileId, currentAvatarUrl, onUploadComplete }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useAuth();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!user) {
      toast.error("נא להתחבר כדי להעלות תמונה");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("נא לבחור קובץ תמונה בלבד");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("גודל הקובץ מקסימלי הוא 5MB");
      return;
    }

    setUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Generate unique file name using user.id (matches storage policy)
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, file, { 
          upsert: true,
          contentType: file.type,
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);

      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl })
        .eq("id", profileId);

      if (updateError) throw updateError;

      onUploadComplete(publicUrl);
      toast.success("התמונה הועלתה בהצלחה!");
    } catch (error) {
      console.error("Error uploading:", error);
      toast.error("שגיאה בהעלאת התמונה");
      setPreviewUrl(currentAvatarUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!currentAvatarUrl || !user) return;

    setUploading(true);
    try {
      // Extract file path from URL
      const urlParts = currentAvatarUrl.split("/avatars/");
      if (urlParts.length > 1) {
        const filePath = urlParts[1];
        await supabase.storage.from("avatars").remove([filePath]);
      }

      // Update profile
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_url: null })
        .eq("id", profileId);

      if (error) throw error;

      setPreviewUrl(null);
      onUploadComplete("");
      toast.success("התמונה הוסרה");
    } catch (error) {
      console.error("Error removing photo:", error);
      toast.error("שגיאה בהסרת התמונה");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4" role="group" aria-label="העלאת תמונת פרופיל">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="sr-only"
        id="photo-upload-input"
        aria-label="בחירת קובץ תמונה להעלאה"
      />

      {previewUrl ? (
        <div className="relative w-32 h-32 mx-auto">
          <img
            src={previewUrl}
            alt="תמונת פרופיל"
            className="w-full h-full object-cover rounded-full border-4 border-primary/20"
          />
          {uploading ? (
            <div className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <>
              <Button
                variant="hero"
                size="icon"
                className="absolute bottom-0 left-0"
                onClick={() => fileInputRef.current?.click()}
                aria-label="שנה תמונת פרופיל"
              >
                <Camera className="w-4 h-4" aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground hover:bg-destructive/90 w-8 h-8"
                onClick={handleRemovePhoto}
                aria-label="הסר תמונת פרופיל"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </Button>
            </>
          )}
        </div>
      ) : (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="w-32 h-32 mx-auto rounded-full border-2 border-dashed border-primary/30 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          aria-label="העלה תמונת פרופיל"
          aria-busy={uploading}
        >
          {uploading ? (
            <Loader2 className="w-8 h-8 text-primary animate-spin" aria-hidden="true" />
          ) : (
            <>
              <Plus className="w-8 h-8 text-primary" aria-hidden="true" />
              <span className="text-sm text-muted-foreground">הוסף תמונה</span>
            </>
          )}
        </button>
      )}

      <p className="text-center text-sm text-muted-foreground">
        תמונות עד 5MB • JPG, PNG, GIF
      </p>
    </div>
  );
}

export default PhotoUpload;
