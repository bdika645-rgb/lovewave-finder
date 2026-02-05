import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, Users, Clock, RefreshCw, Trash2, Eye } from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
} as const;
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";
import { toast } from "sonner";

interface MessageData {
  id: string;
  content: string;
  created_at: string;
  is_read: boolean | null;
  sender: { id: string; name: string; avatar_url: string | null } | null;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ 
    totalMessages: 0, 
    totalConversations: 0,
    unreadMessages: 0 
  });
  const [page, setPage] = useState(1);
  const pageSize = 25;
  const [deleteMessageId, setDeleteMessageId] = useState<string | null>(null);
  const [viewMessage, setViewMessage] = useState<MessageData | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      const { count: messageCount } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true });

      const { count: conversationCount } = await supabase
        .from("conversations")
        .select("*", { count: "exact", head: true });

      const { count: unreadCount } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("is_read", false);

      const rangeFrom = (page - 1) * pageSize;
      const rangeTo = rangeFrom + pageSize - 1;

      const { data: messagesData } = await supabase
        .from("messages")
        .select(`id, content, created_at, is_read, sender_id`)
        .order("created_at", { ascending: false })
        .range(rangeFrom, rangeTo);

      const senderIds = [...new Set(messagesData?.map(m => m.sender_id) || [])];
      
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, name, avatar_url")
        .in("id", senderIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      const enrichedMessages = messagesData?.map(m => ({
        ...m,
        sender: profileMap.get(m.sender_id) || null
      })) || [];

      setMessages(enrichedMessages);
      setStats({
        totalMessages: messageCount || 0,
        totalConversations: conversationCount || 0,
        unreadMessages: unreadCount || 0
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteMessage = async () => {
    if (!deleteMessageId) return;
    
    try {
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", deleteMessageId);
        
      if (error) throw error;
      
      toast.success("ההודעה נמחקה בהצלחה");
      setMessages(prev => prev.filter(m => m.id !== deleteMessageId));
      setStats(prev => ({ ...prev, totalMessages: prev.totalMessages - 1 }));

      // If we deleted the last row on the page, go back a page (when possible)
      if (messages.length === 1 && page > 1) {
        setPage(p => p - 1);
      }
    } catch {
      toast.error("שגיאה במחיקת ההודעה");
    } finally {
      setDeleteMessageId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(stats.totalMessages / pageSize));

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">הודעות</h1>
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
      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">הודעות</h1>
            <p className="text-muted-foreground mt-1">מעקב אחר הודעות במערכת</p>
          </div>
          <Button variant="outline" onClick={() => fetchData()}>
            <RefreshCw className="w-4 h-4 ml-2" />
            רענן
          </Button>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <StatsCard title="סה״כ הודעות" value={stats.totalMessages} icon={MessageCircle} variant="gradient" />
          <StatsCard title="סה״כ שיחות" value={stats.totalConversations} icon={Users} />
          <StatsCard title="הודעות שלא נקראו" value={stats.unreadMessages} icon={Clock} />
        </motion.div>

        <motion.div variants={itemVariants} className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold">הודעות אחרונות</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <caption className="sr-only">טבלת הודעות אחרונות</caption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">שולח</TableHead>
                  <TableHead className="text-right">תוכן</TableHead>
                  <TableHead className="text-right">סטטוס</TableHead>
                  <TableHead className="text-right">תאריך</TableHead>
                  <TableHead className="text-right">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {messages.map((message) => (
                  <TableRow key={message.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={message.sender?.avatar_url || undefined} />
                          <AvatarFallback>{message.sender?.name?.charAt(0) || "?"}</AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:inline">{message.sender?.name || "לא ידוע"}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate text-muted-foreground">
                      {message.content}
                    </TableCell>
                    <TableCell>
                      <Badge variant={message.is_read ? "secondary" : "default"}>
                        {message.is_read ? "נקרא" : "חדש"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true, locale: he })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewMessage(message)}
                          className="focus-ring"
                          aria-label="צפה בהודעה"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteMessageId(message.id)}
                          aria-label="מחק הודעה"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {messages.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                      אין הודעות להצגה
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              עמוד {page} מתוך {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                aria-label="לעמוד הקודם"
              >
                הקודם
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                aria-label="לעמוד הבא"
              >
                הבא
              </Button>
            </div>
          </div>
        </motion.div>

        {/* View Message Dialog */}
        <Dialog open={!!viewMessage} onOpenChange={() => setViewMessage(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>פרטי הודעה</DialogTitle>
            </DialogHeader>
            {viewMessage && (
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={viewMessage.sender?.avatar_url || undefined} />
                    <AvatarFallback>{viewMessage.sender?.name?.charAt(0) || "?"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{viewMessage.sender?.name || "לא ידוע"}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(viewMessage.created_at), { addSuffix: true, locale: he })}
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-foreground whitespace-pre-wrap">{viewMessage.content}</p>
                </div>
                <div className="flex items-center justify-between">
                  <Badge variant={viewMessage.is_read ? "secondary" : "default"}>
                    {viewMessage.is_read ? "נקרא" : "חדש"}
                  </Badge>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setDeleteMessageId(viewMessage.id);
                      setViewMessage(null);
                    }}
                  >
                    <Trash2 className="w-4 h-4 ml-2" />
                    מחק הודעה
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteMessageId} onOpenChange={() => setDeleteMessageId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>האם למחוק את ההודעה?</AlertDialogTitle>
              <AlertDialogDescription>
                פעולה זו תמחק את ההודעה לצמיתות. לא ניתן לבטל פעולה זו.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>ביטול</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteMessage} className="bg-destructive hover:bg-destructive/90">
                מחק
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </AdminLayout>
  );
}