-- ==========================================================
-- GO-LIVE SEED (FERTILITY • LABOUR MARKET • SOCIAL COHESION)
-- Safe to run multiple times (uses WHERE NOT EXISTS / ON CONFLICT)
-- ==========================================================

-- 0) Pick a default user/org for ownership and rule scoping
WITH chosen_user AS (
  SELECT user_id AS uid, COALESCE(org_id, gen_random_uuid()) AS org
  FROM public.profiles
  ORDER BY created_at ASC
  LIMIT 1
), fallback_user AS (
  SELECT id AS uid, gen_random_uuid() AS org
  FROM auth.users
  ORDER BY created_at ASC
  LIMIT 1
), pick AS (
  SELECT * FROM chosen_user
  UNION ALL
  SELECT * FROM fallback_user
  LIMIT 1
)
SELECT * FROM pick;

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
WITH orgpick AS (
  SELECT org FROM (
    SELECT org_id AS org FROM public.profiles WHERE org_id IS NOT NULL ORDER BY created_at LIMIT 1
    UNION ALL
    SELECT gen_random_uuid() AS org
    LIMIT 1
  ) s LIMIT 1
)
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

-- ==========================================================
-- 7) RISK CHANNELS & TRIGGER TEMPLATES (routing metadata)
-- ==========================================================
INSERT INTO public.risk_channels(channel_key,title,description,default_window,enabled,created_at,updated_at)
VALUES
 ('fertility_decline','Fertility Decline','TFR or ANC/FP signals indicate fertility risk','6mo',true,now(),now()),
 ('labour_market_stress','Labour Market Stress','LFPR down or youth unemployment up','3mo',true,now(),now()),
 ('cohesion_erosion','Cohesion Erosion','TRI or civic participation falling','3mo',true,now(),now())
ON CONFLICT (channel_key) DO NOTHING;

INSERT INTO public.trigger_templates(template_key,version,channel_key,title,dsl,defaults,created_at)
VALUES
 ('TT-FERT-DECLINE',1,'fertility_decline',
  'Fertility Decline Route',
  'IF FERT.TFR < 2.10 OR FERT.ANC4 < 80 OR FERT.mCPR < 45 THEN capacity=deliberative, template=DLB-COUNCIL-SESSION',
  '{"capacity":"deliberative","template_key":"DLB-COUNCIL-SESSION","priority":2}'::jsonb, now()),
 ('TT-LAB-STRESS',1,'labour_market_stress',
  'Labour Market Stress Route',
  'IF LAB.LFPR < 62 OR LAB.YU > 14 THEN capacity=responsive, template=RSP-MARKET-ACTION',
  '{"capacity":"responsive","template_key":"RSP-MARKET-ACTION","priority":2}'::jsonb, now()),
 ('TT-COH-EROSION',1,'cohesion_erosion',
  'Cohesion Erosion Route',
  'IF COH.TRI < 0.60 OR COH.CIVIC < 50 THEN capacity=reflexive, template=RFX-COHESION-RAPID',
  '{"capacity":"reflexive","template_key":"RFX-COHESION-RAPID","priority":3}'::jsonb, now())
ON CONFLICT (template_key,version) DO NOTHING;

-- ==========================================================
-- 8) ANTICIPATORY WATCHPOINTS/RULES (EWS & auto-routing)
-- ==========================================================
WITH orgpick AS (
  SELECT org FROM (
    SELECT org_id AS org FROM public.profiles WHERE org_id IS NOT NULL ORDER BY created_at LIMIT 1
    UNION ALL SELECT gen_random_uuid() AS org LIMIT 1
  ) o LIMIT 1
), pick AS (
  SELECT uid FROM (
    SELECT user_id AS uid FROM public.profiles ORDER BY created_at LIMIT 1
    UNION ALL SELECT id FROM auth.users ORDER BY created_at LIMIT 1
    LIMIT 1
  ) p
)
INSERT INTO public.antic_watchpoints(id,org_id,loop_codes,risk_channel,ews_prob,confidence,lead_time_days,buffer_adequacy,status,review_at,notes,created_by,created_at,updated_at)
SELECT gen_random_uuid(), (SELECT org FROM orgpick),
       ARRAY['FERT-TFR-001'],'fertility_decline',0.35,0.6,180,0.7,'armed',now() + interval '30 days',
       'Seasonality + ANC/mCPR trend', (SELECT uid FROM pick), now(), now()
