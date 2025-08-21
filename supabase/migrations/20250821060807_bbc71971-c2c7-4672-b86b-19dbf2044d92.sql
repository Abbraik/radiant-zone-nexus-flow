-- STRUCTURAL SESSIONS (workspace instance)
create table if not exists struct_sessions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  loop_code text not null,                   -- e.g., MAC-L04, MES-L11
  mission text,                              -- short framing
  status text not null default 'draft' check (status in ('draft','in_review','resolved','archived')),
  created_by uuid not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function _touch_struct_updated() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger _touch_struct_sessions before update on struct_sessions for each row execute function _touch_struct_updated();

-- 🔹 Mandate Gate
create table if not exists struct_authority_sources (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references struct_sessions(id) on delete cascade,
  label text not null,
  type text not null check (type in ('statute','regulation','order','moa','budget_rule')),
  status text not null check (status in ('exists','draft','needed')),
  note text,
  link text
);

create table if not exists struct_budget_envelopes (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references struct_sessions(id) on delete cascade,
  label text not null,
  currency text not null default 'USD',
  amount numeric not null,
  window_from date,
  window_to date,
  status text not null check (status in ('available','constrained','blocked')),
  note text
);

create table if not exists struct_deleg_nodes (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references struct_sessions(id) on delete cascade,
  label text not null,
  kind text not null check (kind in ('ministry','agency','council','zcu','elu','pmu')),
  role text check (role in ('owner','controller','operator','auditor'))
);

create table if not exists struct_deleg_edges (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references struct_sessions(id) on delete cascade,
  from_node uuid not null references struct_deleg_nodes(id) on delete cascade,
  to_node uuid not null references struct_deleg_nodes(id) on delete cascade,
  right text not null check (right in ('decide','approve','coordinate','data_access','budget')),
  note text
);

create table if not exists struct_mandate_checks (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references struct_sessions(id) on delete cascade,
  label text not null,
  status text not null check (status in ('ok','risk','fail')),
  note text
);

-- 🔹 Mesh Planner (metrics & issues)
create table if not exists struct_mesh_metrics (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references struct_sessions(id) on delete cascade,
  label text not null,
  value numeric not null,
  unit text
);

create table if not exists struct_mesh_issues (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references struct_sessions(id) on delete cascade,
  label text not null,
  severity text not null check (severity in ('low','med','high')),
  loop_refs text[],
  note text
);

-- 🔹 Process Studio
create table if not exists struct_process_steps (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references struct_sessions(id) on delete cascade,
  label text not null,
  kind text not null check (kind in ('gate','review','sla','checkpoint')),
  latency_days_target int,
  variance_target_pct numeric,
  triage_rule text
);

create table if not exists struct_process_slas (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references struct_sessions(id) on delete cascade,
  step_id uuid not null references struct_process_steps(id) on delete cascade,
  kpi text not null,
  target text not null
);

create table if not exists struct_process_raci (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references struct_sessions(id) on delete cascade,
  step_id uuid not null references struct_process_steps(id) on delete cascade,
  actor_id uuid not null references struct_deleg_nodes(id) on delete cascade,
  role text not null check (role in ('R','A','C','I'))
);

-- Optional telemetry to power charts
create table if not exists struct_process_latency_hist (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references struct_sessions(id) on delete cascade,
  label text not null,        -- "0–5d"
  value int not null
);

create table if not exists struct_process_variance_series (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references struct_sessions(id) on delete cascade,
  t date not null,
  v numeric not null
);

-- 🔹 Standards & Interop Forge
create table if not exists struct_standards (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references struct_sessions(id) on delete cascade,
  name text not null,
  kind text not null check (kind in ('schema','api','mrv','procurement')),
  version text not null,
  status text not null check (status in ('draft','proposed','adopted','deprecated')),
  owner_node_id uuid references struct_deleg_nodes(id) on delete set null,
  summary text
);

create table if not exists struct_conformance_checks (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references struct_sessions(id) on delete cascade,
  standard_id uuid not null references struct_standards(id) on delete cascade,
  actor_id uuid not null references struct_deleg_nodes(id) on delete cascade,
  status text not null check (status in ('pass','warn','fail')),
  last_run timestamptz,
  note text
);

create table if not exists struct_conformance_runs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references struct_sessions(id) on delete cascade,
  run_at timestamptz not null default now(),
  stats jsonb
);

-- 🔹 Market Design Lab
create table if not exists struct_permits (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references struct_sessions(id) on delete cascade,
  name text not null,
  cap_rule text,
  price_rule text,
  mrv_standard_id uuid references struct_standards(id) on delete set null
);

create table if not exists struct_pricing_rules (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references struct_sessions(id) on delete cascade,
  label text not null,
  formula text not null
);

create table if not exists struct_auctions (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references struct_sessions(id) on delete cascade,
  name text not null,
  mechanism text not null check (mechanism in ('uniform_price','pay_as_bid','vcg')),
  lot_size text,
  reserve_price numeric
);

-- 🔹 Dossier, events, handoffs, artifacts
create table if not exists struct_dossiers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references struct_sessions(id) on delete cascade,
  version text not null,
  title text not null,
  rationale text not null,
  lever_summary text not null,
  adoption_plan text not null,
  mandate_path jsonb not null,
  mesh_summary text not null,
  process_summary text not null,
  standards_snapshot jsonb not null,
  market_snapshot jsonb not null,
  attachments jsonb,
  published_by uuid not null,
  published_at timestamptz not null default now()
);

create table if not exists struct_events (
  id bigserial primary key,
  org_id uuid not null,
  session_id uuid not null references struct_sessions(id) on delete cascade,
  kind text not null,
  payload jsonb,
  created_by uuid,
  created_at timestamptz not null default now()
);

create table if not exists struct_handoffs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references struct_sessions(id) on delete cascade,
  to_capacity text not null check (to_capacity in ('responsive','reflexive','deliberative','anticipatory')),
  task_id uuid,
  payload jsonb,
  created_at timestamptz not null default now()
);

create table if not exists struct_runtime_artifacts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null,
  session_id uuid not null references struct_sessions(id) on delete cascade,
  kind text not null check (kind in ('market_compiled','standards_map','process_map')),
  blob jsonb not null,
  created_at timestamptz not null default now()
);

-- Helpful indexes
create index if not exists idx_struct_sessions_org on struct_sessions(org_id, created_at desc);
create index if not exists idx_struct_mandate_checks on struct_mandate_checks(session_id);
create index if not exists idx_struct_standards on struct_standards(session_id, status);
create index if not exists idx_struct_conformance_checks on struct_conformance_checks(session_id, status);
create index if not exists idx_struct_process_steps on struct_process_steps(session_id);
create index if not exists idx_struct_market_all on struct_permits(session_id);