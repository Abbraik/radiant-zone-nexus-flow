-- GO-LIVE SEED Part 2: Loop Mappings, Indicators, Sources, and Bands (Simplified)

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

-- Create key indicators for each loop
INSERT INTO public.indicator_registry(indicator_key,loop_id,title,unit,triad_tag,notes,user_id)
SELECT 'FERT.TFR', l.id, 'Total Fertility Rate', 'births/woman', 'population', 'Main fertility gauge; annual, region-weighted', l.user_id
FROM public.loops l 
WHERE l.loop_code='FERT-TFR-001'
  AND NOT EXISTS (SELECT 1 FROM public.indicator_registry WHERE indicator_key='FERT.TFR');

INSERT INTO public.indicator_registry(indicator_key,loop_id,title,unit,triad_tag,notes,user_id)
SELECT 'LAB.LFPR', l.id, 'Labour Force Participation Rate', '%', 'domain', '15+ population participating in labour market', l.user_id
FROM public.loops l 
WHERE l.loop_code='LAB-LFPR-001'
  AND NOT EXISTS (SELECT 1 FROM public.indicator_registry WHERE indicator_key='LAB.LFPR');

INSERT INTO public.indicator_registry(indicator_key,loop_id,title,unit,triad_tag,notes,user_id)
SELECT 'COH.TRI', l.id, 'TRI Cohesion Index', '0–1', 'institution', 'Composite: Trust, Reciprocity, Integrity', l.user_id
FROM public.loops l 
WHERE l.loop_code='COH-TRI-001'
  AND NOT EXISTS (SELECT 1 FROM public.indicator_registry WHERE indicator_key='COH.TRI');

-- Create data sources
INSERT INTO public.source_registry(name,type,provider,enabled,config,pii_class,user_id)
SELECT 'Vital Statistics API','pull','stats_api',true,
       jsonb_build_object('base_url','/api/v1/vitals','auth_mode','service_account'),
       'none',(SELECT user_id FROM public.profiles ORDER BY created_at LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM public.source_registry WHERE name='Vital Statistics API');

-- Create target bands
INSERT INTO public.de_bands(loop_id,indicator,lower_bound,upper_bound,asymmetry,notes,user_id)
SELECT l.id,'FERT.TFR',2.10,3.20,0,'Target replacement and healthy band',l.user_id
FROM public.loops l WHERE l.loop_code='FERT-TFR-001'
  AND NOT EXISTS (SELECT 1 FROM public.de_bands WHERE loop_id=l.id AND indicator='FERT.TFR');

INSERT INTO public.de_bands(loop_id,indicator,lower_bound,upper_bound,asymmetry,notes,user_id)
SELECT l.id,'LAB.LFPR',60,78,0,'Desired LFPR window',l.user_id
FROM public.loops l WHERE l.loop_code='LAB-LFPR-001'
  AND NOT EXISTS (SELECT 1 FROM public.de_bands WHERE loop_id=l.id AND indicator='LAB.LFPR');

INSERT INTO public.de_bands(loop_id,indicator,lower_bound,upper_bound,asymmetry,notes,user_id)
SELECT l.id,'COH.TRI',0.55,0.85,0,'Healthy cohesion interval',l.user_id
FROM public.loops l WHERE l.loop_code='COH-TRI-001'
  AND NOT EXISTS (SELECT 1 FROM public.de_bands WHERE loop_id=l.id AND indicator='COH.TRI');