WHERE NOT EXISTS (SELECT 1 FROM public.antic_watchpoints WHERE risk_channel='fertility_decline');

INSERT INTO public.antic_watchpoints(id,org_id,loop_codes,risk_channel,ews_prob,confidence,lead_time_days,buffer_adequacy,status,review_at,notes,created_by,created_at,updated_at)
SELECT gen_random_uuid(), (SELECT org FROM orgpick),
       ARRAY['LAB-LFPR-001','LAB-YUNEMP-002'],'labour_market_stress',0.40,0.6,120,0.6,'armed',now() + interval '21 days',
       'LFPR drift & youth U spikes', (SELECT uid FROM pick), now(), now()
WHERE NOT EXISTS (SELECT 1 FROM public.antic_watchpoints WHERE risk_channel='labour_market_stress');

INSERT INTO public.antic_watchpoints(id,org_id,loop_codes,risk_channel,ews_prob,confidence,lead_time_days,buffer_adequacy,status,review_at,notes,created_by,created_at,updated_at)
SELECT gen_random_uuid(), (SELECT org FROM orgpick),
       ARRAY['COH-TRI-001','COH-CIVIC-002'],'cohesion_erosion',0.30,0.55,90,0.5,'armed',now() + interval '14 days',
       'TRI downturn; participation soft', (SELECT uid FROM pick), now(), now()
WHERE NOT EXISTS (SELECT 1 FROM public.antic_watchpoints WHERE risk_channel='cohesion_erosion');

-- Rules that resolve to the templates above
INSERT INTO public.antic_trigger_rules(id,org_id,name,expr_raw,expr_ast,window_hours,action_ref,authority,consent_note,valid_from,expires_at,created_by,created_at,updated_at)
SELECT gen_random_uuid(), (SELECT org_id FROM public.profiles WHERE org_id IS NOT NULL ORDER BY created_at LIMIT 1),
       'Fertility decline rule',
       'avg(FERT.TFR,12mo) < 2.10 OR avg(FERT.ANC4,6mo) < 80 OR avg(FERT.mCPR,6mo) < 45',
       '{"logic":"or","terms":[["avg","FERT.TFR","12mo","<",2.10],["avg","FERT.ANC4","6mo","<",80],["avg","FERT.mCPR","6mo","<",45]]}'::jsonb,
       720,'template:TT-FERT-DECLINE','MoH','Population-level early action',now(),now()+interval '2 years',
       (SELECT uid FROM pick),now(),now()
WHERE NOT EXISTS (SELECT 1 FROM public.antic_trigger_rules WHERE name='Fertility decline rule');

INSERT INTO public.antic_trigger_rules(id,org_id,name,expr_raw,expr_ast,window_hours,action_ref,authority,consent_note,valid_from,expires_at,created_by,created_at,updated_at)
SELECT gen_random_uuid(), (SELECT org_id FROM public.profiles WHERE org_id IS NOT NULL ORDER BY created_at LIMIT 1),
       'Labour market stress rule',
       'avg(LAB.LFPR,3mo) < 62 OR avg(LAB.YU,3mo) > 14',
       '{"logic":"or","terms":[["avg","LAB.LFPR","3mo","<",62],["avg","LAB.YU","3mo",">",14]]}'::jsonb,
       216,'template:TT-LAB-STRESS','MoL','Labour market intervention',now(),now()+interval '2 years',
       (SELECT uid FROM pick),now(),now()
WHERE NOT EXISTS (SELECT 1 FROM public.antic_trigger_rules WHERE name='Labour market stress rule');

