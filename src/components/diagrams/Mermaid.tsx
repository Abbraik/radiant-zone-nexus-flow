import React from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#0b1220',
    primaryTextColor: '#e5e7eb',
    lineColor: '#9ca3af',
    fontFamily: 'ui-sans-serif, system-ui',
  },
  securityLevel: 'loose',
  flowchart: { curve: 'basis' }
});

export default function Mermaid({ code, className='' }:{ code: string; className?: string }){
  const ref = React.useRef<HTMLDivElement|null>(null);

  React.useEffect(()=>{
    if(!ref.current) return;
    const id = 'mmd-' + Math.random().toString(36).slice(2);
    mermaid.render(id, code).then(({ svg })=>{
      if (ref.current) ref.current.innerHTML = svg;
    }).catch(()=>{ if(ref.current){ ref.current.innerHTML = '<pre class="text-xs text-zinc-400">Diagram render failed</pre>'; } });
  },[code]);

  return <div className={className} ref={ref} />;
}