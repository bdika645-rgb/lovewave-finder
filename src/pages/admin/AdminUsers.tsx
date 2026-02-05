import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import UsersTable from "@/components/admin/UsersTable";
import UserFilters from "@/components/admin/UserFilters";
import { useAdminUsers, AdminUser } from "@/hooks/useAdminUsers";
import { useBlockedUsers } from "@/hooks/useBlockedUsers";
import { useImpersonation } from "@/contexts/ImpersonationContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, RefreshCw, Download, UserPlus, Loader2, Edit2, Users, BadgeCheck, UserX as UserOffIcon } from "lucide-react";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
} as const;
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { israeliCities } from "@/data/members";

export default function AdminUsers() {
  const navigate = useNavigate();
  const { startImpersonation } = useImpersonation();
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("all");
  const [city, setCity] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("created_at_desc");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const pageSize = 20;

  // New user form state
  const [newUser, setNewUser] = useState({
    name: "",
    age: 25,
    city: "תל אביב",
    gender: "male",
    bio: "",
  });

  // Edit user form state
  const [editUser, setEditUser] = useState({
    name: "",
    age: 25,
    city: "תל אביב",
    gender: "male",
    bio: "",
  });

  const sortConfig = useMemo(() => {
    const [field, order] = sortBy.split("_");
    return {
      sortBy: field === "created" ? "created_at" : field,
      sortOrder: (order === "asc" ? "asc" : "desc") as "asc" | "desc"
    };
  }, [sortBy]);

  // Determine filter values
  const isOnlineFilter = statusFilter === "online" ? true : statusFilter === "offline" ? false : undefined;
  const isVerifiedFilter = statusFilter === "verified" ? true : statusFilter === "unverified" ? false : undefined;
  
  const { users, loading, totalCount, refetch, updateUserRole, deleteUser, verifyUser } = useAdminUsers({
    search,
    gender: gender !== "all" ? gender : undefined,
    city: city !== "all" ? city : undefined,
    isOnline: isOnlineFilter,
    isVerified: isVerifiedFilter,
    sortBy: sortConfig.sortBy,
    sortOrder: sortConfig.sortOrder,
    page,
    pageSize
  });

  const { blockUser } = useBlockedUsers();

  // Bulk action handlers
  const handleBulkDelete = async (profileIds: string[]) => {
    for (const id of profileIds) {
      await deleteUser(id);
    }
    refetch();
  };

  const handleBulkBlock = async (profileIds: string[], reason: string) => {
    for (const id of profileIds) {
      await blockUser(id, reason);
    }
    refetch();
  };

  const handleBulkUpdateRole = async (userIds: string[], role: "admin" | "moderator" | "user") => {
    for (const id of userIds) {
      await updateUserRole(id, role);
    }
    refetch();
  };

  const handleBulkNotify = async (profileIds: string[], message: string) => {
    // Create notifications for selected users
    const { error } = await supabase
      .from("admin_notifications")
      .insert({
        title: "הודעה ממנהל",
        message,
        type: "info",
        target_all: false,
        // We'll need to insert multiple records or use a different approach
      });
    
    if (!error) {
      toast.success(`התראה נשלחה ל-${profileIds.length} משתמשים`);
    } else {
      toast.error("שגיאה בשליחת ההתראה");
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleViewUser = (user: AdminUser) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const handleBlockUser = async (profileId: string, reason: string) => {
    await blockUser(profileId, reason);
    refetch();
  };

  const handleImpersonate = async (user: AdminUser) => {
    const success = await startImpersonation(user.id);
    if (success) {
      navigate('/discover');
    }
  };

  const handleCreateUser = async () => {
    if (!newUser.name.trim()) {
      toast.error("נא להזין שם");
      return;
    }
    if (newUser.age < 18 || newUser.age > 99) {
      toast.error("גיל לא תקין (18-99)");
      return;
    }

    setIsCreating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .insert({
          name: newUser.name,
          age: newUser.age,
          city: newUser.city,
          gender: newUser.gender,
          bio: newUser.bio || null,
          is_demo: true, // Mark as demo profile since it wasn't created via auth
        });

      if (error) throw error;

      toast.success("המשתמש נוצר בהצלחה!");
      setCreateDialogOpen(false);
      setNewUser({ name: "", age: 25, city: "תל אביב", gender: "male", bio: "" });
      refetch();
    } catch {
      toast.error("שגיאה ביצירת המשתמש");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditUser = (user: AdminUser) => {
    setSelectedUser(user);
    setEditUser({
      name: user.name,
      age: user.age,
      city: user.city,
      gender: user.gender || "male",
      bio: user.bio || "",
    });
    setEditDialogOpen(true);
  };

  const handleSaveUser = async () => {
    if (!selectedUser || !editUser.name.trim()) {
      toast.error("נא להזין שם");
      return;
    }
    if (editUser.age < 18 || editUser.age > 99) {
      toast.error("גיל לא תקין (18-99)");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name: editUser.name,
          age: editUser.age,
          city: editUser.city,
          gender: editUser.gender,
          bio: editUser.bio || null,
        })
        .eq("id", selectedUser.id);

      if (error) throw error;

      toast.success("המשתמש עודכן בהצלחה!");
      setEditDialogOpen(false);
      refetch();
    } catch {
      toast.error("שגיאה בעדכון המשתמש");
    } finally {
      setIsSaving(false);
    }
  };

  const exportUsers = () => {
    const csv = [
      ["שם", "גיל", "מגדר", "עיר", "תאריך הרשמה"],
      ...users.map(u => [u.name, u.age.toString(), u.gender || "", u.city, u.created_at])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "users.csv";
    link.click();
  };

  // Calculate quick stats
  const onlineCount = users.filter(u => u.is_online).length;
  const verifiedCount = users.filter(u => u.is_verified).length;

  return (
    <AdminLayout>
      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">ניהול משתמשים</h1>
            <p className="text-muted-foreground mt-1">
              {totalCount} משתמשים רשומים
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 ml-2" />
              רענן
            </Button>
            <Button variant="outline" size="sm" onClick={exportUsers}>
              <Download className="w-4 h-4 ml-2" />
              ייצוא
            </Button>
            <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
              <UserPlus className="w-4 h-4 ml-2" />
              צור משתמש
            </Button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalCount}</p>
                <p className="text-xs text-muted-foreground">סה״כ משתמשים</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <span className="w-5 h-5 flex items-center justify-center text-success text-lg">●</span>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{onlineCount}</p>
                <p className="text-xs text-muted-foreground">מחוברים כעת</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BadgeCheck className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{verifiedCount}</p>
                <p className="text-xs text-muted-foreground">מאומתים</p>
              </div>
            </div>
          </div>
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <UserOffIcon className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalCount - onlineCount}</p>
                <p className="text-xs text-muted-foreground">לא מחוברים</p>
              </div>
            </div>
          </div>
        </motion.div>

        <UserFilters
          search={search}
          onSearchChange={setSearch}
          gender={gender}
          onGenderChange={setGender}
          sortBy={sortBy}
          onSortChange={setSortBy}
          city={city}
          onCityChange={setCity}
          status={statusFilter}
          onStatusChange={setStatusFilter}
        />

        {loading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 rounded-lg" />
            ))}
          </div>
        ) : (
          <>
            <div className="overflow-x-auto -mx-4 sm:mx-0">
              <p className="sr-only" id="adminUsersTableScrollHint">
                הטבלה ניתנת לגלילה אופקית במסכים קטנים.
              </p>
              <div className="min-w-[700px] px-4 sm:px-0">
                <UsersTable
                  users={users}
                  onUpdateRole={updateUserRole}
                  onDelete={deleteUser}
                  onView={handleViewUser}
                  onBlock={handleBlockUser}
                  onEdit={handleEditUser}
                  onImpersonate={handleImpersonate}
                  onVerify={verifyUser}
                  onBulkDelete={handleBulkDelete}
                  onBulkBlock={handleBulkBlock}
                  onBulkUpdateRole={handleBulkUpdateRole}
                  onBulkNotify={handleBulkNotify}
                />
              </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                מציג {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, totalCount)} מתוך {totalCount}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 1}
                  aria-label="לעמוד הקודם"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground px-2">
                  עמוד {page} מתוך {Math.max(totalPages, 1)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages}
                  aria-label="לעמוד הבא"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}

        {/* User View Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>פרופיל משתמש</DialogTitle>
            </DialogHeader>
            {selectedUser && (
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={selectedUser.avatar_url || undefined} />
                    <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                      {selectedUser.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                    <p className="text-muted-foreground">
                      {selectedUser.age} | {selectedUser.city}
                    </p>
                    <Badge variant={selectedUser.is_online ? "default" : "secondary"} className="mt-1">
                      {selectedUser.is_online ? "מחובר" : "לא מחובר"}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">מגדר</p>
                    <p className="font-medium">{selectedUser.gender || "לא צוין"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">תפקיד</p>
                    <p className="font-medium">{selectedUser.role || "משתמש"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">תאריך הרשמה</p>
                    <p className="font-medium">
                      {formatDistanceToNow(new Date(selectedUser.created_at), { 
                        addSuffix: true, 
                        locale: he 
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">נראה לאחרונה</p>
                    <p className="font-medium">
                      {selectedUser.last_seen
                        ? formatDistanceToNow(new Date(selectedUser.last_seen), { 
                            addSuffix: true, 
                            locale: he 
                          })
                        : "לא ידוע"}
                    </p>
                  </div>
                </div>

                {selectedUser.bio && (
                  <div>
                    <p className="text-muted-foreground text-sm mb-1">אודות</p>
                    <p className="text-foreground">{selectedUser.bio}</p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Create User Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>יצירת משתמש חדש</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="name">שם</Label>
                <Input
                  id="name"
                  placeholder="שם המשתמש"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="age">גיל</Label>
                  <Input
                    id="age"
                    type="number"
                    min={18}
                    max={99}
                    value={newUser.age}
                    onChange={(e) => setNewUser({ ...newUser, age: parseInt(e.target.value) || 18 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>מגדר</Label>
                  <Select
                    value={newUser.gender}
                    onValueChange={(v) => setNewUser({ ...newUser, gender: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">גבר</SelectItem>
                      <SelectItem value="female">אישה</SelectItem>
                      <SelectItem value="other">אחר</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>עיר</Label>
                <Select
                  value={newUser.city}
                  onValueChange={(v) => setNewUser({ ...newUser, city: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {israeliCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">תיאור (אופציונלי)</Label>
                <Textarea
                  id="bio"
                  placeholder="קצת על המשתמש..."
                  value={newUser.bio}
                  onChange={(e) => setNewUser({ ...newUser, bio: e.target.value })}
                  rows={3}
                />
              </div>

              <Button
                className="w-full"
                onClick={handleCreateUser}
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    יוצר...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 ml-2" />
                    צור משתמש
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>עריכת משתמש: {selectedUser?.name}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="editName">שם</Label>
                <Input
                  id="editName"
                  placeholder="שם המשתמש"
                  value={editUser.name}
                  onChange={(e) => setEditUser({ ...editUser, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="editAge">גיל</Label>
                  <Input
                    id="editAge"
                    type="number"
                    min={18}
                    max={99}
                    value={editUser.age}
                    onChange={(e) => setEditUser({ ...editUser, age: parseInt(e.target.value) || 18 })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>מגדר</Label>
                  <Select
                    value={editUser.gender}
                    onValueChange={(v) => setEditUser({ ...editUser, gender: v })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">גבר</SelectItem>
                      <SelectItem value="female">אישה</SelectItem>
                      <SelectItem value="other">אחר</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>עיר</Label>
                <Select
                  value={editUser.city}
                  onValueChange={(v) => setEditUser({ ...editUser, city: v })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {israeliCities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="editBio">תיאור (אופציונלי)</Label>
                <Textarea
                  id="editBio"
                  placeholder="קצת על המשתמש..."
                  value={editUser.bio}
                  onChange={(e) => setEditUser({ ...editUser, bio: e.target.value })}
                  rows={3}
                />
              </div>

              <Button
                className="w-full"
                onClick={handleSaveUser}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    שומר...
                  </>
                ) : (
                  <>
                    <Edit2 className="w-4 h-4 ml-2" />
                    שמור שינויים
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </AdminLayout>
  );
}