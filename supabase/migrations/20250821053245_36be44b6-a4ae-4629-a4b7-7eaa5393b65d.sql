-- Deliberative Core Schema Migration (Fixed)
-- Reuse role_enum ('operator','controller','owner') if present
-- Reuse assert_owner(p_org) if present; otherwise omit those calls in RPCs

-- ============== Core decision session ==============
create table if not exists delib_sessions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  loop_code text not null,            -- context loop (e.g., MAC-L04)
  mission text,                       -- short problem framing
  status text not null default 'draft' check (status in ('draft','in_review','resolved','archived')),
  activation_vector jsonb,            -- snapshot from signal/capacity router at intake
  created_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Criteria (weights must sum to 1 per session)
create table if not exists delib_criteria (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references delib_sessions(id) on delete cascade,
  label text not null,
  description text,
  weight numeric not null check (weight >= 0 and weight <= 1),
  direction text not null check (direction in ('maximize','minimize')),
  scale_hint text,                    -- '0-1','percent','score'
  order_index int not null default 0,
  created_at timestamptz default now()
);

-- Options / candidates
create table if not exists delib_options (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references delib_sessions(id) on delete cascade,
  name text not null,
  synopsis text,
  tags text[],
  costs jsonb,                        -- {capex, opex}
  latency_days int,
  authority_flag text check (authority_flag in ('ok','review','blocked')),
  equity_note text,
  created_at timestamptz default now()
);

-- Score matrix (normalized 0..1)
create table if not exists delib_scores (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references delib_sessions(id) on delete cascade,
  option_id uuid not null references delib_options(id) on delete cascade,
  criterion_id uuid not null references delib_criteria(id) on delete cascade,
  score numeric not null check (score >= 0 and score <= 1),
  evidence_refs text[],
  unique (session_id, option_id, criterion_id)
);

-- Scenarios (reference Anticipatory or local stubs)
create table if not exists delib_scenarios (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references delib_sessions(id) on delete cascade,
  antic_scenario_id text,             -- optional FK to antic_scenarios(id)
  name text not null,
  summary text,
  created_at timestamptz default now()
);

-- Option outcome per scenario (0..1 normalized effectiveness; positive is better)
create table if not exists delib_scenario_outcomes (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references delib_sessions(id) on delete cascade,
  option_id uuid not null references delib_options(id) on delete cascade,
  scenario_id uuid not null references delib_scenarios(id) on delete cascade,
  outcome_score numeric not null check (outcome_score >= 0 and outcome_score <= 1),
  risk_delta numeric,                 -- optional +worse / -better
  unique (session_id, option_id, scenario_id)
);

-- Hard constraints toggles
create table if not exists delib_constraints (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references delib_sessions(id) on delete cascade,
  label text not null,
  active boolean not null default true
);

-- Frontier points (computed)
create table if not exists delib_frontier (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references delib_sessions(id) on delete cascade,
  label text,
  option_ids uuid[] not null,
  risk numeric not null,
  cost numeric not null,
  equity numeric not null,
  regret_worst numeric,
  feasible boolean not null default true,
  created_at timestamptz default now()
);

-- Mandate, guardrails, participation
create table if not exists delib_mandate_checks (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references delib_sessions(id) on delete cascade,
  label text not null,
  status text not null check (status in ('ok','risk','fail')),
  note text
);

create table if not exists delib_guardrails (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references delib_sessions(id) on delete cascade,
  label text not null,
  kind text not null check (kind in ('cap','timebox','checkpoint')),
  value text,
  required boolean not null default false,
  selected boolean not null default false
);

create table if not exists delib_participation (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references delib_sessions(id) on delete cascade,
  label text not null,
  audience text,
  date timestamptz,
  status text not null default 'planned' check (status in ('planned','done','skipped'))
);

-- Decision Dossier (versioned ADR)
create table if not exists delib_dossiers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references delib_sessions(id) on delete cascade,
  version text not null,              -- e.g., "1.0.0"
  title text not null,
  decision_summary text not null,
  selected_option_ids uuid[] not null,
  rejected_option_ids uuid[] not null,
  tradeoff_notes text,
  robustness_notes text,
  guardrails jsonb,                   -- snapshot of delib_guardrails
  mandate_path jsonb,                 -- snapshot of delib_mandate_checks
  participation_plan jsonb,           -- snapshot of delib_participation
  handoffs text[] not null,           -- ['responsive','structural','reflexive']
  published_by uuid not null,
  published_at timestamptz not null default now()
);

