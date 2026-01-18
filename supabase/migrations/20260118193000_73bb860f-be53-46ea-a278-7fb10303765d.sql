-- Create reports table for user reports
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  admin_note TEXT,
  reviewed_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create activity_logs table for tracking user and admin activities
CREATE TABLE public.activity_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create app_settings table for storing application settings
CREATE TABLE public.app_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

-- Enable RLS on all new tables
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Reports policies
CREATE POLICY "Users can create reports"
  ON public.reports
  FOR INSERT
  WITH CHECK (reporter_id = get_my_profile_id());

CREATE POLICY "Users can view their own reports"
  ON public.reports
  FOR SELECT
  USING (reporter_id = get_my_profile_id());

CREATE POLICY "Admins can view all reports"
  ON public.reports
  FOR SELECT
  USING (is_admin());

CREATE POLICY "Admins can update reports"
  ON public.reports
  FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can delete reports"
  ON public.reports
  FOR DELETE
  USING (is_admin());

-- Activity logs policies (read-only for users, full access for admins)
CREATE POLICY "Users can view their own activity"
  ON public.activity_logs
  FOR SELECT
  USING (user_id = get_my_profile_id());

CREATE POLICY "Admins can view all activity"
  ON public.activity_logs
  FOR SELECT
  USING (is_admin());

CREATE POLICY "System can insert activity logs"
  ON public.activity_logs
  FOR INSERT
  WITH CHECK (true);

-- App settings policies (admins only)
CREATE POLICY "Anyone can view settings"
  ON public.app_settings
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can update settings"
  ON public.app_settings
  FOR UPDATE
  USING (is_admin());

CREATE POLICY "Admins can insert settings"
  ON public.app_settings
  FOR INSERT
  WITH CHECK (is_admin());

-- Create triggers for updated_at
CREATE TRIGGER update_reports_updated_at
  BEFORE UPDATE ON public.reports
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_app_settings_updated_at
  BEFORE UPDATE ON public.app_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default app settings
INSERT INTO public.app_settings (key, value) VALUES
  ('site_name', '"Spark"'),
  ('site_description', '"אפליקציית הכרויות מובילה בישראל"'),
  ('maintenance_mode', 'false'),
  ('allow_registration', 'true'),
  ('email_notifications', 'true'),
  ('push_notifications', 'true'),
  ('min_age', '18'),
  ('max_age', '99'),
  ('max_photos', '6'),
  ('welcome_message', '"ברוכים הבאים ל-Spark! מקווים שתמצאו את האהבה האמיתית."');

-- Create index for faster queries
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX idx_activity_logs_action_type ON public.activity_logs(action_type);
CREATE INDEX idx_activity_logs_created_at ON public.activity_logs(created_at DESC);
CREATE INDEX idx_activity_logs_user_id ON public.activity_logs(user_id);