import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  BarChart, Bar, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, CartesianGrid, LineChart, Line
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

export function RadarScores({ data, seriesKey="score" }:{ data: Array<{ label: string; [k:string]: string | number }>; seriesKey?: string; }) {
  return (
    <div className="h-56">
      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis dataKey="label" stroke="hsl(var(--muted-foreground))" />
          <PolarRadiusAxis stroke="hsl(var(--muted-foreground))" />
          <Radar dataKey={seriesKey} stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.3} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function StackedBars({ data, keys }:{ data: any[]; keys: string[] }) {
  return (
    <div className="h-56">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid stroke="hsl(var(--border))" />
          <XAxis dataKey="label" tick={{ fill: "hsl(var(--muted-foreground))" }}/>
          <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }}/>
          <RTooltip />
          {keys.map((k,i)=><Bar key={k} dataKey={k} stackId="s" fill={`hsl(var(--chart-${(i%6)+1}))`} />)}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function FrontierScatter({ points }:{ points: Array<{ risk:number; cost:number; equity:number; label?:string; feasible?:boolean }> }) {
  return (
    <div className="h-56">
      <ResponsiveContainer>
        <ScatterChart>
          <CartesianGrid stroke="hsl(var(--border))" />
          <XAxis dataKey="risk" name="Risk" tick={{ fill: "hsl(var(--muted-foreground))" }}/>
          <YAxis dataKey="cost" name="Cost" tick={{ fill: "hsl(var(--muted-foreground))" }}/>
          <ZAxis dataKey="equity" range={[40,140]} />
          <RTooltip />
          <Scatter data={points} fill="hsl(var(--chart-2))" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RegretBars({ data }:{ data: Array<{ option: string; worst: number }> }) {
  return (
    <div className="h-40">
      <ResponsiveContainer>
        <BarChart data={data} layout="vertical" margin={{ left: 80 }}>
          <XAxis type="number" tick={{ fill: "hsl(var(--muted-foreground))" }}/>
          <YAxis dataKey="option" type="category" width={120} tick={{ fill: "hsl(var(--muted-foreground))" }}/>
          <RTooltip />
          <Bar dataKey="worst" fill="hsl(var(--chart-3))" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SmallTrend({ data, colorVar="--chart-4", height=48 }:{ data: Array<{t:string; v:number}>; colorVar?: string; height?: number; }) {
  return (
    <div className="h-12" style={{ height }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="t" hide />
          <YAxis hide />
          <Line type="monotone" dataKey="v" stroke={`hsl(var(${colorVar}))`} strokeWidth={1.75} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}