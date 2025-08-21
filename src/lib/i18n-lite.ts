import type { LangMode, TermDict, TermKey } from "@/bundles/responsive/types.ui.lang";

export function label(dict: TermDict, key: TermKey, mode: LangMode) {
  const item = dict[key];
  if (!item) return key;
  return mode === "general" ? item.label_general : item.label_expert;
}

export function hint(dict: TermDict, key: TermKey) {
  return dict[key]?.hint ?? "";
}