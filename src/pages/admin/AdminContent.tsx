import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminPhotos } from "@/hooks/useAdminPhotos";
import { Skeleton } from "@/components/ui/skeleton";
import { Image, RefreshCw, Trash2, Calendar, Search, Grid, List, Eye } from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";


export default function AdminContent() {
  const { photos, loading, stats, deletePhoto, refetch } = useAdminPhotos();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPhotoId, setSelectedPhotoId] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const filteredPhotos = photos.filter(photo =>
    photo.profile?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (photoId: string) => {
    setSelectedPhotoId(photoId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedPhotoId) {
      deletePhoto(selectedPhotoId);
      setDeleteDialogOpen(false);
      setSelectedPhotoId(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-foreground">ניהול תוכן</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">ניהול תוכן</h1>
            <p className="text-muted-foreground mt-1">צפייה וניהול תמונות שהועלו</p>
          </div>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 ml-2" />
            רענן
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCard
            title="סה״כ תמונות"
            value={stats.total}
            icon={Image}
          />
          <StatsCard
            title="תמונות היום"
            value={stats.today}
            icon={Calendar}
          />
        </div>

        {/* Search and View Mode */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="חפש לפי שם משתמש..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>
          <div className="flex items-center gap-2 border border-border rounded-lg p-1">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="focus-ring"
              aria-label="תצוגת רשת"
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="focus-ring"
              aria-label="תצוגת רשימה"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Photos Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredPhotos.map((photo) => (
              <div 
                key={photo.id} 
                className="group relative aspect-square bg-muted rounded-xl overflow-hidden border border-border"
              >
                <img
                  src={photo.url}
                  alt={photo.profile?.name ? `תמונה שהועלתה על ידי ${photo.profile.name}` : "תמונה שהועלתה"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPreviewUrl(photo.url)}
                    className="focus-ring"
                    aria-label="צפה בתמונה"
                  >
                    <Eye className="w-4 h-4 ml-1" />
                    צפה
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(photo.id)}
                    className="focus-ring"
                    aria-label="מחק תמונה"
                  >
                    <Trash2 className="w-4 h-4 ml-1" />
                    מחק
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={photo.profile?.avatar_url || undefined} />
                      <AvatarFallback className="text-xs">
                        {photo.profile?.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-white text-sm truncate">
                      {photo.profile?.name || "לא ידוע"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="divide-y divide-border">
              {filteredPhotos.map((photo) => (
                <div key={photo.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                  <img
                    src={photo.url}
                    alt={photo.profile?.name ? `תמונה של ${photo.profile.name}` : "תמונה"}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={photo.profile?.avatar_url || undefined} />
                        <AvatarFallback className="text-xs">
                          {photo.profile?.name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{photo.profile?.name || "לא ידוע"}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      הועלה {formatDistanceToNow(new Date(photo.created_at), { addSuffix: true, locale: he })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewUrl(photo.url)}
                      className="focus-ring"
                      aria-label="צפה בתמונה"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(photo.id)}
                      aria-label="מחק תמונה"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredPhotos.length === 0 && (
          <div className="text-center py-12 text-muted-foreground" role="status" aria-live="polite">
            {searchQuery ? "לא נמצאו תמונות התואמות לחיפוש" : "אין תמונות להצגה"}
          </div>
        )}

        {/* Image Preview Dialog */}
        <Dialog open={!!previewUrl} onOpenChange={() => setPreviewUrl(null)}>
          <DialogContent className="max-w-4xl p-0 overflow-hidden">
            {previewUrl && (
              <img
                src={previewUrl}
                alt=""
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>האם למחוק את התמונה?</AlertDialogTitle>
              <AlertDialogDescription>
                פעולה זו אינה ניתנת לביטול. התמונה תימחק לצמיתות.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>ביטול</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
                מחק
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}
