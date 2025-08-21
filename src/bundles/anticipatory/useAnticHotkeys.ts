import { useEffect } from "react";

export function useAnticHotkeys(actions: {
  armWatchpoint?: () => void;
  runScenario?: () => void;
  stagePrePosition?: () => void;
  saveTrigger?: () => void;
  openHandoffs?: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target && (e.target as HTMLElement).tagName === "INPUT") return;
      if (e.key.toLowerCase() === "w") actions.armWatchpoint?.();
      if (e.key.toLowerCase() === "s") actions.runScenario?.();
      if (e.key.toLowerCase() === "p") actions.stagePrePosition?.();
      if (e.key.toLowerCase() === "t") actions.saveTrigger?.();
      if (e.key.toLowerCase() === "h") actions.openHandoffs?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [actions]);
}