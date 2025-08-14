import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Overlay as MotionOverlay, Content as MotionContent } from '@/components/motion/MotionDialog';
import { useToolsStore } from '@/stores/toolsStore';
import Mermaid from '@/components/diagrams/Mermaid';
import ParallaxCard from '@/components/motion/ParallaxCard';

const WORKFLOW = `
flowchart LR
  A[Think<br/>Map loops & variables] --> B[Act<br/>Bundles & Gate Stacks]
  B --> C[Monitor<br/>Loop Health & REL]
  C --> D[Learn<br/>Pilots ITS/DiD]
  D --> E[Innovate<br/>Shock Lab & Network]
  E --> A
  subgraph Governance
    C -.->|Gate & Participation| B
    C -.->|Transparency Packs| C
  end
`;

const ENTITIES = `
erDiagram
  VARIABLE ||--o{ EDGE : "defines link"
  VARIABLE }o--o{ LOOP : "tagged in"
  LOOP ||--o{ REL : "breach opens"
  REL ||--o{ TRANSPARENCY_PACK : "published for"
  REL ||--o{ PARTICIPATION : "evidence"
  BUNDLE ||--o{ APPLIED_ARC : "PDI arcs"
  GATE_SCORES ||--|| BUNDLE : "latest for"
  GATE_STACK ||--o{ APPLIED_ARC : "expands to"
  META_REL ||--o{ REL : "precedes/pauses"
`;

export default function AboutOverlay(){
  const open = useToolsStore(s=>s.global.about);
  const tab  = useToolsStore(s=>s.global.aboutTab);
  const setTab = (t:'overview'|'workflow'|'entities')=>{
    const u = useToolsStore.getState();
    u.openAbout(t); // keeps about open and switches tab
  };
  const close = useToolsStore(s=>s.close);

  return (
    <Dialog.Root open={open} onOpenChange={(v)=>!v && close('global','about')}>
      <MotionOverlay />
      <MotionContent className="glass-modal top-12 w-[1040px]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">About this App</h2>
          <div className="flex items-center gap-2 text-sm">
            <button onClick={()=>setTab('overview')}  className={`btn-chip ${tab==='overview'?'bg-white/15':''}`}>Overview</button>
            <button onClick={()=>setTab('workflow')}  className={`btn-chip ${tab==='workflow'?'bg-white/15':''}`}>Workflow</button>
            <button onClick={()=>setTab('entities')}  className={`btn-chip ${tab==='entities'?'bg-white/15':''}`}>Entities</button>
          </div>
          <Dialog.Close className="btn-ghost text-sm">Close</Dialog.Close>
        </div>

        {tab==='overview' && (
          <div className="grid grid-cols-2 gap-4">
            <ParallaxCard className="glass-panel p-4">
              <div className="tile-title">What it is</div>
              <div className="mt-2 text-sm text-zinc-200">
                A front-end "systems thinking & execution" cockpit:
                map complexity (<b>Think</b>), package actions (<b>Act</b>), monitor loops & breaches (<b>Monitor</b>),
                evaluate & learn (<b>Learn</b>), explore innovations (<b>Innovate</b>), with governance rails.
              </div>
              <ul className="mt-3 text-sm text-zinc-300 list-disc pl-5 space-y-1">
                <li>Built with React + TS + Vite + Tailwind + Zustand + Radix/shadcn.</li>
                <li>Runs fully in-browser with seeded mock data; backend can be added later.</li>
                <li>Glassy, Apple-inspired UI with subtle motion; overlays instead of pages.</li>
              </ul>
            </ParallaxCard>

            <ParallaxCard className="glass-panel p-4">
              <div className="tile-title">Zones at a glance</div>
              <ul className="mt-2 text-sm text-zinc-300 space-y-1">
                <li><b>Think</b>: Loop/Variable registries, CLD Studio, Bands, Auto-REL.</li>
                <li><b>Act</b>: Bundles, Gate Checklist & Override, Participation Pack, Gate Stacks + PDI Storyboard, Ship Guard.</li>
                <li><b>Monitor</b>: REL Board w/ timers, Transparency Packs, KPI Strip, Pilot Board.</li>
                <li><b>Learn</b>: Pilots & evidence roll-up (seeded via Monitor's Pilot Board).</li>
                <li><b>Innovate</b>: Shock Lab & Network Explorer (stubs present).</li>
                <li><b>Admin</b>: Meta-Loop Console (conflicts heatmap, precedence, sequence).</li>
              </ul>
            </ParallaxCard>
          </div>
        )}

        {tab==='workflow' && (
          <div className="grid grid-cols-5 gap-4">
            <ParallaxCard className="glass-panel p-4 col-span-3">
              <div className="tile-title mb-2">Think → Act → Monitor → Learn → Innovate</div>
              <Mermaid code={WORKFLOW} className="w-full overflow-auto" />
            </ParallaxCard>
            <ParallaxCard className="glass-panel p-4 col-span-2">
              <div className="tile-title">Governance rails</div>
              <ul className="mt-2 text-sm text-zinc-300 space-y-2">
                <li><b>Gate</b> (6 scores) with optional <b>Override</b>.</li>
                <li><b>Participation</b> (Yes/No/Compressed + due date) → debt guard.</li>
                <li><b>Transparency</b> (Short/Full) with <b>hash & versions</b> + 72h SLO score.</li>
                <li><b>Meta-Loop precedence</b> pauses RELs; banners & disabled actions reflect it.</li>
              </ul>
            </ParallaxCard>
          </div>
        )}

        {tab==='entities' && (
          <div className="grid grid-cols-5 gap-4">
            <ParallaxCard className="glass-panel p-4 col-span-3">
              <div className="tile-title mb-2">Core entities & relations</div>
              <Mermaid code={ENTITIES} className="w-full overflow-auto" />
            </ParallaxCard>
            <ParallaxCard className="glass-panel p-4 col-span-2">
              <div className="tile-title">Glossary (seeded)</div>
              <ul className="mt-2 text-sm text-zinc-300 space-y-1">
                <li><b>Indicator</b>: target + bands; values drive status.</li>
                <li><b>REL</b>: breach ticket (staged: think→…→innovate).</li>
                <li><b>Gate Stack</b>: reusable PDI sequence; expands to <b>Applied Arcs</b>.</li>
                <li><b>Transparency Pack</b>: Short/Full, hashed, versioned.</li>
                <li><b>Meta-REL</b>: conflict/sequence hub; can enforce precedence.</li>
              </ul>
            </ParallaxCard>
          </div>
        )}
      </MotionContent>
    </Dialog.Root>
  );
}