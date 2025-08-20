import React from "react";
import { composeTasksFromDecision } from "@/tasks/task-template-registry";
import type { DecisionResult } from "@/services/capacity-decision/types";

type Props = {
  decision: DecisionResult;
  loopCode: string;
  onCreate?: (tasks: any[]) => void;
};

export default function CapacityTaskComposer({ decision, loopCode, onCreate }: Props) {
  const tasks = composeTasksFromDecision(decision, loopCode);
  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Proposed Tasks ({tasks.length})</div>
      <ul className="space-y-1">
        {tasks.map(t => (
          <li key={t.id} className="text-sm">
            <span className="font-mono">{t.capacity.toUpperCase()}</span> — {t.title}
            <span className="text-xs text-gray-500"> (due {new Date(t.dueAt || "").toLocaleDateString()})</span>
          </li>
        ))}
      </ul>
      <button className="px-3 py-1 rounded bg-blue-600 text-white text-sm"
        onClick={() => onCreate?.(tasks)}>
        Create Tasks
      </button>
    </div>
  );
}