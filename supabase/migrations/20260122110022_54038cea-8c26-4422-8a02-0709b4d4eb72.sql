-- Harden support_tickets ownership + RLS
-- 1) Add profile_id ownership column
ALTER TABLE public.support_tickets
ADD COLUMN IF NOT EXISTS profile_id uuid;

-- 2) Backfill profile_id from existing user_id (if present)
UPDATE public.support_tickets st
SET profile_id = p.id
FROM public.profiles p
WHERE st.profile_id IS NULL
  AND st.user_id IS NOT NULL
  AND p.user_id = st.user_id;

-- 3) Add FK to profiles (ownership is via profiles)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'support_tickets_profile_id_fkey'
  ) THEN
    ALTER TABLE public.support_tickets
    ADD CONSTRAINT support_tickets_profile_id_fkey
    FOREIGN KEY (profile_id) REFERENCES public.profiles(id)
    ON DELETE SET NULL;
  END IF;
END$$;

-- 4) Index for ownership queries
CREATE INDEX IF NOT EXISTS idx_support_tickets_profile_id
ON public.support_tickets(profile_id);

-- 5) Replace problematic user policies with profile-based policies
-- Drop old policies if they exist
DROP POLICY IF EXISTS "Users can create own tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Users can view own tickets by user_id" ON public.support_tickets;

-- Ensure RLS is on
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- New INSERT: authenticated users can create tickets ONLY for themselves (profile_id required)
CREATE POLICY "Users can create own tickets (by profile_id)"
ON public.support_tickets
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND profile_id = public.get_my_profile_id()
);

-- New SELECT: users can read ONLY their own tickets; admins can read all
CREATE POLICY "Users can view own tickets (by profile_id)"
ON public.support_tickets
FOR SELECT
USING (
  public.is_admin()
  OR profile_id = public.get_my_profile_id()
);

-- Admin-only UPDATE (include WITH CHECK)
DROP POLICY IF EXISTS "Admins can update tickets" ON public.support_tickets;
CREATE POLICY "Admins can update tickets"
ON public.support_tickets
FOR UPDATE
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Admin-only DELETE
-- Keep existing if present; otherwise create
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'support_tickets'
      AND policyname = 'Admins can delete tickets'
  ) THEN
    CREATE POLICY "Admins can delete tickets"
    ON public.support_tickets
    FOR DELETE
    USING (public.is_admin());
  END IF;
END$$;