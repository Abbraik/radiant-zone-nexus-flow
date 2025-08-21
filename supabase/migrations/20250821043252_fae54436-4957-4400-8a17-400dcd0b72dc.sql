-- Enable RLS on all anticipatory tables
alter table antic_watchpoints enable row level security;
alter table antic_trigger_rules enable row level security;
alter table antic_trigger_firings enable row level security;
alter table antic_activation_events enable row level security;
alter table antic_pre_position_orders enable row level security;
alter table antic_scenarios enable row level security;
alter table antic_scenario_results enable row level security;
alter table antic_backtests enable row level security;
alter table antic_ews_components enable row level security;
alter table antic_buffers enable row level security;
alter table antic_geo_sentinels enable row level security;
alter table app_tasks_queue enable row level security;
alter table indicator_readings enable row level security;

-- Create a security definer function to get current user role
create or replace function public.get_current_user_role()
returns text
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(
    (select role::text from user_roles where user_id = auth.uid() limit 1),
    'user'
  );
$$;

-- Create a security definer function to get current user org
create or replace function public.get_current_user_org()
returns uuid
language sql
security definer
stable
set search_path = public
as $$
  select coalesce(
    (select org_id from profiles where id = auth.uid() limit 1),
    auth.uid() -- fallback for demo
  );
$$;

-- Policies: org scoping + role tiers for antic_watchpoints
create policy "org read watchpoints" on antic_watchpoints for select using (
  org_id = public.get_current_user_org()
);
create policy "controller+ insert watchpoints" on antic_watchpoints for insert with check (
  org_id = public.get_current_user_org() and 
  public.get_current_user_role() in ('controller','owner')
);
create policy "controller+ update watchpoints" on antic_watchpoints for update using (
  org_id = public.get_current_user_org() and 
  public.get_current_user_role() in ('controller','owner')
);

-- Policies for antic_trigger_rules
create policy "org read trigger_rules" on antic_trigger_rules for select using (
  org_id = public.get_current_user_org()
);
create policy "controller+ insert trigger_rules" on antic_trigger_rules for insert with check (
  org_id = public.get_current_user_org() and 
  public.get_current_user_role() in ('controller','owner')
);
create policy "controller+ update trigger_rules" on antic_trigger_rules for update using (
  org_id = public.get_current_user_org() and 
  public.get_current_user_role() in ('controller','owner')
);

-- Policies for antic_trigger_firings (read-only for users, system inserts)
create policy "org read trigger_firings" on antic_trigger_firings for select using (
  org_id = public.get_current_user_org()
);

-- Policies for antic_activation_events
create policy "org read activation_events" on antic_activation_events for select using (
  org_id = public.get_current_user_org()
);
create policy "operator+ insert activation_events" on antic_activation_events for insert with check (
  org_id = public.get_current_user_org() and 
  public.get_current_user_role() in ('operator','controller','owner')
);

-- Policies for antic_pre_position_orders  
create policy "org read prepos" on antic_pre_position_orders for select using (
  org_id = public.get_current_user_org()
);
create policy "controller+ insert prepos" on antic_pre_position_orders for insert with check (
  org_id = public.get_current_user_org() and 
  public.get_current_user_role() in ('controller','owner')
);
create policy "controller+ update prepos" on antic_pre_position_orders for update using (
  org_id = public.get_current_user_org() and 
  public.get_current_user_role() in ('controller','owner')
);

-- Policies for scenarios
create policy "org read scenarios" on antic_scenarios for select using (
  org_id = public.get_current_user_org()
);
create policy "controller+ insert scenarios" on antic_scenarios for insert with check (
  org_id = public.get_current_user_org() and 
  public.get_current_user_role() in ('controller','owner')
);

-- Policies for scenario results (read-only for users, system inserts)
create policy "org read scenario_results" on antic_scenario_results for select using (
  org_id = public.get_current_user_org()
);

-- Policies for backtests (read-only for users, system inserts)
create policy "org read backtests" on antic_backtests for select using (
  org_id = public.get_current_user_org()
);

-- Policies for EWS components (read-only for users, system inserts)
create policy "org read ews_components" on antic_ews_components for select using (
  org_id = public.get_current_user_org()
);

-- Policies for buffers (read-only for users, system inserts)  
create policy "org read buffers" on antic_buffers for select using (
  org_id = public.get_current_user_org()
);

-- Policies for geo sentinels (read-only for users, system inserts)
create policy "org read geo_sentinels" on antic_geo_sentinels for select using (
  org_id = public.get_current_user_org()
);

-- Policies for task queue
create policy "org read tasks_queue" on app_tasks_queue for select using (
  org_id = public.get_current_user_org()
);
create policy "operator+ insert tasks_queue" on app_tasks_queue for insert with check (
  org_id = public.get_current_user_org() and 
  public.get_current_user_role() in ('operator','controller','owner')
);

-- Policies for indicator readings
create policy "org read indicator_readings" on indicator_readings for select using (
  org_id = public.get_current_user_org()
);
create policy "controller+ insert indicator_readings" on indicator_readings for insert with check (
  org_id = public.get_current_user_org() and 
  public.get_current_user_role() in ('controller','owner')
);