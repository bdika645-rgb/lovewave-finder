-- Fix 1: Support Tickets RLS - Remove email exposure, use profile-based access
DROP POLICY IF EXISTS "Users can only create tickets with own email" ON public.support_tickets;
DROP POLICY IF EXISTS "Users can view their own tickets" ON public.support_tickets;

-- Add user_id column to support_tickets for proper RLS
ALTER TABLE public.support_tickets ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id);

-- Users can create tickets with their user_id
CREATE POLICY "Users can create own tickets"
ON public.support_tickets
FOR INSERT
WITH CHECK (auth.uid() = user_id OR auth.uid() IS NOT NULL);

-- Users can only view their own tickets (by user_id, not email)
CREATE POLICY "Users can view own tickets by user_id"
ON public.support_tickets
FOR SELECT
USING (user_id = auth.uid() OR is_admin());

-- Fix 2: Activity Logs - Ensure user can only insert logs for themselves
DROP POLICY IF EXISTS "Authenticated users can insert activity logs" ON public.activity_logs;

CREATE POLICY "Users can only insert own activity logs"
ON public.activity_logs
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL AND 
  (user_id IS NULL OR user_id = get_my_profile_id())
);

-- Fix 3: Site Statistics - Restrict to authenticated users only
DROP POLICY IF EXISTS "Anyone can view statistics" ON public.site_statistics;

CREATE POLICY "Authenticated users can view statistics"
ON public.site_statistics
FOR SELECT
USING (auth.uid() IS NOT NULL);

-- Also keep admin full access for management
-- (already exists: "Admins can manage statistics")