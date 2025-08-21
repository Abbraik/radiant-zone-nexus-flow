import * as React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LanguageProvider, useLang } from "@/lib/lang/language.context";
import { baseDictionary, reflexiveTerms } from "@/lib/lang/language.dictionary";
import PostAdoptionReview from "./panels/PostAdoptionReview";
import ControllerTuner from "./panels/ControllerTuner";
import BandManager from "./panels/BandManager";
import EvidenceNotebook from "./panels/EvidenceNotebook";
import TriggerAuditor from "./panels/TriggerAuditor";
import { LearningHub, type LearnContent } from "@/bundles/_shared/LearningHub";

type ReflexiveProps = {
  loopCode: string;
  mission?: string;
  screen?: "review" | "tuner" | "bands" | "triggers" | "evidence" | "learning";
  // existing props for panels (data + callbacks) …
  learnContent?: LearnContent; // new
  onEvent?: (name: string, payload?: Record<string, any>) => void;
};

function LangToggle(){
  const { mode, setMode } = useLang();
  return (
    <div className="inline-flex items-center gap-2">
      <Badge variant="outline">Language</Badge>
      <div className="rounded-xl border p-1">
        <Button size="sm" variant={mode==="general"?"default":"ghost"} onClick={()=>setMode("general")}>General</Button>
        <Button size="sm" variant={mode==="expert"?"default":"ghost"} onClick={()=>setMode("expert")}>Expert</Button>
      </div>
    </div>
  );
}

export default function ReflexiveBundle(props: ReflexiveProps){
  const { loopCode, mission, screen="review", learnContent } = props;
  const dict = React.useMemo(()=>({ ...baseDictionary, ...reflexiveTerms }), []);

  return (
    <LanguageProvider dict={dict}>
      <div className="grid gap-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-muted-foreground">Workspace-5C · Reflexive</div>
            <h3 className="text-xl font-semibold leading-tight">{loopCode}</h3>
            {mission && <div className="mt-1 text-sm">{mission}</div>}
          </div>
          <LangToggle />
        </div>

        <Tabs value={screen} className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="review">After Rollout</TabsTrigger>
            <TabsTrigger value="tuner">Auto-Adjust</TabsTrigger>
            <TabsTrigger value="bands">Safe Ranges</TabsTrigger>
            <TabsTrigger value="triggers">Trigger Audit</TabsTrigger>
            <TabsTrigger value="evidence">Evidence</TabsTrigger>
            <TabsTrigger value="learning">Learning Hub</TabsTrigger>
          </TabsList>
        </Tabs>

        {screen==="review"   && <PostAdoptionReview />}
        {screen==="tuner"    && <ControllerTuner />}
        {screen==="bands"    && <BandManager />}
        {screen==="triggers" && <TriggerAuditor />}
        {screen==="evidence" && <EvidenceNotebook />}
        {screen==="learning" && (
          <LearningHub
            title="Reflexive Capacity"
            subtitle="Learn from results, retune safely, and reduce repeat crises"
            content={learnContent ?? defaultLearn}
          />
        )}
      </div>
    </LanguageProvider>
  );
}

/** Default Learning content if none provided */
const defaultLearn: LearnContent = {
  purpose: {
    id: "purpose",
    title: "Why Reflexive?",
    summary:
      "To check what actually happened after an action, learn from the results, and adjust settings (like safe ranges and auto-adjust speed) so the system stabilizes with less firefighting next time."
  },
  workflows: [
    {
      id: "wf1",
      title: "Review what changed",
      summary:
        "Compare before vs after, and against a similar group if possible, to estimate the real effect.",
      bullets: [
        "Pick the action and time window",
        "See trend and comparison",
        "Record the takeaway (improved, unclear, no change)"
      ]
    },
    {
      id: "wf2",
      title: "Retune auto-adjust settings",
      summary:
        "If swings happen or response is sluggish, adjust gain and delay to smooth behavior.",
      bullets: ["Check swings and delay", "Lower gain or add a pause", "Set a follow-up check"]
    },
    {
      id: "wf3",
      title: "Update safe ranges",
      summary:
        "If the ‘safe range’ is too tight or too loose, edit bounds so alerts are meaningful.",
      bullets: ["Review band hits", "Adjust thresholds", "Confirm the reason and publish"]
    },
    {
      id: "wf4",
      title: "Audit triggers and renewals",
      summary:
        "Stop auto-renewals without a review and fix triggers that fire too often or too late.",
      bullets: ["List repeated renewals", "Require interim review", "Re-shape trigger thresholds"]
    }
  ],
  components: [
    {
      id: "c1",
      title: "After Rollout",
      summary:
        "One-pager that shows trend lines, comparison with a similar group, and a plain conclusion. Save the learning in one click.",
      bullets: ["Trend (before/after)", "Comparison group", "Plain conclusion + confidence"]
    },
    {
      id: "c2",
      title: "Auto-Adjust (Controller Tuner)",
      summary:
        "Adjust how strong/fast the system reacts. Prevent swings or sluggishness with safe presets.",
      bullets: ["Gain & delay presets", "Swing detector", "Auto-retune suggestion"]
    },
    {
      id: "c3",
      title: "Safe Ranges (Band Manager)",
      summary:
        "Edit upper/lower bounds with historic preview. Add notes to explain why changes were made.",
      bullets: ["Historic hits preview", "Justification note", "Publish with version"]
    },
    {
      id: "c4",
      title: "Trigger Audit",
      summary:
        "List of triggers that fired recently, with frequency, missed calls, and renewal patterns.",
      bullets: ["Too frequent triggers", "Late triggers", "Auto-renewal without review"]
    },
    {
      id: "c5",
      title: "Evidence Notebook",
      summary:
        "Attach charts, notes, and files to keep a transparent trail of why decisions were made.",
      bullets: ["Snapshot of charts", "Plain summary", "Linked to loop and action"]
    }
  ],
  handoffs: {
    id: "handoff",
    title: "Handoffs",
    summary:
      "Share learning and changes: Responsive gets activation notes to adjust playbooks; Structural gets repeated-issue flags for rule/process fixes; Anticipatory gets updated trigger templates.",
    bullets: ["→ Responsive: refine playbooks", "→ Structural: propose durable fix", "→ Anticipatory: adjust triggers & watchpoints"]
  },
  outputs: {
    id: "outputs",
    title: "Expected Outputs",
    summary:
      "A saved learning note, suggested or applied retune, updated safe ranges if needed, and a trigger audit trail.",
    bullets: ["Learning note + confidence", "Retune log", "Band change log", "Trigger audit log"]
  },
  glossaryKeys: [
    "concept.reflex_cycle",
    "concept.post_adoption",
    "concept.controller",
    "concept.band_tuning",
    "concept.guardrail_audit",
    "concept.its",
    "concept.did",
    "concept.effect_size",
    "concept.confidence",
    "concept.lag",
    "metric.band_hits",
    "metric.renewal_rate"
  ]
};
