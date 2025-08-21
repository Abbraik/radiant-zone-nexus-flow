-- Organizations & roles (create enum if not exists)
create type role_enum as enum ('operator','controller','owner');

-- ---------- Anticipatory Core ----------
create table if not exists antic_watchpoints (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  loop_codes text[] not null,
  risk_channel text not null,
  ews_prob numeric not null check (ews_prob >= 0 and ews_prob <= 1),
  confidence numeric,
  lead_time_days int,
  buffer_adequacy numeric,
  status text not null default 'armed' check (status in ('armed','on_hold','expired')),
  review_at timestamptz not null,
  notes text,
  created_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists antic_trigger_rules (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  name text not null,
  -- stored expression as normalized JSON AST (compiled by function), and original human expression
  expr_raw text not null,
  expr_ast jsonb not null,
  window_hours int not null,
  action_ref text not null,
  authority text not null,
  consent_note text,
  valid_from timestamptz not null,
  expires_at timestamptz not null,
  created_by uuid not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists antic_trigger_firings (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  rule_id uuid not null references antic_trigger_rules(id) on delete cascade,
  fired_at timestamptz not null default now(),
  matched_payload jsonb not null,
  activation_event_id uuid,
  created_at timestamptz default now()
);

create table if not exists antic_activation_events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  kind text not null check (kind in ('pre_activate','activate','route_responsive','route_deliberative','route_structural')),
  source text not null, -- e.g., 'trigger:rule_id', 'manual'
  loop_code text,
  indicator text,
  payload jsonb,
  created_by uuid,
  created_at timestamptz default now()
);

create table if not exists antic_pre_position_orders (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  kind text not null check (kind in ('resource','regulatory','comms')),
  title text not null,
  items jsonb not null, -- [{key,label,qty,unit}]
  suppliers text[],
  sla text,
  cost_ceiling numeric,
  readiness_score numeric,
  shelf_life_days int,
  status text not null default 'draft' check (status in ('draft','armed','canceled','expired')),
  created_by uuid not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists antic_scenarios (
  id text primary key,
  org_id uuid not null,
  name text not null,
  assumptions jsonb not null, -- domain params
  target_loops text[] not null,
  created_by uuid not null,
  created_at timestamptz default now()
);

create table if not exists antic_scenario_results (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  scenario_id text not null references antic_scenarios(id) on delete cascade,
  with_mitigation_breach_prob numeric not null,
  without_mitigation_breach_prob numeric not null,
  mitigation_delta numeric not null,
  affected_loops text[] not null,
  notes text,
  created_by uuid,
  created_at timestamptz default now()
);

create table if not exists antic_backtests (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  rule_id uuid not null references antic_trigger_rules(id) on delete cascade,
  horizon text not null, -- e.g., 'P180D'
  metrics jsonb not null, -- { auc, precision, recall, f1 }
  points jsonb not null,  -- [{t, fired, breach, score}]
  created_by uuid,
  created_at timestamptz default now()
);

-- Optional: EWS components & buffer gauges & geo cells (for Watchboard)
create table if not exists antic_ews_components (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  loop_code text not null,
  label text not null,
  weight numeric not null,
  series jsonb not null, -- [{t,v}]
  created_at timestamptz default now()
);

create table if not exists antic_buffers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  label text not null,
  current numeric not null,
  target numeric not null,
  history jsonb, -- [{t,v}]
  created_at timestamptz default now()
);

create table if not exists antic_geo_sentinels (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  cell_id text not null,
  label text,
  value numeric not null,
  created_at timestamptz default now()
);

-- Queue table for cross-capacity tasks (if not already present)
create table if not exists app_tasks_queue (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  capacity text not null,
  title text not null,
  payload jsonb not null,
  due_at timestamptz,
  created_by uuid,
  created_at timestamptz default now(),
  status text not null default 'pending'
);

-- Indicator readings (if missing): used by trigger eval/backtests (simplified)
create table if not exists indicator_readings (
  id bigserial primary key,
  org_id uuid not null,
  loop_code text not null,
  indicator text not null,
  t timestamptz not null,
  value numeric not null,
  lower numeric,
  upper numeric,
  unique(org_id, loop_code, indicator, t)
);

-- housekeeping
create or replace function touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;

create trigger _touch_watchpoints before update on antic_watchpoints for each row execute function touch_updated_at();
create trigger _touch_prepos before update on antic_pre_position_orders for each row execute function touch_updated_at();

-- helpful indexes
create index if not exists idx_indicator_readings_lookup on indicator_readings(org_id, loop_code, indicator, t desc);
create index if not exists idx_trigger_rules_valid on antic_trigger_rules(org_id, valid_from, expires_at);
create index if not exists idx_watchpoints_status on antic_watchpoints(org_id, status);
create index if not exists idx_activation_events_org on antic_activation_events(org_id, created_at desc);
create index if not exists idx_backtests_rule on antic_backtests(org_id, rule_id);