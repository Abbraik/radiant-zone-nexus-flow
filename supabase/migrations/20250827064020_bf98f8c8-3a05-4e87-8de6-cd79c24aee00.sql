-- ==========================================================
-- GO-LIVE SEED (FERTILITY • LABOUR MARKET • SOCIAL COHESION)
-- Safe to run multiple times (uses WHERE NOT EXISTS / ON CONFLICT)
-- ==========================================================

-- ==========================================================
-- 1) LOOPS (core objects shown on Home/Workspaces)
-- ==========================================================
WITH u AS (SELECT uid FROM (
  SELECT user_id AS uid FROM public.profiles ORDER BY created_at LIMIT 1
  UNION ALL
  SELECT id      AS uid FROM auth.users     ORDER BY created_at LIMIT 1
  LIMIT 1
) z)
-- Fertility
INSERT INTO public.loops (user_id,name,description,type,status,loop_type,scale,leverage_default,
  metadata,controller,thresholds,notes,version,loop_code,source_tag,motif,domain,layer,created_at,updated_at)
SELECT (SELECT uid FROM u),
  'Total Fertility & Maternal Care','Stabilize TFR ≥ 2.1 and improve access to ANC/FP',
  'micro','active','reactive','meso','N',
  jsonb_build_object('owner','Ministry of Health','region','National','focus','Fertility'),
  '{}'::jsonb,'{}'::jsonb,NULL,1,
  'FERT-TFR-001','NCF-PAGS-ATLAS','population','social','service',now(),now()
WHERE NOT EXISTS (SELECT 1 FROM public.loops WHERE loop_code='FERT-TFR-001');

-- Labour market
INSERT INTO public.loops (user_id,name,description,type,status,loop_type,scale,leverage_default,
  metadata,controller,thresholds,notes,version,loop_code,source_tag,motif,domain,layer,created_at,updated_at)
SELECT (SELECT uid FROM u),
  'Labour Force Participation','Raise LFPR and reduce youth unemployment',
  'micro','active','reactive','meso','P',
  jsonb_build_object('owner','Ministry of Labour','region','National','focus','Employment'),
  '{}'::jsonb,'{}'::jsonb,NULL,1,
  'LAB-LFPR-001','NCF-PAGS-ATLAS','opportunity','economy','service',now(),now()
WHERE NOT EXISTS (SELECT 1 FROM public.loops WHERE loop_code='LAB-LFPR-001');

INSERT INTO public.loops (user_id,name,description,type,status,loop_type,scale,leverage_default,
  metadata,controller,thresholds,notes,version,loop_code,source_tag,motif,domain,layer,created_at,updated_at)
SELECT (SELECT uid FROM u),
  'Youth Unemployment','Lower 15–24 unemployment rate via matching and skilling',
  'micro','active','reactive','meso','S',
  jsonb_build_object('owner','Public Employment Service','region','National','focus','Youth'),
  '{}'::jsonb,'{}'::jsonb,NULL,1,
  'LAB-YUNEMP-002','NCF-PAGS-ATLAS','resilience','economy','ecosystem',now(),now()
WHERE NOT EXISTS (SELECT 1 FROM public.loops WHERE loop_code='LAB-YUNEMP-002');

-- Social cohesion
INSERT INTO public.loops (user_id,name,description,type,status,loop_type,scale,leverage_default,
  metadata,controller,thresholds,notes,version,loop_code,source_tag,motif,domain,layer,created_at,updated_at)
SELECT (SELECT uid FROM u),
  'Social Cohesion (TRI Index)','Grow trust, reciprocity, integrity across regions',
  'micro','active','reactive','meso','N',
  jsonb_build_object('owner','Civic Affairs','region','National','focus','Cohesion'),
  '{}'::jsonb,'{}'::jsonb,NULL,1,
  'COH-TRI-001','NCF-PAGS-ATLAS','legitimacy','civic','ecosystem',now(),now()
WHERE NOT EXISTS (SELECT 1 FROM public.loops WHERE loop_code='COH-TRI-001');

INSERT INTO public.loops (user_id,name,description,type,status,loop_type,scale,leverage_default,
  metadata,controller,thresholds,notes,version,loop_code,source_tag,motif,domain,layer,created_at,updated_at)
