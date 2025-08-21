import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ProCard, RadarScores, StackedBars, FrontierScatter, RegretBars, SmallTrend } from "./ProPrimitives";
import type { DeliberativeUiProps, Criterion, ScoreCell, PortfolioPoint, MandateCheck, Guardrail, ParticipationStep } from "./types.ui";
import { subtle, fmtPct01, fmtNum, toneFromStatus } from "./ui.utils";
import { Info, Scale, CheckCircle2, Shield, Users, ScrollText, ArrowRight } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip } from "recharts";

export default function DeliberativeBundle(props: DeliberativeUiProps) {
  const {
    loopCode, mission, screen="intake",
    options, evidence, scenarios,
    criteria, scores, scenarioOutcomes, mcdaTotal,
    frontier, hardConstraints, selectedPortfolio,
    mandateChecks, guardrails, participation, consentIndex,
    dossier,
    handoff,
    busy, errorText,
    onUploadEvidence, onAddOption, onEditWeights, onScoreCell, onSelectScenario, onPickPortfolio,
    onToggleConstraint, onToggleGuardrail, onSetParticipationStatus, onExportDossier, onEvent
  } = props;

  const emit = (name: string, payload?: any) => onEvent?.(name, payload);

  // derived: matrix
  const critOrder = criteria;
  const matrix = options.map(opt => ({
    option: opt,
    row: critOrder.map(c => scores.find(s => s.optionId===opt.id && s.criterionId===c.id)?.score ?? null)
  }));

  return (
    <div className="grid gap-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className={subtle}>Workspace-5C · Deliberative</div>
          <h3 className="text-xl font-semibold leading-tight">{loopCode}</h3>
          {mission && <div className="mt-1 text-sm">{mission}</div>}
        </div>
        <div className="flex items-center gap-2">
          {consentIndex != null && <Badge variant="outline" className="border-warning text-warning">Consent {fmtPct01(consentIndex)}</Badge>}
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={screen} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="intake">Intake & Evidence</TabsTrigger>
          <TabsTrigger value="tradeoff">Trade-Off Board</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio Builder</TabsTrigger>
          <TabsTrigger value="mandate">Mandate & Legitimacy</TabsTrigger>
          <TabsTrigger value="dossier">Decision Dossier</TabsTrigger>
        </TabsList>
      </Tabs>

      {errorText && (
        <div className="rounded-2xl border bg-background p-3 text-destructive text-sm flex items-center gap-2">
          <Info className="h-4 w-4" /> {errorText}
        </div>
      )}

      {/* ============== 1) INTAKE & EVIDENCE ============== */}
      {screen === "intake" && (
        <>
          <ProCard title="Options" subtitle="Candidate interventions / bundles">
            <div className="flex flex-wrap gap-2 mb-3">
              <Button size="sm" onClick={()=>{ props.onAddOption?.(); emit("delib_add_option"); }}>Add Option</Button>
              <Button size="sm" variant="outline" onClick={()=>emit("delib_import_options")}>Import</Button>
            </div>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
              {options.map(o=>(
                <div key={o.id} className="rounded-xl border p-3 bg-background">
                  <div className="text-sm font-medium">{o.name}</div>
                  {o.synopsis && <div className={"mt-1 text-xs "+subtle}>{o.synopsis}</div>}
                  <div className="mt-2 text-xs flex flex-wrap gap-3">
                    {"capex" in (o.costs||{}) && <span className={subtle}>Capex {fmtNum(o.costs?.capex)}</span>}
                    {"opex" in (o.costs||{}) && <span className={subtle}>Opex {fmtNum(o.costs?.opex)}</span>}
                    {o.latencyDays!=null && <span className={subtle}>Latency ~{o.latencyDays}d</span>}
                    {o.authorityFlag && <Badge variant={o.authorityFlag==="ok"?"default":o.authorityFlag==="review"?"secondary":"destructive"}>{o.authorityFlag}</Badge>}
                  </div>
                </div>
              ))}
            </div>
          </ProCard>

          <div className="grid xl:grid-cols-2 gap-3">
            <ProCard title="Evidence" subtitle="Attach loops / indicators / docs" right={<Button size="sm" variant="outline" onClick={()=>emit("delib_add_evidence")}>Link evidence</Button>}>
              <ul className="text-sm space-y-2">
                {evidence.map(ev=>(
                  <li key={ev.id} className="rounded-xl border p-2 bg-background">
                    <div className="font-medium">{ev.label}</div>
                    <div className={"text-xs "+subtle}>
                      {ev.loopCodes?.length ? <>Loops: {ev.loopCodes.join(", ")}. </> : null}
                      {ev.indicators?.length ? <>Indicators: {ev.indicators.join(", ")}.</> : null}
                    </div>
                  </li>
                ))}
                {evidence.length===0 && <div className={subtle}>No evidence yet.</div>}
              </ul>
            </ProCard>

            <ProCard title="Scenarios" subtitle="Stress frames to test robustness">
              <div className="flex flex-wrap gap-2">
                {scenarios.map(s=>(
                  <Button key={s.id} size="sm" variant="outline" onClick={()=>{ props.onSelectScenario?.(s.id); emit("delib_select_scenario",{id:s.id}); }}>{s.name}</Button>
                ))}
                {scenarios.length===0 && <div className={subtle}>No scenarios configured.</div>}
              </div>
            </ProCard>
          </div>
        </>
      )}

      {/* ============== 2) TRADE-OFF BOARD ============== */}
      {screen === "tradeoff" && (
        <>
          <ProCard title="Criteria & Weights" subtitle="Weights sum to 1. Publish changes for transparency" right={<Button size="sm" variant="outline" onClick={()=>props.onEditWeights?.(criteria)}>Save Weights</Button>}>
            <div className="grid lg:grid-cols-2 gap-3">
              <div className="rounded-xl border p-3 bg-background">
                <table className="w-full text-sm">
                  <thead className={subtle}>
                    <tr><th className="text-left">Criterion</th><th className="text-left">Dir</th><th className="text-right">Weight</th></tr>
                  </thead>
                  <tbody>
                    {criteria.map(c=>(
                      <tr key={c.id} className="border-t">
                        <td className="py-2">{c.label}</td>
                        <td className="py-2">{c.direction==="maximize"?"↑":"↓"}</td>
                        <td className="py-2 text-right">{(c.weight*100).toFixed(0)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="rounded-xl border p-3 bg-background">
                {/* Weighted contribution stacked bars (per option) */}
                <StackedBars data={options.map(o=>({
                  label: o.name,
                  ...Object.fromEntries(criteria.map(c=>{
                    const score = (props.scores.find(s=>s.optionId===o.id && s.criterionId===c.id)?.score ?? 0) * (c.weight ?? 0);
                    return [c.label, score];
                  }))
                }))} keys={criteria.map(c=>c.label)} />
              </div>
            </div>
          </ProCard>

          <div className="grid xl:grid-cols-2 gap-3">
            <ProCard title="MCDA Radar" subtitle="Per-option normalized scores">
              <div className="grid md:grid-cols-2 gap-3">
                {options.map(o=>{
                  const data = criteria.map(c=>({
                    label: c.label,
                    score: props.scores.find(s=>s.optionId===o.id && s.criterionId===c.id)?.score ?? 0
                  }));
                  return (
                    <div key={o.id} className="rounded-xl border p-3 bg-background">
                      <div className="text-sm font-medium mb-2">{o.name}</div>
                      <RadarScores data={data}/>
                    </div>
                  );
                })}
              </div>
            </ProCard>

            <ProCard title="Scenario Highlights" subtitle="Outcome contrast by scenario">
              <div className="grid md:grid-cols-2 gap-3">
                {options.slice(0,4).map(o=>{
                  const data = (scenarioOutcomes||[])
                    .filter(s=>s.optionId===o.id)
                    .map(s=>({ label: s.scenarioName, value: s.outcomeScore }));
                  return (
                    <div key={o.id} className="rounded-xl border p-3 bg-background">
                      <div className="text-sm font-medium mb-2">{o.name}</div>
                      <div className="h-40">
                        <ResponsiveContainer>
                          <BarChart data={data}>
                            <XAxis dataKey="label" tick={{ fill: "hsl(var(--muted-foreground))" }}/>
                            <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }}/>
                            <RTooltip />
                            <Bar dataKey="value" fill="hsl(var(--chart-5))"/>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  );
                })}
                {(scenarioOutcomes?.length ?? 0) === 0 && <div className={subtle}>No scenario outcomes yet.</div>}
              </div>
            </ProCard>
          </div>
        </>
      )}

      {/* ============== 3) PORTFOLIO BUILDER ============== */}
      {screen === "portfolio" && (
        <>
          <ProCard title="Efficient Frontier" subtitle="Select a feasible point under constraints">
            <FrontierScatter points={(frontier||[]).map(p=>({ risk:p.risk, cost:p.cost, equity:p.equity, label:p.label, feasible:p.feasible }))}/>
            <div className="mt-3 flex flex-wrap gap-2">
              {(frontier||[]).map((p,i)=>(
                <Button key={i} size="sm" variant={p===selectedPortfolio?"default":"outline"} onClick={()=>{ props.onPickPortfolio?.(p); emit("delib_pick_portfolio",{ label:p.label, options:p.optionIds }); }}>
                  Pick {p.label ?? `P${i+1}`}
                </Button>
              ))}
              {(!frontier || frontier.length===0) && <div className={subtle}>No frontier computed yet.</div>}
            </div>
          </ProCard>

          <div className="grid xl:grid-cols-2 gap-3">
            <ProCard title="Worst-case Regret" subtitle="Lower is better (robustness across scenarios)">
              <RegretBars data={(frontier||[]).slice(0,6).map(p=>({ option: p.label || "P", worst: p.regretWorst ?? 0 }))}/>
            </ProCard>
            <ProCard title="Constraints" subtitle="Toggle hard constraints; recompute frontier">
              <div className="grid gap-2">
                {(hardConstraints||[]).map(c=>(
                  <label key={c.id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked={c.active} onChange={()=>props.onToggleConstraint?.(c.id)} />
                    {c.label}
                  </label>
                ))}
                {(!hardConstraints || hardConstraints.length===0) && <div className={subtle}>No constraints configured.</div>}
              </div>
            </ProCard>
          </div>
        </>
      )}

      {/* ============== 4) MANDATE & LEGITIMACY ============== */}
      {screen === "mandate" && (
        <>
          <ProCard title="Mandate Gate" subtitle="Authority, budget, legal path">
            <div className="grid md:grid-cols-2 gap-3">
              {mandateChecks.map(m=>(
                <div key={m.id} className="rounded-xl border p-3 bg-background">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{m.label}</div>
                    <Badge variant={ (toneFromStatus(m.status) as any) }>{m.status}</Badge>
                  </div>
                  {m.note && <div className={"mt-1 text-xs "+subtle}>{m.note}</div>}
                </div>
              ))}
              {mandateChecks.length===0 && <div className={subtle}>No mandate checks yet.</div>}
            </div>
          </ProCard>

          <div className="grid xl:grid-cols-2 gap-3">
            <ProCard title="Guardrails" subtitle="Caps, time-boxes, checkpoints">
              <div className="grid gap-2">
                {guardrails.map(g=>(
                  <label key={g.id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked={!!g.selected} onChange={(e)=>props.onToggleGuardrail?.(g.id, e.currentTarget.checked)} />
                    <span className="font-medium">{g.label}</span>
                    <span className={subtle}>{g.value}</span>
                    {g.required && <Badge variant="secondary" className="ml-auto">required</Badge>}
                  </label>
                ))}
                {guardrails.length===0 && <div className={subtle}>No guardrails defined.</div>}
              </div>
            </ProCard>

            <ProCard title="Legitimacy & Participation" subtitle="Consent steps & transparency">
              <div className="text-sm">Consent index: <span className="font-semibold">{fmtPct01(consentIndex ?? null)}</span></div>
              <Separator className="my-2"/>
              <div className="grid gap-2">
                {participation.map(p=>(
                  <div key={p.id} className="rounded-xl border p-2 bg-background text-sm flex items-center justify-between">
                    <div>
                      <div className="font-medium">{p.label}</div>
                      <div className={"text-xs "+subtle}>{p.audience ?? "—"} {p.date ? `· ${p.date}` : ""}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      {(["planned","done","skipped"] as const).map(st=>(
                        <Button key={st} size="sm" variant={p.status===st?"default":"outline"} onClick={()=>props.onSetParticipationStatus?.(p.id, st)}>{st}</Button>
                      ))}
                    </div>
                  </div>
                ))}
                {participation.length===0 && <div className={subtle}>No participation steps yet.</div>}
              </div>
            </ProCard>
          </div>
        </>
      )}

      {/* ============== 5) DECISION DOSSIER ============== */}
      {screen === "dossier" && (
        <>
          <ProCard title="Decision Dossier" subtitle="Versioned, auditable ADR">
            {dossier ? (
              <div className="grid gap-3">
                <div className="rounded-xl border p-3 bg-background">
                  <div className="text-sm font-medium">{dossier.title}</div>
                  <div className={"text-xs "+subtle}>v{dossier.version} · {new Date(dossier.updatedAt).toLocaleString()}</div>
                  <Separator className="my-2"/>
                  <div className="text-sm">{dossier.decisionSummary}</div>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <ProCard title="Selected" subtitle="Chosen option(s)">
                    <ul className="text-sm list-disc list-inside">
                      {dossier.selectedOptionIds.map(id=>{
                        const opt = options.find(o=>o.id===id);
                        return <li key={id}>{opt?.name ?? id}</li>;
                      })}
                    </ul>
                  </ProCard>
                  <ProCard title="Rejected" subtitle="Alternatives & why">
                    <ul className="text-sm list-disc list-inside">
                      {dossier.rejectedOptionIds.map(id=>{
                        const opt = options.find(o=>o.id===id);
                        return <li key={id}>{opt?.name ?? id}</li>;
                      })}
                    </ul>
                  </ProCard>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <ProCard title="Trade-off Notes"><div className="text-sm">{dossier.tradeOffNotes}</div></ProCard>
                  <ProCard title="Robustness & Regret"><div className="text-sm">{dossier.robustnessNotes}</div></ProCard>
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <ProCard title="Guardrails">
                    <ul className="text-sm list-disc list-inside">
                      {dossier.guardrails.map(g=> <li key={g.id}>{g.label}{g.value?`: ${g.value}`:""}</li>)}
                    </ul>
                  </ProCard>
                  <ProCard title="Mandate Path">
                    <ul className="text-sm list-disc list-inside">
                      {dossier.mandatePath.map(m=> <li key={m.id}>{m.label} — {m.status}</li>)}
                    </ul>
                  </ProCard>
                </div>

                <ProCard title="Participation Plan">
                  <ul className="text-sm list-disc list-inside">
                    {dossier.participationPlan.map(p=> <li key={p.id}>{p.label} {p.date?`(${p.date})`:""} — {p.status ?? "planned"}</li>)}
                  </ul>
                </ProCard>

                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={()=>props.onExportDossier?.()}>Export</Button>
                </div>
              </div>
            ) : (
              <div className={subtle}>No dossier yet. Build it via Portfolio & Mandate tabs.</div>
            )}
          </ProCard>

          <ProCard title="Handoffs" subtitle="Dispatch to capacities">
            <div className="flex flex-wrap gap-2 justify-end">
              <Button variant="outline" size="sm" disabled={!handoff.enableResponsive} onClick={()=>props.handoff.onHandoff?.("responsive")}>→ Responsive</Button>
              <Button variant="outline" size="sm" disabled={!handoff.enableStructural} onClick={()=>props.handoff.onHandoff?.("structural")}>→ Structural</Button>
              <Button variant="outline" size="sm" disabled={!handoff.enableReflexive} onClick={()=>props.handoff.onHandoff?.("reflexive")}>→ Reflexive</Button>
            </div>
          </ProCard>
        </>
      )}
    </div>
  );
}