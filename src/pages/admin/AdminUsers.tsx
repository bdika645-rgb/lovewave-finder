import { useState, useMemo } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import UsersTable from "@/components/admin/UsersTable";
import UserFilters from "@/components/admin/UserFilters";
import { useAdminUsers, AdminUser } from "@/hooks/useAdminUsers";
import { useBlockedUsers } from "@/hooks/useBlockedUsers";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, RefreshCw, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("all");
  const [sortBy, setSortBy] = useState("created_at_desc");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const pageSize = 20;

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">ניהול משתמשים</h1>
            <p className="text-muted-foreground mt-1">
              {totalCount} משתמשים רשומים
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => refetch()}>
              <RefreshCw className="w-4 h-4 ml-2" />
              רענן
            </Button>
            <Button variant="outline" onClick={exportUsers}>
              <Download className="w-4 h-4 ml-2" />
              ייצוא
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
            <UsersTable
              users={users}
              onUpdateRole={updateUserRole}
              onDelete={deleteUser}
              onView={handleViewUser}
              onBlock={handleBlockUser}
            />

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                מציג {((page - 1) * pageSize) + 1}-{Math.min(page * pageSize, totalCount)} מתוך {totalCount}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p - 1)}
                  disabled={page === 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  עמוד {page} מתוך {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(p => p + 1)}
                  disabled={page >= totalPages}
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
      </div>
    </AdminLayout>
  );
}