-- Audit trail
create table if not exists delib_events (
  id bigserial primary key,
  org_id uuid not null,
  session_id uuid not null references delib_sessions(id) on delete cascade,
  kind text not null,                 -- 'score_updated','weights_changed','frontier_built','dossier_published','handoff'
  payload jsonb,
  created_by uuid,
  created_at timestamptz default now()
);

-- Handoffs recorded
create table if not exists delib_handoffs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references delib_sessions(id) on delete cascade,
  to_capacity text not null check (to_capacity in ('responsive','structural','reflexive')),
  task_id uuid,
  payload jsonb,
  created_at timestamptz default now()
);

-- housekeeping
create or replace function _touch_delib_updated() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger _touch_delib_sessions before update on delib_sessions for each row execute function _touch_delib_updated();

-- Helpful indexes
create index if not exists idx_delib_sessions_org on delib_sessions(org_id, created_at desc);
create index if not exists idx_delib_criteria_sess on delib_criteria(session_id);
create index if not exists idx_delib_options_sess on delib_options(session_id);
create index if not exists idx_delib_scores_sess on delib_scores(session_id, option_id, criterion_id);
create index if not exists idx_delib_scenarios_sess on delib_scenarios(session_id);
create index if not exists idx_delib_outcomes_sess on delib_scenario_outcomes(session_id, scenario_id);
create index if not exists idx_delib_frontier_sess on delib_frontier(session_id, created_at desc);
create index if not exists idx_delib_dossiers_sess on delib_dossiers(session_id, published_at desc);

-- RLS policies
alter table delib_sessions        enable row level security;
alter table delib_criteria        enable row level security;
alter table delib_options         enable row level security;
alter table delib_scores          enable row level security;
alter table delib_scenarios       enable row level security;
alter table delib_scenario_outcomes enable row level security;
alter table delib_constraints     enable row level security;
alter table delib_frontier        enable row level security;
alter table delib_mandate_checks  enable row level security;
alter table delib_guardrails      enable row level security;
alter table delib_participation   enable row level security;
alter table delib_dossiers        enable row level security;
alter table delib_events          enable row level security;
alter table delib_handoffs        enable row level security;

-- Create view for current user org context
create or replace view v_me as
select auth.uid() as user_id, auth.uid() as org_id, 'owner'::text as role;

-- Read policies: everyone in same org
create policy "org_read_delib_sessions" on delib_sessions for select using (org_id = (select org_id from v_me));
create policy "org_read_delib_criteria" on delib_criteria for select using (org_id = (select org_id from v_me));
create policy "org_read_delib_options" on delib_options for select using (org_id = (select org_id from v_me));
create policy "org_read_delib_scores" on delib_scores for select using (org_id = (select org_id from v_me));
create policy "org_read_delib_scenarios" on delib_scenarios for select using (org_id = (select org_id from v_me));
create policy "org_read_delib_scenario_outcomes" on delib_scenario_outcomes for select using (org_id = (select org_id from v_me));
create policy "org_read_delib_constraints" on delib_constraints for select using (org_id = (select org_id from v_me));
create policy "org_read_delib_frontier" on delib_frontier for select using (org_id = (select org_id from v_me));
create policy "org_read_delib_mandate_checks" on delib_mandate_checks for select using (org_id = (select org_id from v_me));
create policy "org_read_delib_guardrails" on delib_guardrails for select using (org_id = (select org_id from v_me));
create policy "org_read_delib_participation" on delib_participation for select using (org_id = (select org_id from v_me));
create policy "org_read_delib_dossiers" on delib_dossiers for select using (org_id = (select org_id from v_me));
create policy "org_read_delib_events" on delib_events for select using (org_id = (select org_id from v_me));
create policy "org_read_delib_handoffs" on delib_handoffs for select using (org_id = (select org_id from v_me));

-- Write policies: controller+ (simplified to owner for now)
create policy "org_write_delib_sessions" on delib_sessions for insert with check (org_id = (select org_id from v_me) and (select role from v_me) in ('owner'));
create policy "org_update_delib_sessions" on delib_sessions for update using (org_id = (select org_id from v_me) and (select role from v_me) in ('owner'));