INSERT INTO public.antic_trigger_rules(id,org_id,name,expr_raw,expr_ast,window_hours,action_ref,authority,consent_note,valid_from,expires_at,created_by,created_at,updated_at)
SELECT gen_random_uuid(), (SELECT org_id FROM public.profiles WHERE org_id IS NOT NULL ORDER BY created_at LIMIT 1),
       'Cohesion erosion rule',
       'avg(COH.TRI,3mo) < 0.60 OR avg(COH.CIVIC,3mo) < 50',
       '{"logic":"or","terms":[["avg","COH.TRI","3mo","<",0.60],["avg","COH.CIVIC","3mo","<",50]]}'::jsonb,
       216,'template:TT-COH-EROSION','Civic Affairs','Rapid cohesion strengthening',now(),now()+interval '2 years',
       (SELECT uid FROM pick),now(),now()
WHERE NOT EXISTS (SELECT 1 FROM public.antic_trigger_rules WHERE name='Cohesion erosion rule');

-- ==========================================================
-- 9) TASK SLA POLICIES & TEMPLATES (FE task composer)
-- ==========================================================
INSERT INTO public.task_sla_policies(template_key,target_hours,reminder_schedule,escalation_after_hours,created_at)
VALUES
 ('RSP-MARKET-ACTION',72,'[{"at":"-24h"},{"at":"-2h"},{"at":"+0h"},{"at":"+24h"}]'::jsonb,96,now()),
 ('RFX-COHESION-RAPID',48,'[{"at":"-12h"},{"at":"+0h"},{"at":"+12h"}]'::jsonb,72,now()),
 ('DLB-COUNCIL-SESSION',120,'[{"at":"-48h"},{"at":"+0h"},{"at":"+48h"}]'::jsonb,168,now())
ON CONFLICT (template_key) DO NOTHING;

INSERT INTO public.task_templates(template_key,capacity,title,default_sla_hours,default_checklist,default_payload,open_route,version,active,created_at,updated_at)
VALUES
 ('RSP-MARKET-ACTION','responsive','Deploy market action for labour stress',72,
  '[
     {"label":"Confirm regions & sectors","required":true},
     {"label":"Coordinate with PES","required":true},
     {"label":"Publish public notice","required":false}
   ]'::jsonb,
  '{"playbook":"labour_actions","channels":["PES","JobPortal"]}'::jsonb,
  '/tasks',1,true,now(),now()),
 ('RFX-COHESION-RAPID','reflexive','Rapid cohesion response & rumor control',48,
  '[
     {"label":"Assess TRI dip drivers","required":true},
     {"label":"Engage community centers","required":true},
     {"label":"Issue media brief","required":true}
   ]'::jsonb,
  '{"playbook":"cohesion_rapid","ops":["Community","Media"]}'::jsonb,
  '/tasks',1,true,now(),now()),
 ('DLB-COUNCIL-SESSION','deliberative','Convene council on fertility drivers',120,
  '[
     {"label":"Compile ANC/mCPR dossier","required":true},
     {"label":"Cost/impact options","required":true},
     {"label":"Stakeholder invitations","required":true}
   ]'::jsonb,
  '{"playbook":"fertility_council","scope":"national"}'::jsonb,
  '/tasks',1,true,now(),now())
ON CONFLICT (template_key) DO NOTHING;

-- ==========================================================
-- 10) TASKS (already-routed actions) + EVENTS
-- ==========================================================
WITH lu AS (
  SELECT id AS loop_id FROM public.loops WHERE loop_code='LAB-YUNEMP-002'
), ld AS (
  SELECT id AS loop_id FROM public.loops WHERE loop_code='FERT-TFR-001'
), lc AS (
  SELECT id AS loop_id FROM public.loops WHERE loop_code='COH-TRI-001'
), usr AS (
  SELECT uid AS user_id FROM (
    SELECT user_id AS uid FROM public.profiles ORDER BY created_at LIMIT 1
    UNION ALL SELECT id FROM auth.users ORDER BY created_at LIMIT 1
    LIMIT 1
  ) q
)
-- Labour task (responsive)
INSERT INTO public.tasks_v2(task_id,loop_id,capacity,template_key,status,priority,title,payload,open_route,created_by,created_at,updated_at,due_at,review_at)
SELECT gen_random_uuid(), (SELECT loop_id FROM lu),'responsive','RSP-MARKET-ACTION','in_progress',2,
       'Mitigate youth unemployment spike','{"trigger":"LAB.YU>14","regions":["Metro North","Coastal"]}'::jsonb,
       '/tasks',(SELECT user_id FROM usr), now(), now(), now()+interval '72 hours', now()+interval '7 days'
