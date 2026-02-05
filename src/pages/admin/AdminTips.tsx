import { useState } from "react";
import { motion } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
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
  Plus, 
  Edit2, 
  Trash2, 
  RefreshCw, 
  Lightbulb,
  GripVertical
} from "lucide-react";
import { useDatingTips, DatingTip } from "@/hooks/useDatingTips";
import { datingTips as staticTips } from "@/data/members";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
} as const;

const CATEGORIES = [
  { value: "פרופיל", label: "פרופיל" },
  { value: "שיחות", label: "שיחות" },
  { value: "דייטים", label: "דייטים" },
  { value: "מוטיבציה", label: "מוטיבציה" },
];

export default function AdminTips() {
  const { tips, loading, refetch, createTip, updateTip, deleteTip } = useDatingTips();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedTip, setSelectedTip] = useState<DatingTip | null>(null);
  const [tipToDelete, setTipToDelete] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "פרופיל",
    order_index: 0,
    is_active: true
  });

  // Use database tips if available, otherwise show static tips
  const displayTips = tips.length > 0 ? tips : staticTips.map((tip, index) => ({
    ...tip,
    order_index: index,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  const handleOpenCreate = () => {
    setSelectedTip(null);
    setFormData({
      title: "",
      content: "",
      category: "פרופיל",
      order_index: displayTips.length,
      is_active: true
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (tip: DatingTip) => {
    setSelectedTip(tip);
    setFormData({
      title: tip.title,
      content: tip.content,
      category: tip.category,
      order_index: tip.order_index,
      is_active: tip.is_active
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      return;
    }

    if (selectedTip) {
      await updateTip(selectedTip.id, formData);
    } else {
      await createTip(formData);
    }
    
    setDialogOpen(false);
    setFormData({
      title: "",
      content: "",
      category: "פרופיל",
      order_index: displayTips.length,
      is_active: true
    });
  };

  const handleDelete = async () => {
    if (tipToDelete) {
      await deleteTip(tipToDelete);
      setDeleteDialogOpen(false);
      setTipToDelete(null);
    }
  };

  const confirmDelete = (id: string) => {
    setTipToDelete(id);
    setDeleteDialogOpen(true);
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      "פרופיל": "bg-primary/10 text-primary border-primary",
      "שיחות": "bg-success/10 text-success border-success",
      "דייטים": "bg-secondary/10 text-secondary border-secondary",
      "מוטיבציה": "bg-warning/10 text-warning border-warning",
    };
    return colors[category] || "bg-muted text-muted-foreground border-muted-foreground/30";
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-foreground">טיפים להיכרויות</h1>
          <div className="grid gap-4">
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
      <motion.div 
        className="space-y-6 sm:space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">טיפים להיכרויות</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">ניהול טיפים שמוצגים למשתמשים</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 ml-2" />
              רענן
            </Button>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" onClick={handleOpenCreate}>
                  <Plus className="w-4 h-4 ml-2" />
                  הוסף טיפ
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>{selectedTip ? "עריכת טיפ" : "הוספת טיפ חדש"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label>כותרת</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="כותרת הטיפ..."
                    />
                  </div>
                  
                  <div>
                    <Label>תוכן</Label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="תוכן הטיפ..."
                      rows={4}
                    />
                  </div>
                  
                  <div>
                    <Label>קטגוריה</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(v) => setFormData({ ...formData, category: v })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(cat => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>סדר תצוגה</Label>
                    <Input
                      type="number"
                      value={formData.order_index}
                      onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                      min={0}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>פעיל</Label>
                      <p className="text-sm text-muted-foreground">הצג טיפ זה למשתמשים</p>
                    </div>
                    <Switch 
                      checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                    />
                  </div>
                  
                  <Button onClick={handleSubmit} className="w-full">
                    {selectedTip ? "עדכן טיפ" : "הוסף טיפ"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </motion.div>

        {/* Tips List */}
        <div className="space-y-4">
          {displayTips.map((tip) => (
            <div 
              key={tip.id}
              className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 bg-primary/10 rounded-lg cursor-move">
                  <GripVertical className="w-5 h-5 text-muted-foreground" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Lightbulb className="w-5 h-5 text-primary" />
                    <h3 className="font-semibold text-foreground">{tip.title}</h3>
                    <Badge variant="outline" className={getCategoryBadge(tip.category)}>
                      {tip.category}
                    </Badge>
                    {!tip.is_active && (
                      <Badge variant="secondary">מושבת</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground">{tip.content}</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleOpenEdit(tip as DatingTip)}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => confirmDelete(tip.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}

          {displayTips.length === 0 && (
            <div className="text-center py-12 bg-card rounded-xl border border-border">
              <Lightbulb className="w-12 h-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">אין טיפים להצגה</p>
              <Button variant="outline" className="mt-4" onClick={handleOpenCreate}>
                <Plus className="w-4 h-4 ml-2" />
                הוסף טיפ ראשון
              </Button>
            </div>
          )}
        </div>

        {/* Delete Confirmation */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>מחיקת טיפ</AlertDialogTitle>
              <AlertDialogDescription>
                האם אתה בטוח שברצונך למחוק טיפ זה? פעולה זו לא ניתנת לביטול.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>ביטול</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                מחק
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </AdminLayout>
  );
}
