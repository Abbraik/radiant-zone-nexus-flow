-- GO-LIVE SEED Part 3: Watchpoints, Risk Channels, and Triggers

-- Create watchpoints for each loop
INSERT INTO public.watchpoints(id,loop_id,indicator,direction,threshold_value,owner,armed,user_id,created_at,updated_at)
SELECT gen_random_uuid(), l.id,'FERT.TFR','down',2.10,l.user_id,true,l.user_id,now(),now()
FROM public.loops l
WHERE l.loop_code='FERT-TFR-001'
  AND NOT EXISTS (SELECT 1 FROM public.watchpoints w WHERE w.loop_id=l.id AND w.indicator='FERT.TFR');

INSERT INTO public.watchpoints(id,loop_id,indicator,direction,threshold_value,owner,armed,user_id,created_at,updated_at)
SELECT gen_random_uuid(), l.id,'LAB.LFPR','down',62,l.user_id,true,l.user_id,now(),now()
FROM public.loops l
WHERE l.loop_code='LAB-LFPR-001'
  AND NOT EXISTS (SELECT 1 FROM public.watchpoints w WHERE w.loop_id=l.id AND w.indicator='LAB.LFPR');

INSERT INTO public.watchpoints(id,loop_id,indicator,direction,threshold_value,owner,armed,user_id,created_at,updated_at)
SELECT gen_random_uuid(), l.id,'LAB.YU','up',14,l.user_id,true,l.user_id,now(),now()
FROM public.loops l
WHERE l.loop_code='LAB-YUNEMP-002'
  AND NOT EXISTS (SELECT 1 FROM public.watchpoints w WHERE w.loop_id=l.id AND w.indicator='LAB.YU');

INSERT INTO public.watchpoints(id,loop_id,indicator,direction,threshold_value,owner,armed,user_id,created_at,updated_at)
SELECT gen_random_uuid(), l.id,'COH.TRI','down',0.60,l.user_id,true,l.user_id,now(),now()
FROM public.loops l
WHERE l.loop_code='COH-TRI-001'
  AND NOT EXISTS (SELECT 1 FROM public.watchpoints w WHERE w.loop_id=l.id AND w.indicator='COH.TRI');

-- Create risk channels
INSERT INTO public.risk_channels(channel_key,title,description,default_window,enabled,created_at,updated_at)
VALUES
 ('fertility_decline','Fertility Decline','TFR or ANC/FP signals indicate fertility risk','6mo',true,now(),now()),
 ('labour_market_stress','Labour Market Stress','LFPR down or youth unemployment up','3mo',true,now(),now()),
 ('cohesion_erosion','Cohesion Erosion','TRI or civic participation falling','3mo',true,now(),now())
ON CONFLICT (channel_key) DO NOTHING;

-- Create trigger templates
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