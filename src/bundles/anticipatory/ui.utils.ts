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

export function fmtPct01(x?: number) { 
  return x == null ? "—" : (x*100).toFixed(0) + "%"; 
}

export const subtle = "text-muted-foreground";