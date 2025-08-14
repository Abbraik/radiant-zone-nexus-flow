import React from 'react';
 type Props={ stage:'sense'|'diagnose'|'gate'|'participate'|'decide'|'act'|'learn'|'closed' };
 const MAP:Record<Props['stage'],string> = {
   sense:'bg-sky-500/20 text-sky-200', diagnose:'bg-indigo-500/20 text-indigo-200',
   gate:'bg-cyan-500/20 text-cyan-200', participate:'bg-teal-500/20 text-teal-200',
   decide:'bg-emerald-500/20 text-emerald-200', act:'bg-lime-500/20 text-lime-200',
   learn:'bg-amber-500/20 text-amber-200', closed:'bg-zinc-500/20 text-zinc-300'
 };
 export default function RelStageChips({stage}:Props){
   return <span className={`px-2 py-0.5 rounded-md text-xs ${MAP[stage]} border border-white/10`}>{stage}</span>;
 }
