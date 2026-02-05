import { useState } from "react";
import { motion } from "framer-motion";
import AdminLayout from "@/components/admin/AdminLayout";
import { useBlockedUsers } from "@/hooks/useBlockedUsers";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldX, UserX, RefreshCw, Unlock, Search } from "lucide-react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { formatDistanceToNow } from "date-fns";
import { he } from "date-fns/locale";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
} as const;

export default function AdminBlockedUsers() {
  const { blockedUsers, loading, unblockUser, refetch } = useBlockedUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [unblockDialogOpen, setUnblockDialogOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const filteredUsers = blockedUsers.filter(user =>
    user.blocked_profile?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.reason?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUnblock = (userId: string) => {
    setSelectedUserId(userId);
    setUnblockDialogOpen(true);
  };

  const confirmUnblock = () => {
    if (selectedUserId) {
      unblockUser(selectedUserId);
      setUnblockDialogOpen(false);
      setSelectedUserId(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-foreground">משתמשים חסומים</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
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
      <motion.div 
        className="space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">משתמשים חסומים</h1>
            <p className="text-muted-foreground mt-1">ניהול משתמשים שנחסמו במערכת</p>
          </div>
          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="w-4 h-4 ml-2" />
            רענן
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatsCard
            title="סה״כ חסומים"
            value={blockedUsers.length}
            icon={ShieldX}
          />
          <StatsCard
            title="חסומים על ידי מנהל"
            value={blockedUsers.filter(u => u.blocked_by_admin).length}
            icon={UserX}
          />
        </motion.div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="חפש לפי שם או סיבה..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>

        {/* Blocked Users Table */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold">רשימת משתמשים חסומים</h3>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">משתמש</TableHead>
                <TableHead className="text-right">סיבת החסימה</TableHead>
                <TableHead className="text-right">תאריך חסימה</TableHead>
                <TableHead className="text-right">פעולות</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((blockedUser) => (
                <TableRow key={blockedUser.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={blockedUser.blocked_profile?.avatar_url || undefined} />
                        <AvatarFallback>
                          {blockedUser.blocked_profile?.name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{blockedUser.blocked_profile?.name || "לא ידוע"}</p>
                        <p className="text-sm text-muted-foreground">
                          {blockedUser.blocked_profile?.city}, גיל {blockedUser.blocked_profile?.age}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <p className="text-muted-foreground truncate">
                      {blockedUser.reason || "לא צוינה סיבה"}
                    </p>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDistanceToNow(new Date(blockedUser.created_at), { 
                      addSuffix: true, 
                      locale: he 
                    })}
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleUnblock(blockedUser.blocked_id)}
                    >
                      <Unlock className="w-4 h-4 ml-2" />
                      בטל חסימה
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                    {searchQuery ? "לא נמצאו משתמשים חסומים התואמים לחיפוש" : "אין משתמשים חסומים"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Unblock Confirmation Dialog */}
        <AlertDialog open={unblockDialogOpen} onOpenChange={setUnblockDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>האם לבטל את החסימה?</AlertDialogTitle>
              <AlertDialogDescription>
                פעולה זו תאפשר למשתמש לחזור ולהשתמש באפליקציה ללא הגבלות.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>ביטול</AlertDialogCancel>
              <AlertDialogAction onClick={confirmUnblock}>
                בטל חסימה
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </motion.div>
    </AdminLayout>
  );
}
