import type { FormatHint } from "./language.types";

export function fmt(v: number | null | undefined, hint?: FormatHint){
  if (v == null) return "—";
  switch (hint?.kind){
    case "percent": return `${(v * 100).toFixed(hint.decimals ?? 0)}%`;
    case "days": return `${Math.round(v)} days`;
    case "currency": return new Intl.NumberFormat(undefined, {
      style: "currency", currency: hint.code ?? "USD", maximumFractionDigits: hint.decimals ?? 0
    }).format(v);
    case "integer": return new Intl.NumberFormat().format(Math.round(v));
    case "float": return Number(v).toFixed(hint.decimals ?? 2);
    default: return `${v}`;
  }
}