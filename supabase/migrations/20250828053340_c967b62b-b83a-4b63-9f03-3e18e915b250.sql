-- Manually assign admin role to the most recent user
INSERT INTO public.user_roles (user_id, role)
SELECT '8277594f-9779-4554-a325-9b1fce3635d8', 'admin'
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = '8277594f-9779-4554-a325-9b1fce3635d8' AND role = 'admin'
);