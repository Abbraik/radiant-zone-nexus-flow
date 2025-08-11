import { create } from 'zustand'

export type Level = 'micro' | 'meso' | 'macro'

type LevelState = {
  level: Level
  setLevel: (lvl: Level) => void
}

const defaultLevel: Level = (localStorage.getItem('pags.level') as Level) || 'meso'

export const useLevelStore = create<LevelState>((set) => ({
  level: defaultLevel,
  setLevel: (level) => {
    localStorage.setItem('pags.level', level)
    set({ level })
  },
}))

export function levelsEnabled() {
  return import.meta.env.VITE_PAGS_FULL === '1' && import.meta.env.VITE_LEVELS_ENABLED === '1'
}