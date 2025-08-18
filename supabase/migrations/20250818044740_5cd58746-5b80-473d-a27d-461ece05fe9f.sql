-- Fix security definer function by setting search path
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Fix the update trigger function by setting search path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recreate views without security definer (default invoker rights)
DROP VIEW IF EXISTS public.vw_breach_current;
DROP VIEW IF EXISTS public.meta_alignment_vw;

-- Create breach data view with invoker rights
CREATE VIEW public.vw_breach_current AS
SELECT 
  r.id,
  r.loop_id,
  l.name as loop_name,
  r.severity_score,
  r.magnitude,
  r.persistence,
  r.cohort,
  r.geo,
  r.updated_at,
  CASE 
    WHEN r.magnitude > LAG(r.magnitude) OVER (PARTITION BY r.indicator_id ORDER BY r.updated_at) THEN 'increasing'
    WHEN r.magnitude < LAG(r.magnitude) OVER (PARTITION BY r.indicator_id ORDER BY r.updated_at) THEN 'decreasing'
    ELSE 'stable'
  END as magnitude_change
FROM public.rel_tickets r
LEFT JOIN public.loops l ON r.loop_id = l.id
WHERE r.stage = 'breach'
ORDER BY r.severity_score DESC;

-- Create meta alignment view with invoker rights
CREATE VIEW public.meta_alignment_vw AS
SELECT 
  72 as overall_alignment,
  69 as population_score,
  74 as domains_balance_score,
  71 as institutions_adaptivity_score,
  now() as updated_at;