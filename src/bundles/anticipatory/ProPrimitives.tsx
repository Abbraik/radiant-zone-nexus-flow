import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ChartVars } from "./ui.utils";
import {
  LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip as RTooltip,
  AreaChart, Area, BarChart, Bar, CartesianGrid
} from "recharts";

export function ProCard(props: React.PropsWithChildren<{title?: string; subtitle?: string; right?: React.ReactNode; className?: string;}>) {
  return (
    <Card className={cn("rounded-2xl border bg-card shadow-sm", props.className)}>
      {(props.title || props.subtitle || props.right) && (
        <CardHeader className="py-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              {props.title ? <CardTitle className="text-base leading-tight">{props.title}</CardTitle> : null}
              {props.subtitle ? <CardDescription className="mt-0.5">{props.subtitle}</CardDescription> : null}
            </div>
            {props.right ? <div className="ml-auto">{props.right}</div> : null}
          </div>
        </CardHeader>
      )}
      <CardContent className="pt-0">{props.children}</CardContent>
    </Card>
  );
}

export function KPIStat(props: {label: string; value: string; badge?: React.ReactNode}) {
  return (
    <div className="rounded-xl border p-3 bg-background">
      <div className="text-xs text-muted-foreground">{props.label}</div>
      <div className="mt-1 text-lg font-semibold flex items-center gap-2">{props.value} {props.badge}</div>
    </div>
  );
}

export function Sparkline({ data, stroke = ChartVars.series1 }: { data: Array<{t:string; v:number}>; stroke?: string; }) {
  return (
    <div className="h-12">
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="t" hide />
          <YAxis hide domain={["auto","auto"]}/>
          <RTooltip 
            formatter={(v: any)=>v.toFixed? v.toFixed(2): v}
            contentStyle={{ 
              backgroundColor: ChartVars.background, 
              border: `1px solid ${ChartVars.grid}`,
              borderRadius: '6px',
              fontSize: '12px',
              color: ChartVars.axis
            }}
          />
          <Line type="monotone" dataKey="v" stroke={stroke} strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BandedSeries({ data, lower="p10", upper="p90", mean="mean" }:{
  data: Array<{t:string; [k:string]: any}>, lower?: string, upper?: string, mean?: string
}) {
  return (
    <div className="h-40">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={ChartVars.grid}/>
          <XAxis dataKey="t" tick={{ fill: ChartVars.axis, fontSize: 12 }} />
          <YAxis tick={{ fill: ChartVars.axis, fontSize: 12 }} />
          <RTooltip 
            contentStyle={{ 
              backgroundColor: ChartVars.background, 
              border: `1px solid ${ChartVars.grid}`,
              borderRadius: '8px',
              color: ChartVars.axis
            }}
          />
          <Area dataKey={upper} stroke="transparent" fill={ChartVars.band} fillOpacity={0.25} />
          <Area dataKey={lower} stroke="transparent" fill={ChartVars.background} />
          <Line type="monotone" dataKey={mean} stroke={ChartVars.series1} strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Waterfall({ items }:{ items: Array<{label: string; delta: number}> }) {
  const cum = []; let s = 0;
  for (const it of items) { s += it.delta; cum.push({ label: it.label, value: s, delta: it.delta }); }
  return (
    <div className="h-40">
      <ResponsiveContainer>
        <BarChart data={cum}>
          <CartesianGrid strokeDasharray="3 3" stroke={ChartVars.grid}/>
          <XAxis dataKey="label" tick={{ fill: ChartVars.axis, fontSize: 12 }}/>
          <YAxis tick={{ fill: ChartVars.axis, fontSize: 12 }}/>
          <RTooltip 
            formatter={(v:any)=>v.toFixed? v.toFixed(2): v}
            contentStyle={{ 
              backgroundColor: ChartVars.background, 
              border: `1px solid ${ChartVars.grid}`,
              borderRadius: '8px',
              color: ChartVars.axis
            }}
          />
          <Bar dataKey="delta" fill={ChartVars.series2}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Tornado({ items }:{ items: Array<{factor: string; impact: number}> }) {
  const data = [...items].sort((a,b)=>Math.abs(b.impact)-Math.abs(a.impact));
  return (
    <div className="h-40">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={ChartVars.grid}/>
          <XAxis type="number" tick={{ fill: ChartVars.axis, fontSize: 12 }}/>
          <YAxis dataKey="factor" type="category" width={120} tick={{ fill: ChartVars.axis, fontSize: 12 }}/>
          <RTooltip 
            formatter={(v:any)=>v.toFixed? v.toFixed(3): v}
            contentStyle={{ 
              backgroundColor: ChartVars.background, 
              border: `1px solid ${ChartVars.grid}`,
              borderRadius: '8px',
              color: ChartVars.axis
            }}
          />
          <Bar dataKey="impact" fill={ChartVars.series3}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MiniHeatmap({ cells }:{ cells: Array<{id:string; value:number}> }) {
  // Token-friendly: use opacity to reflect value on accent bg
  return (
    <div className="grid grid-cols-8 gap-1">
      {cells.map(c=>(
        <div 
          key={c.id} 
          className="aspect-square rounded-sm transition-opacity hover:opacity-80" 
          style={{
            backgroundColor: `hsl(var(--primary))`,
            opacity: Math.max(0.2, Math.min(0.9, c.value))
          }} 
          aria-label={`Cell ${c.id}=${c.value.toFixed(2)}`} 
          title={`Value: ${c.value.toFixed(2)}`}
        />
      ))}
    </div>
  );
}