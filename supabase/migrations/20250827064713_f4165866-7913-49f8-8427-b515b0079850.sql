-- GO-LIVE SEED Part 3: Watchpoints, Templates, Tasks, and Compass Data

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

-- Create risk channels
INSERT INTO public.risk_channels(channel_key,title,description,default_window,enabled)
VALUES
 ('fertility_decline','Fertility Decline','TFR or ANC/FP signals indicate fertility risk','6mo',true),
 ('labour_market_stress','Labour Market Stress','LFPR down or youth unemployment up','3mo',true),
 ('cohesion_erosion','Cohesion Erosion','TRI or civic participation falling','3mo',true)
WHERE NOT EXISTS (SELECT 1 FROM public.risk_channels WHERE channel_key IN ('fertility_decline','labour_market_stress','cohesion_erosion'));

-- Create task templates
INSERT INTO public.task_templates(template_key,capacity,title,default_sla_hours,default_checklist,default_payload,open_route,version,active)
VALUES
 ('RSP-MARKET-ACTION','responsive','Deploy market action for labour stress',72,
  '[
     {"label":"Confirm regions & sectors","required":true},
     {"label":"Coordinate with PES","required":true}
   ]'::jsonb,
  '{"playbook":"labour_actions"}'::jsonb,
  '/tasks',1,true),
  
 ('DLB-COUNCIL-SESSION','deliberative','Convene council on fertility drivers',120,
  '[
     {"label":"Compile ANC/mCPR dossier","required":true},
     {"label":"Cost/impact options","required":true}
   ]'::jsonb,
  '{"playbook":"fertility_council"}'::jsonb,
  '/tasks',1,true),
  
 ('RFX-COHESION-RAPID','reflexive','Rapid cohesion response & rumor control',48,
  '[
     {"label":"Assess TRI dip drivers","required":true},
     {"label":"Engage community centers","required":true}
   ]'::jsonb,
  '{"playbook":"cohesion_rapid"}'::jsonb,
  '/tasks',1,true)
WHERE NOT EXISTS (SELECT 1 FROM public.task_templates WHERE template_key IN ('RSP-MARKET-ACTION','DLB-COUNCIL-SESSION','RFX-COHESION-RAPID'));

-- Create compass weights for loops
INSERT INTO public.compass_weights(loop_id,w_population,w_domains,w_institutions,w_legitimacy,user_id)
SELECT l.id,0.35,0.35,0.20,0.10,l.user_id
FROM public.loops l WHERE l.loop_code='FERT-TFR-001'
  AND NOT EXISTS (SELECT 1 FROM public.compass_weights w WHERE w.loop_id=l.id);

INSERT INTO public.compass_weights(loop_id,w_population,w_domains,w_institutions,w_legitimacy,user_id)
SELECT l.id,0.20,0.50,0.20,0.10,l.user_id
FROM public.loops l WHERE l.loop_code='LAB-LFPR-001'
  AND NOT EXISTS (SELECT 1 FROM public.compass_weights w WHERE w.loop_id=l.id);

INSERT INTO public.compass_weights(loop_id,w_population,w_domains,w_institutions,w_legitimacy,user_id)
SELECT l.id,0.25,0.25,0.30,0.20,l.user_id
FROM public.loops l WHERE l.loop_code='COH-TRI-001'
  AND NOT EXISTS (SELECT 1 FROM public.compass_weights w WHERE w.loop_id=l.id);

-- Create compass snapshots
INSERT INTO public.compass_snapshots(snap_id,loop_id,as_of,ci,drift,tri,consent_avg,user_id)
SELECT gen_random_uuid(),l.id, CURRENT_DATE, 0.58,
       '{"pop":-0.03,"dom":-0.02,"inst":-0.01}'::jsonb,
       '{"T":0.62,"R":0.55,"I":0.60}'::jsonb,0.64,l.user_id
FROM public.loops l WHERE l.loop_code='FERT-TFR-001'
  AND NOT EXISTS (SELECT 1 FROM public.compass_snapshots WHERE loop_id=l.id);

-- Create TRI snapshot
INSERT INTO public.tri_snapshots(snap_id,loop_id,as_of,trust,reciprocity,integrity,notes,user_id)
SELECT gen_random_uuid(),l.id, now(), 0.59,0.57,0.61,
       '{"note":"mild dip; target outreach"}'::jsonb,l.user_id
FROM public.loops l WHERE l.loop_code='COH-TRI-001'
  AND NOT EXISTS (SELECT 1 FROM public.tri_snapshots WHERE loop_id=l.id);