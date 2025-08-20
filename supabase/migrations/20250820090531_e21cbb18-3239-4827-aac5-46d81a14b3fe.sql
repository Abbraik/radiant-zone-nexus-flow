-- Responsive capacity bundle tables for incidents (if not exists)
create table if not exists incidents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  loop_code text not null,
  indicator text not null,
  started_at timestamptz not null default now(),
  severity numeric not null,
  srt jsonb not null,
  guardrails jsonb,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table incidents enable row level security;

-- Create policies for incidents (drop if exists first)
drop policy if exists "Users can manage their own incidents" on incidents;
create policy "Users can manage their own incidents"
  on incidents for all
  using (auth.uid() = user_id);

create table if not exists incident_events (
  id uuid primary key default gen_random_uuid(),
  incident_id uuid references incidents(id) on delete cascade,
  user_id uuid references auth.users not null,
  at timestamptz not null default now(),
  kind text not null,
  payload jsonb not null,
  created_at timestamptz not null default now()
);

-- Enable RLS
alter table incident_events enable row level security;

-- Create policies for incident events (drop if exists first)
drop policy if exists "Users can manage their own incident events" on incident_events;
create policy "Users can manage their own incident events"
  on incident_events for all
  using (auth.uid() = user_id);