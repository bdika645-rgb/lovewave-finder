-- Add gender to public projection for safe filtering
ALTER TABLE public.profiles_public
ADD COLUMN IF NOT EXISTS gender text;

-- Backfill gender from private profiles
UPDATE public.profiles_public pp
SET gender = p.gender
FROM public.profiles p
WHERE p.id = pp.id
  AND (pp.gender IS DISTINCT FROM p.gender);

-- Update sync trigger function to keep gender in sync
CREATE OR REPLACE FUNCTION public.sync_profiles_public()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles_public (
    id,
    name,
    age,
    city,
    avatar_url,
    interests,
    gender,
    is_visible,
    is_online,
    updated_at
  )
  values (
    new.id,
    new.name,
    new.age,
    new.city,
    new.avatar_url,
    coalesce(new.interests, '{}'::text[]),
    new.gender,
    coalesce(new.is_visible, true),
    coalesce(new.is_online, false),
    now()
  )
  on conflict (id) do update set
    name = excluded.name,
    age = excluded.age,
    city = excluded.city,
    avatar_url = excluded.avatar_url,
    interests = excluded.interests,
    gender = excluded.gender,
    is_visible = excluded.is_visible,
    is_online = excluded.is_online,
    updated_at = now();

  return new;
end;
$function$;
