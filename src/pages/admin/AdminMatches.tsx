import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, ThumbsUp, TrendingUp, Trash2, RefreshCw } from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";
import { toast } from "sonner";

interface MatchData {
  id: string;
  created_at: string;
  profile1: { id: string; name: string; avatar_url: string | null } | null;
  profile2: { id: string; name: string; avatar_url: string | null } | null;
}

interface LikeData {
  id: string;
  created_at: string;
  liker: { id: string; name: string; avatar_url: string | null } | null;
  liked: { id: string; name: string; avatar_url: string | null } | null;
}

export default function AdminMatches() {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [likes, setLikes] = useState<LikeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ matches: 0, likes: 0, conversionRate: 0 });
  const [deleteMatchId, setDeleteMatchId] = useState<string | null>(null);
  const [deleteLikeId, setDeleteLikeId] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data: matchesData } = await supabase
        .from("matches")
        .select(`id, created_at, profile1_id, profile2_id`)
        .order("created_at", { ascending: false })
        .limit(50);

      const { data: likesData } = await supabase
        .from("likes")
        .select(`id, created_at, liker_id, liked_id`)
        .order("created_at", { ascending: false })
        .limit(50);

      const { count: matchCount } = await supabase
        .from("matches")
        .select("*", { count: "exact", head: true });

      const { count: likeCount } = await supabase
        .from("likes")
        .select("*", { count: "exact", head: true });

      const matchProfileIds = new Set<string>();
      matchesData?.forEach(m => {
        matchProfileIds.add(m.profile1_id);
        matchProfileIds.add(m.profile2_id);
      });

      const likeProfileIds = new Set<string>();
      likesData?.forEach(l => {
        likeProfileIds.add(l.liker_id);
        likeProfileIds.add(l.liked_id);
      });

      const allProfileIds = [...new Set([...matchProfileIds, ...likeProfileIds])];
      
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .in("id", allProfileIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      const enrichedMatches = matchesData?.map(m => ({
        ...m,
        profile1: profileMap.get(m.profile1_id) || null,
        profile2: profileMap.get(m.profile2_id) || null
      })) || [];

      const enrichedLikes = likesData?.map(l => ({
        ...l,
        liker: profileMap.get(l.liker_id) || null,
        liked: profileMap.get(l.liked_id) || null
      })) || [];

      setMatches(enrichedMatches);
      setLikes(enrichedLikes);
      setStats({
        matches: matchCount || 0,
        likes: likeCount || 0,
        conversionRate: likeCount && likeCount > 0 
          ? ((matchCount || 0) / likeCount * 100) 
          : 0
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteMatch = async () => {
    if (!deleteMatchId) return;
    
    try {
      const { error } = await supabase
        .from("matches")
        .delete()
        .eq("id", deleteMatchId);
        
      if (error) throw error;
      
      toast.success("המאץ' נמחק בהצלחה");
      setMatches(prev => prev.filter(m => m.id !== deleteMatchId));
      setStats(prev => ({ ...prev, matches: prev.matches - 1 }));
    } catch {
      toast.error("שגיאה במחיקת המאץ'");
    } finally {
      setDeleteMatchId(null);
    }
  };

  const handleDeleteLike = async () => {
    if (!deleteLikeId) return;
    
    try {
      const { error } = await supabase
        .from("likes")
        .delete()
        .eq("id", deleteLikeId);
        
      if (error) throw error;
      
      toast.success("הלייק נמחק בהצלחה");
      setLikes(prev => prev.filter(l => l.id !== deleteLikeId));
      setStats(prev => ({ ...prev, likes: prev.likes - 1 }));
    } catch {
      toast.error("שגיאה במחיקת הלייק");
    } finally {
      setDeleteLikeId(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">מאצ'ים ולייקים</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">מאצ'ים ולייקים</h1>
            <p className="text-muted-foreground mt-1">ניהול התאמות ולייקים במערכת</p>
          </div>
          <Button variant="outline" onClick={() => fetchData()}>
            <RefreshCw className="w-4 h-4 ml-2" />
            רענן
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard title="סה״כ מאצ'ים" value={stats.matches} icon={Heart} />
          <StatsCard title="סה״כ לייקים" value={stats.likes} icon={ThumbsUp} />
          <StatsCard title="יחס המרה" value={`${stats.conversionRate.toFixed(1)}%`} icon={TrendingUp} />
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold">מאצ'ים אחרונים</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">משתמש 1</TableHead>
                  <TableHead className="text-center">💕</TableHead>
                  <TableHead className="text-right">משתמש 2</TableHead>
                  <TableHead className="text-right">תאריך</TableHead>
                  <TableHead className="text-right">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {matches.slice(0, 10).map((match) => (
                  <TableRow key={match.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={match.profile1?.avatar_url || undefined} />
                          <AvatarFallback>{match.profile1?.name?.charAt(0) || "?"}</AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:inline">{match.profile1?.name || "לא ידוע"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-2xl">💕</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={match.profile2?.avatar_url || undefined} />
                          <AvatarFallback>{match.profile2?.name?.charAt(0) || "?"}</AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:inline">{match.profile2?.name || "לא ידוע"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDistanceToNow(new Date(match.created_at), { addSuffix: true, locale: he })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteMatchId(match.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {matches.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      אין מאצ'ים להצגה
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold">לייקים אחרונים</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">מי נתן לייק</TableHead>
                  <TableHead className="text-center">❤️</TableHead>
                  <TableHead className="text-right">למי</TableHead>
                  <TableHead className="text-right">תאריך</TableHead>
                  <TableHead className="text-right">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {likes.slice(0, 10).map((like) => (
                  <TableRow key={like.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={like.liker?.avatar_url || undefined} />
                          <AvatarFallback>{like.liker?.name?.charAt(0) || "?"}</AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:inline">{like.liker?.name || "לא ידוע"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center text-2xl">❤️</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={like.liked?.avatar_url || undefined} />
                          <AvatarFallback>{like.liked?.name?.charAt(0) || "?"}</AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:inline">{like.liked?.name || "לא ידוע"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDistanceToNow(new Date(like.created_at), { addSuffix: true, locale: he })}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setDeleteLikeId(like.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {likes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      אין לייקים להצגה
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <AlertDialog open={!!deleteMatchId} onOpenChange={() => setDeleteMatchId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>האם למחוק את המאץ'?</AlertDialogTitle>
              <AlertDialogDescription>
                פעולה זו תמחק את ההתאמה בין שני המשתמשים. לא ניתן לבטל פעולה זו.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>ביטול</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteMatch} className="bg-destructive hover:bg-destructive/90">
                מחק
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={!!deleteLikeId} onOpenChange={() => setDeleteLikeId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>האם למחוק את הלייק?</AlertDialogTitle>
              <AlertDialogDescription>
                פעולה זו תמחק את הלייק. לא ניתן לבטל פעולה זו.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>ביטול</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteLike} className="bg-destructive hover:bg-destructive/90">
                מחק
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
}