SELECT (SELECT uid FROM u),
  'Civic Participation','Increase turnout & volunteering; reduce disengagement',
  'micro','active','reactive','meso','P',
  jsonb_build_object('owner','Civic Affairs','region','National','focus','Participation'),
  '{}'::jsonb,'{}'::jsonb,NULL,1,
  'COH-CIVIC-002','NCF-PAGS-ATLAS','participation','civic','service',now(),now()
WHERE NOT EXISTS (SELECT 1 FROM public.loops WHERE loop_code='COH-CIVIC-002');

-- ==========================================================
-- 2) SHARED NODES (used in loop badges / maps) + MAPPING
-- ==========================================================
INSERT INTO public.shared_nodes (label, key, type, created_at, updated_at) VALUES
 ('Civil Registry & Vital Stats','SNL-CIVREG','hub',now(),now()),
 ('Family Planning Clinics','SNL-FPCLIN','hub',now(),now()),
 ('Public Employment Service','SNL-PES','hub',now(),now()),
 ('National Job Portal','SNL-JOBPORT','bridge',now(),now()),
 ('Community Centers','SNL-COMMUNITY','hub',now(),now()),
 ('Media & Messaging Channels','SNL-MEDIA','bridge',now(),now())
ON CONFLICT (key) DO NOTHING;

-- Map to loops (role chips)
INSERT INTO public.loop_shared_nodes(loop_id,role,snl_id,note,created_at)
SELECT l.id,'provider',sn.snl_id,'ANC/FP delivery network',now()
FROM public.loops l JOIN public.shared_nodes sn ON sn.key='SNL-FPCLIN'
WHERE l.loop_code='FERT-TFR-001'
  AND NOT EXISTS (SELECT 1 FROM public.loop_shared_nodes x WHERE x.loop_id=l.id AND x.snl_id=sn.snl_id);

INSERT INTO public.loop_shared_nodes(loop_id,role,snl_id,note,created_at)
SELECT l.id,'registry',sn.snl_id,'Birth registration & TFR statistics',now()
FROM public.loops l JOIN public.shared_nodes sn ON sn.key='SNL-CIVREG'
WHERE l.loop_code='FERT-TFR-001'
  AND NOT EXISTS (SELECT 1 FROM public.loop_shared_nodes x WHERE x.loop_id=l.id AND x.snl_id=sn.snl_id);

INSERT INTO public.loop_shared_nodes(loop_id,role,snl_id,note,created_at)
SELECT l.id,'provider',sn.snl_id,'Active labour intermediation',now()
FROM public.loops l JOIN public.shared_nodes sn ON sn.key='SNL-PES'
WHERE l.loop_code IN ('LAB-LFPR-001','LAB-YUNEMP-002')
  AND NOT EXISTS (SELECT 1 FROM public.loop_shared_nodes x WHERE x.loop_id=l.id AND x.snl_id=sn.snl_id);

INSERT INTO public.loop_shared_nodes(loop_id,role,snl_id,note,created_at)
SELECT l.id,'platform',sn.snl_id,'Vacancy aggregation & matching',now()
FROM public.loops l JOIN public.shared_nodes sn ON sn.key='SNL-JOBPORT'
WHERE l.loop_code='LAB-YUNEMP-002'
  AND NOT EXISTS (SELECT 1 FROM public.loop_shared_nodes x WHERE x.loop_id=l.id AND x.snl_id=sn.snl_id);

INSERT INTO public.loop_shared_nodes(loop_id,role,snl_id,note,created_at)
SELECT l.id,'engagement',sn.snl_id,'Local convening & programs',now()
FROM public.loops l JOIN public.shared_nodes sn ON sn.key='SNL-COMMUNITY'
WHERE l.loop_code IN ('COH-TRI-001','COH-CIVIC-002')
  AND NOT EXISTS (SELECT 1 FROM public.loop_shared_nodes x WHERE x.loop_id=l.id AND x.snl_id=sn.snl_id);

INSERT INTO public.loop_shared_nodes(loop_id,role,snl_id,note,created_at)
SELECT l.id,'communications',sn.snl_id,'Messaging & rumor control',now()
FROM public.loops l JOIN public.shared_nodes sn ON sn.key='SNL-MEDIA'
WHERE l.loop_code='COH-TRI-001'
  AND NOT EXISTS (SELECT 1 FROM public.loop_shared_nodes x WHERE x.loop_id=l.id AND x.snl_id=sn.snl_id);

