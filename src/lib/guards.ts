export function canShip(ctx:{
  hasLoopMapping:boolean; hasPdiArc:boolean;
  gateOutcome:'ALLOW'|'REWORK'|'BLOCK'|null;
  participationDebtOverdue:boolean;
}) {
  return !!(ctx.hasLoopMapping && ctx.hasPdiArc && ctx.gateOutcome==='ALLOW' && !ctx.participationDebtOverdue);
}
