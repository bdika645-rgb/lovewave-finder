import { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useCurrentProfile } from '@/hooks/useCurrentProfile';
import { logActivity } from '@/hooks/useActivityLogs';
import { toast } from 'sonner';

interface ImpersonatedProfile {
  id: string;
  name: string;
  avatar_url: string | null;
}

interface ImpersonationState {
  isImpersonating: boolean;
  impersonatedProfile: ImpersonatedProfile | null;
  realAdminProfileId: string | null;
  startedAt: Date | null;
}

// Actions that are blocked during impersonation (view-only mode)
const BLOCKED_ACTIONS = [
  'send_message',
  'like_profile',
  'unlike_profile',
  'edit_profile',
  'update_settings',
  'delete_account',
  'change_password',
  'upload_photo',
  'delete_photo',
  'create_conversation',
  'block_user',
  'report_user',
] as const;

type BlockedAction = typeof BLOCKED_ACTIONS[number];

interface ImpersonationContextType extends ImpersonationState {
  startImpersonation: (profileId: string) => Promise<boolean>;
  stopImpersonation: () => void;
  canPerformAction: (action: string) => boolean;
  getEffectiveProfileId: () => string | null;
}

const ImpersonationContext = createContext<ImpersonationContextType | undefined>(undefined);

export function ImpersonationProvider({ children }: { children: ReactNode }) {
  const { profileId: realProfileId } = useCurrentProfile();
  
  const [state, setState] = useState<ImpersonationState>({
    isImpersonating: false,
    impersonatedProfile: null,
    realAdminProfileId: null,
    startedAt: null,
  });

  const startImpersonation = useCallback(async (profileId: string): Promise<boolean> => {
    if (!realProfileId) {
      toast.error('לא ניתן להתחיל מצב צפייה - אין פרופיל מחובר');
      return false;
    }

    try {
      // Fetch the target profile from profiles (admins have access via RLS)
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, name, avatar_url')
        .eq('id', profileId)
        .single();

      if (error || !profile) {
        console.error('Error fetching profile for impersonation:', error);
        toast.error('לא ניתן לטעון את פרטי המשתמש');
        return false;
      }

      // Log the impersonation start
      await logActivity(
        'impersonation_start',
        `אדמין התחיל צפייה כמשתמש: ${profile.name}`,
        realProfileId,
        {
          target_profile_id: profileId,
          target_profile_name: profile.name,
        }
      );

      setState({
        isImpersonating: true,
        impersonatedProfile: {
          id: profile.id,
          name: profile.name,
          avatar_url: profile.avatar_url,
        },
        realAdminProfileId: realProfileId,
        startedAt: new Date(),
      });

      toast.success(`מצב צפייה פעיל: ${profile.name}`);
      return true;
    } catch (err) {
      console.error('Error starting impersonation:', err);
      toast.error('שגיאה בהפעלת מצב צפייה');
      return false;
    }
  }, [realProfileId]);

  const stopImpersonation = useCallback(() => {
    if (!state.isImpersonating || !state.impersonatedProfile) return;

    const durationSeconds = state.startedAt
      ? Math.floor((Date.now() - state.startedAt.getTime()) / 1000)
      : 0;

    // Log the impersonation end
    logActivity(
      'impersonation_end',
      `אדמין סיים צפייה כמשתמש: ${state.impersonatedProfile.name}`,
      state.realAdminProfileId || undefined,
      {
        target_profile_id: state.impersonatedProfile.id,
        target_profile_name: state.impersonatedProfile.name,
        duration_seconds: durationSeconds,
      }
    );

    setState({
      isImpersonating: false,
      impersonatedProfile: null,
      realAdminProfileId: null,
      startedAt: null,
    });

    toast.info('יצאת ממצב צפייה');
  }, [state]);

  const canPerformAction = useCallback((action: string): boolean => {
    if (!state.isImpersonating) return true;
    return !BLOCKED_ACTIONS.includes(action as BlockedAction);
  }, [state.isImpersonating]);

  const getEffectiveProfileId = useCallback((): string | null => {
    if (state.isImpersonating && state.impersonatedProfile) {
      return state.impersonatedProfile.id;
    }
    return realProfileId;
  }, [state.isImpersonating, state.impersonatedProfile, realProfileId]);

  const value = useMemo(() => ({
    ...state,
    startImpersonation,
    stopImpersonation,
    canPerformAction,
    getEffectiveProfileId,
  }), [state, startImpersonation, stopImpersonation, canPerformAction, getEffectiveProfileId]);

  return (
    <ImpersonationContext.Provider value={value}>
      {children}
    </ImpersonationContext.Provider>
  );
}

export function useImpersonation() {
  const context = useContext(ImpersonationContext);
  if (context === undefined) {
    throw new Error('useImpersonation must be used within an ImpersonationProvider');
  }
  return context;
}

/**
 * Hook for checking if action is allowed and showing toast if blocked
 */
export function useImpersonationGuard() {
  const { canPerformAction, isImpersonating } = useImpersonation();

  const guardAction = useCallback((action: string, actionNameHebrew?: string): boolean => {
    if (!canPerformAction(action)) {
      toast.warning(
        actionNameHebrew 
          ? `לא ניתן ${actionNameHebrew} במצב צפייה`
          : 'לא ניתן לבצע פעולה זו במצב צפייה'
      );
      return false;
    }
    return true;
  }, [canPerformAction]);

  return { guardAction, isImpersonating };
}
