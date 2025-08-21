-- Latest conformance by actor×standard
create or replace view struct_conformance_summary as
select c.org_id, c.session_id, c.standard_id, c.actor_id,
       c.status, c.last_run, c.note
from struct_conformance_checks c;

-- Process KPIs (compact per session)
create or replace view struct_process_kpis as
select
  s.org_id, s.session_id,
  coalesce((select sum(value) from struct_process_latency_hist h where h.session_id=s.session_id and h.org_id=s.org_id),0) as latency_obs,
  coalesce((select avg(v) from struct_process_variance_series v where v.session_id=s.session_id and v.org_id=s.org_id),null) as variance_avg
from (select distinct org_id, session_id from struct_process_steps) s;