create policy "org_write_delib_criteria" on delib_criteria for insert with check (org_id = (select org_id from v_me) and (select role from v_me) in ('owner'));
create policy "org_update_delib_criteria" on delib_criteria for update using (org_id = (select org_id from v_me) and (select role from v_me) in ('owner'));

create policy "org_write_delib_options" on delib_options for insert with check (org_id = (select org_id from v_me) and (select role from v_me) in ('owner'));
create policy "org_update_delib_options" on delib_options for update using (org_id = (select org_id from v_me) and (select role from v_me) in ('owner'));

create policy "org_write_delib_scores" on delib_scores for insert with check (org_id = (select org_id from v_me) and (select role from v_me) in ('owner'));
create policy "org_update_delib_scores" on delib_scores for update using (org_id = (select org_id from v_me) and (select role from v_me) in ('owner'));

create policy "org_write_delib_scenarios" on delib_scenarios for insert with check (org_id = (select org_id from v_me) and (select role from v_me) in ('owner'));
create policy "org_update_delib_scenarios" on delib_scenarios for update using (org_id = (select org_id from v_me) and (select role from v_me) in ('owner'));

create policy "org_write_delib_scenario_outcomes" on delib_scenario_outcomes for insert with check (org_id = (select org_id from v_me) and (select role from v_me) in ('owner'));
create policy "org_update_delib_scenario_outcomes" on delib_scenario_outcomes for update using (org_id = (select org_id from v_me) and (select role from v_me) in ('owner'));

create policy "org_write_delib_constraints" on delib_constraints for insert with check (org_id = (select org_id from v_me) and (select role from v_me) in ('owner'));
create policy "org_update_delib_constraints" on delib_constraints for update using (org_id = (select org_id from v_me) and (select role from v_me) in ('owner'));

create policy "org_write_delib_frontier" on delib_frontier for insert with check (org_id = (select org_id from v_me) and (select role from v_me) in ('owner'));

create policy "org_write_delib_mandate_checks" on delib_mandate_checks for insert with check (org_id = (select org_id from v_me) and (select role from v_me) in ('owner'));
create policy "org_update_delib_mandate_checks" on delib_mandate_checks for update using (org_id = (select org_id from v_me) and (select role from v_me) in ('owner'));

create policy "org_write_delib_guardrails" on delib_guardrails for insert with check (org_id = (select org_id from v_me) and (select role from v_me) in ('owner'));
create policy "org_update_delib_guardrails" on delib_guardrails for update using (org_id = (select org_id from v_me) and (select role from v_me) in ('owner'));

create policy "org_write_delib_participation" on delib_participation for insert with check (org_id = (select org_id from v_me) and (select role from v_me) in ('owner'));
create policy "org_update_delib_participation" on delib_participation for update using (org_id = (select org_id from v_me) and (select role from v_me) in ('owner'));

create policy "org_write_delib_dossiers" on delib_dossiers for insert with check (org_id = (select org_id from v_me) and (select role from v_me) in ('owner'));

create policy "org_write_delib_events" on delib_events for insert with check (org_id = (select org_id from v_me) and (select role from v_me) in ('owner'));
create policy "org_write_delib_handoffs" on delib_handoffs for insert with check (org_id = (select org_id from v_me) and (select role from v_me) in ('owner'));

-- Views for fast reads (FIXED)
create or replace view delib_mcda_totals as
select
  s.org_id, s.session_id, s.id as option_id,
  sum(
    case when c.direction='maximize' then (sc.score * c.weight)
         else ((1 - sc.score) * c.weight) end
  ) as total
from delib_scores sc
join delib_criteria c on c.id = sc.criterion_id
join delib_options s on s.id = sc.option_id
group by s.org_id, s.session_id, s.id;

-- latest dossier per session
create or replace view delib_latest_dossier as
select distinct on (session_id)
  session_id, id as dossier_id, version, title, published_at
from delib_dossiers
order by session_id, published_at desc;

-- Create RPC functions

-- Create a session
create or replace function delib_create_session(
  p_org uuid, p_loop text, p_mission text, p_activation_vector jsonb
) returns uuid language plpgsql security definer as $$
declare sid uuid;
begin
  insert into delib_sessions(org_id, loop_code, mission, activation_vector, created_by)
  values (p_org, p_loop, p_mission, p_activation_vector, auth.uid())
  returning id into sid;
  return sid;
