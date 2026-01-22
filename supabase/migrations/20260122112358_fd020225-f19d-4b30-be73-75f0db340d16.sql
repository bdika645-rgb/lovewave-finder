-- Tighten support_tickets access control and enforce user_id integrity

-- Ensure RLS is enabled
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

-- Backfill user_id when missing but profile_id is present
UPDATE public.support_tickets st
SET user_id = p.user_id
FROM public.profiles p
WHERE st.user_id IS NULL
  AND st.profile_id = p.id
  AND p.user_id IS NOT NULL;

-- Drop potentially unsafe/legacy policies
DROP POLICY IF EXISTS "Anyone can create support tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Authenticated users can create support tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Users can view their own tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Users can view own tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Admins can view all tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Admins can manage support tickets" ON public.support_tickets;

-- SELECT: owners can view their own tickets
CREATE POLICY "Users can view own support tickets"
ON public.support_tickets
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- SELECT: admins can view all tickets
CREATE POLICY "Admins can view all support tickets"
ON public.support_tickets
FOR SELECT
TO authenticated
USING (public.is_admin());

-- INSERT: must be authenticated and user_id must match auth.uid()
CREATE POLICY "Users can create own support tickets"
ON public.support_tickets
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- UPDATE: users can update only their own tickets (e.g., allow edits to message/subject if UI ever adds it)
CREATE POLICY "Users can update own support tickets"
ON public.support_tickets
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- UPDATE: admins can update any ticket (status/admin_note/resolution)
CREATE POLICY "Admins can update any support ticket"
ON public.support_tickets
FOR UPDATE
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Enforce user_id presence & ownership at DB-level with a trigger (prevents NULL user_id or spoofing)
CREATE OR REPLACE FUNCTION public.validate_support_ticket_owner()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  IF NEW.user_id IS NULL THEN
    RAISE EXCEPTION 'user_id is required';
  END IF;

  IF NEW.user_id <> auth.uid() THEN
    RAISE EXCEPTION 'user_id must match authenticated user';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_support_ticket_owner ON public.support_tickets;
CREATE TRIGGER trg_validate_support_ticket_owner
BEFORE INSERT OR UPDATE
ON public.support_tickets
FOR EACH ROW
EXECUTE FUNCTION public.validate_support_ticket_owner();
