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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
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
import { MoreHorizontal, Eye, Trash2, Shield, ShieldCheck, User, UserX, Edit2, Bell, X, UserCheck, BadgeCheck } from "lucide-react";
import { AdminUser } from "@/hooks/useAdminUsers";
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

interface UsersTableProps {
  users: AdminUser[];
  onUpdateRole: (userId: string, role: "admin" | "moderator" | "user") => void;
  onDelete: (profileId: string) => void;
  onView: (user: AdminUser) => void;
  onBlock?: (profileId: string, reason: string) => Promise<void>;
  onEdit?: (user: AdminUser) => void;
  onImpersonate?: (user: AdminUser) => void;
  onVerify?: (profileId: string, verified: boolean) => void;
  // Bulk action handlers
  onBulkDelete?: (profileIds: string[]) => Promise<void>;
  onBulkBlock?: (profileIds: string[], reason: string) => Promise<void>;
  onBulkUpdateRole?: (userIds: string[], role: "admin" | "moderator" | "user") => Promise<void>;
  onBulkNotify?: (profileIds: string[], message: string) => Promise<void>;
}

export default function UsersTable({ 
  users, 
  onUpdateRole, 
  onDelete, 
  onView, 
  onBlock, 
  onEdit,
  onImpersonate,
  onVerify,
  onBulkDelete,
  onBulkBlock,
  onBulkUpdateRole,
  onBulkNotify
}: UsersTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [bulkBlockDialogOpen, setBulkBlockDialogOpen] = useState(false);
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false);
  const [bulkNotifyDialogOpen, setBulkNotifyDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [blockReason, setBlockReason] = useState("");
  const [notifyMessage, setNotifyMessage] = useState("");
  
  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

  // Bulk selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.size === users.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(users.map(u => u.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  };

  const clearSelection = () => {
    setSelectedIds(new Set());
  };

  // Bulk action handlers
  const handleBulkDelete = async () => {
    if (onBulkDelete && selectedIds.size > 0) {
      await onBulkDelete(Array.from(selectedIds));
      clearSelection();
    }
    setBulkDeleteDialogOpen(false);
  };

  const handleBulkBlock = async () => {
    if (onBulkBlock && selectedIds.size > 0 && blockReason.trim()) {
      await onBulkBlock(Array.from(selectedIds), blockReason);
      clearSelection();
      setBlockReason("");
    }
    setBulkBlockDialogOpen(false);
  };

  const handleBulkNotify = async () => {
    if (onBulkNotify && selectedIds.size > 0 && notifyMessage.trim()) {
      await onBulkNotify(Array.from(selectedIds), notifyMessage);
      clearSelection();
      setNotifyMessage("");
    }
    setBulkNotifyDialogOpen(false);
  };

  const handleBulkRoleChange = async (role: "admin" | "moderator" | "user") => {
    if (onBulkUpdateRole && selectedIds.size > 0) {
      const selectedUsers = users.filter(u => selectedIds.has(u.id) && u.user_id);
      const userIds = selectedUsers.map(u => u.user_id!);
      if (userIds.length > 0) {
        await onBulkUpdateRole(userIds, role);
        clearSelection();
      }
    }
  };

  const getRoleBadge = (role?: string) => {
    switch (role) {
      case "admin":
        return <Badge className="bg-destructive/90 hover:bg-destructive text-destructive-foreground">מנהל</Badge>;
      case "moderator":
        return <Badge className="bg-amber-500/90 hover:bg-amber-500 text-white">מנחה</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground">משתמש</Badge>;
    }
  };

  const getGenderDisplay = (gender: string | null) => {
    if (gender === "male" || gender === "גבר") return "גבר";
    if (gender === "female" || gender === "אישה") return "אישה";
    return gender || "לא צוין";
  };

  const isAllSelected = users.length > 0 && selectedIds.size === users.length;
  const isSomeSelected = selectedIds.size > 0;
  const isMixedSelected = isSomeSelected && !isAllSelected;

  return (
    <>
      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {isSomeSelected && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-4 p-3 bg-primary/10 border border-primary/20 rounded-lg flex flex-wrap items-center gap-2 sm:gap-4"
            role="status"
            aria-live="polite"
          >
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-sm">
                {selectedIds.size} נבחרו
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 focus-ring"
                onClick={clearSelection}
                aria-label="נקה בחירה"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 mr-auto">
              {onBulkNotify && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setBulkNotifyDialogOpen(true)}
                  className="gap-1"
                >
                  <Bell className="w-4 h-4" />
                  <span className="hidden sm:inline">שלח התראה</span>
                </Button>
              )}
              
              {onBulkUpdateRole && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-1 focus-ring" aria-label="שנה תפקיד (בחירה מרובה)">
                      <Shield className="w-4 h-4" />
                      <span className="hidden sm:inline">שנה תפקיד</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="z-50">
                    <DropdownMenuItem onClick={() => handleBulkRoleChange("admin")}>
                      <ShieldCheck className="w-4 h-4 ml-2" />
                      מנהל
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkRoleChange("moderator")}>
                      <Shield className="w-4 h-4 ml-2" />
                      מנחה
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleBulkRoleChange("user")}>
                      <User className="w-4 h-4 ml-2" />
                      משתמש רגיל
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
              
              {onBulkBlock && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setBulkBlockDialogOpen(true)}
                  className="gap-1 text-orange-600 border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                >
                  <UserX className="w-4 h-4" />
                  <span className="hidden sm:inline">חסום</span>
                </Button>
              )}
              
              {onBulkDelete && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setBulkDeleteDialogOpen(true)}
                  className="gap-1 text-destructive border-destructive/20 hover:bg-destructive/10"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">מחק</span>
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="w-12">
                <Checkbox 
                  checked={isAllSelected ? true : isMixedSelected ? "indeterminate" : false}
                  onCheckedChange={toggleSelectAll}
                  aria-label="בחר הכל"
                  aria-checked={isMixedSelected ? "mixed" : isAllSelected}
                />
              </TableHead>
              <TableHead className="text-right">משתמש</TableHead>
              <TableHead className="text-right">גיל</TableHead>
              <TableHead className="text-right hidden sm:table-cell">מגדר</TableHead>
              <TableHead className="text-right">עיר</TableHead>
              <TableHead className="text-right hidden md:table-cell">סטטוס</TableHead>
              <TableHead className="text-right hidden lg:table-cell">תפקיד</TableHead>
              <TableHead className="text-right hidden lg:table-cell">הצטרף</TableHead>
              <TableHead className="text-right">פעולות</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow 
                key={user.id} 
                className={`hover:bg-muted/30 ${selectedIds.has(user.id) ? 'bg-primary/5' : ''}`}
              >
                <TableCell>
                  <Checkbox 
                    checked={selectedIds.has(user.id)}
                    onCheckedChange={() => toggleSelect(user.id)}
                    aria-label={`בחר ${user.name}`}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={user.avatar_url || undefined} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {/* Online Status Indicator */}
                      <span 
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                          user.is_online ? 'bg-green-500' : 'bg-muted-foreground/40'
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-medium text-foreground">{user.name}</p>
                        {user.is_verified && (
                          <BadgeCheck className="w-4 h-4 text-primary" aria-label="מאומת" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                        {user.bio || "אין תיאור"}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{user.age}</TableCell>
                <TableCell className="text-muted-foreground hidden sm:table-cell">{getGenderDisplay(user.gender)}</TableCell>
                <TableCell className="text-muted-foreground">{user.city}</TableCell>
                <TableCell className="hidden md:table-cell">
                  <Badge 
                    variant="outline" 
                    className={user.is_online 
                      ? "bg-green-500/10 text-green-600 border-green-500/30" 
                      : "bg-orange-500/10 text-orange-600 border-orange-500/30"
                    }
                  >
                    {user.is_online ? "מחובר" : "לא מחובר"}
                  </Badge>
                </TableCell>
                <TableCell className="hidden lg:table-cell">{getRoleBadge(user.role)}</TableCell>
                <TableCell className="text-muted-foreground text-sm hidden lg:table-cell">
                  {formatDistanceToNow(new Date(user.created_at), { 
                    addSuffix: true, 
                    locale: he 
                  })}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="focus-ring"
                        aria-label={`פעולות עבור ${user.name}`}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 z-50">
                      <DropdownMenuItem onClick={() => onView(user)}>
                        <Eye className="w-4 h-4 ml-2" />
                        צפייה בפרופיל
                      </DropdownMenuItem>
                      {onEdit && (
                        <DropdownMenuItem onClick={() => onEdit(user)}>
                          <Edit2 className="w-4 h-4 ml-2" />
                          עריכת פרטים
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      {/* Verify option */}
                      {onVerify && (
                        <DropdownMenuItem 
                          onClick={() => onVerify(user.id, !user.is_verified)}
                          className={user.is_verified ? "text-muted-foreground" : "text-primary focus:text-primary"}
                        >
                          <BadgeCheck className="w-4 h-4 ml-2" />
                          {user.is_verified ? "הסר אימות" : "אמת משתמש"}
                        </DropdownMenuItem>
                      )}
                      {/* Impersonate option - available for all profiles */}
                      {onImpersonate && (
                        <DropdownMenuItem 
                          onClick={() => onImpersonate(user)}
                          className="text-primary focus:text-primary"
                        >
                          <UserCheck className="w-4 h-4 ml-2" />
                          התחבר בתור משתמש
                        </DropdownMenuItem>
                      )}
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

      {/* Single Delete Dialog */}
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

      {/* Single Block Dialog */}
      <Dialog open={blockDialogOpen} onOpenChange={setBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>חסימת משתמש: {selectedUser?.name}</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground" id="blockDialogDesc">
            ציין סיבת חסימה כדי שנוכל לתעד את הפעולה ביומן.
          </p>
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
              <Button variant="outline" onClick={() => setBlockDialogOpen(false)} className="focus-ring">
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

      {/* Bulk Delete Dialog */}
      <AlertDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>מחיקת {selectedIds.size} משתמשים</AlertDialogTitle>
            <AlertDialogDescription>
              פעולה זו תמחק את כל המשתמשים שנבחרו לצמיתות. לא ניתן לבטל פעולה זו.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogCancel>ביטול</AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              מחק {selectedIds.size} משתמשים
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Block Dialog */}
      <Dialog open={bulkBlockDialogOpen} onOpenChange={setBulkBlockDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>חסימת {selectedIds.size} משתמשים</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            הפעולה תחסום את כל המשתמשים שנבחרו ותשמור סיבת חסימה לתיעוד.
          </p>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="bulkBlockReason">סיבת החסימה</Label>
              <Textarea
                id="bulkBlockReason"
                placeholder="נא לציין את סיבת החסימה..."
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setBulkBlockDialogOpen(false)} className="focus-ring">
                ביטול
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleBulkBlock}
                disabled={!blockReason.trim()}
              >
                <UserX className="w-4 h-4 ml-2" />
                חסום {selectedIds.size} משתמשים
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Notify Dialog */}
      <Dialog open={bulkNotifyDialogOpen} onOpenChange={setBulkNotifyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>שליחת התראה ל-{selectedIds.size} משתמשים</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            כתבו הודעה קצרה וברורה. מומלץ לכלול הנחיה לפעולה.
          </p>
          <div className="space-y-4 pt-4">
            <div>
              <Label htmlFor="notifyMessage">תוכן ההתראה</Label>
              <Textarea
                id="notifyMessage"
                placeholder="כתוב את ההודעה שתישלח למשתמשים..."
                value={notifyMessage}
                onChange={(e) => setNotifyMessage(e.target.value)}
                rows={4}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setBulkNotifyDialogOpen(false)} className="focus-ring">
                ביטול
              </Button>
              <Button 
                onClick={handleBulkNotify}
                disabled={!notifyMessage.trim()}
              >
                <Bell className="w-4 h-4 ml-2" />
                שלח התראה
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
