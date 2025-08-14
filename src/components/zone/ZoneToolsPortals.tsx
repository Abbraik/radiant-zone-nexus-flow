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
import PilotBoardTool from '@/components/tools/monitor/PilotBoardTool';
import MetaLoopConsoleTool from '@/components/tools/admin/MetaLoopConsoleTool';

export default function ZoneToolsPortals({ zone }:{ zone:'think'|'monitor'|'act'|'admin' }){
  // Render overlays for the zone (no DOM unless opened)
  if(zone==='think') return (<><IndicatorEditorTool/><BandsHeatmapTool/></>);
  if(zone==='monitor') return (<><RELBoardTool/><TransparencyTool/><PilotBoardTool/></>);
  if(zone==='act') return (<><GateStacksBrowserTool/><PDIStoryboardTool/><GateChecklistTool/><ParticipationPackTool/><ShipPanelTool/></>);
  if(zone==='admin') return (<><MetaLoopConsoleTool/></>);
  return null;
}
