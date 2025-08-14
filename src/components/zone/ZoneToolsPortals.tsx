import React from 'react';
import IndicatorEditorTool from '@/components/tools/think/IndicatorEditorTool';
import BandsHeatmapTool from '@/components/tools/think/BandsHeatmapTool';
import RELBoardTool from '@/components/tools/monitor/RELBoardTool';
import ShipPanelTool from '@/components/tools/act/ShipPanelTool';
import GateChecklistTool from '@/components/tools/act/GateChecklistTool';
import ParticipationPackTool from '@/components/tools/act/ParticipationPackTool';
import TransparencyTool from '@/components/tools/monitor/TransparencyTool';
import GateStacksBrowserTool from '@/components/tools/act/GateStacksBrowserTool';
import PDIStoryboardTool from '@/components/tools/act/PDIStoryboardTool';

export default function ZoneToolsPortals({ zone }:{ zone:'think'|'monitor'|'act' }){
  // Render overlays for the zone (no DOM unless opened)
  if(zone==='think') return (<><IndicatorEditorTool/><BandsHeatmapTool/></>);
  if(zone==='monitor') return (<><RELBoardTool/><TransparencyTool/></>);
  if(zone==='act') return (<><GateStacksBrowserTool/><PDIStoryboardTool/><GateChecklistTool/><ParticipationPackTool/><ShipPanelTool/></>);
  return null;
}
