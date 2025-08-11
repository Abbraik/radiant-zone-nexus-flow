import React from 'react'
import LevelSwitcher from './LevelSwitcher'
import MetaLoopDrawer from './MetaLoopDrawer'
import EvidenceInbox from './EvidenceInbox'
import ChangesQueue from './ChangesQueue'

export default function HeaderAddons(){
  if (import.meta.env.VITE_PAGS_FULL !== '1') return null
  return (
    <div className="flex items-center gap-3">
      <LevelSwitcher />
      <MetaLoopDrawer />
      <EvidenceInbox />
      <ChangesQueue />
    </div>
  )
}