import { createClient } from "@supabase/supabase-js";
import type { UUID } from "./types";

export function supaServer() {
  return createClient(
    process.env.SUPABASE_URL!, 
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function createSession(args: {
  org_id: string; 
  loop_code: string; 
  mission?: string; 
  activation_vector?: any;
}) {
  const sb = supaServer();
  const { data, error } = await sb.rpc("delib_create_session", {
    p_org: args.org_id, 
    p_loop: args.loop_code, 
    p_mission: args.mission ?? null, 
    p_activation_vector: args.activation_vector ?? {}
  });
  if (error) throw error; 
  return data as string;
}

export async function upsertCriterion(args: {
  org_id: string; 
  session_id: string; 
  id?: string; 
  label: string; 
  description?: string; 
  weight: number; 
  direction: "maximize" | "minimize"; 
  scale_hint?: string; 
  order_index?: number;
}) {
  const sb = supaServer();
  const { data, error } = await sb.rpc("delib_upsert_criterion", {
    p_org: args.org_id, 
    p_session: args.session_id, 
    p_id: args.id ?? null,
    p_label: args.label, 
    p_desc: args.description ?? null, 
    p_weight: args.weight, 
    p_direction: args.direction, 
    p_scale: args.scale_hint ?? null, 
    p_order: args.order_index ?? 0
  });
  if (error) throw error; 
  return data as string;
}

export async function upsertOption(args: {
  org_id: string; 
  session_id: string; 
  id?: string; 
  name: string; 
  synopsis?: string; 
  tags?: string[]; 
  costs?: any; 
  latency_days?: number; 
  authority_flag?: "ok" | "review" | "blocked"; 
  equity_note?: string;
}) {
  const sb = supaServer();
  const { data, error } = await sb.rpc("delib_upsert_option", {
    p_org: args.org_id, 
    p_session: args.session_id, 
    p_id: args.id ?? null,
    p_name: args.name, 
    p_synopsis: args.synopsis ?? null, 
    p_tags: args.tags ?? [], 
    p_costs: args.costs ?? {},
    p_latency: args.latency_days ?? null, 
    p_authority: args.authority_flag ?? null, 
    p_equity_note: args.equity_note ?? null
  });
  if (error) throw error; 
  return data as string;
}

export async function setScore(args: {
  org_id: string; 
  session_id: string; 
  option_id: string; 
  criterion_id: string; 
  score: number; 
  evidence_refs?: string[]
}) {
  const sb = supaServer();
  const { error } = await sb.rpc("delib_set_score", {
    p_org: args.org_id, 
    p_session: args.session_id, 
    p_option: args.option_id, 
    p_criterion: args.criterion_id, 
    p_score: args.score, 
    p_evidence: args.evidence_refs ?? []
  }); 
  if (error) throw error;
}

export async function toggleConstraint(args: {
  org_id: string; 
  session_id: string; 
  label: string; 
  active: boolean;
}) {
  const sb = supaServer();
  const { error } = await sb.rpc("delib_toggle_constraint", {
    p_org: args.org_id, 
    p_session: args.session_id, 
    p_label: args.label, 
    p_active: args.active
  }); 
  if (error) throw error;
}

export async function setMandate(args: {
  org_id: string; 
  session_id: string; 
  label: string; 
  status: "ok" | "risk" | "fail"; 
  note?: string;
}) {
  const sb = supaServer();
  const { error } = await sb.rpc("delib_set_mandate", {
    p_org: args.org_id, 
    p_session: args.session_id, 
    p_label: args.label, 
    p_status: args.status, 
    p_note: args.note ?? null
  }); 
  if (error) throw error;
}

export async function setGuardrail(args: {
  org_id: string; 
  session_id: string; 
  label: string; 
  kind: "cap" | "timebox" | "checkpoint"; 
  value?: string; 
  required: boolean; 
  selected: boolean;
}) {
  const sb = supaServer();
  const { error } = await sb.rpc("delib_set_guardrail", {
    p_org: args.org_id, 
    p_session: args.session_id, 
    p_label: args.label, 
    p_kind: args.kind, 
    p_value: args.value ?? null, 
    p_required: args.required, 
    p_selected: args.selected
  }); 
  if (error) throw error;
}

export async function setParticipation(args: {
  org_id: string; 
  session_id: string; 
  label: string; 
  audience?: string; 
  date?: string; 
  status: "planned" | "done" | "skipped";
}) {
  const sb = supaServer();
  const { error } = await sb.rpc("delib_set_participation", {
    p_org: args.org_id, 
    p_session: args.session_id, 
    p_label: args.label, 
    p_audience: args.audience ?? null, 
    p_date: args.date ?? null, 
    p_status: args.status
  }); 
  if (error) throw error;
}