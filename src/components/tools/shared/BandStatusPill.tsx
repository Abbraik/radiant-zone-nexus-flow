import React from 'react';
type Props = { status:'in'|'soft'|'hard'|'critical' };
const RING: Record<Props['status'], string> = {
  in:'ring-emerald-400/30 text-emerald-200',
  soft:'ring-amber-400/30 text-amber-200',
  hard:'ring-rose-400/30 text-rose-200',
  critical:'ring-red-400/40 text-red-200'
};
export default function BandStatusPill({status}:Props){
  return (
    <span className={`glass-chip ring-1 ${RING[status]}`}>
      {status}
    </span>
  );
}
