import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
} from "@/components/ui/dialog";
import { MoreHorizontal, Eye, Trash2, Shield, ShieldCheck, User, UserX } from "lucide-react";
import { AdminUser } from "@/hooks/useAdminUsers";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";

interface UsersTableProps {
  users: AdminUser[];
  onUpdateRole: (userId: string, role: "admin" | "moderator" | "user") => void;
  onDelete: (profileId: string) => void;
  onView: (user: AdminUser) => void;
  onBlock?: (profileId: string, reason: string) => Promise<void>;
}

export default function UsersTable({ users, onUpdateRole, onDelete, onView, onBlock }: UsersTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [blockReason, setBlockReason] = useState("");

  const handleDeleteClick = (user: AdminUser) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleBlockClick = (user: AdminUser) => {
    setSelectedUser(user);
    setBlockReason("");
    setBlockDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      onDelete(selectedUser.id);
    }
    setDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  const confirmBlock = async () => {
    if (selectedUser && onBlock) {
      await onBlock(selectedUser.id, blockReason);
    }
    setBlockDialogOpen(false);
    setSelectedUser(null);
    setBlockReason("");
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-red-500 hover:bg-red-600">מנהל</Badge>;
      case "moderator":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">מנחה</Badge>;
      default:
        return <Badge variant="secondary">משתמש</Badge>;
    }
  };

  const getGenderDisplay = (gender: string | null) => {
    if (gender === "male" || gender === "גבר") return "גבר";
    if (gender === "female" || gender === "אישה") return "אישה";
    return gender || "לא צוין";
  };

  return (
    <>
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="text-right">משתמש</TableHead>
              <TableHead className="text-right">גיל</TableHead>
              <TableHead className="text-right">מגדר</TableHead>
              <TableHead className="text-right">עיר</TableHead>
              <TableHead className="text-right">סטטוס</TableHead>
              <TableHead className="text-right">תפקיד</TableHead>
              <TableHead className="text-right">הצטרף</TableHead>
              <TableHead className="text-right">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id} className="hover:bg-muted/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10">
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {user.bio || "אין תיאור"}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.age}</TableCell>
                <TableCell className="text-muted-foreground">{getGenderDisplay(user.gender)}</TableCell>
                <TableCell className="text-muted-foreground">{user.city}</TableCell>
                <TableCell>
                  <Badge variant={user.is_online ? "default" : "secondary"}>
                    {user.is_online ? "מחובר" : "לא מחובר"}
                  </Badge>
                </TableCell>
                <TableCell>{getRoleBadge(user.role)}</TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {formatDistanceToNow(new Date(user.created_at), { 
                    addSuffix: true, 
                    locale: he 
                  })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem onClick={() => onView(user)}>
                        <Eye className="w-4 h-4 ml-2" />
                        צפייה בפרופיל
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {user.user_id && (
                        <>
                          <DropdownMenuItem onClick={() => onUpdateRole(user.user_id!, "admin")}>
                            <ShieldCheck className="w-4 h-4 ml-2" />
                            הפוך למנהל
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateRole(user.user_id!, "moderator")}>
                            <Shield className="w-4 h-4 ml-2" />
                            הפוך למנחה
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onUpdateRole(user.user_id!, "user")}>
                            <User className="w-4 h-4 ml-2" />
                            הפוך למשתמש רגיל
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                        </>
                      )}
                      {onBlock && (
                        <DropdownMenuItem 
                          onClick={() => handleBlockClick(user)}
                          className="text-orange-600 focus:text-orange-600"
                        >
                          <UserX className="w-4 h-4 ml-2" />
                          חסום משתמש
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleDeleteClick(user)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="w-4 h-4 ml-2" />
                        מחק משתמש
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>האם אתה בטוח?</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו תמחק את המשתמש {selectedUser?.name} לצמיתות. לא ניתן לבטל פעולה זו.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              מחק
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Block User Dialog */}
      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>חסימת משתמש: {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="blockReason">סיבת החסימה</Label>
              <Textarea
                id="blockReason"
                placeholder="נא לציין את סיבת החסימה..."
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setBlockDialogOpen(false)}>
                ביטול
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmBlock}
                disabled={!blockReason.trim()}
              >
                <UserX className="w-4 h-4 ml-2" />
                חסום משתמש
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
