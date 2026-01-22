import { useState, useMemo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import UsersTable from "@/components/admin/UsersTable";
import UserFilters from "@/components/admin/UserFilters";
import { useAdminUsers, AdminUser } from "@/hooks/useAdminUsers";
import { useBlockedUsers } from "@/hooks/useBlockedUsers";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, RefreshCw, Download, UserPlus, Loader2, Edit2 } from "lucide-react";
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
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("all");
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

  const { users, loading, totalCount, refetch, updateUserRole, deleteUser } = useAdminUsers({
    search,
    gender: gender !== "all" ? gender : undefined,
    sortBy: sortConfig.sortBy,
    sortOrder: sortConfig.sortOrder,
    page,
    pageSize
  });

  const { blockUser } = useBlockedUsers();

  const totalPages = Math.ceil(totalCount / pageSize);

  const handleViewUser = (user: AdminUser) => {
    setSelectedUser(user);
    setViewDialogOpen(true);
  };

  const handleBlockUser = async (profileId: string, reason: string) => {
    await blockUser(profileId, reason);
    refetch();
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

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
        </div>

        <UserFilters
          search={search}
          onSearchChange={setSearch}
          gender={gender}
          onGenderChange={setGender}
          sortBy={sortBy}
          onSortChange={setSortBy}
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
      </div>
    </AdminLayout>
  );
}