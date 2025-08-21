export const subtle = "text-muted-foreground";

export function variantFromProb(p?: number): "destructive"|"secondary"|"default"|"outline" {
  if (p == null) return "secondary";
  if (p >= 0.85) return "destructive";
  if (p >= 0.70) return "outline";
  return "secondary";
}
export function variantFromBuffer(b?: number|null): "destructive"|"secondary"|"default"|"outline" {
  if (b == null) return "secondary";
  if (b < 0.20) return "destructive";
  if (b < 0.35) return "outline";
  return "default";
}
export const fmtPct01 = (x?: number) => x == null ? "—" : (x*100).toFixed(0) + "%";
export const fmtNum = (n?: number) => n == null ? "—" : new Intl.NumberFormat().format(n);

// CSS variables to match theme (define once in global CSS, values map to your token palette)
export const ChartVars = {
  series1: "hsl(var(--chart-1))",
  series2: "hsl(var(--chart-2))",
  series3: "hsl(var(--chart-3))",
  series4: "hsl(var(--chart-4))",
  series5: "hsl(var(--chart-5))",
  band: "hsl(var(--muted))",
  grid: "hsl(var(--chart-grid))",
  axis: "hsl(var(--chart-text))",
  background: "hsl(var(--background))"
};