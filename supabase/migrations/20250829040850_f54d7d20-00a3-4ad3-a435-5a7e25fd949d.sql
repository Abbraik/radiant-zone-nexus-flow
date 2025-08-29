-- RPC: rre_create_loop_full(jsonb)
-- Creates a complete loop with all related artifacts in one atomic transaction
create or replace function public.rre_create_loop_full(p jsonb)
returns uuid
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_loop_id uuid;
  v_now timestamptz := now();
  v_valid_from timestamptz;
  v_expires_at timestamptz;
  v_user uuid := coalesce(auth.uid(), (select id from auth.users limit 1)); -- fallback
begin
  -- 1) loop
  insert into public.loops (name, description, loop_type, scale, domain, layer, metadata, loop_code, user_id, created_at, updated_at)
  values (
    p->'loop'->>'name',
    p->'loop'->>'description',
    coalesce(p->'loop'->>'type','reactive'),
    coalesce(p->'loop'->>'scale','micro'),
    p->'loop'->>'domain',
    p->'loop'->>'layer',
    coalesce(p->'loop'->'metadata','{}'::jsonb),
    p->'loop'->>'loop_code',
    v_user,
    v_now,
    v_now
  )
  returning id into v_loop_id;

  -- 2) indicators (upsert, bind to loop)
  insert into public.indicator_registry (indicator_key, loop_id, title, unit, triad_tag, notes, user_id)
  select i.indicator_key, v_loop_id, i.title, i.unit, i.triad_tag, i.notes, v_user
  from jsonb_to_recordset(coalesce(p->'indicators','[]'::jsonb))
    as i(indicator_key text, title text, unit text, triad_tag text, notes text)
  on conflict (indicator_key) do update
    set loop_id = excluded.loop_id,
        title   = excluded.title,
        unit    = excluded.unit,
        triad_tag = excluded.triad_tag,
        notes   = excluded.notes,
        updated_at = now();

  -- 3) sources
  insert into public.source_registry (name, type, provider, schedule_cron, schema_version, enabled, config, pii_class, user_id)
  select s.name, s.type, s.provider, s.schedule_cron, coalesce(s.schema_version,1), coalesce(s.enabled,true), coalesce(s.config,'{}'::jsonb), coalesce(s.pii_class,'none'), v_user
  from jsonb_to_recordset(coalesce(p->'sources','[]'::jsonb))
    as s(name text, type text, provider text, schedule_cron text, schema_version int, enabled boolean, config jsonb, pii_class text);

  -- 4) nodes
  with ins_nodes as (
    insert into public.loop_nodes (loop_id, label, kind, meta, user_id, created_at)
    select v_loop_id, n.label, n.kind, coalesce(n.meta,'{}'::jsonb), v_user, v_now
    from jsonb_to_recordset(coalesce(p->'nodes','[]'::jsonb))
      as n(label text, kind text, meta jsonb, pos jsonb)
    returning id, label
  )
  -- 5) edges
  insert into public.loop_edges (loop_id, from_node, to_node, polarity, delay_ms, weight, note, user_id, created_at)
  select v_loop_id, fn.id, tn.id, e.polarity, coalesce(e.delay_ms,0), coalesce(e.weight,1.0), e.note, v_user, v_now
  from jsonb_to_recordset(coalesce(p->'edges','[]'::jsonb))
    as e(from_label text, to_label text, polarity int, delay_ms int, weight numeric, note text)
  join ins_nodes fn on fn.label = e.from_label
  join ins_nodes tn on tn.label = e.to_label;

  -- 6) bands
  insert into public.de_bands (loop_id, indicator, lower_bound, upper_bound, asymmetry, smoothing_alpha, notes, user_id)
  select v_loop_id, b.indicator, b.lower_bound, b.upper_bound, coalesce(b.asymmetry,0), coalesce(b.smoothing_alpha,0.3), b.notes, v_user
  from jsonb_to_recordset(coalesce(p->'bands','[]'::jsonb))
    as b(indicator text, lower_bound numeric, upper_bound numeric, asymmetry numeric, smoothing_alpha numeric, notes text);

  -- 7) watchpoints
  insert into public.watchpoints (loop_id, indicator, direction, threshold_value, threshold_band, owner, armed, user_id, created_at, updated_at)
  select v_loop_id, w.indicator, w.direction, w.threshold_value, w.threshold_band, v_user, coalesce(w.armed,true), v_user, v_now, v_now
  from jsonb_to_recordset(coalesce(p->'watchpoints','[]'::jsonb))
    as w(indicator text, direction text, threshold_value numeric, threshold_band jsonb, armed boolean);

  -- 8) triggers
  insert into public.trigger_rules (name, condition, threshold, window_hours, action_ref, authority, consent_note, valid_from, expires_at, user_id, created_at)
  select t.name, t.condition, t.threshold, t.window_hours, t.action_ref, t.authority, t.consent_note,
         case when t.valid_from = 'now' then v_now else (t.valid_from)::timestamptz end,
         case when t.expires_at = 'in_180d' then v_now + interval '180 days' else (t.expires_at)::timestamptz end,
         v_user, v_now
  from jsonb_to_recordset(coalesce(p->'triggers','[]'::jsonb))
    as t(name text, condition text, threshold numeric, window_hours int, action_ref text, authority text, consent_note text, valid_from text, expires_at text);

  -- 9) TRI baseline
  insert into public.tri_snapshots (loop_id, as_of, trust, reciprocity, integrity, notes, user_id, created_at)
  values (
    v_loop_id,
    v_now,
    coalesce((p->'baselines'->>'trust')::numeric, 0.6),
    coalesce((p->'baselines'->>'reciprocity')::numeric, 0.6),
    coalesce((p->'baselines'->>'integrity')::numeric, 0.6),
    'Initial TRI baseline',
    v_user,
    v_now
  );

  -- 10) loop version snapshot
  insert into public.loop_versions (loop_id, version, payload, created_at)
  values (v_loop_id, 1, p, v_now);

  -- 11) reflex memory
  insert into public.reflex_memory (loop_id, before, after, reason, created_at, user_id)
  values (v_loop_id, '{}'::jsonb, p, coalesce(p->>'reflex_note','Loop created via RRE'), v_now, v_user);

  -- 12) optional task
  if coalesce((p->>'create_followup_task')::boolean, false) then
    insert into public.tasks_v2 (loop_id, capacity, template_key, status, priority, title, payload, open_route, created_by, created_at, due_at)
    values (v_loop_id, 'responsive', null, 'available', 3, 'Initial monitoring & review', '{}'::jsonb, '/tasks/responsive', v_user, v_now, v_now + interval '7 days');
  end if;

  -- 13) audit
  insert into public.audit_log (user_id, action, resource_type, resource_id, new_values, created_at)
  values (v_user, 'rre_create_loop_full', 'loop', v_loop_id::text, jsonb_build_object('loop_id', v_loop_id, 'payload', p), v_now);

  return v_loop_id;
end
$$;

grant execute on function public.rre_create_loop_full(jsonb) to authenticated;