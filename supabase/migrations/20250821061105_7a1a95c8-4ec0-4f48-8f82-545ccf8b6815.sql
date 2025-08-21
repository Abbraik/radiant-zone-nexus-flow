-- Enable RLS on all structural tables
alter table struct_sessions               enable row level security;
alter table struct_authority_sources      enable row level security;
alter table struct_budget_envelopes       enable row level security;
alter table struct_deleg_nodes            enable row level security;
alter table struct_deleg_edges            enable row level security;
alter table struct_mandate_checks         enable row level security;
alter table struct_mesh_metrics           enable row level security;
alter table struct_mesh_issues            enable row level security;
alter table struct_process_steps          enable row level security;
alter table struct_process_slas           enable row level security;
alter table struct_process_raci           enable row level security;
alter table struct_process_latency_hist   enable row level security;
alter table struct_process_variance_series enable row level security;
alter table struct_standards              enable row level security;
alter table struct_conformance_checks     enable row level security;
alter table struct_conformance_runs       enable row level security;
alter table struct_permits                enable row level security;
alter table struct_pricing_rules          enable row level security;
alter table struct_auctions               enable row level security;
alter table struct_dossiers               enable row level security;
alter table struct_events                 enable row level security;
alter table struct_handoffs               enable row level security;
alter table struct_runtime_artifacts      enable row level security;

-- For now, allow users to access data based on their user_id in org_id field
-- This can be updated later when proper org structure is implemented

