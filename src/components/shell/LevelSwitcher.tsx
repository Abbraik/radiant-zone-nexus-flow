import React from 'react'
import { useLevelStore, levelsEnabled } from '@/stores/useLevelStore'

export default function LevelSwitcher() {
  if (!levelsEnabled()) return null
  const { level, setLevel } = useLevelStore()
  const mkBtn = (val: typeof level, label: string) => (
    <button
      key={val}
      aria-pressed={level === val}
      onClick={() => setLevel(val)}
      className={
        'px-3 py-1 rounded-full border text-sm transition ' +
        (level === val ? 'bg-white/20 border-white/40' : 'hover:bg-white/10 border-white/20')
      }
    >
      {label}
    </button>
  )
  return (
    <div className="flex items-center gap-2" role="group" aria-label="Level switcher">
      {mkBtn('micro','Micro')}{mkBtn('meso','Meso')}{mkBtn('macro','Macro')}
    </div>
  )
}