import { useState } from 'react';
import { MoreVertical, Trash2, Ban, Flag, Volume, VolumeX, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ConversationMenuProps {
  conversationId: string;
  otherProfileId: string;
  otherProfileName: string;
  onConversationDeleted?: () => void;
  onUserBlocked?: () => void;
}

const ConversationMenu = ({
  conversationId,
  otherProfileId,
  otherProfileName,
  onConversationDeleted,
  onUserBlocked,
}: ConversationMenuProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showBlockDialog, setShowBlockDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const [muted, setMuted] = useState(false);

  const handleDeleteConversation = async () => {
    setLoading(true);
    try {
      // Delete all messages in the conversation
      const { error: messagesError } = await supabase
        .from('messages')
        .delete()
        .eq('conversation_id', conversationId);

      if (messagesError) throw messagesError;

      // Delete conversation participants
      const { error: participantsError } = await supabase
        .from('conversation_participants')
        .delete()
        .eq('conversation_id', conversationId);

      if (participantsError) throw participantsError;

      // Delete the conversation itself
      const { error: convError } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (convError) throw convError;

      toast.success('השיחה נמחקה בהצלחה');
      onConversationDeleted?.();
    } catch (err) {
      console.error('Error deleting conversation:', err);
      toast.error('שגיאה במחיקת השיחה');
    } finally {
      setLoading(false);
      setShowDeleteDialog(false);
    }
  };

  const handleBlockUser = async () => {
    setLoading(true);
    try {
      // Get my profile ID
      const { data: myProfile } = await supabase.rpc('get_my_profile_id');
      
      if (!myProfile) {
        throw new Error('Profile not found');
      }

      // Add to blocked users
      const { error } = await supabase
        .from('blocked_users')
        .insert({
          blocker_id: myProfile,
          blocked_id: otherProfileId,
          reason: 'חסימה מתוך שיחה',
        });

      if (error) {
        if (error.code === '23505') {
          toast.info('המשתמש כבר חסום');
        } else {
          throw error;
        }
      } else {
        toast.success(`${otherProfileName} נחסם/ה בהצלחה`);
        onUserBlocked?.();
      }
    } catch (err) {
      console.error('Error blocking user:', err);
      toast.error('שגיאה בחסימת המשתמש');
    } finally {
      setLoading(false);
      setShowBlockDialog(false);
    }
  };

  const handleMuteToggle = () => {
    setMuted(!muted);
    toast.success(muted ? 'התראות הופעלו' : 'התראות הושתקו לשיחה זו');
  };

  const handleReport = () => {
    // Navigate to report - we'll use the ReportDialog component
    toast.info('פתח את הפרופיל כדי לדווח');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="אפשרויות נוספות">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48">
          <DropdownMenuItem onClick={handleMuteToggle}>
            {muted ? (
              <>
                <Volume className="w-4 h-4" />
                בטל השתקה
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                השתק התראות
              </>
            )}
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => setShowBlockDialog(true)}
            className="text-warning"
          >
            <Ban className="w-4 h-4" />
            חסום את {otherProfileName}
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={handleReport}>
            <Flag className="w-4 h-4" />
            דווח
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive"
          >
            <Trash2 className="w-4 h-4" />
            מחק שיחה
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>מחיקת שיחה</AlertDialogTitle>
            <AlertDialogDescription>
              האם אתה בטוח שברצונך למחוק את השיחה עם {otherProfileName}?
              פעולה זו לא ניתנת לביטול וכל ההודעות יימחקו לצמיתות.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogCancel disabled={loading}>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConversation}
              disabled={loading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'מחק'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Block Confirmation Dialog */}
      <AlertDialog open={showBlockDialog} onOpenChange={setShowBlockDialog}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>חסימת משתמש</AlertDialogTitle>
            <AlertDialogDescription>
              האם אתה בטוח שברצונך לחסום את {otherProfileName}?
              לא תוכל לראות את הפרופיל שלו/ה ולא תקבל ממנו/ה הודעות.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse gap-2">
            <AlertDialogCancel disabled={loading}>ביטול</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBlockUser}
              disabled={loading}
              className="bg-warning text-warning-foreground hover:bg-warning/90"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                'חסום'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ConversationMenu;
