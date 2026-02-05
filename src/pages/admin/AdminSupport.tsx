import { useState } from "react";
import { motion } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdminSupportTickets } from "@/hooks/useAdminSupportTickets";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  MessageSquare, 
  Trash2, 
  Eye, 
  CheckCircle,
  Clock,
  XCircle,
  Mail
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";
import { toast } from "sonner";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
} as const;

export default function AdminSupport() {
  const { tickets, loading, updateTicketStatus, deleteTicket } = useAdminSupportTickets();
  const [selectedTicket, setSelectedTicket] = useState<typeof tickets[0] | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [newStatus, setNewStatus] = useState<string>("");
  const [deleteTicketId, setDeleteTicketId] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge variant="secondary">פתוח</Badge>;
      case 'in_progress':
        return <Badge variant="outline">בטיפול</Badge>;
      case 'resolved':
        return <Badge variant="default">נפתר</Badge>;
      case 'closed':
        return <Badge variant="outline" className="bg-muted text-muted-foreground">נסגר</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedTicket || !newStatus) return;
    
    const { error } = await updateTicketStatus(selectedTicket.id, newStatus, adminNote);
    
    if (error) {
      toast.error("שגיאה בעדכון הפנייה");
    } else {
      toast.success("הפנייה עודכנה בהצלחה");
      setSelectedTicket(null);
      setAdminNote("");
      setNewStatus("");
    }
  };

  const handleDelete = async () => {
    if (!deleteTicketId) return;

    const { error } = await deleteTicket(deleteTicketId);

    if (error) {
      toast.error("שגיאה במחיקת הפנייה");
    } else {
      toast.success("הפנייה נמחקה");
    }

    setDeleteTicketId(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <motion.div 
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-24" />
            </div>
          </div>
          <div className="bg-card rounded-xl border overflow-hidden">
            <div className="p-4 border-b">
              <Skeleton className="h-5 w-32" />
            </div>
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border-b last:border-b-0">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        </motion.div>
      </AdminLayout>
    );
  }

  const openCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;

  return (
    <AdminLayout>
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">פניות תמיכה</h1>
            <p className="text-muted-foreground">ניהול פניות תמיכה מהמשתמשים</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{openCount} פתוחות</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{inProgressCount} בטיפול</span>
            </div>
          </div>
        </motion.div>

        {tickets.length === 0 ? (
          <motion.div 
            variants={itemVariants}
            className="text-center py-16 bg-card rounded-xl border" 
            role="status" 
            aria-live="polite"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            >
              <MessageSquare className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" aria-hidden="true" />
            </motion.div>
            <h3 className="text-lg font-semibold text-foreground mb-2">אין פניות תמיכה 🎉</h3>
            <p className="text-muted-foreground">טרם התקבלו פניות תמיכה - מצוין!</p>
          </motion.div>
        ) : (
          <motion.div variants={itemVariants} className="bg-card rounded-xl border overflow-hidden">
            <Table>
              <caption className="sr-only">טבלת פניות תמיכה</caption>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">שם</TableHead>
                  <TableHead className="text-right">אימייל</TableHead>
                  <TableHead className="text-right">נושא</TableHead>
                  <TableHead className="text-right">סטטוס</TableHead>
                  <TableHead className="text-right">תאריך</TableHead>
                  <TableHead className="text-right">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.id}>
                    <TableCell className="font-medium">{ticket.name}</TableCell>
                    <TableCell>
                      <a 
                        href={`mailto:${ticket.email}`} 
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <Mail className="w-4 h-4" />
                        {ticket.email}
                      </a>
                    </TableCell>
                    <TableCell>{ticket.subject || "ללא נושא"}</TableCell>
                    <TableCell>{getStatusBadge(ticket.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDistanceToNow(new Date(ticket.created_at), { 
                        addSuffix: true, 
                        locale: he 
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="focus-ring"
                              aria-label="צפה בפרטי הפנייה"
                              onClick={() => {
                                setSelectedTicket(ticket);
                                setNewStatus(ticket.status);
                                setAdminNote(ticket.admin_note || "");
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-lg" dir="rtl">
                            <DialogHeader>
                              <DialogTitle>פרטי הפנייה</DialogTitle>
                            </DialogHeader>
                            {selectedTicket && (
                              <div className="space-y-4">
                                <div>
                                  <p className="text-sm text-muted-foreground">שם</p>
                                  <p className="font-medium">{selectedTicket.name}</p>
                                </div>
                                <div>
                                  <p className="text-sm text-muted-foreground">אימייל</p>
                                  <p className="font-medium">{selectedTicket.email}</p>
                                </div>
                                {selectedTicket.subject && (
                                  <div>
                                    <p className="text-sm text-muted-foreground">נושא</p>
                                    <p className="font-medium">{selectedTicket.subject}</p>
                                  </div>
                                )}
                                <div>
                                  <p className="text-sm text-muted-foreground">הודעה</p>
                                  <p className="bg-muted/50 p-3 rounded-lg whitespace-pre-wrap">
                                    {selectedTicket.message}
                                  </p>
                                </div>
                                
                                <div className="border-t pt-4 space-y-4">
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">סטטוס</p>
                                    <Select value={newStatus} onValueChange={setNewStatus}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="open">פתוח</SelectItem>
                                        <SelectItem value="in_progress">בטיפול</SelectItem>
                                        <SelectItem value="resolved">נפתר</SelectItem>
                                        <SelectItem value="closed">נסגר</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  
                                  <div>
                                    <p className="text-sm text-muted-foreground mb-2">הערת מנהל</p>
                                    <Textarea
                                      value={adminNote}
                                      onChange={(e) => setAdminNote(e.target.value)}
                                      placeholder="הוסף הערה..."
                                      rows={3}
                                    />
                                  </div>
                                  
                                  <Button onClick={handleUpdateStatus} className="w-full">
                                    <CheckCircle className="w-4 h-4 ml-2" />
                                    עדכן פנייה
                                  </Button>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setDeleteTicketId(ticket.id)}
                          className="text-destructive hover:text-destructive"
                          aria-label="מחק פנייה"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </motion.div>
        )}

        <AlertDialog open={!!deleteTicketId} onOpenChange={(open) => !open && setDeleteTicketId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>האם למחוק את הפנייה?</AlertDialogTitle>
              <AlertDialogDescription>
                פעולה זו תמחק את הפנייה לצמיתות. לא ניתן לבטל פעולה זו.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>ביטול</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-destructive hover:bg-destructive/90"
              >
                מחק
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </AdminLayout>
  );
}