WHERE NOT EXISTS (
  SELECT 1 FROM public.tasks_v2 WHERE template_key='RSP-MARKET-ACTION' AND status IN ('available','claimed','in_progress')
);

-- Fertility task (deliberative)
INSERT INTO public.tasks_v2(task_id,loop_id,capacity,template_key,status,priority,title,payload,open_route,created_by,created_at,updated_at,due_at,review_at)
SELECT gen_random_uuid(), (SELECT loop_id FROM ld),'deliberative','DLB-COUNCIL-SESSION','claimed',2,
       'Council session: fertility decline and ANC gaps','{"trigger":"FERT.TFR<2.1 or ANC4<80"}'::jsonb,
       '/tasks',(SELECT user_id FROM usr), now(), now(), now()+interval '5 days', now()+interval '10 days'
WHERE NOT EXISTS (
  SELECT 1 FROM public.tasks_v2 WHERE template_key='DLB-COUNCIL-SESSION' AND status IN ('available','claimed','in_progress')
);

-- Cohesion task (reflexive)
INSERT INTO public.tasks_v2(task_id,loop_id,capacity,template_key,status,priority,title,payload,open_route,created_by,created_at,updated_at,due_at,review_at)
SELECT gen_random_uuid(), (SELECT loop_id FROM lc),'reflexive','RFX-COHESION-RAPID','available',3,
       'Rapid response: TRI dip & rumor cluster','{"trigger":"COH.TRI<0.60","hotspots":["District 4"]}'::jsonb,
       '/tasks',(SELECT user_id FROM usr), now(), now(), now()+interval '48 hours', now()+interval '5 days'
WHERE NOT EXISTS (
  SELECT 1 FROM public.tasks_v2 WHERE template_key='RFX-COHESION-RAPID' AND status IN ('available','claimed','in_progress')
);

-- Task events (timeline)
INSERT INTO public.task_events_v2(event_id,task_id,event_type,created_by,created_at,detail)
SELECT gen_random_uuid(), t.task_id,'created',(SELECT user_id FROM usr), t.created_at,'{}'::jsonb
FROM public.tasks_v2 t
WHERE NOT EXISTS (SELECT 1 FROM public.task_events_v2 ev WHERE ev.task_id=t.task_id AND ev.event_type='created');

INSERT INTO public.task_events_v2(event_id,task_id,event_type,created_by,created_at,detail)
SELECT gen_random_uuid(), t.task_id,'status_change',(SELECT user_id FROM usr), t.updated_at,
       jsonb_build_object('to',t.status)
FROM public.tasks_v2 t
WHERE NOT EXISTS (SELECT 1 FROM public.task_events_v2 ev WHERE ev.task_id=t.task_id AND ev.event_type='status_change');

-- ==========================================================
-- 11) COMPASS (NCF overlays) + TRI snapshot (for FE dials)
-- ==========================================================
-- Weights per loop
INSERT INTO public.compass_weights(loop_id,w_population,w_domains,w_institutions,w_legitimacy,user_id,updated_at,created_at)
SELECT l.id,0.35,0.35,0.20,0.10,l.user_id,now(),now()
FROM public.loops l WHERE l.loop_code='FERT-TFR-001'
  AND NOT EXISTS (SELECT 1 FROM public.compass_weights w WHERE w.loop_id=l.id);

INSERT INTO public.compass_weights(loop_id,w_population,w_domains,w_institutions,w_legitimacy,user_id,updated_at,created_at)
SELECT l.id,0.20,0.50,0.20,0.10,l.user_id,now(),now()
FROM public.loops l WHERE l.loop_code='LAB-LFPR-001'
  AND NOT EXISTS (SELECT 1 FROM public.compass_weights w WHERE w.loop_id=l.id);

