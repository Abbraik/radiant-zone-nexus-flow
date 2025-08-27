-- GO-LIVE SEED Part 4: Final Components - Anticipatory Rules, Templates, and Sample Tasks

-- Create trigger templates  
INSERT INTO public.trigger_templates(template_key,version,channel_key,title,dsl,defaults)
SELECT 'TT-FERT-DECLINE',1,'fertility_decline',
  'Fertility Decline Route',
  'IF FERT.TFR < 2.10 OR FERT.ANC4 < 80 THEN capacity=deliberative, template=DLB-COUNCIL-SESSION',
  '{"capacity":"deliberative","template_key":"DLB-COUNCIL-SESSION","priority":2}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.trigger_templates WHERE template_key='TT-FERT-DECLINE');

INSERT INTO public.trigger_templates(template_key,version,channel_key,title,dsl,defaults)
SELECT 'TT-LAB-STRESS',1,'labour_market_stress',
  'Labour Market Stress Route',
  'IF LAB.LFPR < 62 OR LAB.YU > 14 THEN capacity=responsive, template=RSP-MARKET-ACTION',
  '{"capacity":"responsive","template_key":"RSP-MARKET-ACTION","priority":2}'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM public.trigger_templates WHERE template_key='TT-LAB-STRESS');

-- Create sample tasks for each capacity
INSERT INTO public.tasks_v2(task_id,loop_id,capacity,template_key,status,priority,title,payload,open_route,created_by)
SELECT gen_random_uuid(), l.id,'responsive','RSP-MARKET-ACTION','in_progress',2,
       'Mitigate youth unemployment spike','{"trigger":"LAB.YU>14","regions":["Metro North","Coastal"]}'::jsonb,
       '/tasks',l.user_id
FROM public.loops l 
WHERE l.loop_code='LAB-YUNEMP-002'
  AND NOT EXISTS (
    SELECT 1 FROM public.tasks_v2 WHERE template_key='RSP-MARKET-ACTION' AND status IN ('available','claimed','in_progress')
  );

INSERT INTO public.tasks_v2(task_id,loop_id,capacity,template_key,status,priority,title,payload,open_route,created_by)
SELECT gen_random_uuid(), l.id,'deliberative','DLB-COUNCIL-SESSION','claimed',2,
       'Council session: fertility decline and ANC gaps','{"trigger":"FERT.TFR<2.1"}'::jsonb,
       '/tasks',l.user_id
FROM public.loops l 
WHERE l.loop_code='FERT-TFR-001'
  AND NOT EXISTS (
    SELECT 1 FROM public.tasks_v2 WHERE template_key='DLB-COUNCIL-SESSION' AND status IN ('available','claimed','in_progress')
  );

-- Create signal events for realistic history
INSERT INTO public.signal_events(id,watchpoint_id,loop_id,event_type,indicator_value,threshold_crossed,severity,auto_action_taken,playbook_executed,user_id)
SELECT gen_random_uuid(), w.id, w.loop_id,'trip',2.05,2.10,'high',false,'{}'::jsonb,l.user_id
FROM public.watchpoints w
JOIN public.loops l ON l.id=w.loop_id
WHERE l.loop_code='FERT-TFR-001'
  AND NOT EXISTS (
    SELECT 1 FROM public.signal_events se WHERE se.loop_id=w.loop_id AND se.event_type='trip'
  );

INSERT INTO public.signal_events(id,watchpoint_id,loop_id,event_type,indicator_value,threshold_crossed,severity,auto_action_taken,playbook_executed,user_id)
SELECT gen_random_uuid(), w.id, w.loop_id,'trip',0.58,0.60,'medium',false,'{}'::jsonb,l.user_id
FROM public.watchpoints w
JOIN public.loops l ON l.id=w.loop_id
WHERE l.loop_code='COH-TRI-001'
  AND NOT EXISTS (
    SELECT 1 FROM public.signal_events se WHERE se.loop_id=w.loop_id AND se.event_type='trip'
  );

-- Create learning hubs for context content
INSERT INTO public.learning_hubs(hub_id,capacity,version,mdx_content,author,active)
SELECT gen_random_uuid(),'deliberative','1.0',
  '# Fertility Council\n\nSteps, evidence pack, options MCDA.\n','Policy Lab',true
WHERE NOT EXISTS (SELECT 1 FROM public.learning_hubs WHERE capacity='deliberative');

INSERT INTO public.learning_hubs(hub_id,capacity,version,mdx_content,author,active)
SELECT gen_random_uuid(),'responsive','1.0',
  '# Labour Market Action\n\nTargeted matching, wage support, apprenticeships.\n','Jobs Unit',true
WHERE NOT EXISTS (SELECT 1 FROM public.learning_hubs WHERE capacity='responsive');

INSERT INTO public.learning_hubs(hub_id,capacity,version,mdx_content,author,active)
SELECT gen_random_uuid(),'reflexive','1.0',
  '# Cohesion Rapid Response\n\nCommunity convening and rumor countermeasures.\n','Civic Affairs',true
WHERE NOT EXISTS (SELECT 1 FROM public.learning_hubs WHERE capacity='reflexive');