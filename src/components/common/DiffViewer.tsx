import React from 'react'

export default function DiffViewer({ before, after, format }:{ before:any; after:any; format:'json'|'text' }){
  if (format==='json'){
    const left = JSON.stringify(before, null, 2)
    const right = JSON.stringify(after, null, 2)
    return <SideBySide left={left} right={right} />
  }
  const left = String(before||'')
  const right = String(after||'')
  return <SideBySide left={left} right={right} />
}

function SideBySide({ left, right }:{ left:string; right:string }){
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <pre className="p-3 rounded border bg-destructive/5 text-xs overflow-auto" aria-label="Current">
        {left}
      </pre>
      <pre className="p-3 rounded border bg-success/5 text-xs overflow-auto" aria-label="Proposed">
        {right}
      </pre>
    </div>
  )
}
