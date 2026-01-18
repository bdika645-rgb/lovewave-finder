import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Flag, AlertTriangle, CheckCircle, XCircle, Eye } from "lucide-react";
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
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";

interface Report {
  id: string;
  reporter_id: string;
  reported_id: string;
  reason: string;
  description: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  created_at: string;
  reporter?: { name: string; avatar_url: string | null } | null;
  reported?: { name: string; avatar_url: string | null } | null;
}

// Mock data for demonstration
const mockReports: Report[] = [
  {
    id: "1",
    reporter_id: "user1",
    reported_id: "user2",
    reason: "spam",
    description: "המשתמש שולח הודעות ספאם חוזרות",
    status: "pending",
    created_at: new Date().toISOString(),
    reporter: { name: "דנה כהן", avatar_url: null },
    reported: { name: "יוסי לוי", avatar_url: null },
  },
  {
    id: "2",
    reporter_id: "user3",
    reported_id: "user4",
    reason: "inappropriate",
    description: "תמונת פרופיל לא הולמת",
    status: "reviewed",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    reporter: { name: "מיכל אברהם", avatar_url: null },
    reported: { name: "אבי ישראלי", avatar_url: null },
  },
  {
    id: "3",
    reporter_id: "user5",
    reported_id: "user6",
    reason: "harassment",
    description: "הטרדה בהודעות פרטיות",
    status: "resolved",
    created_at: new Date(Date.now() - 172800000).toISOString(),
    reporter: { name: "שרה דוד", avatar_url: null },
    reported: { name: "רון מזרחי", avatar_url: null },
  },
];

export default function AdminReports() {
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [adminNote, setAdminNote] = useState("");

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === "pending").length,
    resolved: reports.filter(r => r.status === "resolved").length,
    dismissed: reports.filter(r => r.status === "dismissed").length,
  };

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
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500">ממתין</Badge>;
      case "reviewed":
        return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500">נבדק</Badge>;
      case "resolved":
        return <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500">טופל</Badge>;
      case "dismissed":
        return <Badge variant="outline" className="bg-gray-500/10 text-gray-600 border-gray-500">נדחה</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleStatusUpdate = (reportId: string, newStatus: string) => {
    setReports(reports.map(r => 
      r.id === reportId ? { ...r, status: newStatus as Report["status"] } : r
    ));
    toast.success("סטטוס הדיווח עודכן");
    setViewDialogOpen(false);
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setViewDialogOpen(true);
  };

  const filteredReports = filterStatus === "all" 
    ? reports 
    : reports.filter(r => r.status === filterStatus);

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

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">דיווחים ותלונות</h1>
          <p className="text-muted-foreground mt-1">ניהול דיווחים על משתמשים ותוכן</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
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
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
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
        </div>

        {/* Reports Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold">דיווחים אחרונים</h3>
          </div>
          <Table>
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
              {filteredReports.map((report) => (
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
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleViewReport(report)}
                    >
                      <Eye className="w-4 h-4 ml-2" />
                      צפה
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredReports.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    אין דיווחים
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

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

                <div>
                  <p className="text-sm text-muted-foreground mb-1">תיאור</p>
                  <p className="text-foreground bg-muted p-3 rounded-lg">{selectedReport.description}</p>
                </div>

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
                    onClick={() => handleStatusUpdate(selectedReport.id, "resolved")}
                  >
                    <CheckCircle className="w-4 h-4 ml-2" />
                    טפל
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => handleStatusUpdate(selectedReport.id, "dismissed")}
                  >
                    <XCircle className="w-4 h-4 ml-2" />
                    דחה
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
