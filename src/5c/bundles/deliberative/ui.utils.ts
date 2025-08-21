export const subtle = "text-muted-foreground";
export const fmtPct01 = (x?: number|null) => x==null ? "—" : (x*100).toFixed(0)+"%";
export const fmtNum = (n?: number|null) => n==null ? "—" : new Intl.NumberFormat().format(n);
export function toneFromStatus(s: "ok"|"risk"|"fail") { return s==="ok"?"default": s==="risk"?"secondary":"destructive"; }