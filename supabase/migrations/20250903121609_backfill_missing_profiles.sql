-- Backfill profiles for existing users who don't have profiles
INSERT INTO public.profiles (id, email, created_at, updated_at)
SELECT 
    id,
    email,
    created_at,
    NOW() as updated_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles);