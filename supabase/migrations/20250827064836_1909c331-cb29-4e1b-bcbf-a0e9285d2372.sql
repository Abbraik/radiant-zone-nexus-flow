-- GO-LIVE SEED Part 3: Watchpoints, Templates, Tasks, and Compass Data (Fixed)

-- Create watchpoints for loop monitoring
INSERT INTO public.watchpoints(id,loop_id,indicator,direction,threshold_value,owner,armed,user_id)
SELECT gen_random_uuid(), l.id,'FERT.TFR','down',2.10,l.user_id,true,l.user_id
FROM public.loops l
WHERE l.loop_code='FERT-TFR-001'
  AND NOT EXISTS (SELECT 1 FROM public.watchpoints w WHERE w.loop_id=l.id AND w.indicator='FERT.TFR');

INSERT INTO public.watchpoints(id,loop_id,indicator,direction,threshold_value,owner,armed,user_id)
SELECT gen_random_uuid(), l.id,'LAB.LFPR','down',62,l.user_id,true,l.user_id
FROM public.loops l
WHERE l.loop_code='LAB-LFPR-001'
  AND NOT EXISTS (SELECT 1 FROM public.watchpoints w WHERE w.loop_id=l.id AND w.indicator='LAB.LFPR');

INSERT INTO public.watchpoints(id,loop_id,indicator,direction,threshold_value,owner,armed,user_id)
SELECT gen_random_uuid(), l.id,'COH.TRI','down',0.60,l.user_id,true,l.user_id
FROM public.loops l
WHERE l.loop_code='COH-TRI-001'
  AND NOT EXISTS (SELECT 1 FROM public.watchpoints w WHERE w.loop_id=l.id AND w.indicator='COH.TRI');

-- Create risk channels individually
INSERT INTO public.risk_channels(channel_key,title,description,default_window,enabled)
SELECT 'fertility_decline','Fertility Decline','TFR or ANC/FP signals indicate fertility risk','6mo',true
WHERE NOT EXISTS (SELECT 1 FROM public.risk_channels WHERE channel_key='fertility_decline');

INSERT INTO public.risk_channels(channel_key,title,description,default_window,enabled)
SELECT 'labour_market_stress','Labour Market Stress','LFPR down or youth unemployment up','3mo',true
WHERE NOT EXISTS (SELECT 1 FROM public.risk_channels WHERE channel_key='labour_market_stress');

INSERT INTO public.risk_channels(channel_key,title,description,default_window,enabled)
SELECT 'cohesion_erosion','Cohesion Erosion','TRI or civic participation falling','3mo',true
WHERE NOT EXISTS (SELECT 1 FROM public.risk_channels WHERE channel_key='cohesion_erosion');

-- Create task templates individually
INSERT INTO public.task_templates(template_key,capacity,title,default_sla_hours,default_checklist,default_payload,open_route,version,active)
SELECT 'RSP-MARKET-ACTION','responsive','Deploy market action for labour stress',72,
  '[{"label":"Confirm regions & sectors","required":true},{"label":"Coordinate with PES","required":true}]'::jsonb,
  '{"playbook":"labour_actions"}'::jsonb,'/tasks',1,true
WHERE NOT EXISTS (SELECT 1 FROM public.task_templates WHERE template_key='RSP-MARKET-ACTION');

INSERT INTO public.task_templates(template_key,capacity,title,default_sla_hours,default_checklist,default_payload,open_route,version,active)
SELECT 'DLB-COUNCIL-SESSION','deliberative','Convene council on fertility drivers',120,
  '[{"label":"Compile ANC/mCPR dossier","required":true},{"label":"Cost/impact options","required":true}]'::jsonb,
  '{"playbook":"fertility_council"}'::jsonb,'/tasks',1,true
WHERE NOT EXISTS (SELECT 1 FROM public.task_templates WHERE template_key='DLB-COUNCIL-SESSION');

-- Create compass weights for loops
INSERT INTO public.compass_weights(loop_id,w_population,w_domains,w_institutions,w_legitimacy,user_id)
SELECT l.id,0.35,0.35,0.20,0.10,l.user_id
FROM public.loops l WHERE l.loop_code='FERT-TFR-001'
  AND NOT EXISTS (SELECT 1 FROM public.compass_weights w WHERE w.loop_id=l.id);

-- Create compass anchor mappings
INSERT INTO public.compass_anchor_map(loop_id,anchor,indicator_key,weight,notes,user_id)
SELECT l.id,'population','FERT.TFR',0.6,'Core demographic anchor',l.user_id
FROM public.loops l WHERE l.loop_code='FERT-TFR-001'
  AND NOT EXISTS (SELECT 1 FROM public.compass_anchor_map WHERE indicator_key='FERT.TFR');

INSERT INTO public.compass_anchor_map(loop_id,anchor,indicator_key,weight,notes,user_id)
SELECT l.id,'domain','LAB.LFPR',0.7,'Participation access',l.user_id
FROM public.loops l WHERE l.loop_code='LAB-LFPR-001'
  AND NOT EXISTS (SELECT 1 FROM public.compass_anchor_map WHERE indicator_key='LAB.LFPR');

INSERT INTO public.compass_anchor_map(loop_id,anchor,indicator_key,weight,notes,user_id)
SELECT l.id,'institution','COH.TRI',0.7,'Institutional trust',l.user_id
FROM public.loops l WHERE l.loop_code='COH-TRI-001'
  AND NOT EXISTS (SELECT 1 FROM public.compass_anchor_map WHERE indicator_key='COH.TRI');