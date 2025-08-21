-- Create Structural session
create or replace function struct_create_session(p_org uuid, p_loop text, p_mission text)
returns uuid 
language plpgsql 
security definer 
set search_path = public
as $$
declare sid uuid;
begin
  insert into struct_sessions(org_id, loop_code, mission, created_by)
  values (p_org, p_loop, p_mission, auth.uid())
  returning id into sid;
  return sid;
end $$;

-- Mandate check setter
create or replace function struct_set_mandate_check(p_org uuid, p_session uuid, p_label text, p_status text, p_note text)
returns void 
language plpgsql 
security definer 
set search_path = public
as $$
declare idd uuid;
begin
  select id into idd from struct_mandate_checks where org_id=p_org and session_id=p_session and label=p_label;
  if idd is null then
    insert into struct_mandate_checks(org_id, session_id, label, status, note) values (p_org, p_session, p_label, p_status, p_note);
  else
    update struct_mandate_checks set status=p_status, note=p_note where id=idd;
  end if;
  insert into struct_events(org_id, session_id, kind, payload, created_by)
  values(p_org, p_session, 'mandate_check_set', jsonb_build_object('label',p_label,'status',p_status), auth.uid());
end $$;

-- Delegation upsert (edge)
create or replace function struct_upsert_deleg_edge(p_org uuid, p_session uuid, p_id uuid, p_from uuid, p_to uuid, p_permission text, p_note text)
returns uuid 
language plpgsql 
security definer 
set search_path = public
as $$
declare rid uuid := p_id;
begin
  if rid is null then
    insert into struct_deleg_edges(org_id, session_id, from_node, to_node, permission, note)
    values(p_org, p_session, p_from, p_to, p_permission, p_note) returning id into rid;
  else
    update struct_deleg_edges set from_node=p_from, to_node=p_to, permission=p_permission, note=p_note
    where id=rid and org_id=p_org and session_id=p_session;
  end if;
  return rid;
end $$;

-- Conformance toggle
create or replace function struct_set_conformance(p_org uuid, p_session uuid, p_check uuid, p_status text)
returns void 
language plpgsql 
security definer 
set search_path = public
as $$
begin
  update struct_conformance_checks set status=p_status, last_run=now()
  where id=p_check and org_id=p_org and session_id=p_session;
  insert into struct_events(org_id, session_id, kind, payload, created_by)
  values(p_org, p_session, 'conformance_set', jsonb_build_object('check_id',p_check,'status',p_status), auth.uid());
end $$;

-- Save compiled artifact
create or replace function struct_save_artifact(p_org uuid, p_session uuid, p_kind text, p_blob jsonb)
returns uuid 
language plpgsql 
security definer 
set search_path = public
as $$
declare aid uuid;
begin
  insert into struct_runtime_artifacts(org_id, session_id, kind, blob) values (p_org, p_session, p_kind, p_blob)
  returning id into aid;
  return aid;
end $$;

-- Publish Structural Dossier
create or replace function struct_publish_dossier(
  p_org uuid, p_session uuid, p_version text, p_title text, p_rationale text,
  p_lever_summary text, p_adoption_plan text, p_mesh_summary text, p_process_summary text,
  p_handoffs text[]
) returns uuid 
language plpgsql 
security definer 
set search_path = public
as $$
declare did uuid;
begin
  -- Precondition: no 'fail' in mandate checks
  if exists(select 1 from struct_mandate_checks m where m.org_id=p_org and m.session_id=p_session and m.status='fail') then
    raise exception 'Mandate check failure prevents publish';
  end if;

  insert into struct_dossiers(org_id, session_id, version, title, rationale, lever_summary, adoption_plan,
    mandate_path, mesh_summary, process_summary, standards_snapshot, market_snapshot, attachments, published_by)
  select
    p_org, p_session, p_version, p_title, p_rationale, p_lever_summary, p_adoption_plan,
    coalesce(jsonb_agg(jsonb_build_object('id',m.id,'label',m.label,'status',m.status,'note',m.note)) filter (where m.id is not null), '[]'::jsonb),
    p_mesh_summary, p_process_summary,
    coalesce(jsonb_agg(jsonb_build_object('id',st.id,'name',st.name,'version',st.version,'status',st.status)) filter (where st.id is not null), '[]'::jsonb),
    jsonb_build_object(
      'permits', coalesce((select jsonb_agg(jsonb_build_object('id',pm.id,'name',pm.name,'cap_rule',pm.cap_rule,'price_rule',pm.price_rule)) from struct_permits pm where pm.session_id=p_session and pm.org_id=p_org),'[]'::jsonb),
      'pricing', coalesce((select jsonb_agg(jsonb_build_object('id',pr.id,'label',pr.label)) from struct_pricing_rules pr where pr.session_id=p_session and pr.org_id=p_org),'[]'::jsonb),
      'auctions', coalesce((select jsonb_agg(jsonb_build_object('id',au.id,'name',au.name,'mechanism',au.mechanism)) from struct_auctions au where au.session_id=p_session and au.org_id=p_org),'[]'::jsonb)
    ),
    '[]'::jsonb,
    auth.uid()
  from struct_sessions s
  left join struct_mandate_checks m on m.session_id=s.id
  left join struct_standards st on st.session_id=s.id
  where s.id=p_session and s.org_id=p_org
  group by s.id
  returning id into did;

  update struct_sessions set status='resolved' where id=p_session and org_id=p_org;

  insert into struct_events(org_id, session_id, kind, payload, created_by)
  values(p_org, p_session, 'struct_dossier_published', jsonb_build_object('dossier_id', did, 'version', p_version), auth.uid());

  -- Optional handoffs queued
  if p_handoffs is not null then
    insert into struct_handoffs(org_id, session_id, to_capacity, task_id, payload)
    select p_org, p_session, x, null, jsonb_build_object('dossier_id', did) from unnest(p_handoffs) x;
  end if;

  return did;
end $$;

-- Create task for handoff destination
create or replace function struct_handoff_task(
  p_org uuid, p_session uuid, p_to text, p_title text, p_payload jsonb, p_due timestamptz
) returns uuid 
language plpgsql 
security definer 
set search_path = public
as $$
declare tid uuid;
begin
  insert into app_tasks_queue(org_id, capacity, title, payload, due_at, created_by)
  values (p_org, p_to, p_title, coalesce(p_payload,'{}'::jsonb), p_due, auth.uid())
  returning id into tid;

  insert into struct_handoffs(org_id, session_id, to_capacity, task_id, payload)
  values (p_org, p_session, p_to, tid, p_payload);

  insert into struct_events(org_id, session_id, kind, payload, created_by)
  values (p_org, p_session, 'handoff_task', jsonb_build_object('to',p_to,'task_id',tid), auth.uid());

  return tid;
end $$;