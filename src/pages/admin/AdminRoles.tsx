import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Shield, ShieldCheck, User, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type AppRole = "admin" | "moderator" | "user";

interface RoleUser {
  id: string;
  user_id: string;
  role: AppRole;
  created_at: string;
  profile?: { name: string; avatar_url: string | null } | null;
}

interface AvailableUser {
  id: string;
  user_id: string;
  name: string;
  avatar_url: string | null;
}

export default function AdminRoles() {
  const [roleUsers, setRoleUsers] = useState<RoleUser[]>([]);
  const [availableUsers, setAvailableUsers] = useState<AvailableUser[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedRole, setSelectedRole] = useState<"admin" | "moderator" | "user">("moderator");
  const [searchUser, setSearchUser] = useState("");

  const fetchData = async () => {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);

      // Fetch users with roles
      const { data: rolesData } = await supabase
        .from("user_roles")
        .select("*")
        .order("created_at", { ascending: false });

      // Get profile details
      const userIds = rolesData?.map(r => r.user_id) || [];
      
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, name, avatar_url")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.user_id, p]) || []);

      const enrichedRoles = rolesData?.map(r => ({
        ...r,
        profile: profileMap.get(r.user_id) || null
      })) || [];

      setRoleUsers(enrichedRoles);

      // Fetch available users (those without roles)
      const { data: allProfiles } = await supabase
        .from("profiles")
        .select("id, user_id, name, avatar_url")
        .not("user_id", "is", null)
        .eq("is_demo", false);

      const usersWithRoles = new Set(rolesData?.map(r => r.user_id) || []);
      const available = (allProfiles || [])
        .filter(p => p.user_id && !usersWithRoles.has(p.user_id))
        .map(p => ({ 
          id: p.id, 
          user_id: p.user_id!, 
          name: p.name, 
          avatar_url: p.avatar_url 
        }));

      setAvailableUsers(available);
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addRole = async () => {
    if (!selectedUserId) {
      toast.error("בחר משתמש");
      return;
    }

    try {
      const { error } = await supabase
        .from("user_roles")
        .insert({ user_id: selectedUserId, role: selectedRole });

      if (error) throw error;

      toast.success("התפקיד נוסף בהצלחה");
      setDialogOpen(false);
      setSelectedUserId("");
      fetchData();
    } catch (error) {
      console.error("Error adding role:", error);
      toast.error("שגיאה בהוספת התפקיד");
    }
  };

  const updateRole = async (userId: string, newRole: AppRole) => {
    try {
      const { error } = await supabase
        .from("user_roles")
        .update({ role: newRole })
        .eq("user_id", userId);

      if (error) throw error;

      toast.success("התפקיד עודכן בהצלחה");
      fetchData();
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("שגיאה בעדכון התפקיד");
    }
  };

  const removeRole = async (userId: string) => {
    // Prevent self-removal
    if (userId === currentUserId) {
      toast.error("לא ניתן להסיר את התפקיד שלך עצמך");
      return;
    }

    try {
      const { error } = await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", userId);

      if (error) throw error;

      toast.success("התפקיד הוסר בהצלחה");
      fetchData();
    } catch (error) {
      console.error("Error removing role:", error);
      toast.error("שגיאה בהסרת התפקיד");
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <ShieldCheck className="w-4 h-4 text-destructive" />;
      case "moderator":
        return <Shield className="w-4 h-4 text-secondary" />;
      default:
        return <User className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-destructive hover:bg-destructive/90">מנהל</Badge>;
      case "moderator":
        return <Badge className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">מנחה</Badge>;
      default:
        return <Badge variant="secondary">משתמש</Badge>;
    }
  };

  const filteredUsers = availableUsers.filter(u => 
    u.name.toLowerCase().includes(searchUser.toLowerCase())
  );

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-foreground">תפקידים והרשאות</h1>
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
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">תפקידים והרשאות</h1>
            <p className="text-muted-foreground mt-1 text-sm sm:text-base">ניהול תפקידי משתמשים במערכת</p>
          </div>
          
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 ml-2" />
                הוסף תפקיד
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>הוספת תפקיד למשתמש</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">חפש משתמש</label>
                  <Input
                    placeholder="הקלד שם..."
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                  />
                </div>

                <div className="max-h-[200px] overflow-y-auto space-y-2">
                  {filteredUsers.map(user => (
                    <button
                      key={user.user_id}
                      onClick={() => setSelectedUserId(user.user_id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        selectedUserId === user.user_id 
                          ? "border-primary bg-primary/10" 
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span>{user.name}</span>
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">תפקיד</label>
                  <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">מנהל</SelectItem>
                      <SelectItem value="moderator">מנחה</SelectItem>
                      <SelectItem value="user">משתמש</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={addRole} className="w-full">
                  הוסף תפקיד
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Role Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
          <div className="bg-card rounded-xl p-6 border border-border flex items-center gap-4">
            <div className="p-3 bg-destructive/10 rounded-lg">
              <ShieldCheck className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{roleUsers.filter(r => r.role === "admin").length}</p>
              <p className="text-muted-foreground">מנהלים</p>
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border flex items-center gap-4">
            <div className="p-3 bg-secondary/10 rounded-lg">
              <Shield className="w-6 h-6 text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{roleUsers.filter(r => r.role === "moderator").length}</p>
              <p className="text-muted-foreground">מנחים</p>
            </div>
          </div>
          <div className="bg-card rounded-xl p-6 border border-border flex items-center gap-4">
            <div className="p-3 bg-muted rounded-lg">
              <User className="w-6 h-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-2xl font-bold">{availableUsers.length}</p>
              <p className="text-muted-foreground">משתמשים ללא תפקיד</p>
            </div>
          </div>
        </div>

        {/* Roles Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold">משתמשים עם תפקידים</h3>
          </div>
          <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">משתמש</TableHead>
                <TableHead className="text-right">תפקיד נוכחי</TableHead>
                <TableHead className="text-right">שנה תפקיד</TableHead>
                <TableHead className="text-right">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roleUsers.map((roleUser) => (
                <TableRow key={roleUser.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {getRoleIcon(roleUser.role)}
                      <span>{roleUser.profile?.name || "לא ידוע"}</span>
                    </div>
                  </TableCell>
                  <TableCell>{getRoleBadge(roleUser.role)}</TableCell>
                  <TableCell>
                    <Select 
                      value={roleUser.role} 
                      onValueChange={(v) => updateRole(roleUser.user_id, v as AppRole)}
                    >
                      <SelectTrigger className="w-[130px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">מנהל</SelectItem>
                        <SelectItem value="moderator">מנחה</SelectItem>
                        <SelectItem value="user">משתמש</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => removeRole(roleUser.user_id)}
                      disabled={roleUser.user_id === currentUserId}
                      title={roleUser.user_id === currentUserId ? "לא ניתן להסיר את התפקיד שלך עצמך" : "הסר תפקיד"}
                    >
                      הסר תפקיד
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {roleUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    אין משתמשים עם תפקידים
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