end $$;

-- Upsert criterion (id optional)
create or replace function delib_upsert_criterion(
  p_org uuid, p_session uuid,
  p_id uuid, p_label text, p_desc text, p_weight numeric, p_direction text, p_scale text, p_order int
) returns uuid language plpgsql security definer as $$
declare cid uuid := p_id;
begin
  if cid is null then
    insert into delib_criteria(org_id, session_id, label, description, weight, direction, scale_hint, order_index)
    values (p_org, p_session, p_label, p_desc, p_weight, p_direction, p_scale, coalesce(p_order,0))
    returning id into cid;
  else
    update delib_criteria set label=p_label, description=p_desc, weight=p_weight, direction=p_direction,
      scale_hint=p_scale, order_index=coalesce(p_order, order_index)
    where id=cid and org_id=p_org and session_id=p_session;
  end if;
  return cid;
end $$;

-- Upsert option
create or replace function delib_upsert_option(
  p_org uuid, p_session uuid, p_id uuid,
  p_name text, p_synopsis text, p_tags text[], p_costs jsonb, p_latency int, p_authority text, p_equity_note text
) returns uuid language plpgsql security definer as $$
declare oid uuid := p_id;
begin
  if oid is null then
    insert into delib_options(org_id, session_id, name, synopsis, tags, costs, latency_days, authority_flag, equity_note)
    values (p_org, p_session, p_name, p_synopsis, p_tags, p_costs, p_latency, p_authority, p_equity_note)
    returning id into oid;
  else
    update delib_options set name=p_name, synopsis=p_synopsis, tags=p_tags, costs=p_costs, latency_days=p_latency,
      authority_flag=p_authority, equity_note=p_equity_note
    where id=oid and org_id=p_org and session_id=p_session;
  end if;
  return oid;
end $$;

-- Upsert score cell
create or replace function delib_set_score(
  p_org uuid, p_session uuid, p_option uuid, p_criterion uuid, p_score numeric, p_evidence text[]
) returns void language plpgsql security definer as $$
begin
  insert into delib_scores(org_id, session_id, option_id, criterion_id, score, evidence_refs)
  values(p_org, p_session, p_option, p_criterion, p_score, p_evidence)
  on conflict (session_id, option_id, criterion_id) do update set score=excluded.score, evidence_refs=excluded.evidence_refs;
  insert into delib_events(org_id, session_id, kind, payload, created_by)
  values (p_org, p_session, 'score_updated', jsonb_build_object('option',p_option,'criterion',p_criterion,'score',p_score), auth.uid());
end $$;

-- Toggle constraint
create or replace function delib_toggle_constraint(p_org uuid, p_session uuid, p_label text, p_active boolean)
returns void language plpgsql security definer as $$
declare cid uuid;
begin
  select id into cid from delib_constraints where org_id=p_org and session_id=p_session and label=p_label;
  if cid is null then
    insert into delib_constraints(org_id, session_id, label, active) values(p_org, p_session, p_label, p_active);
  else
    update delib_constraints set active=p_active where id=cid;
  end if;
end $$;

-- Save frontier point
create or replace function delib_save_frontier_point(
  p_org uuid, p_session uuid, p_label text, p_option_ids uuid[], p_risk numeric, p_cost numeric, p_equity numeric, p_regret numeric, p_feasible boolean
) returns uuid language plpgsql security definer as $$
declare fid uuid;
begin
  insert into delib_frontier(org_id, session_id, label, option_ids, risk, cost, equity, regret_worst, feasible)
  values (p_org, p_session, p_label, p_option_ids, p_risk, p_cost, p_equity, p_regret, coalesce(p_feasible,true))
  returning id into fid;
  insert into delib_events(org_id, session_id, kind, payload, created_by)
  values (p_org, p_session, 'frontier_built', jsonb_build_object('label',p_label), auth.uid());
  return fid;
end $$;

-- Mandate, guardrails, participation updates
create or replace function delib_set_mandate(p_org uuid, p_session uuid, p_label text, p_status text, p_note text)
returns void language plpgsql security definer as $$
declare mid uuid;
begin
  select id into mid from delib_mandate_checks where org_id=p_org and session_id=p_session and label=p_label;
  if mid is null then
    insert into delib_mandate_checks(org_id, session_id, label, status, note) values(p_org, p_session, p_label, p_status, p_note);
  else
    update delib_mandate_checks set status=p_status, note=p_note where id=mid;
  end if;
