/** mock SLAs for stage deadlines from openedAt (days) */
const DEADLINES: Record<string, number> = {
  think: 6, act: 11, monitor: 14, learn: 18, innovate: 24,
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
