import React from 'react';
 type Props = { status:'in'|'soft'|'hard'|'critical' };
 const COLORS: Record<Props['status'], string> = {
   in:'bg-emerald-600/20 text-emerald-300 border-emerald-400/30',
   soft:'bg-amber-600/20 text-amber-300 border-amber-400/30',
   hard:'bg-rose-600/20 text-rose-300 border-rose-400/30',
   critical:'bg-red-700/30 text-red-200 border-red-400/40'
 };
 export default function BandStatusPill({status}:Props){
   return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs border ${COLORS[status]}`}>{status}</span>;
 }
