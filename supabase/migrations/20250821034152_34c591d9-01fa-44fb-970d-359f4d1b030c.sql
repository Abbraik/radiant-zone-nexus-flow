-- Anticipatory capacity tables
create table if not exists watchpoints (
  id uuid primary key default gen_random_uuid(),
  risk_channel text not null,
  loop_codes text[] not null,
  ews_prob numeric not null,
  confidence numeric,
  lead_time_days int,
  buffer_adequacy numeric,
  owner_id uuid,
  status text not null default 'armed',
  review_at timestamptz not null,
  notes text,
  user_id uuid not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table watchpoints enable row level security;

-- Create policies
create policy "Users can manage their own watchpoints" 
on watchpoints 
for all 
using (auth.uid() = user_id);

create table if not exists scenario_results (
  id uuid primary key default gen_random_uuid(),
  scenario_id text not null,
  with_mitigation_breach_prob numeric not null,
  without_mitigation_breach_prob numeric not null,
  mitigation_delta numeric not null,
  affected_loops text[] not null,
  notes text,
  user_id uuid not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table scenario_results enable row level security;

-- Create policies
create policy "Users can manage their own scenario results" 
on scenario_results 
for all 
using (auth.uid() = user_id);

create table if not exists pre_position_orders (
  id uuid primary key default gen_random_uuid(),
  kind text not null,     -- 'resource' | 'regulatory' | 'comms'
  items jsonb not null,
  suppliers text[],
  sla text,
  cost_ceiling numeric,
  shelf_life_days int,
  cancel_by timestamptz,
  status text not null default 'draft',
  user_id uuid not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table pre_position_orders enable row level security;

-- Create policies
create policy "Users can manage their own pre position orders" 
on pre_position_orders 
for all 
using (auth.uid() = user_id);

create table if not exists trigger_rules (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  condition text not null,
  threshold numeric not null,
  window_hours int not null,
  action_ref text not null,
  authority text not null,
  consent_note text,
  valid_from timestamptz not null,
  expires_at timestamptz not null,
  user_id uuid not null,
  created_at timestamptz default now()
);

-- Enable RLS
alter table trigger_rules enable row level security;

-- Create policies
create policy "Users can manage their own trigger rules" 
on trigger_rules 
for all 
using (auth.uid() = user_id);