-- Read policies (users can read their own org's data - using user_id for now)
create policy "user_read_struct_sessions" on struct_sessions for select using (org_id = auth.uid());
create policy "user_read_struct_authority_sources" on struct_authority_sources for select using (org_id = auth.uid());
create policy "user_read_struct_budget_envelopes" on struct_budget_envelopes for select using (org_id = auth.uid());
create policy "user_read_struct_deleg_nodes" on struct_deleg_nodes for select using (org_id = auth.uid());
create policy "user_read_struct_deleg_edges" on struct_deleg_edges for select using (org_id = auth.uid());
create policy "user_read_struct_mandate_checks" on struct_mandate_checks for select using (org_id = auth.uid());
create policy "user_read_struct_mesh_metrics" on struct_mesh_metrics for select using (org_id = auth.uid());
create policy "user_read_struct_mesh_issues" on struct_mesh_issues for select using (org_id = auth.uid());
create policy "user_read_struct_process_steps" on struct_process_steps for select using (org_id = auth.uid());
create policy "user_read_struct_process_slas" on struct_process_slas for select using (org_id = auth.uid());
create policy "user_read_struct_process_raci" on struct_process_raci for select using (org_id = auth.uid());
create policy "user_read_struct_process_latency_hist" on struct_process_latency_hist for select using (org_id = auth.uid());
create policy "user_read_struct_process_variance_series" on struct_process_variance_series for select using (org_id = auth.uid());
create policy "user_read_struct_standards" on struct_standards for select using (org_id = auth.uid());
create policy "user_read_struct_conformance_checks" on struct_conformance_checks for select using (org_id = auth.uid());
create policy "user_read_struct_conformance_runs" on struct_conformance_runs for select using (org_id = auth.uid());
create policy "user_read_struct_permits" on struct_permits for select using (org_id = auth.uid());
create policy "user_read_struct_pricing_rules" on struct_pricing_rules for select using (org_id = auth.uid());
create policy "user_read_struct_auctions" on struct_auctions for select using (org_id = auth.uid());
create policy "user_read_struct_dossiers" on struct_dossiers for select using (org_id = auth.uid());
create policy "user_read_struct_events" on struct_events for select using (org_id = auth.uid());
create policy "user_read_struct_handoffs" on struct_handoffs for select using (org_id = auth.uid());
create policy "user_read_struct_runtime_artifacts" on struct_runtime_artifacts for select using (org_id = auth.uid());

-- Write policies (authenticated users can write to their own org)
create policy "user_write_struct_sessions" on struct_sessions for insert with check (org_id = auth.uid() and auth.uid() is not null);
create policy "user_update_struct_sessions" on struct_sessions for update using (org_id = auth.uid() and auth.uid() is not null);

create policy "user_write_struct_authority_sources" on struct_authority_sources for insert with check (org_id = auth.uid() and auth.uid() is not null);
create policy "user_update_struct_authority_sources" on struct_authority_sources for update using (org_id = auth.uid() and auth.uid() is not null);

create policy "user_write_struct_budget_envelopes" on struct_budget_envelopes for insert with check (org_id = auth.uid() and auth.uid() is not null);
create policy "user_update_struct_budget_envelopes" on struct_budget_envelopes for update using (org_id = auth.uid() and auth.uid() is not null);

create policy "user_write_struct_deleg_nodes" on struct_deleg_nodes for insert with check (org_id = auth.uid() and auth.uid() is not null);
create policy "user_update_struct_deleg_nodes" on struct_deleg_nodes for update using (org_id = auth.uid() and auth.uid() is not null);

create policy "user_write_struct_deleg_edges" on struct_deleg_edges for insert with check (org_id = auth.uid() and auth.uid() is not null);
create policy "user_update_struct_deleg_edges" on struct_deleg_edges for update using (org_id = auth.uid() and auth.uid() is not null);

create policy "user_write_struct_mandate_checks" on struct_mandate_checks for insert with check (org_id = auth.uid() and auth.uid() is not null);
create policy "user_update_struct_mandate_checks" on struct_mandate_checks for update using (org_id = auth.uid() and auth.uid() is not null);

create policy "user_write_struct_mesh_metrics" on struct_mesh_metrics for insert with check (org_id = auth.uid() and auth.uid() is not null);
create policy "user_update_struct_mesh_metrics" on struct_mesh_metrics for update using (org_id = auth.uid() and auth.uid() is not null);

create policy "user_write_struct_mesh_issues" on struct_mesh_issues for insert with check (org_id = auth.uid() and auth.uid() is not null);
create policy "user_update_struct_mesh_issues" on struct_mesh_issues for update using (org_id = auth.uid() and auth.uid() is not null);

create policy "user_write_struct_process_steps" on struct_process_steps for insert with check (org_id = auth.uid() and auth.uid() is not null);
create policy "user_update_struct_process_steps" on struct_process_steps for update using (org_id = auth.uid() and auth.uid() is not null);

create policy "user_write_struct_process_slas" on struct_process_slas for insert with check (org_id = auth.uid() and auth.uid() is not null);
create policy "user_update_struct_process_slas" on struct_process_slas for update using (org_id = auth.uid() and auth.uid() is not null);

create policy "user_write_struct_process_raci" on struct_process_raci for insert with check (org_id = auth.uid() and auth.uid() is not null);
create policy "user_update_struct_process_raci" on struct_process_raci for update using (org_id = auth.uid() and auth.uid() is not null);

create policy "user_write_struct_standards" on struct_standards for insert with check (org_id = auth.uid() and auth.uid() is not null);
create policy "user_update_struct_standards" on struct_standards for update using (org_id = auth.uid() and auth.uid() is not null);

create policy "user_write_struct_conformance_checks" on struct_conformance_checks for insert with check (org_id = auth.uid() and auth.uid() is not null);
create policy "user_update_struct_conformance_checks" on struct_conformance_checks for update using (org_id = auth.uid() and auth.uid() is not null);

create policy "user_write_struct_permits" on struct_permits for insert with check (org_id = auth.uid() and auth.uid() is not null);
create policy "user_update_struct_permits" on struct_permits for update using (org_id = auth.uid() and auth.uid() is not null);

create policy "user_write_struct_pricing_rules" on struct_pricing_rules for insert with check (org_id = auth.uid() and auth.uid() is not null);
create policy "user_update_struct_pricing_rules" on struct_pricing_rules for update using (org_id = auth.uid() and auth.uid() is not null);

create policy "user_write_struct_auctions" on struct_auctions for insert with check (org_id = auth.uid() and auth.uid() is not null);
create policy "user_update_struct_auctions" on struct_auctions for update using (org_id = auth.uid() and auth.uid() is not null);

create policy "user_write_struct_dossiers" on struct_dossiers for insert with check (org_id = auth.uid() and auth.uid() is not null);
create policy "user_write_struct_handoffs" on struct_handoffs for insert with check (org_id = auth.uid() and auth.uid() is not null);
create policy "user_write_struct_runtime_artifacts" on struct_runtime_artifacts for insert with check (org_id = auth.uid() and auth.uid() is not null);

-- Telemetry tables (all authenticated users can append to their own org)
create policy "user_write_struct_process_latency_hist" on struct_process_latency_hist for insert with check (org_id = auth.uid() and auth.uid() is not null);
create policy "user_write_struct_process_variance_series" on struct_process_variance_series for insert with check (org_id = auth.uid() and auth.uid() is not null);
create policy "user_write_struct_conformance_runs" on struct_conformance_runs for insert with check (org_id = auth.uid() and auth.uid() is not null);
create policy "user_write_struct_events" on struct_events for insert with check (org_id = auth.uid() and auth.uid() is not null);