-- Enforce authenticated ownership on support_tickets via trigger
-- (Function public.validate_support_ticket_owner() already exists)

DO $$
BEGIN
  -- Create trigger only if it doesn't already exist
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'trg_support_tickets_validate_owner'
  ) THEN
    CREATE TRIGGER trg_support_tickets_validate_owner
    BEFORE INSERT OR UPDATE ON public.support_tickets
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_support_ticket_owner();
  END IF;
END $$;