-- Responsive capacity bundle tables for incidents and sprints
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

-- Create policies for incidents
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

-- Create policies for incident events
create policy "Users can manage their own incident events"
  on incident_events for all
  using (auth.uid() = user_id);

create table if not exists sprints (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  capacity text not null,        -- 'responsive'
  leverage text not null,        -- 'P'
  due_at timestamptz,
  guardrails jsonb,
  srt jsonb,
  status text not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table sprints enable row level security;

-- Create policies for sprints
create policy "Users can manage their own sprints"
  on sprints for all
  using (auth.uid() = user_id);

create table if not exists sprint_tasks (
  id uuid primary key default gen_random_uuid(),
  sprint_id uuid references sprints(id) on delete cascade,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  owner_id uuid references auth.users,
  status text not null default 'todo',
  meta jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table sprint_tasks enable row level security;

-- Create policies for sprint tasks
create policy "Users can manage their own sprint tasks"
  on sprint_tasks for all
  using (auth.uid() = user_id);

-- Create function to update timestamps
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for automatic timestamp updates
create trigger update_incidents_updated_at
  before update on incidents
  for each row
  execute function update_updated_at_column();

create trigger update_sprints_updated_at
  before update on sprints
  for each row
  execute function update_updated_at_column();

create trigger update_sprint_tasks_updated_at
  before update on sprint_tasks
  for each row
  execute function update_updated_at_column();