-- Tighten RLS for sensitive data: support_tickets + profiles

-- 1) support_tickets: only owner can read their own tickets; only admins can read/update all.
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets FORCE ROW LEVEL SECURITY;

DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'support_tickets'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.support_tickets', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY support_tickets_select_own_or_admin
ON public.support_tickets
FOR SELECT
USING (
  user_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY support_tickets_insert_own
ON public.support_tickets
FOR INSERT
WITH CHECK (
  user_id = auth.uid()
);

CREATE POLICY support_tickets_update_admin_only
ON public.support_tickets
FOR UPDATE
USING (
  public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  public.has_role(auth.uid(), 'admin')
);

CREATE POLICY support_tickets_delete_admin_only
ON public.support_tickets
FOR DELETE
USING (
  public.has_role(auth.uid(), 'admin')
);


-- 2) profiles: prevent full profile harvesting; only owner/admin can read full row.
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'profiles'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY profiles_select_owner_or_admin
ON public.profiles
FOR SELECT
USING (
  user_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY profiles_insert_owner
ON public.profiles
FOR INSERT
WITH CHECK (
  user_id = auth.uid()
);

CREATE POLICY profiles_update_owner_or_admin
ON public.profiles
FOR UPDATE
USING (
  user_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
)
WITH CHECK (
  user_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY profiles_delete_owner_or_admin
ON public.profiles
FOR DELETE
USING (
  user_id = auth.uid()
  OR public.has_role(auth.uid(), 'admin')
);
