import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Mail,
  Plus,
  Send,
  RefreshCw,
  Trash2,
  Edit2,
  Users,
  UserCheck,
  Calendar,
  BarChart3,
  Eye,
  Copy,
  Loader2,
  Sparkles,
  MessageSquare,
  Heart,
  UserPlus,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";
import { formatDistanceToNow, format } from "date-fns";
import { he } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface Campaign {
  id: string;
  name: string;
  subject: string;
  content: string;
  status: "draft" | "scheduled" | "sent" | "failed";
  target_audience: string;
  recipients_count: number;
  sent_at: string | null;
  scheduled_at: string | null;
  open_rate: number;
  click_rate: number;
  created_at: string;
}

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  content: string;
  type: string;
  created_at: string;
}

// Mock data for demonstration (would be replaced with real database queries)
const mockCampaigns: Campaign[] = [
  {
    id: "1",
    name: "ברוכים הבאים לחברים חדשים",
    subject: "ברוכים הבאים ל-Spark! 💝",
    content: "שמחים שהצטרפת אלינו...",
    status: "sent",
    target_audience: "new_users",
    recipients_count: 156,
    sent_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    scheduled_at: null,
    open_rate: 68.5,
    click_rate: 24.3,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "2",
    name: "חזרה לאתר - משתמשים לא פעילים",
    subject: "מתגעגעים אליך! 😊",
    content: "שמנו לב שלא היית פעיל/ה לאחרונה...",
    status: "scheduled",
    target_audience: "inactive_users",
    recipients_count: 89,
    sent_at: null,
    scheduled_at: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    open_rate: 0,
    click_rate: 0,
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "3",
    name: "עדכון שבועי",
    subject: "המאצ'ים החדשים שלך השבוע! 💕",
    content: "הנה הפרופילים החדשים שמתאימים לך...",
    status: "draft",
    target_audience: "all_active",
    recipients_count: 0,
    sent_at: null,
    scheduled_at: null,
    open_rate: 0,
    click_rate: 0,
    created_at: new Date().toISOString(),
  },
];

const mockTemplates: EmailTemplate[] = [
  {
    id: "1",
    name: "ברוכים הבאים",
    subject: "ברוכים הבאים ל-Spark! 💝",
    content: `שלום {name},

שמחים שהצטרפת אלינו! 

אנחנו כאן כדי לעזור לך למצוא את האהבה.

בהצלחה!
צוות Spark`,
    type: "welcome",
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "מאצ' חדש",
    subject: "יש לך מאצ' חדש! 💕",
    content: `היי {name},

יש לך מאצ' חדש עם {match_name}!

לחץ/י כאן כדי להתחיל שיחה.

בהצלחה!
צוות Spark`,
    type: "match",
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "איפוס סיסמה",
    subject: "איפוס סיסמה",
    content: `שלום {name},

לחץ/י על הקישור הבא כדי לאפס את הסיסמה שלך:
{reset_link}

הקישור יפוג תוך 24 שעות.

צוות Spark`,
    type: "password_reset",
    created_at: new Date().toISOString(),
  },
];

const targetAudienceLabels: Record<string, string> = {
  all: "כל המשתמשים",
  all_active: "כל הפעילים",
  new_users: "משתמשים חדשים",
  inactive_users: "לא פעילים",
  verified_users: "מאומתים",
  unverified_users: "לא מאומתים",
};

