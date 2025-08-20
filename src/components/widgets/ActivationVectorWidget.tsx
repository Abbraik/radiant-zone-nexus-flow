import React from "react";
import type { DecisionResult } from "@/services/capacity-decision/types";

type Props = {
  decision: DecisionResult;
  onPrimaryClick?: (capacity: string) => void;
};

export default function ActivationVectorWidget({ decision, onPrimaryClick }: Props) {
  const caps = Object.entries(decision.scores).sort((a,b)=>b[1]-a[1]);
  return (
    <div className="grid gap-2">
      <div className="text-sm text-muted-foreground">Activation Vector</div>
      <div className="flex gap-2 items-end">
        {caps.map(([cap, score]) => (
          <div key={cap} className="flex flex-col items-center">
            <div className="text-xs">{cap}</div>
            <div
              title={`${cap}: ${score}`}
              style={{ height: `${Math.max(8, score)}px`, width: 12 }}
              className={`rounded ${cap === decision.primary ? "bg-blue-600" : "bg-gray-300"}`}
              onClick={() => onPrimaryClick?.(cap)}
            />
          </div>
        ))}
      </div>
      {decision.consent.requireDeliberative && (
        <div className="text-xs text-amber-600">
          Consent gate active — open Transparency Pack & Council Convenor.
        </div>
      )}
    </div>
  );
}