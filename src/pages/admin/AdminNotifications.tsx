import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Bell, 
  RefreshCw, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Info, 
  CheckCircle,
  Send,
  Users,
  User
} from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";

export default function AdminNotifications() {
  const { notifications, loading, createNotification, deleteNotification, refetch } = useAdminNotifications();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: "",
    message: "",
    type: "info",
    target_all: true
  });

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "warning":
        return (
          <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500">
            <AlertTriangle className="w-3 h-3 ml-1" />
            אזהרה
          </Badge>
        );
      case "success":
        return (
          <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500">
            <CheckCircle className="w-3 h-3 ml-1" />
            הצלחה
          </Badge>
        );
      case "error":
        return (
          <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500">
            <AlertTriangle className="w-3 h-3 ml-1" />
            שגיאה
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500">
            <Info className="w-3 h-3 ml-1" />
            מידע
          </Badge>
        );
    }
  };

  const handleCreate = async () => {
    if (!newNotification.title || !newNotification.message) return;
    
    await createNotification({
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type,
      target_all: newNotification.target_all
    });
    
    setDialogOpen(false);
    setNewNotification({ title: "", message: "", type: "info", target_all: true });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-foreground">התראות</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-[400px] rounded-xl" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">התראות</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">שלח התראות למשתמשים</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 ml-2" />
              רענן
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 ml-2" />
                  התראה חדשה
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>שליחת התראה חדשה</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">כותרת</Label>
                    <Input
                      id="title"
                      placeholder="כותרת ההתראה"
                      value={newNotification.title}
                      onChange={(e) => setNewNotification({ ...newNotification, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">הודעה</Label>
                    <Textarea
                      id="message"
                      placeholder="תוכן ההתראה"
                      value={newNotification.message}
                      onChange={(e) => setNewNotification({ ...newNotification, message: e.target.value })}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>סוג ההתראה</Label>
                    <Select 
                      value={newNotification.type} 
                      onValueChange={(v) => setNewNotification({ ...newNotification, type: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="info">מידע</SelectItem>
                        <SelectItem value="success">הצלחה</SelectItem>
                        <SelectItem value="warning">אזהרה</SelectItem>
                        <SelectItem value="error">שגיאה</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">שלח לכל המשתמשים</p>
                        <p className="text-sm text-muted-foreground">ההתראה תישלח לכל המשתמשים הרשומים</p>
                      </div>
                    </div>
                    <Switch
                      checked={newNotification.target_all}
                      onCheckedChange={(checked) => setNewNotification({ ...newNotification, target_all: checked })}
                    />
                  </div>

                  <Button onClick={handleCreate} className="w-full" disabled={!newNotification.title || !newNotification.message}>
                    <Send className="w-4 h-4 ml-2" />
                    שלח התראה
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          <StatsCard
            title="סה״כ התראות"
            value={notifications.length}
            icon={Bell}
          />
          <StatsCard
            title="התראות כלליות"
            value={notifications.filter(n => n.target_all).length}
            icon={Users}
          />
          <StatsCard
            title="התראות אישיות"
            value={notifications.filter(n => !n.target_all).length}
            icon={User}
          />
        </div>

        {/* Notifications Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold">היסטוריית התראות</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">כותרת</TableHead>
                <TableHead className="text-right">הודעה</TableHead>
                <TableHead className="text-right">סוג</TableHead>
                <TableHead className="text-right">יעד</TableHead>
                <TableHead className="text-right">תאריך</TableHead>
                <TableHead className="text-right">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((notification) => (
                <TableRow key={notification.id}>
                  <TableCell className="font-medium">{notification.title}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-muted-foreground">
                    {notification.message}
                  </TableCell>
                  <TableCell>{getTypeBadge(notification.type)}</TableCell>
                  <TableCell>
                    {notification.target_all ? (
                      <Badge variant="secondary">
                        <Users className="w-3 h-3 ml-1" />
                        כולם
                      </Badge>
                    ) : notification.target_user ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={notification.target_user.avatar_url || undefined} />
                          <AvatarFallback>{notification.target_user.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{notification.target_user.name}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.created_at), { 
                      addSuffix: true, 
                      locale: he 
                    })}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => deleteNotification(notification.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {notifications.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    אין התראות
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
