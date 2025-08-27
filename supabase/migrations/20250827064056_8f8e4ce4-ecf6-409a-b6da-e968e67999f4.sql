-- GO-LIVE SEED Part 1: Core Loops and Shared Nodes

-- Create main loops for fertility, labor market, and social cohesion
INSERT INTO public.loops (user_id,name,description,type,status,loop_type,scale,leverage_default,
  metadata,controller,thresholds,notes,version,loop_code,source_tag,motif,domain,layer,created_at,updated_at)
VALUES 
  ((SELECT user_id FROM public.profiles ORDER BY created_at LIMIT 1),
   'Total Fertility & Maternal Care','Stabilize TFR ≥ 2.1 and improve access to ANC/FP',
   'micro','active','reactive','meso','N',
   jsonb_build_object('owner','Ministry of Health','region','National','focus','Fertility'),
   '{}'::jsonb,'{}'::jsonb,NULL,1,
   'FERT-TFR-001','NCF-PAGS-ATLAS','population','social','service',now(),now()),
  
  ((SELECT user_id FROM public.profiles ORDER BY created_at LIMIT 1),
   'Labour Force Participation','Raise LFPR and reduce youth unemployment',
   'micro','active','reactive','meso','P',
   jsonb_build_object('owner','Ministry of Labour','region','National','focus','Employment'),
   '{}'::jsonb,'{}'::jsonb,NULL,1,
   'LAB-LFPR-001','NCF-PAGS-ATLAS','opportunity','economy','service',now(),now()),
   
  ((SELECT user_id FROM public.profiles ORDER BY created_at LIMIT 1),
   'Youth Unemployment','Lower 15–24 unemployment rate via matching and skilling',
   'micro','active','reactive','meso','S',
   jsonb_build_object('owner','Public Employment Service','region','National','focus','Youth'),
   '{}'::jsonb,'{}'::jsonb,NULL,1,
   'LAB-YUNEMP-002','NCF-PAGS-ATLAS','resilience','economy','ecosystem',now(),now()),
   
  ((SELECT user_id FROM public.profiles ORDER BY created_at LIMIT 1),
   'Social Cohesion (TRI Index)','Grow trust, reciprocity, integrity across regions',
   'micro','active','reactive','meso','N',
   jsonb_build_object('owner','Civic Affairs','region','National','focus','Cohesion'),
   '{}'::jsonb,'{}'::jsonb,NULL,1,
   'COH-TRI-001','NCF-PAGS-ATLAS','legitimacy','civic','ecosystem',now(),now()),
   
  ((SELECT user_id FROM public.profiles ORDER BY created_at LIMIT 1),
   'Civic Participation','Increase turnout & volunteering; reduce disengagement',
   'micro','active','reactive','meso','P',
   jsonb_build_object('owner','Civic Affairs','region','National','focus','Participation'),
   '{}'::jsonb,'{}'::jsonb,NULL,1,
   'COH-CIVIC-002','NCF-PAGS-ATLAS','participation','civic','service',now(),now())
ON CONFLICT (loop_code) DO NOTHING;

-- Create shared nodes for the system
INSERT INTO public.shared_nodes (label, key, type, created_at, updated_at) VALUES
 ('Civil Registry & Vital Stats','SNL-CIVREG','hub',now(),now()),
 ('Family Planning Clinics','SNL-FPCLIN','hub',now(),now()),
 ('Public Employment Service','SNL-PES','hub',now(),now()),
 ('National Job Portal','SNL-JOBPORT','bridge',now(),now()),
 ('Community Centers','SNL-COMMUNITY','hub',now(),now()),
 ('Media & Messaging Channels','SNL-MEDIA','bridge',now(),now())
ON CONFLICT (key) DO NOTHING;