end $$;

create or replace function delib_set_guardrail(p_org uuid, p_session uuid, p_label text, p_kind text, p_value text, p_required boolean, p_selected boolean)
returns void language plpgsql security definer as $$
declare gid uuid;
begin
  select id into gid from delib_guardrails where org_id=p_org and session_id=p_session and label=p_label;
  if gid is null then
    insert into delib_guardrails(org_id, session_id, label, kind, value, required, selected)
    values(p_org, p_session, p_label, p_kind, p_value, p_required, p_selected);
  else
    update delib_guardrails set kind=p_kind, value=p_value, required=p_required, selected=p_selected where id=gid;
  end if;
end $$;

create or replace function delib_set_participation(p_org uuid, p_session uuid, p_label text, p_audience text, p_date timestamptz, p_status text)
returns void language plpgsql security definer as $$
declare pid uuid;
begin
  select id into pid from delib_participation where org_id=p_org and session_id=p_session and label=p_label;
  if pid is null then
    insert into delib_participation(org_id, session_id, label, audience, date, status)
    values (p_org, p_session, p_label, p_audience, p_date, p_status);
  else
    update delib_participation set audience=p_audience, date=p_date, status=p_status where id=pid;
  end if;
end $$;

-- Publish dossier (ADR)
create or replace function delib_publish_dossier(
  p_org uuid, p_session uuid, p_version text,
  p_title text, p_summary text, p_selected uuid[], p_rejected uuid[],
  p_trade text, p_robust text, p_handoffs text[]
) returns uuid language plpgsql security definer as $$
declare did uuid;
begin
  insert into delib_dossiers(org_id, session_id, version, title, decision_summary,
    selected_option_ids, rejected_option_ids, tradeoff_notes, robustness_notes,
    guardrails, mandate_path, participation_plan, handoffs, published_by)
  select
    p_org, p_session, p_version, p_title, p_summary, p_selected, p_rejected, p_trade, p_robust,
    coalesce(jsonb_agg(jsonb_build_object('id',g.id,'label',g.label,'kind',g.kind,'value',g.value,'required',g.required,'selected',g.selected)) filter (where g.id is not null), '[]'::jsonb),
    coalesce(jsonb_agg(jsonb_build_object('id',m.id,'label',m.label,'status',m.status,'note',m.note)) filter (where m.id is not null), '[]'::jsonb),
    coalesce(jsonb_agg(jsonb_build_object('id',p.id,'label',p.label,'audience',p.audience,'date',p.date,'status',p.status)) filter (where p.id is not null), '[]'::jsonb),
    p_handoffs,
    auth.uid()
  from delib_sessions s
  left join delib_guardrails g   on g.session_id = s.id
  left join delib_mandate_checks m on m.session_id = s.id
  left join delib_participation p on p.session_id = s.id
  where s.id = p_session and s.org_id = p_org
  group by s.id
  returning id into did;

  insert into delib_events(org_id, session_id, kind, payload, created_by)
  values (p_org, p_session, 'dossier_published', jsonb_build_object('dossier_id', did, 'version', p_version), auth.uid());

  update delib_sessions set status='resolved' where id=p_session and org_id=p_org;
  return did;
end $$;

-- Handoff: insert queue task and record
create or replace function delib_handoff(
  p_org uuid, p_session uuid, p_to text, p_title text, p_payload jsonb, p_due timestamptz
) returns uuid language plpgsql security definer as $$
declare tid uuid;
begin
  insert into app_tasks_queue(org_id, capacity, title, payload, due_at, created_by)
  values (p_org, p_to, p_title, coalesce(p_payload,'{}'::jsonb), p_due, auth.uid())
  returning id into tid;

  insert into delib_handoffs(org_id, session_id, to_capacity, task_id, payload)
  values (p_org, p_session, p_to, tid, p_payload);

  insert into delib_events(org_id, session_id, kind, payload, created_by)
  values (p_org, p_session, 'handoff', jsonb_build_object('to',p_to,'task_id',tid), auth.uid());

  return tid;
end $$;