-- ==========================================================
-- 3) INDICATOR REGISTRY (keys used by FE charts & watchpoints)
-- ==========================================================
-- Fertility indicators
INSERT INTO public.indicator_registry(indicator_key,loop_id,title,unit,transform,triad_tag,notes,created_at,updated_at,user_id)
SELECT 'FERT.TFR',(SELECT id FROM public.loops WHERE loop_code='FERT-TFR-001'),
       'Total Fertility Rate','births/woman',NULL,'population',
       'Main fertility gauge; annual, region-weighted',now(),now(),
       COALESCE((SELECT user_id FROM public.loops WHERE loop_code='FERT-TFR-001'), (SELECT user_id FROM public.loops LIMIT 1))
WHERE NOT EXISTS (SELECT 1 FROM public.indicator_registry WHERE indicator_key='FERT.TFR');

INSERT INTO public.indicator_registry(indicator_key,loop_id,title,unit,transform,triad_tag,notes,created_at,updated_at,user_id)
SELECT 'FERT.mCPR',(SELECT id FROM public.loops WHERE loop_code='FERT-TFR-001'),
       'Modern Contraceptive Prevalence','%',NULL,'domains',
       'Women 15–49 using modern methods',now(),now(),
       COALESCE((SELECT user_id FROM public.loops WHERE loop_code='FERT-TFR-001'), (SELECT user_id FROM public.loops LIMIT 1))
WHERE NOT EXISTS (SELECT 1 FROM public.indicator_registry WHERE indicator_key='FERT.mCPR');

INSERT INTO public.indicator_registry(indicator_key,loop_id,title,unit,transform,triad_tag,notes,created_at,updated_at,user_id)
SELECT 'FERT.ANC4',(SELECT id FROM public.loops WHERE loop_code='FERT-TFR-001'),
       'Antenatal Care (4+ visits)','%',NULL,'institutions',
       'Share of pregnancies with ≥4 ANC visits',now(),now(),
       COALESCE((SELECT user_id FROM public.loops WHERE loop_code='FERT-TFR-001'), (SELECT user_id FROM public.loops LIMIT 1))
WHERE NOT EXISTS (SELECT 1 FROM public.indicator_registry WHERE indicator_key='FERT.ANC4');

-- Labour indicators
INSERT INTO public.indicator_registry(indicator_key,loop_id,title,unit,transform,triad_tag,notes,created_at,updated_at,user_id)
SELECT 'LAB.LFPR',(SELECT id FROM public.loops WHERE loop_code='LAB-LFPR-001'),
       'Labour Force Participation Rate','%',NULL,'domains',
       '15+ population participating in labour market',now(),now(),
       COALESCE((SELECT user_id FROM public.loops WHERE loop_code='LAB-LFPR-001'), (SELECT user_id FROM public.loops LIMIT 1))
WHERE NOT EXISTS (SELECT 1 FROM public.indicator_registry WHERE indicator_key='LAB.LFPR');

INSERT INTO public.indicator_registry(indicator_key,loop_id,title,unit,transform,triad_tag,notes,created_at,updated_at,user_id)
SELECT 'LAB.YU',(SELECT id FROM public.loops WHERE loop_code='LAB-YUNEMP-002'),
       'Youth Unemployment (15–24)','%',NULL,'population',
       'ILO definition; quarterly',now(),now(),
       COALESCE((SELECT user_id FROM public.loops WHERE loop_code='LAB-YUNEMP-002'), (SELECT user_id FROM public.loops LIMIT 1))
WHERE NOT EXISTS (SELECT 1 FROM public.indicator_registry WHERE indicator_key='LAB.YU');

-- Cohesion indicators
INSERT INTO public.indicator_registry(indicator_key,loop_id,title,unit,transform,triad_tag,notes,created_at,updated_at,user_id)
SELECT 'COH.TRI',(SELECT id FROM public.loops WHERE loop_code='COH-TRI-001'),
       'TRI Cohesion Index','0–1',NULL,'institutions',
       'Composite: Trust, Reciprocity, Integrity',now(),now(),
       COALESCE((SELECT user_id FROM public.loops WHERE loop_code='COH-TRI-001'), (SELECT user_id FROM public.loops LIMIT 1))