INSERT INTO public.compass_weights(loop_id,w_population,w_domains,w_institutions,w_legitimacy,user_id,updated_at,created_at)
SELECT l.id,0.25,0.25,0.30,0.20,l.user_id,now(),now()
FROM public.loops l WHERE l.loop_code='COH-TRI-001'
  AND NOT EXISTS (SELECT 1 FROM public.compass_weights w WHERE w.loop_id=l.id);

-- Anchor map (indicator → anchor)
INSERT INTO public.compass_anchor_map(loop_id,anchor,indicator_key,weight,notes,user_id)
SELECT (SELECT id FROM public.loops WHERE loop_code='FERT-TFR-001'),'population','FERT.TFR',0.6,'Core demographic anchor',
       (SELECT user_id FROM public.loops WHERE loop_code='FERT-TFR-001')
WHERE NOT EXISTS (SELECT 1 FROM public.compass_anchor_map WHERE indicator_key='FERT.TFR');

INSERT INTO public.compass_anchor_map(loop_id,anchor,indicator_key,weight,notes,user_id)
SELECT (SELECT id FROM public.loops WHERE loop_code='FERT-TFR-001'),'domains','FERT.mCPR',0.25,'Access to FP services',
       (SELECT user_id FROM public.loops WHERE loop_code='FERT-TFR-001')
WHERE NOT EXISTS (SELECT 1 FROM public.compass_anchor_map WHERE indicator_key='FERT.mCPR');

INSERT INTO public.compass_anchor_map(loop_id,anchor,indicator_key,weight,notes,user_id)
SELECT (SELECT id FROM public.loops WHERE loop_code='FERT-TFR-001'),'institutions','FERT.ANC4',0.15,'Service quality',
       (SELECT user_id FROM public.loops WHERE loop_code='FERT-TFR-001')
WHERE NOT EXISTS (SELECT 1 FROM public.compass_anchor_map WHERE indicator_key='FERT.ANC4');

INSERT INTO public.compass_anchor_map(loop_id,anchor,indicator_key,weight,notes,user_id)
SELECT (SELECT id FROM public.loops WHERE loop_code='LAB-LFPR-001'),'domains','LAB.LFPR',0.7,'Participation access',
       (SELECT user_id FROM public.loops WHERE loop_code='LAB-LFPR-001')
WHERE NOT EXISTS (SELECT 1 FROM public.compass_anchor_map WHERE indicator_key='LAB.LFPR');

INSERT INTO public.compass_anchor_map(loop_id,anchor,indicator_key,weight,notes,user_id)
SELECT (SELECT id FROM public.loops WHERE loop_code='LAB-YUNEMP-002'),'population','LAB.YU',0.7,'Youth outcomes',
       (SELECT user_id FROM public.loops WHERE loop_code='LAB-YUNEMP-002')
WHERE NOT EXISTS (SELECT 1 FROM public.compass_anchor_map WHERE indicator_key='LAB.YU');

INSERT INTO public.compass_anchor_map(loop_id,anchor,indicator_key,weight,notes,user_id)
SELECT (SELECT id FROM public.loops WHERE loop_code='COH-TRI-001'),'institutions','COH.TRI',0.7,'Institutional trust',
       (SELECT user_id FROM public.loops WHERE loop_code='COH-TRI-001')
WHERE NOT EXISTS (SELECT 1 FROM public.compass_anchor_map WHERE indicator_key='COH.TRI');

INSERT INTO public.compass_anchor_map(loop_id,anchor,indicator_key,weight,notes,user_id)
SELECT (SELECT id FROM public.loops WHERE loop_code='COH-CIVIC-002'),'domains','COH.CIVIC',0.7,'Civic participation',
       (SELECT user_id FROM public.loops WHERE loop_code='COH-CIVIC-002')
WHERE NOT EXISTS (SELECT 1 FROM public.compass_anchor_map WHERE indicator_key='COH.CIVIC');

-- Snapshots (FE gauges)
INSERT INTO public.compass_snapshots(snap_id,loop_id,as_of,ci,drift,tri,consent_avg,user_id,created_at)
SELECT gen_random_uuid(),(SELECT id FROM public.loops WHERE loop_code='FERT-TFR-001'), CURRENT_DATE,
       0.58,'{"pop":-0.03,"dom":-0.02,"inst":-0.01}'::jsonb,'{"T":0.62,"R":0.55,"I":0.60}'::jsonb,0.64,
       (SELECT user_id FROM public.loops WHERE loop_code='FERT-TFR-001'), now()
