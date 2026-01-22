-- Security hardening: enforce RLS + least-privilege policies

-- 1) support_tickets: owner can read/insert their own; admins can read/update/delete all
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
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY support_tickets_delete_admin_only
ON public.support_tickets
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));


-- 2) app_settings: admin-only read/write
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings FORCE ROW LEVEL SECURITY;

DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'app_settings'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.app_settings', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY app_settings_admin_select
ON public.app_settings
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY app_settings_admin_insert
ON public.app_settings
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY app_settings_admin_update
ON public.app_settings
FOR UPDATE
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY app_settings_admin_delete
ON public.app_settings
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));


-- 3) site_statistics: public read via public_settings instead; keep this admin-only
ALTER TABLE public.site_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_statistics FORCE ROW LEVEL SECURITY;

DO $$
DECLARE pol record;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'site_statistics'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.site_statistics', pol.policyname);
  END LOOP;
END $$;

CREATE POLICY site_statistics_admin_select
ON public.site_statistics
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY site_statistics_admin_write
ON public.site_statistics
FOR ALL
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));


-- 4) profiles: restrict full-row reads to owner/admin; keep owner write
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
WITH CHECK (user_id = auth.uid());

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
