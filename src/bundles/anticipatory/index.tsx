import React, { useMemo, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import type { DecisionResult, SignalReading } from "@/services/capacity-decision/types";
import type { AnticPlaybook, Scenario } from "@/anticipatory/types";
import { anticPlaybooks, scenarios } from "@/anticipatory/catalogs.default";
import { expandAnticipatory } from "@/anticipatory/expand";

type Props = {
  loopCode: string;
  indicator?: string;
  decision: DecisionResult;
  reading?: SignalReading;
  screen?: "risk-watchboard" | "scenario-sim" | "pre-positioner" | "trigger-library";
  onHandoff?: (to: "responsive"|"deliberative"|"structural", reason: string) => void;
};

export const AnticipatoryBundle: React.FC<Props> = ({ 
  loopCode, 
  indicator = "Primary",
  decision, 
  reading, 
  screen = "risk-watchboard", 
  onHandoff 
}) => {
  const [busy, setBusy] = useState(false);
  
  const playbook: AnticPlaybook | undefined = useMemo(() => {
    // Pick first playbook whose channel matches loop context; fallback first
    return anticPlaybooks[0];
  }, [loopCode]);

  const scenario: Scenario | undefined = scenarios[0];

  const handoffResp = (reading?.ewsProb ?? decision.scores.anticipatory/100) >= 0.7 && (reading?.bufferAdequacy ?? 0.5) < 0.3;
  const handoffDelib = (reading?.dispersion ?? 0) >= 0.5; // allocation/fairness
  const handoffStruct = ((reading?.persistencePk ?? 0)/100) >= 0.5; // repeated emergency governance

  // Keyboard shortcuts
  useEffect(() => {
    function handleKeyboard(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key.toLowerCase()) {
        case 'w': armWatchpoint(); break;
        case 's': runScenario(); break;
        case 'p': stagePrePosition(); break;
        case 't': saveTrigger(); break;
        case 'r': document.querySelector('[data-handoffs]')?.scrollIntoView(); break;
      }
    }
    
    document.addEventListener('keydown', handleKeyboard);
    return () => document.removeEventListener('keydown', handleKeyboard);
  }, []);

  async function armWatchpoint() {
    if (!playbook) return;
    setBusy(true);
    try {
      const { tasks, watchpoint, trigger } = expandAnticipatory(decision, { playbook, scenario: null, ttlDays: 30 });
      
      // Mock persistence calls - replace with real API
      console.log('Saving watchpoint:', watchpoint);
      if (trigger) console.log('Saving trigger:', trigger);
      console.log('Creating tasks:', tasks);
      
      toast.success(`Armed. Review in 30 days.`);
      
      // Analytics
      console.log('Analytics: antic_arm_watchpoint', {
        watchpointId: 'wp-' + Date.now(),
        triggerId: trigger ? 'tr-' + Date.now() : null
      });
    } finally { 
      setBusy(false); 
    }
  }

  async function runScenario() {
    if (!scenario) return;
    setBusy(true);
    try {
      const { scenarioResult, tasks } = expandAnticipatory(decision, { playbook: null, scenario, ttlDays: 30 });
      
      console.log('Saving scenario result:', scenarioResult);
      if (tasks.length) console.log('Creating tasks:', tasks);
      
      toast.success(`Scenario complete. Mitigation delta: ${(scenarioResult?.mitigationDelta ?? 0 * 100).toFixed(0)}%`);
      
      // Analytics
      console.log('Analytics: antic_run_scenario', {
        scenarioId: scenario.id,
        mitigationDelta: scenarioResult?.mitigationDelta
      });
    } finally { 
      setBusy(false); 
    }
  }

  async function stagePrePosition() {
    if (!playbook) return;
    setBusy(true);
    try {
      // Persist three packs if present
      const packs = [];
      for (const pack of ["resource","regulatory","comms"] as const) {
        const p = playbook.prePosition[pack];
        if (p) {
          console.log('Creating pre-position:', { ...p, status: "armed" });
          packs.push(pack);
        }
      }
      
      toast.success(`Pre-position packs staged: ${packs.join(', ')}`);
      
      // Analytics
      console.log('Analytics: antic_stage_preposition', { packs });
    } finally { 
      setBusy(false); 
    }
  }

  async function saveTrigger() {
    if (!playbook?.defaultTrigger) return;
    setBusy(true);
    try {
      const trigger = {
        ...playbook.defaultTrigger,
        validFrom: new Date().toISOString(),
        expiresAt: new Date(Date.now() + playbook.defaultTrigger.ttlDays*24*3600*1000).toISOString()
      };
      
      console.log('Saving trigger rule:', trigger);
      
      const daysToExpiry = playbook.defaultTrigger.ttlDays;
      if (daysToExpiry < 7) {
        toast.warning(`Trigger expires in ${daysToExpiry} days`);
      } else {
        toast.success('Trigger saved');
      }
      
      // Analytics
      console.log('Analytics: antic_save_trigger', { ruleId: 'tr-' + Date.now() });
    } finally { 
      setBusy(false); 
    }
  }

  function handoff(to: "responsive"|"deliberative"|"structural") {
    const reason =
      to === "responsive" ? "Trigger condition met / severity rising" :
      to === "deliberative" ? "Pre-positioning involves fairness/priority trade-offs" :
      "Repeated emergency governance implies structural fix needed";
    
    console.log('Analytics: antic_handoff', { to, reason });
    onHandoff?.(to, reason);
  }

  // Debug logging
  React.useEffect(() => {
    console.log('AnticipatoryBundle rendering:', {
      loopCode,
      indicator,
      screen,
      decision: decision.primary,
      reading: reading?.ewsProb
    });
  }, [loopCode, indicator, screen, decision, reading]);

  return (
    <div className="w-full min-h-screen bg-background p-6 space-y-6">
      {/* Prominent Header with Visual Indicator */}
      <header className="bg-card border rounded-lg p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Anticipatory Capacity Active</span>
              <span>·</span>
              <span>{screen.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}</span>
            </div>
            <div className="text-3xl font-bold text-foreground">{loopCode} · {indicator}</div>
            <div className="flex items-center gap-6 text-sm mt-2">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">EWS:</span>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {(reading?.ewsProb ?? decision.scores.anticipatory/100).toFixed(2)}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Lead-time:</span>
                <Badge variant="outline">~7d</Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Buffers:</span>
                <Badge variant="outline">{(reading?.bufferAdequacy ?? 0.5).toFixed(2)}</Badge>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-blue-600 text-white">
              Anticipatory Mode
            </Badge>
            {decision.consent.requireDeliberative && (
              <Badge variant="outline" className="border-warning text-warning">
                Consent Gate Required
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Screen Bodies */}
      {screen === "risk-watchboard" && (
        <Card>
          <CardHeader>
            <CardTitle>Risk Watchboard</CardTitle>
            <CardDescription>Monitor risk channels and arm watchpoints</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {["Heat","ExternalDemand","EnergyReliability","WaterStress","SupplyChain","LocalPrices"].map((rc) => (
                <Card key={rc} className="p-4">
                  <div className="font-medium">{rc}</div>
                  <div className="text-sm text-muted-foreground">
                    EWS {(Math.random()*0.4+0.4).toFixed(2)} · Lead-time {Math.round(Math.random()*10)+5}d
                  </div>
                  <div className="mt-3">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={armWatchpoint} 
                      disabled={busy}
                    >
                      {busy ? "Arming..." : "Arm Watchpoint"}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {screen === "scenario-sim" && (
        <Card>
          <CardHeader>
            <CardTitle>Scenario & Stress Simulator</CardTitle>
            <CardDescription>Choose a scenario and compute with/without mitigation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {scenarios.map(s => (
                <Button 
                  key={s.id} 
                  variant="outline" 
                  size="sm"
                  onClick={runScenario} 
                  disabled={busy}
                >
                  {busy ? "Running..." : `Run: ${s.name}`}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {screen === "pre-positioner" && (
        <Card>
          <CardHeader>
            <CardTitle>Pre-Positioner</CardTitle>
            <CardDescription>
              Playbook: <strong>{playbook?.name || "None"}</strong>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Stage resources, regulatory, and comms packs without public activation.
            </p>
            <Button 
              onClick={stagePrePosition} 
              disabled={busy || !playbook}
              className="w-full sm:w-auto"
            >
              {busy ? "Staging..." : "Stage Pre-Position Pack"}
            </Button>
          </CardContent>
        </Card>
      )}

      {screen === "trigger-library" && (
        <Card>
          <CardHeader>
            <CardTitle>Trigger Library</CardTitle>
            <CardDescription>Define guardable IF-THEN rules to auto-activate pre-positioned bundles</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={saveTrigger} 
                disabled={busy || !playbook?.defaultTrigger}
              >
                {busy ? "Saving..." : "Save Default Trigger"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Handoffs */}
      <Card data-handoffs>
        <CardHeader>
          <CardTitle>Handoffs</CardTitle>
          <CardDescription>Transfer to other capacity modes when conditions are met</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            <Button 
              variant="outline" 
              size="sm"
              disabled={!handoffResp} 
              onClick={() => handoff("responsive")}
            >
              → Responsive (activate)
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              disabled={!handoffDelib} 
              onClick={() => handoff("deliberative")}
            >
              → Deliberative (trade-offs)
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              disabled={!handoffStruct} 
              onClick={() => handoff("structural")}
            >
              → Structural (codify)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};