WHERE NOT EXISTS (SELECT 1 FROM public.compass_snapshots WHERE loop_id=(SELECT id FROM public.loops WHERE loop_code='FERT-TFR-001'));

INSERT INTO public.tri_snapshots(snap_id,loop_id,as_of,trust,reciprocity,integrity,notes,user_id,created_at)
SELECT gen_random_uuid(),(SELECT id FROM public.loops WHERE loop_code='COH-TRI-001'), now(),
       0.59,0.57,0.61,'{"note":"mild dip; target outreach"}'::jsonb,
       (SELECT user_id FROM public.loops WHERE loop_code='COH-TRI-001'), now()
WHERE NOT EXISTS (SELECT 1 FROM public.tri_snapshots WHERE loop_id=(SELECT id FROM public.loops WHERE loop_code='COH-TRI-001'));

-- ==========================================================
-- 12) SIGNAL EVENTS (so Home shows real, fired history)
-- ==========================================================
INSERT INTO public.signal_events(id,watchpoint_id,loop_id,event_type,indicator_value,threshold_crossed,severity,auto_action_taken,playbook_executed,user_id,created_at)
SELECT gen_random_uuid(), w.id, w.loop_id,'trip',2.05,2.10,'high',false,'{}'::jsonb,(SELECT user_id FROM public.loops WHERE id=w.loop_id), now()
FROM public.watchpoints w
JOIN public.loops l ON l.id=w.loop_id
WHERE l.loop_code='FERT-TFR-001'
  AND NOT EXISTS (
    SELECT 1 FROM public.signal_events se WHERE se.loop_id=w.loop_id AND se.event_type='trip'
);

INSERT INTO public.signal_events(id,watchpoint_id,loop_id,event_type,indicator_value,threshold_crossed,severity,auto_action_taken,playbook_executed,user_id,created_at)
SELECT gen_random_uuid(), w.id, w.loop_id,'trip',16.2,14,'medium',false,'{}'::jsonb,(SELECT user_id FROM public.loops WHERE id=w.loop_id), now()
FROM public.watchpoints w
JOIN public.loops l ON l.id=w.loop_id
WHERE l.loop_code='LAB-YUNEMP-002'
  AND NOT EXISTS (
    SELECT 1 FROM public.signal_events se WHERE se.loop_id=w.loop_id AND se.event_type='trip'
);

INSERT INTO public.signal_events(id,watchpoint_id,loop_id,event_type,indicator_value,threshold_crossed,severity,auto_action_taken,playbook_executed,user_id,created_at)
SELECT gen_random_uuid(), w.id, w.loop_id,'trip',0.58,0.60,'medium',false,'{}'::jsonb,(SELECT user_id FROM public.loops WHERE id=w.loop_id), now()
FROM public.watchpoints w
JOIN public.loops l ON l.id=w.loop_id
WHERE l.loop_code='COH-TRI-001'
  AND NOT EXISTS (
    SELECT 1 FROM public.signal_events se WHERE se.loop_id=w.loop_id AND se.event_type='trip'
);

-- ==========================================================
-- 13) LEARNING HUBS (context side-panel content)
-- ==========================================================
INSERT INTO public.learning_hubs(hub_id,capacity,version,mdx_content,author,active,created_at,updated_at)
VALUES
 (gen_random_uuid(),'deliberative','1.0',
  '# Fertility Council\n\nSteps, evidence pack, options MCDA.\n','Policy Lab',true,now(),now()),
 (gen_random_uuid(),'responsive','1.0',
  '# Labour Market Action\n\nTargeted matching, wage support, apprenticeships.\n','Jobs Unit',true,now(),now()),
 (gen_random_uuid(),'reflexive','1.0',
  '# Cohesion Rapid Response\n\nCommunity convening and rumor countermeasures.\n','Civic Affairs',true,now(),now())
ON CONFLICT DO NOTHING;