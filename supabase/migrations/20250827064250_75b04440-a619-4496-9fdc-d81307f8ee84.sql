-- GO-LIVE SEED Part 2: Loop Mappings, Indicators, Sources, and Bands

-- Map shared nodes to loops
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
SELECT l.id,'engagement',sn.snl_id,'Local convening & programs',now()
FROM public.loops l JOIN public.shared_nodes sn ON sn.key='SNL-COMMUNITY'
WHERE l.loop_code IN ('COH-TRI-001','COH-CIVIC-002')
  AND NOT EXISTS (SELECT 1 FROM public.loop_shared_nodes x WHERE x.loop_id=l.id AND x.snl_id=sn.snl_id);

-- Create indicator registry entries
INSERT INTO public.indicator_registry(indicator_key,loop_id,title,unit,transform,triad_tag,notes,created_at,updated_at,user_id)
VALUES
  ('FERT.TFR',(SELECT id FROM public.loops WHERE loop_code='FERT-TFR-001'),
   'Total Fertility Rate','births/woman',NULL,'population',
   'Main fertility gauge; annual, region-weighted',now(),now(),
   (SELECT user_id FROM public.loops WHERE loop_code='FERT-TFR-001')),
   
  ('FERT.mCPR',(SELECT id FROM public.loops WHERE loop_code='FERT-TFR-001'),
   'Modern Contraceptive Prevalence','%',NULL,'domains',
   'Women 15–49 using modern methods',now(),now(),
   (SELECT user_id FROM public.loops WHERE loop_code='FERT-TFR-001')),
   
  ('LAB.LFPR',(SELECT id FROM public.loops WHERE loop_code='LAB-LFPR-001'),
   'Labour Force Participation Rate','%',NULL,'domains',
   '15+ population participating in labour market',now(),now(),
   (SELECT user_id FROM public.loops WHERE loop_code='LAB-LFPR-001')),
   
  ('LAB.YU',(SELECT id FROM public.loops WHERE loop_code='LAB-YUNEMP-002'),
   'Youth Unemployment (15–24)','%',NULL,'population',
   'ILO definition; quarterly',now(),now(),
   (SELECT user_id FROM public.loops WHERE loop_code='LAB-YUNEMP-002')),
   
  ('COH.TRI',(SELECT id FROM public.loops WHERE loop_code='COH-TRI-001'),
   'TRI Cohesion Index','0–1',NULL,'institutions',
   'Composite: Trust, Reciprocity, Integrity',now(),now(),
   (SELECT user_id FROM public.loops WHERE loop_code='COH-TRI-001')),
   
  ('COH.CIVIC',(SELECT id FROM public.loops WHERE loop_code='COH-CIVIC-002'),
   'Civic Participation Rate','%',NULL,'domains',
   'Turnout/volunteering composite',now(),now(),
   (SELECT user_id FROM public.loops WHERE loop_code='COH-CIVIC-002'))
ON CONFLICT (indicator_key) DO NOTHING;

-- Create source registry entries
INSERT INTO public.source_registry(source_id,name,type,provider,schedule_cron,schema_version,enabled,config,pii_class,created_at,updated_at,user_id)
VALUES
  (gen_random_uuid(),'Vital Statistics API','pull','stats_api','0 3 * * *',1,true,
   jsonb_build_object('base_url','/api/v1/vitals','auth_mode','service_account','resources',jsonb_build_array('births','fertility')),
   'none',now(),now(),(SELECT user_id FROM public.profiles ORDER BY created_at LIMIT 1)),
   
  (gen_random_uuid(),'Household Labour Survey','file','s3','@monthly',1,true,
   jsonb_build_object('bucket','gov-labour','prefix','hlfs/','format','parquet'),
   'none',now(),now(),(SELECT user_id FROM public.profiles ORDER BY created_at LIMIT 1)),
   
  (gen_random_uuid(),'Cohesion Survey Push','push','secure_webhook',NULL,1,true,
   jsonb_build_object('endpoint','/ingest/cohesion','hmac','enabled'),
   'none',now(),now(),(SELECT user_id FROM public.profiles ORDER BY created_at LIMIT 1))
ON CONFLICT (name) DO NOTHING;

-- Create DE bands for target envelopes
INSERT INTO public.de_bands(loop_id,indicator,lower_bound,upper_bound,asymmetry,notes,user_id)
VALUES
  ((SELECT id FROM public.loops WHERE loop_code='FERT-TFR-001'),'FERT.TFR',2.10,3.20,0,'Target replacement and healthy band',
   (SELECT user_id FROM public.loops WHERE loop_code='FERT-TFR-001')),
   
  ((SELECT id FROM public.loops WHERE loop_code='LAB-LFPR-001'),'LAB.LFPR',60,78,0,'Desired LFPR window',
   (SELECT user_id FROM public.loops WHERE loop_code='LAB-LFPR-001')),
   
  ((SELECT id FROM public.loops WHERE loop_code='LAB-YUNEMP-002'),'LAB.YU',0,14,0,'Youth unemployment kept below 14%',
   (SELECT user_id FROM public.loops WHERE loop_code='LAB-YUNEMP-002')),
   
  ((SELECT id FROM public.loops WHERE loop_code='COH-TRI-001'),'COH.TRI',0.55,0.85,0,'Healthy cohesion interval',
   (SELECT user_id FROM public.loops WHERE loop_code='COH-TRI-001')),
   
  ((SELECT id FROM public.loops WHERE loop_code='COH-CIVIC-002'),'COH.CIVIC',45,80,0,'Participation band',
   (SELECT user_id FROM public.loops WHERE loop_code='COH-CIVIC-002'))
ON CONFLICT (loop_id, indicator) DO NOTHING;