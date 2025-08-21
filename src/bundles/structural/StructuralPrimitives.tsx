import * as React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip as RTooltip, CartesianGrid, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";

export function SCard({ title, subtitle, right, className, children }:{
  title?: string; subtitle?: string; right?: React.ReactNode; className?: string; children: React.ReactNode;
}) {
  return (
    <Card className={cn("rounded-2xl border bg-card shadow-sm", className)}>
      {(title || subtitle || right) && (
        <CardHeader className="py-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              {title && <CardTitle className="text-base leading-tight text-card-foreground">{title}</CardTitle>}
              {subtitle && <CardDescription className="mt-0.5">{subtitle}</CardDescription>}
            </div>
            {right && <div>{right}</div>}
          </div>
        </CardHeader>
      )}
      <CardContent className="pt-0">{children}</CardContent>
    </Card>
  );
}

export function MetricBars({ data }:{ data: Array<{ label:string; value:number }> }) {
  return (
    <div className="h-48">
      <ResponsiveContainer>
        <BarChart data={data}>
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3"/>
          <XAxis 
            dataKey="label" 
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <YAxis 
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <RTooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
              color: "hsl(var(--popover-foreground))"
            }}
          />
          <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={[2, 2, 0, 0]}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function TrendLine({ data, color="--chart-2", height=192 }:{ data: Array<{ t:string; v:number }>; color?: string; height?: number; }) {
  return (
    <div className="h-48" style={{ height }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3"/>
          <XAxis 
            dataKey="t" 
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <YAxis 
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            axisLine={{ stroke: "hsl(var(--border))" }}
          />
          <RTooltip 
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
              color: "hsl(var(--popover-foreground))"
            }}
          />
          <Line 
            type="monotone" 
            dataKey="v" 
            stroke={`hsl(var(${color}))`} 
            strokeWidth={1.75} 
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RadarCompare({ data, key1="a", key2="b" }:{ data: Array<{ label:string; a:number; b:number }>; key1?: string; key2?: string; }) {
  return (
    <div className="h-56">
      <ResponsiveContainer>
        <RadarChart data={data}>
          <PolarGrid stroke="hsl(var(--border))"/>
          <PolarAngleAxis dataKey="label" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
          <PolarRadiusAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
          <Radar 
            dataKey={key1} 
            stroke="hsl(var(--chart-3))" 
            fill="hsl(var(--chart-3))" 
            fillOpacity={0.25}
          />
          <Radar 
            dataKey={key2} 
            stroke="hsl(var(--chart-4))" 
            fill="hsl(var(--chart-4))" 
            fillOpacity={0.25}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}