export default function AdminCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(mockCampaigns);
  const [templates, setTemplates] = useState<EmailTemplate[]>(mockTemplates);
  const [loading, setLoading] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [isSending, setIsSending] = useState(false);

  const [newCampaign, setNewCampaign] = useState({
    name: "",
    subject: "",
    content: "",
    target_audience: "all_active",
    scheduled: false,
    scheduled_at: "",
  });

  const [newTemplate, setNewTemplate] = useState({
    name: "",
    subject: "",
    content: "",
    type: "custom",
  });

  const getStatusBadge = (status: Campaign["status"]) => {
    switch (status) {
      case "sent":
        return (
          <Badge className="bg-success/10 text-success border-success">
            <CheckCircle className="w-3 h-3 ml-1" />
            נשלח
          </Badge>
        );
      case "scheduled":
        return (
          <Badge className="bg-primary/10 text-primary border-primary">
            <Clock className="w-3 h-3 ml-1" />
            מתוזמן
          </Badge>
        );
      case "draft":
        return (
          <Badge variant="secondary">
            <Edit2 className="w-3 h-3 ml-1" />
            טיוטה
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 ml-1" />
            נכשל
          </Badge>
        );
      default:
        return null;
    }
  };

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.subject || !newCampaign.content) {
      toast.error("נא למלא את כל השדות");
      return;
    }

    const campaign: Campaign = {
      id: Date.now().toString(),
      name: newCampaign.name,
      subject: newCampaign.subject,
      content: newCampaign.content,
      status: newCampaign.scheduled ? "scheduled" : "draft",
      target_audience: newCampaign.target_audience,
      recipients_count: 0,
      sent_at: null,
      scheduled_at: newCampaign.scheduled ? newCampaign.scheduled_at : null,
      open_rate: 0,
      click_rate: 0,
      created_at: new Date().toISOString(),
    };

    setCampaigns([campaign, ...campaigns]);
    setCreateDialogOpen(false);
    setNewCampaign({
      name: "",
      subject: "",
      content: "",
      target_audience: "all_active",
      scheduled: false,
      scheduled_at: "",
    });
    toast.success("הקמפיין נוצר בהצלחה!");
  };

  const handleSendCampaign = async (campaign: Campaign) => {
    setIsSending(true);
    // Simulate sending
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setCampaigns(campaigns.map(c => 
      c.id === campaign.id 
        ? { ...c, status: "sent" as const, sent_at: new Date().toISOString(), recipients_count: Math.floor(Math.random() * 200) + 50 }
        : c
    ));
    setIsSending(false);
    toast.success("הקמפיין נשלח בהצלחה!");
  };

  const handleDeleteCampaign = (id: string) => {
    setCampaigns(campaigns.filter(c => c.id !== id));
    toast.success("הקמפיין נמחק");
  };

  const handleCreateTemplate = () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.content) {
      toast.error("נא למלא את כל השדות");
      return;
    }

    const template: EmailTemplate = {
      id: Date.now().toString(),
      ...newTemplate,
      created_at: new Date().toISOString(),
    };

    setTemplates([template, ...templates]);
    setTemplateDialogOpen(false);
    setNewTemplate({ name: "", subject: "", content: "", type: "custom" });
    toast.success("התבנית נוצרה בהצלחה!");
  };

  const handleDuplicateCampaign = (campaign: Campaign) => {
    const newCamp: Campaign = {
      ...campaign,
      id: Date.now().toString(),
      name: `${campaign.name} (העתק)`,
      status: "draft",
      sent_at: null,
      scheduled_at: null,
      recipients_count: 0,
      open_rate: 0,
      click_rate: 0,
      created_at: new Date().toISOString(),
    };
    setCampaigns([newCamp, ...campaigns]);
    toast.success("הקמפיין שוכפל בהצלחה!");
  };

  const stats = {
    totalCampaigns: campaigns.length,
    sentCampaigns: campaigns.filter(c => c.status === "sent").length,
    scheduledCampaigns: campaigns.filter(c => c.status === "scheduled").length,
    avgOpenRate: campaigns.filter(c => c.status === "sent").reduce((sum, c) => sum + c.open_rate, 0) / 
      Math.max(campaigns.filter(c => c.status === "sent").length, 1),
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-foreground">קמפיינים וניוזלטר</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
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
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">קמפיינים וניוזלטר</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">ניהול שליחת אימיילים וקמפיינים שיווקיים</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setLoading(false)}>
              <RefreshCw className="w-4 h-4 ml-2" />
              רענן
            </Button>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="w-4 h-4 ml-2" />
                  קמפיין חדש
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>יצירת קמפיין חדש</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="campaignName">שם הקמפיין</Label>
                    <Input
                      id="campaignName"
                      placeholder="שם לזיהוי פנימי"
                      value={newCampaign.name}
                      onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">נושא האימייל</Label>
                    <Input
                      id="subject"
                      placeholder="נושא שיוצג למקבלי האימייל"
                      value={newCampaign.subject}
                      onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">תוכן האימייל</Label>
                    <Textarea
                      id="content"
                      placeholder="תוכן ההודעה... ניתן להשתמש ב-{name} לשם המשתמש"
                      value={newCampaign.content}
                      onChange={(e) => setNewCampaign({ ...newCampaign, content: e.target.value })}
                      rows={8}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>קהל יעד</Label>
                    <Select
                      value={newCampaign.target_audience}
                      onValueChange={(v) => setNewCampaign({ ...newCampaign, target_audience: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">כל המשתמשים</SelectItem>
                        <SelectItem value="all_active">כל הפעילים</SelectItem>
                        <SelectItem value="new_users">משתמשים חדשים (7 ימים אחרונים)</SelectItem>
                        <SelectItem value="inactive_users">לא פעילים (30+ ימים)</SelectItem>
                        <SelectItem value="verified_users">מאומתים בלבד</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">תזמון שליחה</p>
                        <p className="text-sm text-muted-foreground">שלח בזמן מסוים</p>
                      </div>
                    </div>
                    <Switch
                      checked={newCampaign.scheduled}
                      onCheckedChange={(checked) => setNewCampaign({ ...newCampaign, scheduled: checked })}
                    />
                  </div>

                  {newCampaign.scheduled && (
                    <div className="space-y-2">
                      <Label htmlFor="scheduledAt">תאריך ושעת שליחה</Label>
                      <Input
                        id="scheduledAt"
                        type="datetime-local"
                        value={newCampaign.scheduled_at}
                        onChange={(e) => setNewCampaign({ ...newCampaign, scheduled_at: e.target.value })}
                      />
                    </div>
                  )}

                  <div className="flex gap-2 justify-end pt-4">
                    <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                      ביטול
                    </Button>
                    <Button onClick={handleCreateCampaign}>
                      <Sparkles className="w-4 h-4 ml-2" />
                      צור קמפיין
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
          <StatsCard
            title="סה״כ קמפיינים"
            value={stats.totalCampaigns}
            icon={Mail}
          />
          <StatsCard
            title="נשלחו"
            value={stats.sentCampaigns}
            icon={CheckCircle}
          />
          <StatsCard
            title="מתוזמנים"
            value={stats.scheduledCampaigns}
            icon={Clock}
          />
          <StatsCard
            title="אחוז פתיחה ממוצע"
            value={`${stats.avgOpenRate.toFixed(1)}%`}
            icon={Eye}
          />
        </div>

        {/* Tabs */}
        <Tabs defaultValue="campaigns" dir="rtl">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="campaigns" className="flex-1 sm:flex-initial">
              <Mail className="w-4 h-4 ml-2" />
              קמפיינים
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex-1 sm:flex-initial">
              <Copy className="w-4 h-4 ml-2" />
              תבניות
            </TabsTrigger>
          </TabsList>

          {/* Campaigns Tab */}
          <TabsContent value="campaigns" className="mt-6">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border">
                <h3 className="text-lg font-semibold">רשימת קמפיינים</h3>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">שם</TableHead>
                      <TableHead className="text-right">נושא</TableHead>
                      <TableHead className="text-right">קהל יעד</TableHead>
                      <TableHead className="text-right">סטטוס</TableHead>
                      <TableHead className="text-right">נמענים</TableHead>
                      <TableHead className="text-right">פתיחות</TableHead>
                      <TableHead className="text-right">תאריך</TableHead>
                      <TableHead className="text-right">פעולות</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign) => (
                      <TableRow key={campaign.id}>
                        <TableCell className="font-medium">{campaign.name}</TableCell>
                        <TableCell className="max-w-[200px] truncate text-muted-foreground">
                          {campaign.subject}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {targetAudienceLabels[campaign.target_audience] || campaign.target_audience}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(campaign.status)}</TableCell>
                        <TableCell>{campaign.recipients_count || "-"}</TableCell>
                        <TableCell>
                          {campaign.status === "sent" ? `${campaign.open_rate}%` : "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {campaign.sent_at 
                            ? formatDistanceToNow(new Date(campaign.sent_at), { addSuffix: true, locale: he })
                            : campaign.scheduled_at
                              ? `מתוזמן ל-${format(new Date(campaign.scheduled_at), "dd/MM HH:mm", { locale: he })}`
                              : formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true, locale: he })
                          }
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setSelectedCampaign(campaign);
                                setPreviewDialogOpen(true);
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDuplicateCampaign(campaign)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                            {campaign.status === "draft" && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-primary hover:text-primary"
                                onClick={() => handleSendCampaign(campaign)}
                                disabled={isSending}
                              >
                                {isSending ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Send className="w-4 h-4" />
                                )}
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                              onClick={() => handleDeleteCampaign(campaign.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {campaigns.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                          אין קמפיינים עדיין
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="mt-6">
            <div className="bg-card rounded-xl border border-border overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="text-lg font-semibold">תבניות אימייל</h3>
                <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 ml-2" />
                      תבנית חדשה
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>יצירת תבנית חדשה</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="templateName">שם התבנית</Label>
                          <Input
                            id="templateName"
                            placeholder="שם לזיהוי"
                            value={newTemplate.name}
                            onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>סוג</Label>
                          <Select
                            value={newTemplate.type}
                            onValueChange={(v) => setNewTemplate({ ...newTemplate, type: v })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="welcome">ברוכים הבאים</SelectItem>
                              <SelectItem value="match">מאצ' חדש</SelectItem>
                              <SelectItem value="message">הודעה חדשה</SelectItem>
                              <SelectItem value="password_reset">איפוס סיסמה</SelectItem>
                              <SelectItem value="newsletter">ניוזלטר</SelectItem>
                              <SelectItem value="custom">מותאם אישית</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="templateSubject">נושא</Label>
                        <Input
                          id="templateSubject"
                          placeholder="נושא האימייל"
                          value={newTemplate.subject}
                          onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="templateContent">תוכן</Label>
                        <Textarea
                          id="templateContent"
                          placeholder="תוכן האימייל..."
                          value={newTemplate.content}
                          onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                          rows={10}
                        />
                        <p className="text-xs text-muted-foreground">
                          משתנים זמינים: {"{name}"}, {"{email}"}, {"{match_name}"}, {"{reset_link}"}
                        </p>
                      </div>

                      <div className="flex gap-2 justify-end pt-4">
                        <Button variant="outline" onClick={() => setTemplateDialogOpen(false)}>
                          ביטול
                        </Button>
                        <Button onClick={handleCreateTemplate}>
                          צור תבנית
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="border border-border rounded-lg p-4 hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{template.name}</h4>
                      <Badge variant="outline" className="text-xs">
                        {template.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 truncate">
                      {template.subject}
                    </p>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {template.content}
                    </p>
                    <div className="flex items-center gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setNewCampaign({
                            ...newCampaign,
                            subject: template.subject,
                            content: template.content,
                          });
                          setCreateDialogOpen(true);
                        }}
                      >
                        <Mail className="w-3 h-3 ml-1" />
                        השתמש
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Preview Dialog */}
        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>תצוגה מקדימה: {selectedCampaign?.name}</DialogTitle>
            </DialogHeader>
            {selectedCampaign && (
              <div className="space-y-4 pt-4">
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-1">נושא:</p>
                  <p className="font-medium">{selectedCampaign.subject}</p>
                </div>
                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm text-muted-foreground mb-2">תוכן:</p>
                  <div className="whitespace-pre-wrap text-sm">
                    {selectedCampaign.content}
                  </div>
                </div>
                {selectedCampaign.status === "sent" && (
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-card rounded-lg p-4 border border-border text-center">
                      <p className="text-2xl font-bold text-primary">{selectedCampaign.recipients_count}</p>
                      <p className="text-xs text-muted-foreground">נמענים</p>
                    </div>
                    <div className="bg-card rounded-lg p-4 border border-border text-center">
                      <p className="text-2xl font-bold text-success">{selectedCampaign.open_rate}%</p>
                      <p className="text-xs text-muted-foreground">פתיחות</p>
                    </div>
                    <div className="bg-card rounded-lg p-4 border border-border text-center">
                      <p className="text-2xl font-bold text-primary">{selectedCampaign.click_rate}%</p>
                      <p className="text-xs text-muted-foreground">קליקים</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
