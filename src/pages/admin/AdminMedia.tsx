import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Image, RefreshCw, Trash2, Calendar, Search, Grid, List, Eye, User, Filter } from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
} as const;
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";
import { toast } from "sonner";

interface MediaItem {
  id: string;
  url: string;
  type: "avatar" | "gallery";
  profile_id: string;
  created_at: string;
  profile?: {
    id: string;
    name: string;
    avatar_url: string | null;
    city?: string;
  } | null;
}

interface MediaStats {
  totalAvatars: number;
  totalGallery: number;
  todayUploads: number;
}

export default function AdminMedia() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<MediaStats>({ totalAvatars: 0, totalGallery: 0, todayUploads: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [typeFilter, setTypeFilter] = useState<"all" | "avatar" | "gallery">("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);

  const fetchMedia = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch gallery photos
      const { data: galleryPhotos, error: galleryError } = await supabase
        .from("photos")
        .select("id, url, profile_id, created_at")
        .order("created_at", { ascending: false })
        .limit(200);

      if (galleryError) throw galleryError;

      // Fetch profiles with avatars
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, name, avatar_url, city, created_at")
        .not("avatar_url", "is", null)
        .order("created_at", { ascending: false })
        .limit(200);

      if (profilesError) throw profilesError;

      // Get all unique profile IDs for gallery photos
      const galleryProfileIds = [...new Set(galleryPhotos?.map(p => p.profile_id) || [])];
      
      // Fetch profile details for gallery photos
      const { data: galleryProfiles } = await supabase
        .from("profiles")
        .select("id, name, avatar_url, city")
        .in("id", galleryProfileIds);

      const profileMap = new Map(galleryProfiles?.map(p => [p.id, p]) || []);

      // Create media items from gallery photos
      const galleryItems: MediaItem[] = (galleryPhotos || []).map(photo => ({
        id: photo.id,
        url: photo.url,
        type: "gallery" as const,
        profile_id: photo.profile_id,
        created_at: photo.created_at,
        profile: profileMap.get(photo.profile_id) || null,
      }));

      // Create media items from profile avatars
      const avatarItems: MediaItem[] = (profiles || [])
        .filter(p => p.avatar_url)
        .map(profile => ({
          id: `avatar-${profile.id}`,
          url: profile.avatar_url!,
          type: "avatar" as const,
          profile_id: profile.id,
          created_at: profile.created_at,
          profile: { id: profile.id, name: profile.name, avatar_url: profile.avatar_url, city: profile.city },
        }));

      // Combine and sort by date
      const allMedia = [...galleryItems, ...avatarItems].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setMediaItems(allMedia);

      // Calculate stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayUploads = allMedia.filter(
        item => new Date(item.created_at) >= today
      ).length;

      setStats({
        totalAvatars: avatarItems.length,
        totalGallery: galleryItems.length,
        todayUploads,
      });
    } catch (error) {
      console.error("Error fetching media:", error);
      toast.error("שגיאה בטעינת המדיה");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMedia();
  }, [fetchMedia]);

  const handleDelete = (item: MediaItem) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;

    try {
      if (selectedItem.type === "gallery") {
        // Delete from photos table
        const { error } = await supabase
          .from("photos")
          .delete()
          .eq("id", selectedItem.id);

        if (error) throw error;
      } else {
        // Remove avatar from profile
        const { error } = await supabase
          .from("profiles")
          .update({ avatar_url: null })
          .eq("id", selectedItem.profile_id);

        if (error) throw error;
      }

      toast.success("התמונה נמחקה בהצלחה");
      setMediaItems(prev => prev.filter(m => m.id !== selectedItem.id));
      setDeleteDialogOpen(false);
      setSelectedItem(null);
    } catch (error) {
      console.error("Error deleting media:", error);
      toast.error("שגיאה במחיקת התמונה");
    }
  };

  // Filter media items
  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.profile?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.profile?.city?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <AdminLayout>
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div>
            <Skeleton className="h-8 w-40 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 flex-1 max-w-md" />
            <Skeleton className="h-10 w-[180px]" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-xl" />
            ))}
          </div>
        </motion.div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">ניהול מדיה</h1>
            <p className="text-muted-foreground mt-1">צפייה בכל התמונות במערכת לצורך מודרציה</p>
          </div>
          <Button variant="outline" onClick={() => fetchMedia()}>
            <RefreshCw className="w-4 h-4 ml-2" />
            רענן
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="תמונות פרופיל"
            value={stats.totalAvatars}
            icon={User}
          />
          <StatsCard
            title="תמונות גלריה"
            value={stats.totalGallery}
            icon={Image}
          />
          <StatsCard
            title="העלאות היום"
            value={stats.todayUploads}
            icon={Calendar}
          />
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="חפש לפי שם משתמש או עיר..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as "all" | "avatar" | "gallery")}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="w-4 h-4 ml-2" />
                <SelectValue placeholder="סוג תמונה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">כל התמונות</SelectItem>
                <SelectItem value="avatar">תמונות פרופיל</SelectItem>
                <SelectItem value="gallery">תמונות גלריה</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2 border border-border rounded-lg p-1 self-start">
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
        </motion.div>

        {/* Results count */}
        <div className="text-sm text-muted-foreground">
          מציג {filteredItems.length} תמונות מתוך {mediaItems.length}
        </div>

        {/* Media Grid/List */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="group relative aspect-square bg-muted rounded-xl overflow-hidden border border-border"
              >
                <img
                  src={item.url}
                  alt={item.profile?.name ? `תמונה של ${item.profile.name}` : "תמונה"}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setPreviewItem(item)}
                    className="focus-ring"
                    aria-label="צפה בתמונה"
                  >
                    <Eye className="w-4 h-4 ml-1" />
                    צפה
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(item)}
                    className="focus-ring"
                    aria-label="מחק תמונה"
                  >
                    <Trash2 className="w-4 h-4 ml-1" />
                    מחק
                  </Button>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant={item.type === "avatar" ? "default" : "secondary"}>
                    {item.type === "avatar" ? "פרופיל" : "גלריה"}
                  </Badge>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={item.profile?.avatar_url || undefined} />
                      <AvatarFallback className="text-xs">
                        {item.profile?.name?.charAt(0) || "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-white text-sm truncate">
                      {item.profile?.name || "לא ידוע"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <div className="divide-y divide-border">
              {filteredItems.map((item) => (
                <div key={item.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
                  <img
                    src={item.url}
                    alt={item.profile?.name ? `תמונה של ${item.profile.name}` : "תמונה"}
                    className="w-16 h-16 rounded-lg object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={item.profile?.avatar_url || undefined} />
                        <AvatarFallback className="text-xs">
                          {item.profile?.name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{item.profile?.name || "לא ידוע"}</span>
                      <Badge variant={item.type === "avatar" ? "default" : "secondary"} className="text-xs">
                        {item.type === "avatar" ? "פרופיל" : "גלריה"}
                      </Badge>
                      {item.profile?.city && (
                        <span className="text-xs text-muted-foreground">{item.profile.city}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      הועלה {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: he })}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setPreviewItem(item)}
                      className="focus-ring"
                      aria-label="צפה בתמונה"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(item)}
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

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-muted-foreground" role="status" aria-live="polite">
            {searchQuery || typeFilter !== "all" ? "לא נמצאו תמונות התואמות לחיפוש" : "אין תמונות להצגה"}
          </div>
        )}

        {/* Image Preview Dialog */}
        <Dialog open={!!previewItem} onOpenChange={() => setPreviewItem(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                {previewItem?.profile && (
                  <>
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={previewItem.profile.avatar_url || undefined} />
                      <AvatarFallback>{previewItem.profile.name?.charAt(0) || "?"}</AvatarFallback>
                    </Avatar>
                    <span>{previewItem.profile.name}</span>
                    <Badge variant={previewItem.type === "avatar" ? "default" : "secondary"}>
                      {previewItem.type === "avatar" ? "תמונת פרופיל" : "תמונת גלריה"}
                    </Badge>
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {previewItem && (
                <>
                  <img
                    src={previewItem.url}
                    alt=""
                    className="w-full h-auto max-h-[70vh] object-contain rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                      הועלה {formatDistanceToNow(new Date(previewItem.created_at), { addSuffix: true, locale: he })}
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        handleDelete(previewItem);
                        setPreviewItem(null);
                      }}
                    >
                      <Trash2 className="w-4 h-4 ml-2" />
                      מחק תמונה
                    </Button>
                  </div>
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>האם למחוק את התמונה?</AlertDialogTitle>
              <AlertDialogDescription>
                {selectedItem?.type === "avatar" 
                  ? "פעולה זו תסיר את תמונת הפרופיל של המשתמש."
                  : "פעולה זו תמחק את התמונה לצמיתות."}
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
      </motion.div>
    </AdminLayout>
  );
}