WHERE NOT EXISTS (SELECT 1 FROM public.indicator_registry WHERE indicator_key='COH.TRI');

INSERT INTO public.indicator_registry(indicator_key,loop_id,title,unit,transform,triad_tag,notes,created_at,updated_at,user_id)
SELECT 'COH.CIVIC',(SELECT id FROM public.loops WHERE loop_code='COH-CIVIC-002'),
       'Civic Participation Rate','%',NULL,'domains',
       'Turnout/volunteering composite',now(),now(),
       COALESCE((SELECT user_id FROM public.loops WHERE loop_code='COH-CIVIC-002'), (SELECT user_id FROM public.loops LIMIT 1))
WHERE NOT EXISTS (SELECT 1 FROM public.indicator_registry WHERE indicator_key='COH.CIVIC');

-- ==========================================================
-- 4) SOURCES (drivers for ingestion widgets)
-- ==========================================================
INSERT INTO public.source_registry(source_id,name,type,provider,schedule_cron,schema_version,enabled,config,pii_class,created_at,updated_at,user_id)
SELECT gen_random_uuid(),'Vital Statistics API','pull','stats_api','0 3 * * *',1,true,
       jsonb_build_object('base_url','/api/v1/vitals','auth_mode','service_account','resources',jsonb_build_array('births','fertility')),
       'none',now(),now(),(SELECT uid FROM (
         SELECT user_id AS uid FROM public.profiles ORDER BY created_at LIMIT 1
         UNION ALL SELECT id FROM auth.users ORDER BY created_at LIMIT 1
         LIMIT 1
       ) u)
WHERE NOT EXISTS (SELECT 1 FROM public.source_registry WHERE name='Vital Statistics API');

INSERT INTO public.source_registry(name,type,provider,schedule_cron,schema_version,enabled,config,pii_class,created_at,updated_at,user_id)
SELECT 'Household Labour Survey','file','s3','@monthly',1,true,
       jsonb_build_object('bucket','gov-labour','prefix','hlfs/','format','parquet'),
       'none',now(),now(),(SELECT uid FROM (
         SELECT user_id AS uid FROM public.profiles ORDER BY created_at LIMIT 1
         UNION ALL SELECT id FROM auth.users ORDER BY created_at LIMIT 1
         LIMIT 1
       ) u)
WHERE NOT EXISTS (SELECT 1 FROM public.source_registry WHERE name='Household Labour Survey');

INSERT INTO public.source_registry(name,type,provider,schedule_cron,schema_version,enabled,config,pii_class,created_at,updated_at,user_id)
SELECT 'Cohesion Survey Push','push','secure_webhook',NULL,1,true,
       jsonb_build_object('endpoint','/ingest/cohesion','hmac','enabled'),
       'none',now(),now(),(SELECT uid FROM (
         SELECT user_id AS uid FROM public.profiles ORDER BY created_at LIMIT 1
         UNION ALL SELECT id FROM auth.users ORDER BY created_at LIMIT 1
         LIMIT 1
       ) u)
WHERE NOT EXISTS (SELECT 1 FROM public.source_registry WHERE name='Cohesion Survey Push');

-- ==========================================================
-- 5) BANDS (target envelopes for "in band / out of band" UI)
-- ==========================================================
INSERT INTO public.de_bands(loop_id,indicator,lower_bound,upper_bound,asymmetry,notes,user_id)
SELECT l.id,'FERT.TFR',2.10,3.20,0,'Target replacement and healthy band',(SELECT user_id FROM public.loops WHERE loop_code='FERT-TFR-001')
FROM public.loops l WHERE l.loop_code='FERT-TFR-001'
  AND NOT EXISTS (SELECT 1 FROM public.de_bands b WHERE b.loop_id=l.id AND b.indicator='FERT.TFR');

INSERT INTO public.de_bands(loop_id,indicator,lower_bound,upper_bound,asymmetry,notes,user_id)
SELECT l.id,'LAB.LFPR',60,78,0,'Desired LFPR window',(SELECT user_id FROM public.loops WHERE loop_code='LAB-LFPR-001')
FROM public.loops l WHERE l.loop_code='LAB-LFPR-001'
  AND NOT EXISTS (SELECT 1 FROM public.de_bands b WHERE b.loop_id=l.id AND b.indicator='LAB.LFPR');

