import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageCircle, Users, Clock } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";

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

  useEffect(() => {
    async function fetchData() {
      try {
        // Get counts
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

        // Fetch recent messages
        const { data: messagesData } = await supabase
          .from("messages")
          .select(`
            id,
            content,
            created_at,
            is_read,
            sender_id
          `)
          .order("created_at", { ascending: false })
          .limit(50);

        // Get profile details
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
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-foreground">הודעות</h1>
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
        <div>
          <h1 className="text-3xl font-bold text-foreground">הודעות</h1>
          <p className="text-muted-foreground mt-1">מעקב אחר הודעות במערכת</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard
            title="סה״כ הודעות"
            value={stats.totalMessages}
            icon={MessageCircle}
          />
          <StatsCard
            title="סה״כ שיחות"
            value={stats.totalConversations}
            icon={Users}
          />
          <StatsCard
            title="הודעות שלא נקראו"
            value={stats.unreadMessages}
            icon={Clock}
          />
        </div>

        {/* Recent Messages */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold">הודעות אחרונות</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">שולח</TableHead>
                <TableHead className="text-right">תוכן</TableHead>
                <TableHead className="text-right">סטטוס</TableHead>
                <TableHead className="text-right">תאריך</TableHead>
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
                      <span>{message.sender?.name || "לא ידוע"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate text-muted-foreground">
                    {message.content}
                  </TableCell>
                  <TableCell>
                    <Badge variant={message.is_read ? "secondary" : "default"}>
                      {message.is_read ? "נקרא" : "חדש"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true, locale: he })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
