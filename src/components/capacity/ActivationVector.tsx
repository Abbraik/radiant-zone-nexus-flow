import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { Capacity } from "@/services/capacity-decision";

export interface Evidence {
  label: string;
  value: string | number;
  hint?: string;
  intent?: 'good' | 'warn' | 'bad' | 'neutral';
}

export interface ActivationVectorProps {
  loopCode: string;
  indicator: string;
  scores: {
    responsive: number;
    reflexive: number;
    deliberative: number;
    anticipatory: number;
    structural: number;
  };
  picked: { primary: Capacity; secondary?: Capacity };
  srt: { horizon: string; cadence: string };
  consent?: { legGap: number; transparency: 'none' | 'banner' | 'pack' };
  guardrails?: { caps?: string[]; timeboxDays?: number };
  evidence: Evidence[]; // e.g., S, slope, Pk, EWS, LegGap
  onOpenDecisionLog?: () => void;  // opens the detailed JSON decision object
}

export function ActivationVector(props: ActivationVectorProps) {
  const { loopCode, indicator, scores, picked, srt, consent, guardrails, evidence, onOpenDecisionLog } = props;

  const caps: { key: Capacity; label: string; color: string; }[] = [
    { key: 'responsive',   label: 'Responsive',   color: 'bg-amber-500' },
    { key: 'reflexive',    label: 'Reflexive',    color: 'bg-indigo-500' },
    { key: 'deliberative', label: 'Deliberative', color: 'bg-cyan-500' },
    { key: 'anticipatory', label: 'Anticipatory', color: 'bg-emerald-500' },
    { key: 'structural',   label: 'Structural',   color: 'bg-violet-500' },
  ];

  return (
    <TooltipProvider>
      <Card className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">{loopCode} · {indicator}</div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Badge variant="secondary">SRT: {srt.cadence}, {srt.horizon}</Badge>
              </TooltipTrigger>
              <TooltipContent>
                <p>Strategic Reflexive Time: Review cadence and horizon</p>
              </TooltipContent>
            </Tooltip>
            {consent && consent.transparency !== 'none' && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge>{consent.transparency === 'pack' ? 'Transparency Pack' : 'Status Banner'}</Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Legitimacy gap: {(consent.legGap * 100).toFixed(0)}% requires transparency</p>
                </TooltipContent>
              </Tooltip>
            )}
            {guardrails && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Badge variant="outline">Timebox {guardrails.timeboxDays ?? '—'}d</Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Guardrails: {guardrails.caps?.join(', ') || 'None specified'}</p>
                </TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {caps.map(c => {
            const v = (scores as any)[c.key] as number;
            const isPrimary = picked.primary === c.key;
            const isSecondary = picked.secondary === c.key;
            return (
              <div key={c.key} className="w-full">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{c.label}</span>
                    {isPrimary && <Badge className="bg-primary text-primary-foreground">Primary</Badge>}
                    {isSecondary && <Badge variant="outline">Secondary</Badge>}
                  </div>
                  <span className="text-xs text-muted-foreground">{(v*100).toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full rounded-md overflow-hidden bg-muted">
                  <div 
                    className={`h-2 ${c.color} transition-all duration-300`} 
                    style={{ width: `${Math.round(v*100)}%` }} 
                    aria-label={`${c.label} score ${Math.round(v*100)}%`}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2">
          {evidence.map((e, i) => {
            const getVariant = () => {
              switch (e.intent) {
                case 'good': return 'default';
                case 'warn': return 'secondary';
                case 'bad': return 'destructive';
                default: return 'outline';
              }
            };
            
            return (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <Badge variant={getVariant()} className="rounded-full cursor-help">
                    {e.label}: {String(e.value)}
                  </Badge>
                </TooltipTrigger>
                {e.hint && (
                  <TooltipContent>
                    <p>{e.hint}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={onOpenDecisionLog}>Decision log</Button>
        </div>
      </Card>
    </TooltipProvider>
  );
}