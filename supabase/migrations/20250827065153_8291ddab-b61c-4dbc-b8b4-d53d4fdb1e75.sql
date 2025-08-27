-- GO-LIVE SEED Part 4: Task Templates and Compass System (Fixed)

-- Create task SLA policies
INSERT INTO public.task_sla_policies(template_key,target_hours,reminder_schedule,escalation_after_hours,created_at)
VALUES
 ('RSP-MARKET-ACTION',72,'[{"at":"-24h"},{"at":"-2h"},{"at":"+0h"},{"at":"+24h"}]'::jsonb,96,now()),
 ('RFX-COHESION-RAPID',48,'[{"at":"-12h"},{"at":"+0h"},{"at":"+12h"}]'::jsonb,72,now()),
 ('DLB-COUNCIL-SESSION',120,'[{"at":"-48h"},{"at":"+0h"},{"at":"+48h"}]'::jsonb,168,now())
ON CONFLICT (template_key) DO NOTHING;

-- Create task templates
INSERT INTO public.task_templates(template_key,capacity,title,default_sla_hours,default_checklist,default_payload,open_route,version,active,created_at,updated_at)
VALUES
 ('RSP-MARKET-ACTION','responsive','Deploy market action for labour stress',72,
  '[{"label":"Confirm regions & sectors","required":true},{"label":"Coordinate with PES","required":true},{"label":"Publish public notice","required":false}]'::jsonb,
  '{"playbook":"labour_actions","channels":["PES","JobPortal"]}'::jsonb,
  '/tasks',1,true,now(),now()),
 ('RFX-COHESION-RAPID','reflexive','Rapid cohesion response & rumor control',48,
  '[{"label":"Assess TRI dip drivers","required":true},{"label":"Engage community centers","required":true},{"label":"Issue media brief","required":true}]'::jsonb,
  '{"playbook":"cohesion_rapid","ops":["Community","Media"]}'::jsonb,
  '/tasks',1,true,now(),now()),
 ('DLB-COUNCIL-SESSION','deliberative','Convene council on fertility drivers',120,
  '[{"label":"Compile ANC/mCPR dossier","required":true},{"label":"Cost/impact options","required":true},{"label":"Stakeholder invitations","required":true}]'::jsonb,
  '{"playbook":"fertility_council","scope":"national"}'::jsonb,
  '/tasks',1,true,now(),now())
ON CONFLICT (template_key) DO NOTHING;

-- Create compass weights for each loop
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

-- Create compass snapshots for gauges
INSERT INTO public.compass_snapshots(snap_id,loop_id,as_of,ci,drift,tri,consent_avg,user_id,created_at)
SELECT gen_random_uuid(),l.id, CURRENT_DATE,
       0.58,'{"pop":-0.03,"dom":-0.02,"inst":-0.01}'::jsonb,'{"T":0.62,"R":0.55,"I":0.60}'::jsonb,0.64,
       l.user_id, now()
FROM public.loops l WHERE l.loop_code='FERT-TFR-001'
  AND NOT EXISTS (SELECT 1 FROM public.compass_snapshots WHERE loop_id=l.id);

-- Create learning hubs
INSERT INTO public.learning_hubs(hub_id,capacity,version,mdx_content,author,active,created_at,updated_at)
SELECT gen_random_uuid(),'deliberative','1.0','# Fertility Council\n\nSteps, evidence pack, options MCDA.\n','Policy Lab',true,now(),now()
WHERE NOT EXISTS (SELECT 1 FROM public.learning_hubs WHERE capacity='deliberative');

INSERT INTO public.learning_hubs(hub_id,capacity,version,mdx_content,author,active,created_at,updated_at)
SELECT gen_random_uuid(),'responsive','1.0','# Labour Market Action\n\nTargeted matching, wage support, apprenticeships.\n','Jobs Unit',true,now(),now()
WHERE NOT EXISTS (SELECT 1 FROM public.learning_hubs WHERE capacity='responsive');

INSERT INTO public.learning_hubs(hub_id,capacity,version,mdx_content,author,active,created_at,updated_at)
SELECT gen_random_uuid(),'reflexive','1.0','# Cohesion Rapid Response\n\nCommunity convening and rumor countermeasures.\n','Civic Affairs',true,now(),now()
WHERE NOT EXISTS (SELECT 1 FROM public.learning_hubs WHERE capacity='reflexive');