INSERT INTO public.de_bands(loop_id,indicator,lower_bound,upper_bound,asymmetry,notes,user_id)
SELECT l.id,'LAB.YU',0,14,0,'Youth unemployment kept below 14%',(SELECT user_id FROM public.loops WHERE loop_code='LAB-YUNEMP-002')
FROM public.loops l WHERE l.loop_code='LAB-YUNEMP-002'
  AND NOT EXISTS (SELECT 1 FROM public.de_bands b WHERE b.loop_id=l.id AND b.indicator='LAB.YU');

INSERT INTO public.de_bands(loop_id,indicator,lower_bound,upper_bound,asymmetry,notes,user_id)
SELECT l.id,'COH.TRI',0.55,0.85,0,'Healthy cohesion interval',(SELECT user_id FROM public.loops WHERE loop_code='COH-TRI-001')
FROM public.loops l WHERE l.loop_code='COH-TRI-001'
  AND NOT EXISTS (SELECT 1 FROM public.de_bands b WHERE b.loop_id=l.id AND b.indicator='COH.TRI');

INSERT INTO public.de_bands(loop_id,indicator,lower_bound,upper_bound,asymmetry,notes,user_id)
SELECT l.id,'COH.CIVIC',45,80,0,'Participation band',(SELECT user_id FROM public.loops WHERE loop_code='COH-CIVIC-002')
FROM public.loops l WHERE l.loop_code='COH-CIVIC-002'
  AND NOT EXISTS (SELECT 1 FROM public.de_bands b WHERE b.loop_id=l.id AND b.indicator='COH.CIVIC');

-- ==========================================================
-- 6) WATCHPOINTS (UI toggles; per-loop thresholds that fire)
-- ==========================================================
INSERT INTO public.watchpoints(id,loop_id,indicator,direction,threshold_value,owner,armed,user_id,created_at,updated_at)
SELECT gen_random_uuid(), l.id,'FERT.TFR','down',2.10,(SELECT user_id FROM public.loops WHERE loop_code='FERT-TFR-001'),true,
       (SELECT user_id FROM public.loops WHERE loop_code='FERT-TFR-001'),now(),now()
FROM public.loops l
WHERE l.loop_code='FERT-TFR-001'
  AND NOT EXISTS (SELECT 1 FROM public.watchpoints w WHERE w.loop_id=l.id AND w.indicator='FERT.TFR');

INSERT INTO public.watchpoints(id,loop_id,indicator,direction,threshold_value,owner,armed,user_id,created_at,updated_at)
SELECT gen_random_uuid(), l.id,'LAB.LFPR','down',62,(SELECT user_id FROM public.loops WHERE loop_code='LAB-LFPR-001'),true,
       (SELECT user_id FROM public.loops WHERE loop_code='LAB-LFPR-001'),now(),now()
FROM public.loops l
WHERE l.loop_code='LAB-LFPR-001'
  AND NOT EXISTS (SELECT 1 FROM public.watchpoints w WHERE w.loop_id=l.id AND w.indicator='LAB.LFPR');

INSERT INTO public.watchpoints(id,loop_id,indicator,direction,threshold_value,owner,armed,user_id,created_at,updated_at)
SELECT gen_random_uuid(), l.id,'LAB.YU','up',14,(SELECT user_id FROM public.loops WHERE loop_code='LAB-YUNEMP-002'),true,
       (SELECT user_id FROM public.loops WHERE loop_code='LAB-YUNEMP-002'),now(),now()
FROM public.loops l
WHERE l.loop_code='LAB-YUNEMP-002'
  AND NOT EXISTS (SELECT 1 FROM public.watchpoints w WHERE w.loop_id=l.id AND w.indicator='LAB.YU');

INSERT INTO public.watchpoints(id,loop_id,indicator,direction,threshold_value,owner,armed,user_id,created_at,updated_at)
SELECT gen_random_uuid(), l.id,'COH.TRI','down',0.60,(SELECT user_id FROM public.loops WHERE loop_code='COH-TRI-001'),true,
       (SELECT user_id FROM public.loops WHERE loop_code='COH-TRI-001'),now(),now()
FROM public.loops l
WHERE l.loop_code='COH-TRI-001'
  AND NOT EXISTS (SELECT 1 FROM public.watchpoints w WHERE w.loop_id=l.id AND w.indicator='COH.TRI');