/** mock SLAs for stage deadlines from openedAt (days) */
const DEADLINES: Record<string, number> = {
  sense: 2, diagnose: 6, gate: 7, participate: 10, decide: 11, act: 14, learn: 16,
};

export function dueInDays(openedAt:string, stage: keyof typeof DEADLINES){
  const base = new Date(openedAt).getTime();
  const ms = DEADLINES[stage] * 24 * 3600 * 1000;
  const due = base + ms;
  const now = Date.now();
  const delta = Math.max(0, due - now);
  const days = Math.floor(delta / (24*3600*1000));
  const hours = Math.floor((delta % (24*3600*1000)) / (3600*1000));
  return { days, hours, overdue: now>due };
}
