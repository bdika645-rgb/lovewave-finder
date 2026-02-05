import { useState } from "react";
import { motion } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import { useReports, Report } from "@/hooks/useReports";
import { Skeleton } from "@/components/ui/skeleton";
import { Flag, AlertTriangle, CheckCircle, XCircle, Eye, Trash2, RefreshCw } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";

export default function AdminReports() {
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const { reports, loading, stats, refetch, updateReportStatus, deleteReport } = useReports({ status: filterStatus });
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [adminNote, setAdminNote] = useState("");

  const getReasonLabel = (reason: string) => {
    const labels: Record<string, string> = {
      spam: "ספאם",
      inappropriate: "תוכן לא הולם",
      harassment: "הטרדה",
      fake: "פרופיל מזויף",
      other: "אחר",
    };
    return labels[reason] || reason;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="bg-secondary/10 text-secondary border-secondary">ממתין</Badge>;
      case "reviewed":
        return <Badge variant="outline" className="bg-primary/10 text-primary border-primary">נבדק</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-accent/10 text-accent-foreground border-accent">טופל</Badge>;
      case "dismissed":
        return <Badge variant="outline" className="bg-muted text-muted-foreground border-muted-foreground/30">נדחה</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleStatusUpdate = async (newStatus: Report["status"]) => {
    if (selectedReport) {
      await updateReportStatus(selectedReport.id, newStatus, adminNote);
      setViewDialogOpen(false);
      setAdminNote("");
    }
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setAdminNote(report.admin_note || "");
    setViewDialogOpen(true);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-foreground">דיווחים</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-xl" />
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <AdminLayout>
      <motion.div 
        className="space-y-6 sm:space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">דיווחים ותלונות</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">ניהול דיווחים על משתמשים ותוכן</p>
          </div>
          <Button variant="outline" size="sm" className="w-fit" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 ml-2" />
            רענן
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          <StatsCard
            title="סה״כ דיווחים"
            value={stats.total}
            icon={Flag}
          />
          <StatsCard
            title="ממתינים לטיפול"
            value={stats.pending}
            icon={AlertTriangle}
          />
          <StatsCard
            title="טופלו"
            value={stats.resolved}
            icon={CheckCircle}
          />
          <StatsCard
            title="נדחו"
            value={stats.dismissed}
            icon={XCircle}
          />
        </motion.div>

        {/* Filters */}
        <motion.div variants={itemVariants} className="flex items-center gap-4">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="סנן לפי סטטוס" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">הכל</SelectItem>
              <SelectItem value="pending">ממתין</SelectItem>
              <SelectItem value="reviewed">נבדק</SelectItem>
              <SelectItem value="resolved">טופל</SelectItem>
              <SelectItem value="dismissed">נדחה</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Reports Table */}
        <motion.div variants={itemVariants} className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold">דיווחים</h3>
          </div>
          <div className="overflow-x-auto">
          <Table>
            <caption className="sr-only">טבלת דיווחים (ניתן לגלול אופקית במסכים קטנים)</caption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">מדווח</TableHead>
                <TableHead className="text-right">על משתמש</TableHead>
                <TableHead className="text-right">סיבה</TableHead>
                <TableHead className="text-right">סטטוס</TableHead>
                <TableHead className="text-right">תאריך</TableHead>
                <TableHead className="text-right">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={report.reporter?.avatar_url || undefined} />
                        <AvatarFallback>{report.reporter?.name?.charAt(0) || "?"}</AvatarFallback>
                      </Avatar>
                      <span>{report.reporter?.name || "לא ידוע"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={report.reported?.avatar_url || undefined} />
                        <AvatarFallback>{report.reported?.name?.charAt(0) || "?"}</AvatarFallback>
                      </Avatar>
                      <span>{report.reported?.name || "לא ידוע"}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{getReasonLabel(report.reason)}</Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(report.created_at), { addSuffix: true, locale: he })}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewReport(report)}
                        className="focus-ring"
                      >
                        <Eye className="w-4 h-4 ml-1" />
                        צפה
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm("האם אתה בטוח שברצונך למחוק את הדיווח?")) {
                            deleteReport(report.id);
                          }
                        }}
                        aria-label={`מחק דיווח מ${report.reporter?.name || "לא ידוע"}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {reports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    אין דיווחים
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        </motion.div>

        {/* Report Details Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>פרטי דיווח</DialogTitle>
            </DialogHeader>
            {selectedReport && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Flag className="w-5 h-5 text-destructive" />
                    <span className="font-medium">{getReasonLabel(selectedReport.reason)}</span>
                  </div>
                  {getStatusBadge(selectedReport.status)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">מדווח</p>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={selectedReport.reporter?.avatar_url || undefined} />
                        <AvatarFallback>{selectedReport.reporter?.name?.charAt(0) || "?"}</AvatarFallback>
                      </Avatar>
                      <span>{selectedReport.reporter?.name || "לא ידוע"}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">על משתמש</p>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={selectedReport.reported?.avatar_url || undefined} />
                        <AvatarFallback>{selectedReport.reported?.name?.charAt(0) || "?"}</AvatarFallback>
                      </Avatar>
                      <span>{selectedReport.reported?.name || "לא ידוע"}</span>
                    </div>
                  </div>
                </div>

                {selectedReport.description && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">תיאור</p>
                    <p className="text-foreground bg-muted p-3 rounded-lg">{selectedReport.description}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm text-muted-foreground mb-1">הערת מנהל</p>
                  <Textarea
                    placeholder="הוסף הערה..."
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="default" 
                    className="flex-1"
                    onClick={() => handleStatusUpdate("resolved")}
                  >
                    <CheckCircle className="w-4 h-4 ml-2" />
                    טפל
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleStatusUpdate("dismissed")}
                  >
                    <XCircle className="w-4 h-4 ml-2" />
                    דחה
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </AdminLayout>
  );
}
